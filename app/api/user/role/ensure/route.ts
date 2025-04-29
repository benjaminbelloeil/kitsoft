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
    
    // Get the userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Security check: normal users can only ensure roles for themselves
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only manage your own roles' },
        { status: 403 }
      );
    }
    
    // First get all role entries for this user to check if any exist
    const { data: existingRoles, error: rolesError } = await supabase
      .from('usuarios_roles')
      .select('id_nivel, nivel(numero)')
      .eq('id_usuario', userId);
      
    if (rolesError) {
      console.error('Error checking user roles:', rolesError);
      return NextResponse.json(
        { error: 'Error checking user roles' },
        { status: 500 }
      );
    }
    
    // If user already has roles, return the role number of the first one
    // In a proper implementation, we might need to handle multiple roles or role priority
    if (existingRoles && existingRoles.length > 0) {
      const roleNumber = existingRoles[0].nivel?.numero || 0;
      return NextResponse.json({ roleNumber });
    }
    
    // If no role exists, assign the default role (staff = 0)
    // First get the ID of the staff role
    const { data: staffRole, error: staffError } = await supabase
      .from('nivel')
      .select('id_nivel')
      .eq('numero', 0)
      .single();
      
    if (staffError || !staffRole) {
      console.error('Error finding staff role:', staffError);
      return NextResponse.json(
        { error: 'Error finding default role' },
        { status: 500 }
      );
    }
    
    // Assign the staff role to the user
    const { error: assignError } = await supabase
      .from('usuarios_roles')
      .insert({
        id_usuario: userId,
        id_nivel: staffRole.id_nivel
      });
      
    if (assignError) {
      console.error('Error assigning default role:', assignError);
      return NextResponse.json(
        { error: 'Error assigning default role' },
        { status: 500 }
      );
    }
    
    // Return the default role number
    return NextResponse.json({ roleNumber: 0 });
  } catch (error) {
    console.error('Unexpected error in ensure user role API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}