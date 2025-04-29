/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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
    
    // Check if the current user is an admin
    const { data: adminCheck, error: adminError } = await supabase
      .from('usuarios_roles')
      .select(`
        id_nivel,
        nivel!inner(
          numero
        )
      `)
      .eq('id_usuario', user.id)
      .eq('nivel.numero', 1);
      
    if (adminError || !adminCheck || adminCheck.length === 0) {
      return NextResponse.json(
        { error: 'Only admins can view roles' },
        { status: 403 }
      );
    }
    
    // Get all roles
    const { data: roles, error: rolesError } = await supabase
      .from('nivel')
      .select('*')
      .order('numero');
      
    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      return NextResponse.json(
        { error: 'Error fetching roles' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(roles || []);
  } catch (error) {
    console.error('Unexpected error in get all roles API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}