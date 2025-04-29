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
    
    // Security check: normal users can only clean up their own roles
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only manage your own roles' },
        { status: 403 }
      );
    }
    
    // Get all role entries for this user
    const { data: roles, error: fetchError } = await supabase
      .from('usuarios_roles')
      .select('*')
      .eq('id_usuario', userId);
      
    if (fetchError) {
      console.error('Error fetching user roles:', fetchError);
      return NextResponse.json(
        { error: 'Error fetching user roles' },
        { status: 500 }
      );
    }
    
    // If we have more than one role, keep only the most privileged one
    if (roles && roles.length > 1) {
      console.log(`Found ${roles.length} roles for user ${userId}, cleaning up...`);
      
      // First, get all role IDs with their privilege level
      const roleIds = roles.map(r => r.id_nivel);
      
      const { data: roleDetails, error: detailError } = await supabase
        .from('nivel')
        .select('id_nivel, numero')
        .in('id_nivel', roleIds);
        
      if (detailError || !roleDetails) {
        console.error('Error fetching role details:', detailError);
        return NextResponse.json(
          { error: 'Error fetching role details' },
          { status: 500 }
        );
      }
      
      // Create a map of role ID to privilege level
      const roleMap = new Map();
      roleDetails.forEach(r => {
        roleMap.set(r.id_nivel, r.numero);
      });
      
      // Find the most privileged role (highest number)
      let highestRole = roles[0];
      let highestPrivilege = roleMap.get(highestRole.id_nivel) || 0;
      
      for (const role of roles) {
        const privilege = roleMap.get(role.id_nivel) || 0;
        if (privilege > highestPrivilege) {
          highestRole = role;
          highestPrivilege = privilege;
        }
      }
      
      // Delete all roles except the most privileged one
      for (const role of roles) {
        if (role.id_nivel !== highestRole.id_nivel) {
          const { error: deleteError } = await supabase
            .from('usuarios_roles')
            .delete()
            .eq('id_usuario', userId)
            .eq('id_nivel', role.id_nivel);
            
          if (deleteError) {
            console.error('Error deleting duplicate role:', deleteError);
          }
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in cleanup user roles API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}