/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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
    
    // Get the request body
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Security check: users can only clean up their own entries unless they're admin
    if (userId !== user.id) {
      // Check if the current user is an admin - first get their current level ID
      const { data: userNivelesRecord, error: nivelesRecordError } = await supabase
        .from('usuarios_niveles')
        .select('id_nivel_actual')
        .eq('id_usuario', user.id)
        .order('fecha_cambio', { ascending: false })
        .limit(1)
        .single();
      
      if (nivelesRecordError || !userNivelesRecord) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      
      // Get the level details to check if admin
      const { data: nivelData, error: nivelError } = await supabase
        .from('niveles')
        .select('numero')
        .eq('id_nivel', userNivelesRecord.id_nivel_actual)
        .single();
        
      // Check if the user is admin (level number 1)
      if (nivelError || nivelData?.numero !== 1) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }
    
    // Clean up duplicate role entries
    // First get all user's role entries
    const { data: roles, error: rolesError } = await supabase
      .from('usuarios_roles')
      .select('*')
      .eq('id_usuario', userId);
      
    if (rolesError) {
      console.error('Error fetching user roles:', rolesError);
      return NextResponse.json(
        { error: 'Error fetching user roles' },
        { status: 500 }
      );
    }
    
    // If there's more than one entry, clean them up
    if (roles && roles.length > 1) {
      // Keep the first entry only
      const keepRoleId = roles[0].id_nivel;
      
      // Delete all other entries
      for (let i = 1; i < roles.length; i++) {
        const { error: deleteError } = await supabase
          .from('usuarios_roles')
          .delete()
          .eq('id_usuario', userId)
          .eq('id_nivel', roles[i].id_nivel);
          
        if (deleteError) {
          console.error('Error deleting duplicate role:', deleteError);
          // Continue anyway
        }
      }
    }
    
    // Clean up other duplicate entries in related tables if needed
    // For example, duplicate profiles, addresses, etc.
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in cleanup duplicates API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
