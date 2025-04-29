import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the query string
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Get the avatar URL for the specified user
    const { data, error } = await supabase
      .from('usuarios')
      .select('url_avatar')
      .eq('id_usuario', userId)
      .single();
    
    if (error) {
      console.error('Error fetching avatar URL:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch avatar URL' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ url: data?.url_avatar || null });
  } catch (error: any) {
    console.error('Unexpected error in get avatar API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}