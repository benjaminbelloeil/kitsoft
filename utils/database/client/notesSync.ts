import { Note, CreateNoteData, UpdateNoteData } from '@/interfaces/note';

/**
 * Client-side utility functions for managing notes
 * These functions handle the API calls to the backend
 */

/**
 * Fetch all notes for the authenticated user
 */
export async function getUserNotes(category?: string, search?: string): Promise<Note[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'todas') {
      params.set('category', category);
    }
    if (search) {
      params.set('search', search);
    }

    const url = `/api/notes${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
}

/**
 * Create a new note
 */
export async function createNote(noteData: CreateNoteData): Promise<Note> {
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create note');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
}

/**
 * Update an existing note
 */
export async function updateNote(noteId: string, updateData: UpdateNoteData): Promise<Note> {
  try {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update note');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<void> {
  try {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete note');
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}

/**
 * Get a specific note by ID
 */
export async function getNote(noteId: string): Promise<Note> {
  try {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch note');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
}

/**
 * Toggle the pinned status of a note
 */
export async function toggleNotePinned(noteId: string, isPinned: boolean): Promise<Note> {
  return updateNote(noteId, { isPinned });
}

/**
 * Update note color
 */
export async function updateNoteColor(noteId: string, color: string): Promise<Note> {
  return updateNote(noteId, { color });
}
