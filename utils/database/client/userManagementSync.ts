/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/client';

export interface User {
  id_usuario: string;
  nombre?: string;
  apellido?: string;
  titulo?: string;
  email?: string;
  url_avatar?: string | null;
  registered: boolean;
  role?: {
    id_nivel?: string;
    numero?: number;
    titulo?: string;
  };
}

export interface UserRole {
  id_nivel: string;
  numero: number; 
  titulo: string;
}

/**
 * Get all users with their current role status and email
 */
export async function getAllUsersWithRoles(): Promise<User[]> {
  const supabase = createClient();
  
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('usuarios')
      .select('*')
      .order('nombre');
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return [];
    }
    
    // For each user, get their current role and email
    const usersWithRoles = await Promise.all((users || []).map(async (user) => {
      // Get the role for this user
      const { data: roleData } = await supabase
        .from('usuarios_niveles')
        .select(`
          id_nivel_actual,
          niveles:id_nivel_actual (
            id_nivel,
            numero,
            titulo
          )
        `)
        .eq('id_usuario', user.id_usuario)
        .order('fecha_cambio', { ascending: false })
        .limit(1)
        .single();
      
      // Get the email for this user
      const { data: emailData } = await supabase
        .from('correos')
        .select('correo')
        .eq('id_usuario', user.id_usuario)
        .limit(1)
        .maybeSingle();
      
      // Check if user has any role entry (registered)
      const registered = roleData !== null;
      
      return {
        ...user,
        registered,
        role: roleData?.niveles || null,
        email: emailData?.correo || null
      };
    }));
    
    return usersWithRoles;
  } catch (err) {
    console.error('Exception in getAllUsersWithRoles:', err);
    return [];
  }
}

/**
 * Get all available roles
 */
export async function getAllRoles(): Promise<UserRole[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('niveles')
      .select('*')
      .order('numero');
    
    if (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception in getAllRoles:', err);
    return [];
  }
}

/**
 * Update a user's role - completely replaces the previous implementation
 * to fix issues with role changes not persisting
 */
