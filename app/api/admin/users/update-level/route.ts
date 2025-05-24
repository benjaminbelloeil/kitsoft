/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const { userId, levelId } = await request.json();

    if (!userId || !levelId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and levelId are required' },
        { status: 400 }
      );
    }

    // Create a Supabase client
    const supabase = await createClient();

    // Check authentication - only admins should access this
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is admin - first get their current level ID
    const { data: userLevelData, error: userLevelError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();

    if (userLevelError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Now get the level details to check if admin
    const { data: adminLevel, error: adminLevelError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userLevelData.id_nivel_actual)
      .single();

    if (adminLevelError || adminLevel.numero !== 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get level details to ensure it exists
    const { data: levelData, error: levelCheckError } = await supabase
      .from('niveles')
      .select('id_nivel, numero')
      .eq('id_nivel', levelId)
      .single();
    
    if (levelCheckError || !levelData) {
      return NextResponse.json(
        { error: 'Invalid level ID provided' },
        { status: 400 }
      );
    }

    // Check if the user already has a record in usuarios_niveles
    const { data: existingRecord, error: existingError } = await supabase
      .from('usuarios_niveles')
      .select('*')
      .eq('id_usuario', userId)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();

    const timestamp = new Date().toISOString();
    
    // Update usuarios_niveles table
    if (existingRecord) {
      // Store the current level ID to use as previous level
      const currentLevelId = existingRecord.id_nivel_actual;
      
      // Make sure currentLevelId is not null or the same as new levelId
      if (!currentLevelId) {
        console.warn(`Warning: User ${userId} has no current level set, setting id_nivel_previo to null`);
      } else if (currentLevelId === levelId) {
        return NextResponse.json({ 
          success: true, 
          message: 'No level change needed, user already has this level',
          levelNumber: levelData.numero
        });
      }

      // If a record exists, update it instead of creating a new one
      const { data: updateData, error: updateError } = await supabase
        .from('usuarios_niveles')
        .update({
          id_nivel_previo: currentLevelId, // Set current level as previous level
          id_nivel_actual: levelId, // Set new level as current level
          fecha_cambio: timestamp
        })
        .eq('id_historial', existingRecord.id_historial)
        .select();

      if (updateError) {
        console.error('Error updating user level:', updateError);
        return NextResponse.json(
          { error: 'Failed to update user level', details: updateError.message },
          { status: 500 }
        );
      }
    } else {
      // If no record exists, create a new one (should be rare)
      const id_historial = randomUUID();
      
      const { data: insertData, error: insertError } = await supabase
        .from('usuarios_niveles')
        .insert([
          { 
            id_historial,
            id_usuario: userId,
            id_nivel_actual: levelId,
            id_nivel_previo: null, // No previous level for a new record
            fecha_cambio: timestamp 
          }
        ])
        .select();

      if (insertError) {
        console.error('Error creating user level record:', insertError);
        return NextResponse.json(
          { error: 'Failed to create user level record', details: insertError.message },
          { status: 500 }
        );
      }
    }

    // IMPORTANT: Also update the usuarios_roles table to maintain consistency
    // First, delete any existing roles for this user
    const { error: deleteError } = await supabase
      .from('usuarios_roles')
      .delete()
      .eq('id_usuario', userId);

    if (deleteError) {
      console.error('Warning: Failed to delete existing user roles:', deleteError);
      // Continue execution - don't fail the whole operation
    }

    // Then insert the new role
    const { error: insertRoleError } = await supabase
      .from('usuarios_roles')
      .insert([
        {
          id_usuario: userId,
          id_nivel: levelId
        }
      ]);

    if (insertRoleError) {
      console.error('Warning: Failed to insert new user role:', insertRoleError);
      // Continue execution - don't fail the whole operation
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User level updated successfully',
      levelNumber: levelData.numero
    });
  } catch (error: any) {
    console.error('Error in POST /api/admin/users/update-level:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
