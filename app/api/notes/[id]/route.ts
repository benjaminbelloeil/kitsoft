/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { UpdateNoteData, NoteDB, dbNoteToNote } from '@/interfaces/note';

// GET - Fetch a specific note by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: note, error } = await supabase
      .from('notas')
      .select('*')
      .eq('id_nota', id)
      .eq('id_usuario', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Note not found' }, { status: 404 });
      }
      console.error('Error fetching note:', error);
      return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
    }

    const formattedNote = dbNoteToNote(note as NoteDB);
    return NextResponse.json(formattedNote);
  } catch (error) {
    console.error('Unexpected error in note GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update a specific note
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData: UpdateNoteData = await request.json();

    // Verify the note exists and belongs to the user
    const { data: existingNote, error: fetchError } = await supabase
      .from('notas')
      .select('id_nota')
      .eq('id_nota', id)
      .eq('id_usuario', user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Note not found' }, { status: 404 });
      }
      console.error('Error fetching note for update:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
    }

    // Build update object with snake_case for database
    const updateObj: Partial<NoteDB> = {};
    if (updateData.title !== undefined) updateObj.title = updateData.title;
    if (updateData.content !== undefined) updateObj.content = updateData.content;
    if (updateData.category !== undefined) updateObj.category = updateData.category;
    if (updateData.priority !== undefined) updateObj.priority = updateData.priority;
    if (updateData.isPinned !== undefined) updateObj.is_pinned = updateData.isPinned;

    // Update the note
    const { data: updatedNote, error: updateError } = await supabase
      .from('notas')
      .update(updateObj)
      .eq('id_nota', id)
      .eq('id_usuario', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating note:', updateError);
      return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
    }

    const formattedNote = dbNoteToNote(updatedNote as NoteDB);
    return NextResponse.json(formattedNote);
  } catch (error) {
    console.error('Unexpected error in note PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a specific note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the note
    const { error } = await supabase
      .from('notas')
      .delete()
      .eq('id_nota', id)
      .eq('id_usuario', user.id);

    if (error) {
      console.error('Error deleting note:', error);
      return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in note DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
