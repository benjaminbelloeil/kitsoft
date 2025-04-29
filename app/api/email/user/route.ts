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
    
    // Security check: normal users can only access their own emails
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only access your own email records' },
        { status: 403 }
      );
    }
    
    // Get the emails for this user
    const { data, error } = await supabase
      .from('correos')
      .select('*')
      .eq('id_usuario', userId);
    
    if (error) {
      console.error('Error fetching user emails:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user emails' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error in user emails API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}