import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { randomUUID } from 'crypto';

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
    const { userId, newLevelNumber } = await request.json();
    
    if (!userId || newLevelNumber === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Security check: only admins can change user levels
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
        { error: 'Only admins can change user levels' },
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
        { error: 'Only admins can change user levels' },
        { status: 403 }
      );
    }
    
    // Get the level ID for the new level number
    const { data: levelData, error: levelError } = await supabase
      .from('niveles')
      .select('id_nivel')
      .eq('numero', newLevelNumber)
      .single();
      
    if (levelError || !levelData) {
      console.error('Error finding level:', levelError);
      return NextResponse.json(
        { error: 'Invalid level number' },
        { status: 400 }
      );
    }
    
    // Check if the user already has an entry in usuarios_niveles
    const { data: existingRecord, error: existingError } = await supabase
      .from('usuarios_niveles')
      .select('*')
      .eq('id_usuario', userId)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
    
    const timestamp = new Date().toISOString();
    
    if (!existingError && existingRecord) {
      // User has an existing record, update it
      const currentLevelId = existingRecord.id_nivel_actual;
      
      // Only update if the level is actually changing
      if (currentLevelId === levelData.id_nivel) {
        return NextResponse.json({ 
          success: true,
          message: 'No level change needed, user already has this level'
        });
      }
      
      const { error: updateError } = await supabase
        .from('usuarios_niveles')
        .update({
          id_nivel_previo: currentLevelId,
          id_nivel_actual: levelData.id_nivel,
          fecha_cambio: timestamp
        })
        .eq('id_historial', existingRecord.id_historial);
        
      if (updateError) {
        console.error('Error updating user level:', updateError);
        return NextResponse.json(
          { error: 'Error updating user level' },
          { status: 500 }
        );
      }
    } else {
      // No existing record, create a new one
      const id_historial = randomUUID();
      
      const { error: insertError } = await supabase
        .from('usuarios_niveles')
        .insert([
          { 
            id_historial,
            id_usuario: userId,
            id_nivel_actual: levelData.id_nivel,
            id_nivel_previo: null,
            fecha_cambio: timestamp 
          }
        ]);
        
      if (insertError) {
        console.error('Error creating user level record:', insertError);
        return NextResponse.json(
          { error: 'Error creating user level record' },
          { status: 500 }
        );
      }
    }
    
    // Also update usuarios_roles for backward compatibility
    const { error: deleteRoleError } = await supabase
      .from('usuarios_roles')
      .delete()
      .eq('id_usuario', userId);
      
    if (deleteRoleError) {
      console.error('Error deleting old roles:', deleteRoleError);
    }
    
    const { error: insertRoleError } = await supabase
      .from('usuarios_roles')
      .insert([
        {
          id_usuario: userId,
          id_nivel: levelData.id_nivel
        }
      ]);
      
    if (insertRoleError) {
      console.error('Error inserting new role:', insertRoleError);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in change level API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
