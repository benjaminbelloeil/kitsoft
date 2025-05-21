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
    
    // Security check: only admins can clean up users' levels
    // Check if the current user is an admin - first get the current level ID
    const { data: userNivelesRecord, error: nivelesRecordError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
    
    if (nivelesRecordError || !userNivelesRecord) {
      return NextResponse.json(
        { error: 'Only admins can clean up user levels' },
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
        { error: 'Only admins can clean up user levels' },
        { status: 403 }
      );
    }
    
    // Get all level entries for this user
    const { data: levels, error: fetchError } = await supabase
      .from('usuarios_roles')
      .select('*')
      .eq('id_usuario', userId);
      
    if (fetchError) {
      console.error('Error fetching user levels:', fetchError);
      return NextResponse.json(
        { error: 'Error fetching user levels' },
        { status: 500 }
      );
    }
    
    // If we have more than one level, keep only the most privileged one
    if (levels && levels.length > 1) {
      // First, get all level IDs with their privilege level
      const levelIds = levels.map(r => r.id_nivel);
      
      const { data: levelDetails, error: detailError } = await supabase
        .from('niveles')
        .select('id_nivel, numero')
        .in('id_nivel', levelIds);
        
      if (detailError || !levelDetails) {
        console.error('Error fetching level details:', detailError);
        return NextResponse.json(
          { error: 'Error fetching level details' },
          { status: 500 }
        );
      }
      
      // Create a map of level ID to privilege level
      const levelMap = new Map();
      levelDetails.forEach(r => {
        levelMap.set(r.id_nivel, r.numero);
      });
      
      // Find the most privileged level (highest number)
      let highestLevel = levels[0];
      let highestPrivilege = levelMap.get(highestLevel.id_nivel) || 0;
      
      for (const level of levels) {
        const privilege = levelMap.get(level.id_nivel) || 0;
        if (privilege > highestPrivilege) {
          highestLevel = level;
          highestPrivilege = privilege;
        }
      }
      
      // Delete all levels except the most privileged one
      for (const level of levels) {
        if (level.id_nivel !== highestLevel.id_nivel) {
          const { error: deleteError } = await supabase
            .from('usuarios_roles')
            .delete()
            .eq('id_usuario', userId)
            .eq('id_nivel', level.id_nivel);
            
          if (deleteError) {
            console.error('Error deleting duplicate level:', deleteError);
          }
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in level cleanup API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
