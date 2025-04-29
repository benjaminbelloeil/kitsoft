/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { UserProfileUpdate } from '@/interfaces/user';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Parse request body as UserProfileUpdate
    const profileData: UserProfileUpdate = await request.json();
    
    // Basic validation
    if (!profileData.ID_Usuario) {
      return NextResponse.json(
        { error: 'ID de usuario no proporcionado' },
        { status: 400 }
      );
    }
    
    // Security check: users can only save their own profile
    if (profileData.ID_Usuario !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only update your own profile' },
        { status: 403 }
      );
    }
    
    console.log("Starting profile save with: ", JSON.stringify(profileData, null, 2));
    
    // Prepare user data with lowercase field names
    const userData = {
      id_usuario: profileData.ID_Usuario,
      nombre: profileData.Nombre || '',
      apellido: profileData.Apellido || '',
      titulo: profileData.Titulo || '',
      bio: profileData.Bio || '',
      url_avatar: profileData.URL_Avatar || null // Changed from 'placeholder-avatar.png' to null
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
          return NextResponse.json(
            { error: `Error al guardar usuario: ${fnError.message || 'Error desconocido'}` },
            { status: 500 }
          );
        }
        
        console.log('User created using function:', fnData);
      } catch (fnCatchError: any) {
        console.error('Exception using save_user_profile function:', fnCatchError);
        return NextResponse.json(
          { error: `Error al guardar usuario: ${userError.message || 'Error desconocido'}` },
          { status: 500 }
        );
      }
    } else {
      console.log('User upserted successfully:', upsertData);
    }
    
    // Process address if provided
    if (profileData.direccion && profileData.direccion.Pais) {
      const direccionData = {
        id_direccion: profileData.direccion.ID_Direccion || crypto.randomUUID(),
        pais: profileData.direccion.Pais || '',
        estado: profileData.direccion.Estado || '',
        ciudad: profileData.direccion.Ciudad || '',
        id_usuario: profileData.ID_Usuario,
        tipo: ''
      };
      
      console.log("Saving address data:", direccionData);
      
      // First try to get existing address
      const { data: existingAddress } = await supabase
        .from('direccion')
        .select('id_direccion')
        .eq('id_usuario', profileData.ID_Usuario)
        .maybeSingle();
      
      // If already exists, update with existing ID
      if (existingAddress?.id_direccion) {
        direccionData.id_direccion = existingAddress.id_direccion;
      }
      
      const { error: addressError } = await supabase
        .from('direccion')
        .upsert(direccionData);
      
      if (addressError) {
        console.error('Error saving address:', addressError);
      } else {
        console.log('Address saved successfully');
      }
    } else {
      console.log('No address data provided or incomplete');
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
      
      // First try to get existing phone
      const { data: existingPhone } = await supabase
        .from('telefono')
        .select('id_telefono')
        .eq('id_usuario', profileData.ID_Usuario)
        .maybeSingle();
        
      // If already exists, update with existing ID
      if (existingPhone?.id_telefono) {
        telefonoData.id_telefono = existingPhone.id_telefono;
      }
      
      const { error: phoneError } = await supabase
        .from('telefono')
        .upsert(telefonoData);
      
      if (phoneError) {
        console.error('Error saving phone:', phoneError);
      } else {
        console.log('Phone saved successfully');
      }
    } else {
      console.log('No phone data provided or incomplete');
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
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in saveUserProfile API:', error);
    return NextResponse.json(
      { error: `Error inesperado: ${error?.message || 'Error desconocido'}` },
      { status: 500 }
    );
  }
}