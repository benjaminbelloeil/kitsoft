'use client';

import { ChevronDown, ChevronRight, FolderOpen } from 'lucide-react';
import { Note } from '@/interfaces/note';
import { categories, getCategoryColors, CategoryId } from './constants';
import NoteListItem from './NoteListItem';

interface CategoryListProps {
  notes: Note[];
  selectedCategory: CategoryId;
  expandedCategories: Set<string>;
  selectedNote: Note | null;
  onCategorySelect: (categoryId: CategoryId) => void;
  onCategoryToggle: (categoryId: string) => void;
  onNoteSelect: (note: Note) => void;
}

export default function CategoryList({
  notes,
  selectedCategory,
  expandedCategories,
  selectedNote,
  onCategorySelect,
  onCategoryToggle,
  onNoteSelect
}: CategoryListProps) {
  // Calculate category counts
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    count: category.id === 'todas' ? notes.length : notes.filter(note => note.category === category.id).length
  }));

  // Filter and sort notes
  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === "todas" || note.category === selectedCategory;
    return matchesCategory;
  }).sort((a, b) => {
    // Pinned notes first, then by update date
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="p-4 border-b border-gray-200 flex-1 overflow-y-auto">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-lg font-bold text-gray-800 tracking-wide flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#A100FF10] to-[#A100FF20] p-2 rounded-lg shadow-sm border border-[#A100FF10]">
            <FolderOpen className="h-4 w-4 text-[#A100FF]" />
          </div>
          Categorías
        </h3>
      </div>
      <div className="border-b border-gray-200 mb-4"></div>
      <div className="space-y-1">
        {categoriesWithCounts.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          const isExpanded = expandedCategories.has(category.id);
          const categoryNotes = category.id === 'todas' ? filteredNotes : filteredNotes.filter(note => note.category === category.id);
          
          return (
            <div key={category.id} className="mb-1">
              {/* Category Header */}
              <div 
                className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer border-l-4 ${
                  isSelected 
                    ? `bg-gray-100 text-gray-700 ${getCategoryColors(category.color).border}` 
                    : `text-gray-700 hover:bg-gray-100 ${getCategoryColors(category.color).border}`
                }`}
                onClick={() => {
                  onCategorySelect(category.id as CategoryId);
                  onCategoryToggle(category.id);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 flex-grow">
                    {category.id !== 'todas' && (
                      <div className="w-5 h-5 flex items-center justify-center">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    )}
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-gray-600' : 'text-gray-500'}`} />
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                </div>
                
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isSelected 
                    ? 'bg-gray-200 text-gray-800' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </div>

              {/* Notes List for Expanded Category */}
              {isExpanded && categoryNotes.length > 0 && (
                <div className="ml-6 mt-1 space-y-1 mb-3">
                  {categoryNotes.map((note) => (
                    <NoteListItem
                      key={note.id}
                      note={note}
                      isSelected={selectedNote?.id === note.id}
                      onSelect={onNoteSelect}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