export async function updateUserRole(
  userId: string, 
  roleId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  try {
    console.log(`Updating role for user ${userId} to ${roleId}`);
    
    // Delete existing role entries for this user to avoid conflicts
    const { error: deleteError } = await supabase
      .from('usuarios_niveles')
      .delete()
      .eq('id_usuario', userId);
    
    if (deleteError) {
      console.error('Error cleaning up previous roles:', deleteError);
      // Continue anyway as the insert might still work
    }
    
    // Insert new role with a short delay to ensure deletion completes
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { error: insertError } = await supabase
      .from('usuarios_niveles')
      .insert({
        id_historial: crypto.randomUUID(),
        id_nivel_actual: roleId,
        id_nivel_previo: null, // We don't need to track previous since we deleted it
        fecha_cambio: new Date().toISOString(),
        id_usuario: userId
      });
    
    if (insertError) {
      console.error('Error inserting new role:', insertError);
      return { success: false, error: insertError.message };
    }
    
    console.log(`Successfully updated role for user ${userId}`);
    return { success: true };
  } catch (err: any) {
    console.error('Exception in updateUserRole:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

/**
 * Completely deletes a user and all associated data
 * Uses a rollback mechanism to prevent partial deletions
 */
export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  // Keep a record of everything we delete, so we can restore if needed
  const deletedData: Record<string, any[]> = {};
  
  try {
    console.log(`Starting complete deletion of user: ${userId}`);

    // First check if this user has any project associations that would prevent deletion
    const { data: projectData, error: projectError } = await supabase
      .from('usuarios_proyectos')
      .select('id_usuario_proyecto')
      .eq('id_usuario', userId);
      
    if (!projectError && projectData && projectData.length > 0) {
      console.log(`User has ${projectData.length} project associations that prevent deletion`);
      return { 
        success: false, 
        error: `No se puede eliminar el usuario porque está asociado a ${projectData.length} proyecto(s). Elimine estas asociaciones primero.` 
      };
    }

    // Define deletion tasks for related tables
    const deletionTasks = [
      { table: "contactos_emergencia", field: "id_usuario", desc: "contactos de emergencia" },
      { table: "usuarios_certificados", field: "id_usuario", desc: "certificados" },
      { table: "usuarios_habilidades", field: "id_usuario", desc: "habilidades" },
      { table: "correos", field: "id_usuario", desc: "correos electrónicos" },
      { table: "telefono", field: "id_usuario", desc: "teléfonos" },
      { table: "direccion", field: "id_usuario", desc: "direcciones" },
      { table: "usuarios_niveles", field: "id_usuario", desc: "roles y niveles" },
      { table: "usuarios_notificaciones", field: "id_usuario", desc: "notificaciones" },
      { table: "experiencias_habilidades", field: "id_experiencia", 
        desc: "habilidades por experiencia",
        subquery: {
          table: "experiencia",
          field: "id_experiencia",
          where: "id_usuario",
          value: userId
        }
      },
      { table: "experiencia", field: "id_usuario", desc: "experiencias laborales" },
      { table: "usuarios_proyectos", field: "id_usuario", desc: "asociaciones a proyectos" },
    ];
    
    // Execute each deletion task with backup for rollback
    for (const task of deletionTasks) {
      try {
        if (task.subquery) {
          // Get IDs from the subquery
          const { data: subqueryData, error: subqueryError } = await supabase
            .from(task.subquery.table)
            .select(task.subquery.field)
            .eq(task.subquery.where, task.subquery.value);
          
          if (subqueryError) {
            console.error(`Error fetching ${task.subquery.table} records:`, subqueryError);
            continue;
          }
          
          if (!subqueryData || subqueryData.length === 0) {
            console.log(`No ${task.subquery.table} records found to delete related ${task.table} records`);
            continue;
          }
          
          const ids = subqueryData.map(item => item[task.subquery.field as keyof typeof item]);
          
          // First backup the data we're about to delete
          const { data: backupData } = await supabase
            .from(task.table)
            .select('*')
            .in(task.field, ids);
          
          if (backupData && backupData.length > 0) {
            deletedData[task.table] = [...(deletedData[task.table] || []), ...backupData];
          }
          
          // Delete records that reference these IDs
          const { error: deleteError } = await supabase
            .from(task.table)
            .delete()
            .in(task.field, ids);
          
          if (deleteError) {
            console.error(`Error deleting ${task.desc}:`, deleteError);
            console.log(`Continuing with deletion process...`);
          } else {
            console.log(`Successfully deleted ${task.desc}`);
          }
        } else {
          // First backup the data we're about to delete
          const { data: backupData } = await supabase
            .from(task.table)
            .select('*')
            .eq(task.field, userId);
          
          if (backupData && backupData.length > 0) {
            deletedData[task.table] = [...(deletedData[task.table] || []), ...backupData];
          }
          
          // Direct deletion
          const { error: deleteError } = await supabase
            .from(task.table)
            .delete()
            .eq(task.field, userId);
          
          if (deleteError) {
            console.error(`Error deleting ${task.desc}:`, deleteError);
            console.log(`Continuing with deletion process...`);
          } else {
            console.log(`Successfully deleted ${task.desc}`);
          }
        }
      } catch (err) {
        console.error(`Exception when deleting ${task.desc}:`, err);
        console.log(`Continuing with deletion process...`);
      }
    }
    
    // Step 2: Delete files from storage
    const deletedFiles: {table: string, path: string}[] = [];
    
    try {
      // Get avatar URL
      const { data: userData } = await supabase
        .from('usuarios')
        .select('url_avatar, url_curriculum')
        .eq('id_usuario', userId)
        .single();
      
      if (userData) {
        // Delete avatar if exists
        if (userData.url_avatar) {
          const avatarPath = userData.url_avatar.split('/').pop();
          if (avatarPath) {
            await supabase.storage
              .from('usuarios')
              .remove([`Avatars/${avatarPath}`]);
            console.log('Deleted user avatar');
            deletedFiles.push({ table: 'storage', path: `Avatars/${avatarPath}` });
          }
        }
        
        // Delete curriculum if exists
        if (userData.url_curriculum) {
          const curriculumPath = userData.url_curriculum.split('/').pop();
          if (curriculumPath) {
            await supabase.storage
              .from('usuarios')
              .remove([`Curriculum/${curriculumPath}`]);
            console.log('Deleted user curriculum');
            deletedFiles.push({ table: 'storage', path: `Curriculum/${curriculumPath}` });
          }
        }
      }
    } catch (err) {
      console.error('Error deleting user files:', err);
      console.log('Continuing with user deletion...');
    }
    
    // Backup user record before deletion
    const { data: userData } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id_usuario', userId)
      .single();
      
    if (userData) {
      deletedData['usuarios'] = [userData];
    }
    
    // Step 3: Finally delete the user record itself
    const { error: userDeleteError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id_usuario', userId);
    
    if (userDeleteError) {
      console.error('Error deleting user record:', userDeleteError);
      
      // Check if there are still foreign key constraints
      if (userDeleteError.message.includes('violates foreign key constraint')) {
        // Extract the constraint name for better error reporting
        const constraintMatch = userDeleteError.message.match(/constraint "([^"]+)"/);
        const constraintName = constraintMatch ? constraintMatch[1] : 'unknown';
        
        console.log(`Detected unhandled foreign key constraint: ${constraintName}`);
        
        // ROLLBACK: Restore everything we've deleted so far
        await performRollback(supabase, deletedData, deletedFiles);
        
        // Return error message
        return { 
          success: false, 
          error: `No se puede eliminar el usuario debido a restricciones en la base de datos. Este usuario podría tener datos en otras tablas que impiden su eliminación.` 
        };
      }
      
      // ROLLBACK for other errors too
      await performRollback(supabase, deletedData, deletedFiles);
      return { success: false, error: userDeleteError.message };
    }
    
    console.log(`User ${userId} successfully deleted`);
    return { success: true };
  } catch (err: any) {
    console.error('Exception in deleteUser:', err);
    
    // ROLLBACK if any unexpected error happens
    await performRollback(supabase, deletedData, []);
    
    return { success: false, error: err.message || 'Error inesperado' };
  }
}

/**
 * Helper function to restore deleted data during rollback
 */
async function performRollback(
  supabase: any, 
  deletedData: Record<string, any[]>,
  deletedFiles: {table: string, path: string}[]
): Promise<void> {
  console.log("⚠️ Performing rollback to restore deleted data");
  
  try {
    // Restore all deleted database records
    for (const [table, records] of Object.entries(deletedData)) {
      if (records.length > 0) {
        console.log(`Restoring ${records.length} records to ${table}`);
        const { error } = await supabase
          .from(table)
          .upsert(records);
          
        if (error) {
          console.error(`Error restoring data to ${table}:`, error);
        } else {
          console.log(`Successfully restored data to ${table}`);
        }
      }
    }
    
    // Note: We can't restore deleted files, but we'll log it
    if (deletedFiles.length > 0) {
      console.warn(`Unable to restore ${deletedFiles.length} deleted files. Manual restoration required.`);
    }
    
    console.log("✅ Rollback completed");
  } catch (err) {
    console.error("❌ Error during rollback:", err);
  }
}
