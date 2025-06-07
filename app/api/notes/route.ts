import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { CreateNoteData, NoteDB, dbNoteToNote } from '@/interfaces/note';
import { randomUUID } from 'crypto';

// GET - Fetch all notes for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build query
    let query = supabase
      .from('notas')
      .select('*')
      .eq('id_usuario', user.id);

    // Add category filter if provided
    if (category && category !== 'todas') {
      query = query.eq('category', category);
    }

    // Add search filter if provided
    if (search) {
      query = query.or(`title.ilike.%${search}%, content.ilike.%${search}%`);
    }

    // Order by pinned first, then by updated_at
    query = query.order('is_pinned', { ascending: false })
                 .order('updated_at', { ascending: false });

    const { data: notes, error } = await query;

    if (error) {
      console.error('Error fetching notes:', error);
      return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }

    // Convert database notes to frontend format
    const formattedNotes = (notes as NoteDB[]).map(dbNoteToNote);

    return NextResponse.json(formattedNotes);
  } catch (error) {
    console.error('Unexpected error in notes GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new note
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const noteData: CreateNoteData = await request.json();

    // Validate required fields
    if (!noteData.title || !noteData.category || !noteData.priority) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, and priority are required' },
        { status: 400 }
      );
    }

    // Create the note in the database
    const newNote: Partial<NoteDB> = {
      id_nota: randomUUID(),
      title: noteData.title,
      content: noteData.content || '',
      category: noteData.category,
      priority: noteData.priority,
      is_pinned: noteData.isPinned || false,
      id_usuario: user.id,
    };

    const { data, error } = await supabase
      .from('notas')
      .insert(newNote)
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
    }

    // Convert to frontend format
    const formattedNote = dbNoteToNote(data as NoteDB);

    return NextResponse.json(formattedNote, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in notes POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
