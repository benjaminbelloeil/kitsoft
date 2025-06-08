'use client';

import { useState } from 'react';
import { Pin } from 'lucide-react';
import { CategoryId, Priority } from './constants';
import CategoryDropdown from './CategoryDropdown';
import PriorityDropdown from './PriorityDropdown';

interface NoteCreatorProps {
  title: string;
  content: string;
  category: Exclude<CategoryId, 'todas'>;
  priority: Priority;
  isPinned: boolean;
  isSaving: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: Exclude<CategoryId, 'todas'>) => void;
  onPriorityChange: (priority: Priority) => void;
  onPinnedChange: (isPinned: boolean) => void;
  onSave: () => void;
}

export default function NoteCreator({
  title,
  content,
  category,
  priority,
  isPinned,
  isSaving,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onPriorityChange,
  onPinnedChange,
  onSave
}: NoteCreatorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* New Note Toolbar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Category Dropdown */}
            <CategoryDropdown
              selectedCategory={category}
              onCategoryChange={onCategoryChange}
              isOpen={isDropdownOpen}
              onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
            />

            {/* Priority Dropdown */}
            <PriorityDropdown
              selectedPriority={priority}
              onPriorityChange={onPriorityChange}
              isOpen={isPriorityDropdownOpen}
              onToggle={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
            />

            {/* Pin Button */}
            <button 
              onClick={() => onPinnedChange(!isPinned)}
              className={`flex items-center justify-center p-2 rounded-lg border ${
                isPinned 
                  ? 'bg-purple-100 border-purple-200 text-purple-600' 
                  : 'border-gray-200 bg-white text-gray-500 hover:text-purple-500'
              }`}
              title={isPinned ? 'Desanclar nota' : 'Anclar nota'}
            >
              <Pin className={`h-4 w-4 ${isPinned ? 'text-purple-600' : 'text-gray-500'}`} />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              disabled={isSaving}
              className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 min-w-[80px] ${
                isSaving 
                  ? 'bg-purple-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              {isSaving ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Note Title and Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Note Title Input */}
        <div className="p-6 pb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full text-2xl font-semibold text-gray-800 bg-transparent border-none outline-none placeholder-gray-400"
            placeholder="Título sin título"
            autoFocus
          />
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-200 mx-6"></div>
        
        {/* Note Content */}
        <div className="flex-1 p-6 pt-3">
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full h-full resize-none border-none outline-none text-gray-700 leading-relaxed text-base bg-transparent placeholder-gray-400"
            placeholder="Empieza a escribir..."
          />
        </div>
      </div>
    </div>
  );
}
