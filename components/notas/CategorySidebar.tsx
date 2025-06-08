'use client';

import { motion } from 'framer-motion';
import { Note } from '@/interfaces/note';
import { CategoryId } from './constants';
import CategoryList from './CategoryList';

interface CategorySidebarProps {
  notes: Note[];
  selectedCategory: CategoryId;
  expandedCategories: Set<string>;
  selectedNote: Note | null;
  onCategorySelect: (categoryId: CategoryId) => void;
  onCategoryToggle: (categoryId: string) => void;
  onNoteSelect: (note: Note) => void;
}

export default function CategorySidebar({
  notes,
  selectedCategory,
  expandedCategories,
  selectedNote,
  onCategorySelect,
  onCategoryToggle,
  onNoteSelect
}: CategorySidebarProps) {
  return (
    <motion.div 
      className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CategoryList
        notes={notes}
        selectedCategory={selectedCategory}
        expandedCategories={expandedCategories}
        selectedNote={selectedNote}
        onCategorySelect={onCategorySelect}
        onCategoryToggle={onCategoryToggle}
        onNoteSelect={onNoteSelect}
      />
    </motion.div>
  );
}
