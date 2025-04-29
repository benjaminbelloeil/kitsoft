import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function DELETE(request: NextRequest) {
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
    const { emailId } = await request.json();
    
    // Security check: verify this email belongs to the authenticated user
    const { data: emailData, error: emailError } = await supabase
      .from('correos')
      .select('id_usuario')
      .eq('id_correo', emailId)
      .single();
      
    if (emailError || !emailData) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      );
    }
    
    if (emailData.id_usuario !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only delete your own email records' },
        { status: 403 }
      );
    }
    
    // Delete the email
    const { error } = await supabase
      .from('correos')
      .delete()
      .eq('id_correo', emailId);
    
    if (error) {
      console.error('Error deleting user email:', error);
      return NextResponse.json(
        { error: 'Failed to delete user email' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in delete email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}