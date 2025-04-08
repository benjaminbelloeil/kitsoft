import { createClient } from '@/utils/supabase/client';
import { UserProfile, UserProfileUpdate } from '@/interfaces/user';

/**
 * Saves complete user profile data to the database
 * This handles the usuario, direccion, telefono, and correo tables
 * @param profileData - Complete user profile data to save
 * @returns Success status and any error messages
 */
export async function saveUserProfile(profileData: UserProfileUpdate): Promise<{success: boolean, error?: string}> {
  const supabase = createClient();
  
  try {
    console.log("Starting profile save with data:", profileData);
    
    // Basic validation
    if (!profileData.ID_Usuario) {
      return { success: false, error: 'ID de usuario no proporcionado' };
    }
    
    // Keep it simple - use lowercase table names and direct SQL if needed
    const userData = {
      id_usuario: profileData.ID_Usuario,
      nombre: profileData.Nombre || '',
      apellido: profileData.Apellido || '',
      titulo: profileData.Titulo || '',
      bio: profileData.Bio || '',
      url_avatar: profileData.URL_Avatar || 'placeholder-avatar.png'
    };

    console.log("Using direct SQL to save user data");
    
    // Use direct SQL for user data to avoid issues with REST API
    const { error: sqlError } = await supabase.rpc('save_user_profile', {
      p_id_usuario: userData.id_usuario,
      p_nombre: userData.nombre,
      p_apellido: userData.apellido,
      p_titulo: userData.titulo,
      p_bio: userData.bio,
      p_url_avatar: userData.url_avatar
    });
    
    if (sqlError) {
      console.error("SQL error:", sqlError);
      
      // Try direct insert as fallback
      console.log("Trying direct insert as fallback...");
      const { error: insertError } = await supabase
        .from('usuarios')
        .upsert(userData);
        
      if (insertError) {
        console.error("Insert error:", insertError);
        return { 
          success: false, 
          error: `Error guardando usuario: ${insertError.message || 'Error desconocido'}`
        };
      }
    }
    
    console.log("User data saved successfully");
    
    // Save address if provided
    if (profileData.direccion) {
      const direccionData = {
        id_direccion: profileData.direccion.ID_Direccion || crypto.randomUUID(),
        cp: profileData.direccion.CP || '',
        pais: profileData.direccion.Pais || '',
        estado: profileData.direccion.Estado || '',
        ciudad: profileData.direccion.Ciudad || '',
        id_usuario: profileData.ID_Usuario,
        tipo: ''
      };
      
      console.log("Saving direccion:", direccionData);
      
      const { error } = await supabase
        .from('direcciones')
        .upsert(direccionData);
        
      if (error) {
        console.error("Error saving direccion:", error);
        // Continue with other operations
      }
    }
    
    // Save phone if provided
    if (profileData.telefono) {
      const telefonoData = {
        id_telefono: profileData.telefono.ID_Telefono || crypto.randomUUID(),
        codigo_pais: profileData.telefono.Codigo_Pais || '',
        codigo_estado: profileData.telefono.Codigo_Estado || '',
        numero: profileData.telefono.Numero || '',
        id_usuario: profileData.ID_Usuario,
        tipo: ''
      };
      
      console.log("Saving telefono:", telefonoData);
      
      const { error } = await supabase
        .from('telefonos')
        .upsert(telefonoData);
        
      if (error) {
        console.error("Error saving telefono:", error);
        // Continue with other operations
      }
    }
    
    // Save email if provided
    if (profileData.correo?.Correo) {
      // Check if email exists for this user
      const { data: existingEmail, error: checkError } = await supabase
        .from('correos')
        .select('id_correo')
        .eq('id_usuario', profileData.ID_Usuario)
        .maybeSingle();
      
      if (!existingEmail && !checkError) {
        const correoData = {
          id_correo: profileData.correo.ID_Correo || crypto.randomUUID(),
          correo: profileData.correo.Correo,
          id_usuario: profileData.ID_Usuario,
          tipo: profileData.correo.Tipo || ''
        };
        
        console.log("Saving correo:", correoData);
        
        const { error } = await supabase
          .from('correos')
          .upsert(correoData);
          
        if (error) {
          console.error("Error saving correo:", error);
          // Continue with other operations
        }
      }
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error in saveUserProfile:", error);
    return { 
      success: false, 
      error: `Error inesperado: ${error?.message || error?.toString() || 'Error desconocido'}`
    };
  }
}

/**
 * Fetches the complete user profile including related data
 * @param userId - The user's ID
 * @returns Complete user profile data or null if not found
 */
export async function getUserCompleteProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();
  
  try {
    // Use lowercase table names consistently
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id_usuario', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user:', userError);
      return null;
    }
    
    // Now get related data with lowercase table names
    const [dirResponse, telResponse, emailResponse] = await Promise.all([
      // Get direccion
      supabase
        .from('direcciones')
        .select('*')
        .eq('id_usuario', userId)
        .maybeSingle(),
      
      // Get telefono
      supabase
        .from('telefonos')
        .select('*')
        .eq('id_usuario', userId)
        .maybeSingle(),
      
      // Get correo
      supabase
        .from('correos')
        .select('*')
        .eq('id_usuario', userId)
        .maybeSingle()
    ]);
    
    // Map lowercase data to uppercase interface
    const profileData: UserProfile = {
      ID_Usuario: userData.id_usuario,
      Nombre: userData.nombre || '',
      Apellido: userData.apellido || '',
      Titulo: userData.titulo || '',
      Bio: userData.bio || '',
      URL_Avatar: userData.url_avatar || '/.png',
      URL_Curriculum: userData.url_curriculum,
      Fecha_Inicio_Empleo: userData.fecha_inicio_empleo,
      ID_PeopleLead: userData.id_peoplelead,
      
      // Map related data
      direccion: dirResponse.data ? {
        ID_Direccion: dirResponse.data.id_direccion,
        CP: dirResponse.data.cp || '',
        Pais: dirResponse.data.pais || '',
        Estado: dirResponse.data.estado || '',
        Ciudad: dirResponse.data.ciudad || '',
        ID_Usuario: dirResponse.data.id_usuario,
        Tipo: dirResponse.data.tipo || ''
      } : undefined,
      
      telefono: telResponse.data ? {
        ID_Telefono: telResponse.data.id_telefono,
        Codigo_Pais: telResponse.data.codigo_pais || '',
        Codigo_Estado: telResponse.data.codigo_estado || '',
        Numero: telResponse.data.numero || '',
        ID_Usuario: telResponse.data.id_usuario,
        Tipo: telResponse.data.tipo || ''
      } : undefined,
      
      correo: emailResponse.data ? {
        ID_Correo: emailResponse.data.id_correo,
        Correo: emailResponse.data.correo || '',
        ID_Usuario: emailResponse.data.id_usuario,
        Tipo: emailResponse.data.tipo || ''
      } : undefined
    };
    
    return profileData;
  } catch (error) {
    console.error('Unexpected error in getUserCompleteProfile:', error);
    return null;
  }
}
