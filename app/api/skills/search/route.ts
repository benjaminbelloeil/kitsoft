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
    
    // Get the query from query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    if (!query) {
      return NextResponse.json([]);
    }
    
    // Search for skills that match the query
    const { data, error } = await supabase
      .from('habilidades')
      .select('*')
      .ilike('titulo', `%${query}%`)
      .order('titulo')
      .limit(20);
    
    if (error) {
      console.error('Error searching skills:', error);
      return NextResponse.json(
        { error: 'Failed to search skills' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error in skills search API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}