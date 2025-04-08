import { createClient } from '@/utils/supabase/client';
import { UserProfile, UserProfileUpdate } from '@/interfaces/user';

/**
 * Saves complete user profile data to the database
 * Using lowercase table names to avoid case sensitivity issues
 */
export async function saveUserProfile(profileData: UserProfileUpdate): Promise<{success: boolean, error?: string}> {
  const supabase = createClient();
  
  try {
    console.log("Starting profile save...");
    
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
    
    // Insert or update the user record
    const { error: userError } = await supabase
      .from('usuarios')
      .upsert(userData);
    
    if (userError) {
      console.error('Error saving user:', userError);
      return { success: false, error: `Error al guardar usuario: ${userError.message || 'Error desconocido'}` };
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
  } catch (error: unknown) {
    console.error('Error in saveUserProfile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return { success: false, error: `Error inesperado: ${errorMessage}` };
  }
}

/**
 * Fetches the complete user profile including related data
 */
export async function getUserCompleteProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();
  
  try {
    console.log(`Fetching profile for user ID: ${userId}`);
    
    // First verify the authenticated user matches our user ID
    const { data: { user: authUser } } = await supabase.auth.getUser();
    console.log('Current auth user:', authUser?.id);
    console.log('Requested user profile:', userId);
    
    if (!authUser || authUser.id !== userId) {
      console.warn('Auth user ID does not match requested profile ID or not authenticated');
    }
    
    // Check for existing tables and contents
    console.log('Checking database tables...');
    
    // First try a direct query to debug database connection
    const { data: tableData, error: tableError } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre')
      .limit(10);
      
    if (tableError) {
      console.error('Error accessing usuarios table:', tableError);
      
      // Try a simple test query to check general database access
      const { data: testData, error: testError } = await supabase
        .from('auth')
        .select('*')
        .limit(1);
      
      console.log('Test query result:', testData, testError);
    } else {
      console.log('All users found in database:', tableData);
    }
    
    // Try a direct retrieve of the specific user
    console.log(`Attempting direct user lookup for ID: ${userId}`);
    
    // Try bypass with direct SQL if possible
    const { data: directUser, error: directUserError } = await supabase.rpc(
      'get_user_profile_by_id',
      { user_id: userId }
    );
    
    if (directUserError) {
      console.log('Direct user lookup via RPC failed:', directUserError);
      // RPC might not exist, continue with normal query
    } else if (directUser) {
      console.log('Found user via direct lookup:', directUser);
      // If we got user data, format and return it
      if (directUser) {
        // Map the data to match our expected format
        const profile: UserProfile = {
          ID_Usuario: directUser.id_usuario,
          Nombre: directUser.nombre || '',
          Apellido: directUser.apellido || '',
          Titulo: directUser.titulo || '',
          Bio: directUser.bio || '',
          URL_Avatar: directUser.url_avatar || 'placeholder-avatar.png',
          // ...other fields...
        };
        return profile;
      }
    }
    
    // Get the main user data with error handling
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id_usuario', userId)
      .single();
    
    if (userError) {
      console.error(`Error fetching user: ${userError.message}`, userError);
      
      // Try alternate approach - insert empty user
      console.log('Attempting to create user profile since none exists');
      
      // Create basic user profile with minimal data
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert({
          id_usuario: userId,
          nombre: '',
          apellido: '',
          titulo: '',
          bio: '',
          url_avatar: 'placeholder-avatar.png'
        });
        
      if (insertError) {
        console.error('Failed to create user profile:', insertError);
        return null;
      }
      
      // Return minimal profile if we just created it
      const newProfile: UserProfile = {
        ID_Usuario: userId,
        Nombre: '',
        Apellido: '',
        Titulo: '',
        Bio: '',
        URL_Avatar: 'placeholder-avatar.png',
      };
      
      return newProfile;
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