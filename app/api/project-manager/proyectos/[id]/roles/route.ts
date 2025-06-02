/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { executeAgentAssignment } from '@/utils/agent/assign';

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
    const { roleIds, triggerAgentAssignment = false } = await request.json();
    
    if (!Array.isArray(roleIds)) {
      return NextResponse.json({ error: 'Invalid roleIds. Expected array.' }, { status: 400 });
    }

    // Get current roles for comparison to determine what changed
    const { data: currentRoles } = await supabase
      .from('proyectos_roles')
      .select('id_rol')
      .eq('id_proyecto', id);
    
    const currentRoleIds = currentRoles?.map(r => r.id_rol) || [];
    const newRoleIds = roleIds;
    
    // Find roles that were removed (exist in current but not in new)
    const removedRoleIds = currentRoleIds.filter(roleId => !newRoleIds.includes(roleId));
    
    // Find roles that were added (exist in new but not in current)
    const addedRoleIds = newRoleIds.filter(roleId => !currentRoleIds.includes(roleId));

    // Clean up user assignments for removed roles
    if (removedRoleIds.length > 0) {
      console.log(`🧹 Cleaning up user assignments for removed roles: ${removedRoleIds.join(', ')}`);
      
      const { error: cleanupError } = await supabase
        .from('usuarios_proyectos')
        .delete()
        .eq('id_proyecto', id)
        .in('id_rol', removedRoleIds);
        
      if (cleanupError) {
        console.error('Error cleaning up user assignments:', cleanupError);
        throw cleanupError;
      }
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

    // Trigger agent assignment if new roles were added and triggerAgentAssignment is true
    let agentResult = null;
    if (addedRoleIds.length > 0 && triggerAgentAssignment) {
      try {
        console.log(`🤖 Triggering agent assignment for ${addedRoleIds.length} new roles`);
        
        agentResult = await executeAgentAssignment(id);
        
        if (agentResult.success) {
          console.log(`✅ Agent assignment completed: ${agentResult.new_assignments || 0} new assignments made`);
        } else {
          console.warn('⚠️ Agent assignment failed but continuing with role update:', agentResult.error);
        }
      } catch (agentError) {
        console.error('Error triggering agent assignment:', agentError);
        // Don't fail the role update if agent assignment fails
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      rolesAdded: addedRoleIds.length,
      rolesRemoved: removedRoleIds.length,
      agentResult 
    });
  } catch (error: any) {
    console.error('Error updating project roles:', error);
    return NextResponse.json(
      { error: 'Error updating project roles', details: error.message },
      { status: 500 }
    );
  }
}
