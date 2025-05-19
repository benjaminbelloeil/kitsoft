import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { UserProfile } from '@/interfaces/user';

export async function GET(request: NextRequest) {
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
    
    // Get the userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Security check: normal users can only get their own profile
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only access your own profile' },
        { status: 403 }
      );
    }
    
    // Get the main user data with error handling
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id_usuario', userId)
      .single();
    
    if (userError) {
      console.error(`Error fetching user: ${userError.message}`, userError);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }
    
    // Get related data - switched to the singular table names
    const addressPromise = supabase
      .from('direccion')
      .select('*')
      .eq('id_usuario', userId)
      .maybeSingle();
      
    const phonePromise = supabase
      .from('telefono')
      .select('*')
      .eq('id_usuario', userId)
      .maybeSingle();
      
    const emailPromise = supabase
      .from('correos')
      .select('*')
      .eq('id_usuario', userId)
      .maybeSingle();
    
    // Wait for all promises to resolve
    const [addressResult, phoneResult, emailResult] = await Promise.all([
      addressPromise,
      phonePromise,
      emailPromise
    ]);
    
    // Map the data to our interface - ensure defaults for all fields
    const profileData: UserProfile = {
      id_usuario: userData.id_usuario,
      ID_Usuario: userData.id_usuario,
      Nombre: userData.nombre || '',
      Apellido: userData.apellido || '',
      Titulo: userData.titulo || '',
      Bio: userData.bio || '',
      URL_Avatar: userData.url_avatar || null,
      URL_Curriculum: userData.url_curriculum || null,
      Fecha_Inicio_Empleo: userData.fecha_inicio_empleo || null,
      ID_PeopleLead: userData.id_peoplelead || null,
      
      // Map address with careful null checks
      direccion: addressResult.data ? {
        ID_Direccion: addressResult.data.id_direccion,
        Pais: addressResult.data.pais || '',
        Estado: addressResult.data.estado || '',
        Ciudad: addressResult.data.ciudad || '',
        ID_Usuario: addressResult.data.id_usuario,
        Tipo: addressResult.data.tipo || ''
      } : undefined,
      
      // Map phone with careful null checks
      telefono: phoneResult.data ? {
        ID_Telefono: phoneResult.data.id_telefono,
        Codigo_Pais: phoneResult.data.codigo_pais || '',
        Codigo_Estado: phoneResult.data.codigo_estado || '',
        Numero: phoneResult.data.numero || '',
        ID_Usuario: phoneResult.data.id_usuario,
        Tipo: phoneResult.data.tipo || ''
      } : undefined,
      
      // Map email with careful null checks
      correo: emailResult.data ? {
        ID_Correo: emailResult.data.id_correo,
        Correo: emailResult.data.correo || '',
        ID_Usuario: emailResult.data.id_usuario,
        Tipo: emailResult.data.tipo || ''
      } : undefined
    };
    
    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Unexpected error in profile get API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}