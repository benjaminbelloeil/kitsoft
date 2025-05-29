/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Verify that the user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all roles from the roles table
    const { data: roles, error } = await supabase
      .from('roles')
      .select('id_rol, nombre, descripción')
      .order('nombre', { ascending: true });
      
    if (error) throw error;
    
    return NextResponse.json(roles);
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Error fetching roles', details: error.message },
      { status: 500 }
    );
  }
}
