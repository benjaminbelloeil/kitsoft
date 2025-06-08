'use client';

import { motion } from 'framer-motion';
import { Note } from '@/interfaces/note';
import { CategoryId, Priority } from './constants';
import NoteViewer from './NoteViewer';
import NoteCreator from './NoteCreator';

interface NoteEditorProps {
  selectedNote: Note | null;
  newNoteTitle: string;
  newNoteContent: string;
  newNoteCategory: Exclude<CategoryId, 'todas'>;
  newNotePriority: Priority;
  newNotePinned: boolean;
  isSaving: boolean;
  onNewNoteTitleChange: (title: string) => void;
  onNewNoteContentChange: (content: string) => void;
  onNewNoteCategoryChange: (category: Exclude<CategoryId, 'todas'>) => void;
  onNewNotePriorityChange: (priority: Priority) => void;
  onNewNotePinnedChange: (isPinned: boolean) => void;
  onSaveNewNote: () => void;
  onTogglePin: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onEditNote: (field: 'title' | 'content', value: string) => void;
}

export default function NoteEditor({
  selectedNote,
  newNoteTitle,
  newNoteContent,
  newNoteCategory,
  newNotePriority,
  newNotePinned,
  isSaving,
  onNewNoteTitleChange,
  onNewNoteContentChange,
  onNewNoteCategoryChange,
  onNewNotePriorityChange,
  onNewNotePinnedChange,
  onSaveNewNote,
  onTogglePin,
  onDeleteNote,
  onEditNote
}: NoteEditorProps) {
  return (
    <motion.div 
      className="flex-1 bg-white"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {selectedNote ? (
        <NoteViewer
          note={selectedNote}
          onTogglePin={onTogglePin}
          onDelete={onDeleteNote}
          onEdit={onEditNote}
        />
      ) : (
        <NoteCreator
          title={newNoteTitle}
          content={newNoteContent}
          category={newNoteCategory}
          priority={newNotePriority}
          isPinned={newNotePinned}
          isSaving={isSaving}
          onTitleChange={onNewNoteTitleChange}
          onContentChange={onNewNoteContentChange}
          onCategoryChange={onNewNoteCategoryChange}
          onPriorityChange={onNewNotePriorityChange}
          onPinnedChange={onNewNotePinnedChange}
          onSave={onSaveNewNote}
        />
      )}
    </motion.div>
  );
}
