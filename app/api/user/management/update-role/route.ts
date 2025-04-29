/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const { userId, roleId } = await request.json();

    if (!userId || !roleId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and roleId are required' },
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
    
    // Check if the user is an admin
    const { data: userRole, error: roleError } = await supabase
      .from('usuarios_niveles')
      .select(`
        niveles:id_nivel_actual(numero)
      `)
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
    
    // Fix the logical error in the admin check
    if (roleError || (userRole?.niveles?.numero !== 1)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get role details to ensure it exists
    const { data: roleData, error: roleCheckError } = await supabase
      .from('niveles')
      .select('id_nivel, numero')
      .eq('id_nivel', roleId)
      .single();
    
    if (roleCheckError || !roleData) {
      return NextResponse.json(
        { error: 'Invalid role ID provided' },
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

    // Log the existing record for debugging
    console.log('Existing record:', JSON.stringify(existingRecord, null, 2));

    const timestamp = new Date().toISOString();
    
    if (existingRecord) {
      // Store the current role ID to use as previous role
      const currentRoleId = existingRecord.id_nivel_actual;
      
      // Make sure currentRoleId is not null or the same as new roleId
      if (!currentRoleId) {
        console.warn(`Warning: User ${userId} has no current role set, setting id_nivel_previo to null`);
      } else if (currentRoleId === roleId) {
        console.log(`User ${userId} already has role ${roleId}, no change needed`);
        return NextResponse.json({ 
          success: true, 
          message: 'No role change needed, user already has this role',
          roleNumber: roleData.numero
        });
      }

      console.log(`Updating user ${userId} role: id_nivel_previo=${currentRoleId}, id_nivel_actual=${roleId}`);
      
      // If a record exists, update it instead of creating a new one
      const { data: updateData, error: updateError } = await supabase
        .from('usuarios_niveles')
        .update({
          id_nivel_previo: currentRoleId, // Set current role as previous role
          id_nivel_actual: roleId, // Set new role as current role
          fecha_cambio: timestamp
        })
        .eq('id_historial', existingRecord.id_historial)
        .select();

      if (updateError) {
        console.error('Error updating user role:', updateError);
        return NextResponse.json(
          { error: 'Failed to update user role', details: updateError.message },
          { status: 500 }
        );
      }
      
      console.log('Updated record:', JSON.stringify(updateData, null, 2));
    } else {
      // If no record exists, create a new one (should be rare)
      const id_historial = randomUUID();
      
      console.log(`Creating new role record for user ${userId}: id_nivel_actual=${roleId}`);
      
      const { data: insertData, error: insertError } = await supabase
        .from('usuarios_niveles')
        .insert([
          { 
            id_historial,
            id_usuario: userId,
            id_nivel_actual: roleId,
            id_nivel_previo: null, // No previous role for a new record
            fecha_cambio: timestamp 
          }
        ])
        .select();

      if (insertError) {
        console.error('Error creating user role record:', insertError);
        return NextResponse.json(
          { error: 'Failed to create user role record', details: insertError.message },
          { status: 500 }
        );
      }
      
      console.log('Inserted record:', JSON.stringify(insertData, null, 2));
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User role updated successfully',
      roleNumber: roleData.numero
    });
  } catch (error: any) {
    console.error('Error in POST /api/user/management/update-role:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}