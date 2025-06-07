// Note interface for the notes functionality
export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea';
  priority: 'alta' | 'media' | 'baja';
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  userId: string; // Foreign key to the user who owns the note
}

// Database representation (matches Supabase table structure)
export interface NoteDB {
  id_nota: string;
  title: string;
  content: string;
  category: 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea';
  priority: 'alta' | 'media' | 'baja';
  created_at: string; // ISO string in database
  updated_at: string; // ISO string in database
  is_pinned: boolean;
  id_usuario: string; // Foreign key to the user who owns the note
}

// For creating new notes
export interface CreateNoteData {
  title: string;
  content: string;
  category: 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea';
  priority: 'alta' | 'media' | 'baja';
  isPinned?: boolean;
}

// For updating existing notes
export interface UpdateNoteData {
  title?: string;
  content?: string;
  category?: 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea';
  priority?: 'alta' | 'media' | 'baja';
  isPinned?: boolean;
}

// Helper function to convert database note to frontend note
export function dbNoteToNote(dbNote: NoteDB): Note {
  return {
    id: dbNote.id_nota,
    title: dbNote.title,
    content: dbNote.content,
    category: dbNote.category,
    priority: dbNote.priority,
    createdAt: new Date(dbNote.created_at),
    updatedAt: new Date(dbNote.updated_at),
    isPinned: dbNote.is_pinned,
    userId: dbNote.id_usuario,
  };
}

// Helper function to convert frontend note to database note
export function noteToDbNote(note: Note): NoteDB {
  return {
    id_nota: note.id,
    title: note.title,
    content: note.content,
    category: note.category,
    priority: note.priority,
    created_at: note.createdAt.toISOString(),
    updated_at: note.updatedAt.toISOString(),
    is_pinned: note.isPinned,
    id_usuario: note.userId,
  };
}
