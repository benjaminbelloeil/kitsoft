import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a Supabase client with server privileges
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
    
    if (roleError || !userRole?.niveles?.numero === 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all roles
    const { data: roles, error } = await supabase
      .from('niveles')
      .select('id_nivel, numero, titulo')
      .order('numero');
    
    if (error) {
      console.error('Error fetching roles:', error);
      return NextResponse.json({ error: 'Error fetching roles' }, { status: 500 });
    }
    
    return NextResponse.json(roles);
  } catch (error) {
    console.error('Error in GET /api/user/management/roles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}