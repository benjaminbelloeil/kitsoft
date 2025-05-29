/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Verify that the user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch roles for the specific project
    const { data: projectRoles, error } = await supabase
      .from('proyectos_roles')
      .select(`
        id_proyecto, 
        roles (
          id_rol, 
          nombre, 
          descripción
        )
      `)
      .eq('id_proyecto', id);
      
    if (error) throw error;
    
    // Transform the result to a simpler structure
    const roles = projectRoles?.map((item: any) => item.roles) || [];
    
    return NextResponse.json(roles);
  } catch (error: any) {
    console.error('Error fetching project roles:', error);
    return NextResponse.json(
      { error: 'Error fetching project roles', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Verify that the user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get role IDs from request body
    const { roleIds } = await request.json();
    
    if (!Array.isArray(roleIds)) {
      return NextResponse.json({ error: 'Invalid roleIds. Expected array.' }, { status: 400 });
    }

    // Start a transaction to update project roles
    // First, delete all existing roles for the project
    const { error: deleteError } = await supabase
      .from('proyectos_roles')
      .delete()
      .eq('id_proyecto', id);
      
    if (deleteError) throw deleteError;
    
    // If we have roles to insert, add them
    if (roleIds.length > 0) {
      const rolesToInsert = roleIds.map(roleId => ({
        id_proyecto: id,
        id_rol: roleId
      }));
      
      const { error: insertError } = await supabase
        .from('proyectos_roles')
        .insert(rolesToInsert);
        
      if (insertError) throw insertError;
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating project roles:', error);
    return NextResponse.json(
      { error: 'Error updating project roles', details: error.message },
      { status: 500 }
    );
  }
}
