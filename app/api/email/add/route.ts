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
    const { userId, email } = await request.json();
    
    // Security check: users can only add emails to their own account
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only add emails to your own account' },
        { status: 403 }
      );
    }
    
    // Extract domain for type
    const domain = email.split('@')[1]?.split('.')[0] || 'other';
    
    // Add the new email
    const { error } = await supabase
      .from('correos')
      .insert({
        id_correo: crypto.randomUUID(),
        correo: email,
        id_usuario: userId,
        tipo: domain
      });
    
    if (error) {
      console.error('Error adding user email:', error);
      return NextResponse.json(
        { error: 'Failed to add user email' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in add email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}