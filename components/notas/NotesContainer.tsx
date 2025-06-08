'use client';

import { motion } from 'framer-motion';
import { Note } from '@/interfaces/note';
import { CategoryId, Priority } from './constants';
import CategorySidebar from './CategorySidebar';
import NoteEditor from './NoteEditor';

interface NotesContainerProps {
  notes: Note[];
  selectedCategory: CategoryId;
  expandedCategories: Set<string>;
  selectedNote: Note | null;
  newNoteTitle: string;
  newNoteContent: string;
  newNoteCategory: Exclude<CategoryId, 'todas'>;
  newNotePriority: Priority;
  newNotePinned: boolean;
  isSaving: boolean;
  onCategorySelect: (categoryId: CategoryId) => void;
  onCategoryToggle: (categoryId: string) => void;
  onNoteSelect: (note: Note) => void;
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

export default function NotesContainer({
  notes,
  selectedCategory,
  expandedCategories,
  selectedNote,
  newNoteTitle,
  newNoteContent,
  newNoteCategory,
  newNotePriority,
  newNotePinned,
  isSaving,
  onCategorySelect,
  onCategoryToggle,
  onNoteSelect,
  onNewNoteTitleChange,
  onNewNoteContentChange,
  onNewNoteCategoryChange,
  onNewNotePriorityChange,
  onNewNotePinnedChange,
  onSaveNewNote,
  onTogglePin,
  onDeleteNote,
  onEditNote
}: NotesContainerProps) {
  return (
    <motion.div 
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-210px)] pt-0 pb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex h-full">
          <CategorySidebar
            notes={notes}
            selectedCategory={selectedCategory}
            expandedCategories={expandedCategories}
            selectedNote={selectedNote}
            onCategorySelect={onCategorySelect}
            onCategoryToggle={onCategoryToggle}
            onNoteSelect={onNoteSelect}
          />
          
          <NoteEditor
            selectedNote={selectedNote}
            newNoteTitle={newNoteTitle}
            newNoteContent={newNoteContent}
            newNoteCategory={newNoteCategory}
            newNotePriority={newNotePriority}
            newNotePinned={newNotePinned}
            isSaving={isSaving}
            onNewNoteTitleChange={onNewNoteTitleChange}
            onNewNoteContentChange={onNewNoteContentChange}
            onNewNoteCategoryChange={onNewNoteCategoryChange}
            onNewNotePriorityChange={onNewNotePriorityChange}
            onNewNotePinnedChange={onNewNotePinnedChange}
            onSaveNewNote={onSaveNewNote}
            onTogglePin={onTogglePin}
            onDeleteNote={onDeleteNote}
            onEditNote={onEditNote}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
