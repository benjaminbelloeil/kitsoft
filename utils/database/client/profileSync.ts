import { createClient } from '@/utils/supabase/client';
import { UserProfile, UserProfileUpdate } from '@/interfaces/user';

/**
 * Saves complete user profile data to the database
 * Using lowercase table names to avoid case sensitivity issues
 */
export async function saveUserProfile(profileData: UserProfileUpdate): Promise<{success: boolean, error?: string}> {
  const supabase = createClient();
  
  try {
    console.log("Starting profile save with: ", JSON.stringify(profileData, null, 2));
    
    // Basic validation
    if (!profileData.ID_Usuario) {
      return { success: false, error: 'ID de usuario no proporcionado' };
    }
    
    // Prepare user data with lowercase field names
    const userData = {
      id_usuario: profileData.ID_Usuario,
      nombre: profileData.Nombre || '',
      apellido: profileData.Apellido || '',
      titulo: profileData.Titulo || '',
      bio: profileData.Bio || '',
      url_avatar: profileData.URL_Avatar || 'placeholder-avatar.png'
    };
    
    console.log("Attempting to upsert to usuarios table with data:", userData);
    
    // Insert or update the user record
    const { data: upsertData, error: userError } = await supabase
      .from('usuarios')
      .upsert(userData)
      .select();
    
    if (userError) {
      console.error('Error saving user:', userError);
      
      // Try to create the user using the Postgres function instead
      try {
        const { data: fnData, error: fnError } = await supabase
          .rpc('save_user_profile', {
            p_id_usuario: userData.id_usuario,
            p_nombre: userData.nombre,
            p_apellido: userData.apellido,
            p_titulo: userData.titulo,
            p_bio: userData.bio,
            p_url_avatar: userData.url_avatar
          });
        
        if (fnError) {
          console.error('Error using function save_user_profile:', fnError);
          return { success: false, error: `Error al guardar usuario: ${fnError.message || 'Error desconocido'}` };
        }
        
        console.log('User created using function:', fnData);
      } catch (fnCatchError) {
        console.error('Exception using save_user_profile function:', fnCatchError);
        return { success: false, error: `Error al guardar usuario: ${userError.message || 'Error desconocido'}` };
      }
    } else {
      console.log('User upserted successfully:', upsertData);
    }
    
    // Process address if provided
    if (profileData.direccion && profileData.direccion.Pais) {
      const direccionData = {
        id_direccion: profileData.direccion.ID_Direccion || crypto.randomUUID(),
        cp: profileData.direccion.CP || '',
        pais: profileData.direccion.Pais || '',
        estado: profileData.direccion.Estado || '',
        ciudad: profileData.direccion.Ciudad || '',
        id_usuario: profileData.ID_Usuario,
        tipo: ''
      };
      
      const { error: addressError } = await supabase
        .from('direcciones')
        .upsert(direccionData);
      
      if (addressError) {
        console.error('Error saving address:', addressError);
      }
    }
    
    // Process phone if provided
    if (profileData.telefono && profileData.telefono.Numero) {
      const telefonoData = {
        id_telefono: profileData.telefono.ID_Telefono || crypto.randomUUID(),
        codigo_pais: profileData.telefono.Codigo_Pais || '',
        codigo_estado: profileData.telefono.Codigo_Estado || '',
        numero: profileData.telefono.Numero || '',
        id_usuario: profileData.ID_Usuario,
        tipo: ''
      };
      
      const { error: phoneError } = await supabase
        .from('telefonos')
        .upsert(telefonoData);
      
      if (phoneError) {
        console.error('Error saving phone:', phoneError);
      }
    }
    
    // Process email if provided (only for new users)
    if (profileData.correo?.Correo) {
      // Check if email already exists
      const { data: existingEmail } = await supabase
        .from('correos')
        .select('id_correo')
        .eq('id_usuario', profileData.ID_Usuario)
        .maybeSingle();
      
      // Only insert if doesn't exist
      if (!existingEmail) {
        const correoData = {
          id_correo: crypto.randomUUID(),
          correo: profileData.correo.Correo,
          id_usuario: profileData.ID_Usuario,
          tipo: profileData.correo.Tipo || ''
        };
        
        const { error: emailError } = await supabase
          .from('correos')
          .insert(correoData);
        
        if (emailError) {
          console.error('Error saving email:', emailError);
        }
      }
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in saveUserProfile:', error);
    return { success: false, error: `Error inesperado: ${error?.message || 'Error desconocido'}` };
  }
}

/**
 * Fetches the complete user profile including related data
 */
export async function getUserCompleteProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();
  
  try {
    console.log(`Fetching profile for user ID: ${userId}`);
    
    // Get the main user data with error handling
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id_usuario', userId)
      .single();
    
    if (userError) {
      console.error(`Error fetching user: ${userError.message}`, userError);
      // Try direct debugging
      const { data: checkUser } = await supabase
        .from('usuarios')
        .select('*');
      console.log(`All users in database:`, checkUser);
      return null;
    }
    
    console.log(`Found user data:`, userData);
    
    // Get related data
    const [addressData, phoneData, emailData] = await Promise.all([
      // Get address with better error handling
      supabase
        .from('direcciones')
        .select('*')
        .eq('id_usuario', userId)
        .maybeSingle()
        .then(res => {
          if (res.error) console.error(`Error fetching address: ${res.error.message}`);
          console.log(`Address data:`, res.data);
          return res;
        }),
      
      // Get phone with better error handling
      supabase
        .from('telefonos')
        .select('*')
        .eq('id_usuario', userId)
        .maybeSingle()
        .then(res => {
          if (res.error) console.error(`Error fetching phone: ${res.error.message}`);
          console.log(`Phone data:`, res.data);
          return res;
        }),
      
      // Get email with better error handling
      supabase
        .from('correos')
        .select('*')
        .eq('id_usuario', userId)
        .maybeSingle()
        .then(res => {
          if (res.error) console.error(`Error fetching email: ${res.error.message}`);
          console.log(`Email data:`, res.data);
          return res;
        })
    ]);
    
    // Map the data to our interface - ensure defaults for all fields
    const profileData: UserProfile = {
      ID_Usuario: userData.id_usuario,
      Nombre: userData.nombre || '',
      Apellido: userData.apellido || '',
      Titulo: userData.titulo || '',
      Bio: userData.bio || '',
      URL_Avatar: userData.url_avatar || 'placeholder-avatar.png',
      URL_Curriculum: userData.url_curriculum || null,
      Fecha_Inicio_Empleo: userData.fecha_inicio_empleo || null,
      ID_PeopleLead: userData.id_peoplelead || null,
      
      // Map address with careful null checks
      direccion: addressData.data ? {
        ID_Direccion: addressData.data.id_direccion,
        CP: addressData.data.cp || '',
        Pais: addressData.data.pais || '',
        Estado: addressData.data.estado || '',
        Ciudad: addressData.data.ciudad || '',
        ID_Usuario: addressData.data.id_usuario,
        Tipo: addressData.data.tipo || ''
      } : undefined,
      
      // Map phone with careful null checks
      telefono: phoneData.data ? {
        ID_Telefono: phoneData.data.id_telefono,
        Codigo_Pais: phoneData.data.codigo_pais || '',
        Codigo_Estado: phoneData.data.codigo_estado || '',
        Numero: phoneData.data.numero || '',
        ID_Usuario: phoneData.data.id_usuario,
        Tipo: phoneData.data.tipo || ''
      } : undefined,
      
      // Map email with careful null checks
      correo: emailData.data ? {
        ID_Correo: emailData.data.id_correo,
        Correo: emailData.data.correo || '',
        ID_Usuario: emailData.data.id_usuario,
        Tipo: emailData.data.tipo || ''
      } : undefined
    };
    
    console.log(`Returning profile data:`, profileData);
    return profileData;
  } catch (error) {
    console.error('Unexpected error in getUserCompleteProfile:', error);
    return null;
  }
}