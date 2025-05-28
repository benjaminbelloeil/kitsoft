import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { adminClient } from '@/utils/supabase/server-admin';

export async function DELETE(request: NextRequest) {
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
    
    // Get the request body
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Security check: only admins can delete users
    // Check if the current user is an admin - first get their current level ID
    const { data: userNivelesRecord, error: nivelesRecordError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
    
    if (nivelesRecordError || !userNivelesRecord) {
      return NextResponse.json(
        { error: 'Only admins can delete users' },
        { status: 403 }
      );
    }
    
    // Get the level details to check if admin
    const { data: nivelData, error: nivelError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userNivelesRecord.id_nivel_actual)
      .single();
      
    // Check if the user is admin (level number 1)
    if (nivelError || nivelData?.numero !== 1) {
      return NextResponse.json(
        { error: 'Only admins can delete users' },
        { status: 403 }
      );
    }
    
    // Begin transaction by deleting related records in the correct order
    // We need to handle foreign key constraints properly
    
    // 1. First, get all experience IDs for this user to delete junction table records
    const { data: userExperiences, error: expQueryError } = await supabase
      .from('experiencia')
      .select('id_experiencia')
      .eq('id_usuario', userId);
    
    if (expQueryError) {
      console.error('Error querying user experiences:', expQueryError);
    }
    
    // 2. Delete experience-skills junction records (experiencias_habilidades)
    if (userExperiences && userExperiences.length > 0) {
      const experienceIds = userExperiences.map(exp => exp.id_experiencia);
      
      const { error: expSkillsError } = await supabase
        .from('experiencias_habilidades')
        .delete()
        .in('id_experiencia', experienceIds);
        
      if (expSkillsError) {
        console.error('Error deleting experience-skills junction records:', expSkillsError);
      }
    }
    
    // 3. Delete user addresses (direccion table)
    const { error: direccionError } = await supabase
      .from('direccion')
      .delete()
      .eq('id_usuario', userId);
    
    if (direccionError) {
      console.error('Error deleting user addresses:', direccionError);
    }
    
    // 4. Delete user phone numbers (telefono table)
    const { error: telefonoError } = await supabase
      .from('telefono')
      .delete()
      .eq('id_usuario', userId);
    
    if (telefonoError) {
      console.error('Error deleting user phone numbers:', telefonoError);
    }
    
    // 5. Delete from correos (email table)
    const { error: correosError } = await supabase
      .from('correos')
      .delete()
      .eq('id_usuario', userId);
    
    if (correosError) {
      console.error('Error deleting user emails:', correosError);
    }
    
    // 6. Delete from usuarios_niveles (role history)
    const { error: nivelesDeletionError } = await supabase
      .from('usuarios_niveles')
      .delete()
      .eq('id_usuario', userId);
    
    if (nivelesDeletionError) {
      console.error('Error deleting user roles history:', nivelesDeletionError);
    }
    
    // 7. Delete user certificates (using correct table name)
    const { error: certError } = await supabase
      .from('usuarios_certificados')  // Corrected table name
      .delete()
      .eq('id_usuario', userId);
      
    if (certError) {
      console.error('Error deleting user certificates:', certError);
    }
    
    // 8. Delete user skills (using correct table name)
    const { error: skillsError } = await supabase
      .from('usuarios_habilidades')  // Corrected table name
      .delete()
      .eq('id_usuario', userId);
      
    if (skillsError) {
      console.error('Error deleting user skills:', skillsError);
    }
    
    // 9. Delete user experiences (now that junction tables are cleared)
    const { error: expError } = await supabase
      .from('experiencia')
      .delete()
      .eq('id_usuario', userId);
      
    if (expError) {
      console.error('Error deleting user experiences:', expError);
    }
    
    // 10. Finally delete the user profile record
    const { error: profileError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id_usuario', userId);
      
    if (profileError) {
      console.error('Error deleting user profile:', profileError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete user profile: ' + profileError.message },
        { status: 500 }
      );
    }
      
    // 11. Delete the auth user using the admin client
    try {
      const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(userId);
      
      if (authDeleteError) {
        console.error('Error deleting user auth record:', authDeleteError);
        // We'll continue anyway even if auth deletion fails
        // This prevents orphaned profiles but allows auth cleanup to happen later
      }
    } catch (authError) {
      console.error('Exception during auth user deletion:', authError);
      // Continue anyway - the database records are the most important
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in delete user API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
