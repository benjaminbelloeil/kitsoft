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

    // Create a new role entry with current timestamp
    const timestamp = new Date().toISOString();
    const id_historial = randomUUID(); // Generate UUID for primary key
    
    // Insert new record into usuarios_niveles with the updated role
    const { data, error } = await supabase
      .from('usuarios_niveles')
      .insert([
        { 
          id_historial, 
          id_usuario: userId,
          id_nivel_actual: roleId,
          fecha_cambio: timestamp 
        }
      ])
      .select();

    if (error) {
      console.error('Error updating user role:', error);
      return NextResponse.json(
        { error: 'Failed to update user role', details: error.message },
        { status: 500 }
      );
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