"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NotesHeader from "@/components/notas/NotesHeader";
import NotesSkeleton from "@/components/notas/NotesSkeleton";
import NotesContainer from "@/components/notas/NotesContainer";
import { Note } from "@/interfaces/note";
import { getUserNotes, createNote, updateNote, deleteNote } from "@/utils/database/client/notesSync";
import { createClient } from "@/utils/supabase/client";
import { CategoryId, Priority } from "@/components/notas/constants";

export default function NotasPage() {
  return (
    <Suspense fallback={<NotesSkeleton />}>
      <NotasPageContent />
    </Suspense>
  );
}

function NotasPageContent() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todas');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState<Exclude<CategoryId, 'todas'>>('personal');
  const [newNotePriority, setNewNotePriority] = useState<Priority>('media');
  const [newNotePinned, setNewNotePinned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Load notes on component mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('User not authenticated');
          return;
        }

        const fetchedNotes = await getUserNotes();
        setNotes(fetchedNotes || []);

        // Check if there's a note parameter in URL
        const noteId = searchParams.get('note');
        if (noteId && fetchedNotes) {
          const note = fetchedNotes.find(n => n.id === noteId);
          if (note) {
            setSelectedNote(note);
            setSelectedCategory(note.category as CategoryId);
          }
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [searchParams, supabase.auth]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.clear();
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSelectCategory = (categoryId: CategoryId) => {
    setSelectedCategory(categoryId);
    setSelectedNote(null);
    // Clear note parameter from URL when switching categories
    const url = new URL(window.location.href);
    url.searchParams.delete('note');
    router.replace(url.pathname + url.search);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  const handleSaveNewNote = async () => {
    if (newNoteTitle.trim() || newNoteContent.trim()) {
      try {
        setIsSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('User not authenticated');
          return;
        }

        const newNoteData = {
          title: newNoteTitle.trim() || 'Título sin título',
          content: newNoteContent.trim(),
          category: newNoteCategory,
          priority: newNotePriority,
          isPinned: newNotePinned,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const savedNote = await createNote(newNoteData);
        if (savedNote) {
          setNotes(prev => [savedNote, ...prev]);
          setNewNoteTitle("");
          setNewNoteContent("");
          setNewNoteCategory('personal');
          setNewNotePriority('media');
          setNewNotePinned(false);
          setSelectedNote(savedNote);
        }
      } catch (error) {
        console.error('Error saving note:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleTogglePin = async (noteId: string) => {
    try {
      const noteToUpdate = notes.find(note => note.id === noteId);
      if (noteToUpdate) {
        const updatedNote = await updateNote(noteId, { 
          isPinned: !noteToUpdate.isPinned 
        });
        
        if (updatedNote) {
          setNotes(prev => prev.map(note =>
            note.id === noteId ? updatedNote : note
          ));
          if (selectedNote?.id === noteId) {
            setSelectedNote(updatedNote);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleEditNote = async (field: 'title' | 'content', value: string) => {
    if (selectedNote) {
      try {
        const updatedNote = await updateNote(selectedNote.id, { 
          [field]: value 
        });
        
        if (updatedNote) {
          setNotes(prev => prev.map(note =>
            note.id === selectedNote.id ? updatedNote : note
          ));
          setSelectedNote(updatedNote);
        }
      } catch (error) {
        console.error('Error updating note:', error);
      }
    }
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {loading ? (
        <NotesSkeleton />
      ) : (
        <>
          <NotesHeader
            totalNotes={notes.length}
            pinnedNotes={notes.filter(n => n.isPinned).length}
          />
          
          <NotesContainer
            notes={notes}
            selectedCategory={selectedCategory}
            expandedCategories={expandedCategories}
            selectedNote={selectedNote}
            newNoteTitle={newNoteTitle}
            newNoteContent={newNoteContent}
            newNoteCategory={newNoteCategory}
            newNotePriority={newNotePriority}
            newNotePinned={newNotePinned}
            isSaving={isSaving}
            onCategorySelect={handleSelectCategory}
            onCategoryToggle={toggleCategory}
            onNoteSelect={handleSelectNote}
            onNewNoteTitleChange={setNewNoteTitle}
            onNewNoteContentChange={setNewNoteContent}
            onNewNoteCategoryChange={setNewNoteCategory}
            onNewNotePriorityChange={setNewNotePriority}
            onNewNotePinnedChange={setNewNotePinned}
            onSaveNewNote={handleSaveNewNote}
            onTogglePin={handleTogglePin}
            onDeleteNote={handleDeleteNote}
            onEditNote={handleEditNote}
          />
        </>
      )}
    </div>
  );
}
