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
  lastLogin?: string | null;
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
      
      // Get the last login timestamp for this user (if available)
      const { data: loginData } = await supabase
        .from('accesos_usuarios')
        .select('fecha_acceso')
        .eq('id_usuario', user.id_usuario)
        .order('fecha_acceso', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      // Check if user has any role entry - this is the only criteria for being registered
      const registered = roleData !== null;
      
      return {
        ...user,
        registered,
        role: roleData?.niveles || null,
        email: emailData?.correo || null,
        lastLogin: loginData?.fecha_acceso || null
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
 * Cleans up duplicate entries for a user in auth-related tables
 * @param userId - The user's ID from Supabase Auth
 */
export async function cleanupDuplicateEntries(userId: string): Promise<boolean> {
  const supabase = createClient();
  let success = true;
  
  try {
    console.log(`Cleaning up potential duplicate entries for user ${userId}`);
    
    // Check for duplicate emails in correos table
    const { data: emailData, error: emailError } = await supabase
      .from('correos')
      .select('id_correo, correo')
      .eq('id_usuario', userId);
    
    if (emailError) {
      console.error('Error checking for duplicate emails:', emailError);
      success = false;
    } else if (emailData && emailData.length > 1) {
      console.log(`Found ${emailData.length} email entries for user ${userId}, cleaning up...`);
      
      // Keep the first non-null email, delete others
      const validEmails = emailData.filter(e => e.correo !== null);
      const emailToKeep = validEmails.length > 0 ? validEmails[0].id_correo : emailData[0].id_correo;
      
      const emailsToDelete = emailData
        .filter(e => e.id_correo !== emailToKeep)
        .map(e => e.id_correo);
      
      if (emailsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('correos')
          .delete()
          .in('id_correo', emailsToDelete);
        
        if (deleteError) {
          console.error('Error deleting duplicate emails:', deleteError);
          success = false;
        } else {
          console.log(`Successfully deleted ${emailsToDelete.length} duplicate email entries`);
        }
      }
    }
    
    // Check for duplicate roles in usuarios_niveles table
    const { data: roleData, error: roleError } = await supabase
      .from('usuarios_niveles')
      .select('id_historial, fecha_cambio, id_nivel_actual')
      .eq('id_usuario', userId)
      .order('fecha_cambio', { ascending: false });
    
    if (roleError) {
      console.error('Error checking for duplicate roles:', roleError);
      success = false;
    } else if (roleData && roleData.length > 1) {
      console.log(`Found ${roleData.length} role entries for user ${userId}, cleaning up...`);
      
      // Keep the most recent role, delete others
      const roleToKeep = roleData[0].id_historial;
      const rolesToDelete = roleData
        .slice(1)
        .filter(r => r.id_historial !== roleToKeep && r.id_nivel_actual !== null)
        .map(r => r.id_historial);
      
      if (rolesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('usuarios_niveles')
          .delete()
          .in('id_historial', rolesToDelete);
        
        if (deleteError) {
          console.error('Error deleting duplicate roles:', deleteError);
          success = false;
        } else {
          console.log(`Successfully deleted ${rolesToDelete.length} duplicate role entries`);
        }
      }
    }
    
    return success;
  } catch (err) {
    console.error('Exception in cleanupDuplicateEntries:', err);
    return false;
  }
}

/**
 * Completely deletes a user and all associated data including authentication
 * Uses a rollback mechanism to prevent partial deletions
 */
export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  // Keep a record of everything we delete, so we can restore if needed
  const deletedData: Record<string, any[]> = {};
  
  try {
    console.log(`Starting complete deletion of user: ${userId}`);

    // First, clean up any duplicate entries that might exist
    await cleanupDuplicateEntries(userId);

    // Check if this user has any project associations that would prevent deletion
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

    // Define deletion tasks for related tables, including any additional tables not previously covered
    const deletionTasks = [
      { table: "contactos_emergencia", field: "id_usuario", desc: "contactos de emergencia", required: false },
      { table: "usuarios_certificados", field: "id_usuario", desc: "certificados", required: false },
      { table: "usuarios_habilidades", field: "id_usuario", desc: "habilidades", required: false },
      { table: "correos", field: "id_usuario", desc: "correos electrónicos", required: false },
      { table: "telefono", field: "id_usuario", desc: "teléfonos", required: false },
      { table: "direccion", field: "id_usuario", desc: "direcciones", required: false },
      { table: "usuarios_niveles", field: "id_usuario", desc: "roles y niveles", required: false },
      { table: "usuarios_notificaciones", field: "id_usuario", desc: "notificaciones", required: false },
      { table: "experiencias_habilidades", field: "id_experiencia", 
        desc: "habilidades por experiencia",
        required: false,
        subquery: {
          table: "experiencia",
          field: "id_experiencia",
          where: "id_usuario",
          value: userId
        }
      },
      { table: "experiencia", field: "id_usuario", desc: "experiencias laborales", required: false },
      { table: "usuarios_proyectos", field: "id_usuario", desc: "asociaciones a proyectos", required: false },
      // Add any other tables that might have foreign keys to usuarios
      { table: "usuarios_educacion", field: "id_usuario", desc: "información educativa", required: false },
      { table: "accesos_usuarios", field: "id_usuario", desc: "registros de acceso", required: false },
      { table: "preferencias_usuario", field: "id_usuario", desc: "preferencias del usuario", required: false }
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
            console.log(`Warning in ${task.desc}:`, deleteError);
            // If deletion of a required table fails, stop the process
            if (task.required) {
              throw new Error(`Could not delete required data: ${task.desc}`);
            }
            console.log(`Continuing with deletion process...`);
          } else {
            console.log(`Successfully deleted ${task.desc}`);
          }
        } else {
          // First check if the table exists by selecting a count
          const { count, error: countError } = await supabase
            .from(task.table)
            .select('*', { count: 'exact', head: true })
            .eq(task.field, userId);
          
          // If table doesn't exist or user has no records, skip it
          if (countError || count === 0) {
            if (countError) {
              console.log(`Table ${task.table} may not exist or is not accessible: ${countError.message}`);
            } else {
              console.log(`No ${task.desc} found for user, skipping`);
            }
            continue;
          }
          
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
            // Check if error is just empty (this happens sometimes with no actual problem)
            const errorIsEmpty = Object.keys(deleteError).length === 0;
            if (!errorIsEmpty) {
              console.log(`Warning in ${task.desc}:`, deleteError);
              // If deletion of a required table fails, stop the process
              if (task.required) {
                throw new Error(`Could not delete required data: ${task.desc}`);
              }
            } else {
              console.log(`Note: Empty error when deleting ${task.desc} - likely succeeded`);
            }
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
      // Get avatar URL and curriculum
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
    
    // Delete the user record from usuarios table
    const { error: userDeleteError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id_usuario', userId);
    
    if (userDeleteError) {
      console.error('Error deleting user record:', userDeleteError);
      
      // Check if there are still foreign key constraints
      if (userDeleteError.message && userDeleteError.message.includes('violates foreign key constraint')) {
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
      return { success: false, error: userDeleteError.message || 'Error deleting user' };
    }
    
    // Final step - try to delete the user from the authentication system using RPC
    try {
      console.log("Attempting to delete user from auth system");
      
      // Try with RPC function (this may fail with permission issues)
      try {
        // First try with the admin_delete_user RPC function
        const { error: rpcError } = await supabase.rpc('admin_delete_user', {
          userid: userId
        });
        
        if (!rpcError) {
          console.log("Successfully deleted user from auth system using RPC");
          return { success: true };
        }
        
        if (Object.keys(rpcError).length === 0) {
          // Empty error object typically means it was actually successful
          console.log("Empty RPC error object, likely successful");
          return { success: true };
        }
        
        console.log('Error using RPC to delete user from auth system:', rpcError);
      } catch (rpcErr) {
        console.log("RPC error:", rpcErr);
      }
      
      // Even if we can't delete from auth, the database records were deleted successfully
      console.log("Database records deleted successfully, but auth deletion may have failed");
      return { success: true, error: "Registros de base de datos eliminados correctamente, pero es posible que el usuario aún exista en el sistema de autenticación." };
    } catch (authErr) {
      console.error('Exception in auth deletion:', authErr);
      // Continue as the database records are already deleted
      return { success: true, error: "Registros de base de datos eliminados correctamente, pero es posible que el usuario aún exista en el sistema de autenticación." };
    }
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
