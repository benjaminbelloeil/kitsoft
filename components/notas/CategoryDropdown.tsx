'use client';

import { useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { categories, getCategoryColors, CategoryId } from './constants';

interface CategoryDropdownProps {
  selectedCategory: Exclude<CategoryId, 'todas'>;
  onCategoryChange: (category: Exclude<CategoryId, 'todas'>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function CategoryDropdown({
  selectedCategory,
  onCategoryChange,
  isOpen,
  onToggle
}: CategoryDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer shadow-sm transition-colors"
      >
        <div className={`w-2 h-2 rounded-full ${
          (() => {
            const categoryColor = categories.find(cat => cat.id === selectedCategory)?.color || 'gray';
            const colors = getCategoryColors(categoryColor);
            return colors.dot;
          })()
        }`}></div>
        {(() => {
          const categoryIcon = categories.find(cat => cat.id === selectedCategory)?.icon;
          const CategoryIcon = categoryIcon;
          return CategoryIcon ? <CategoryIcon className="h-4 w-4 text-gray-500" /> : null;
        })()}
        <span className="capitalize">{selectedCategory}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Custom Category Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {categories.slice(1).map((category) => {
            const Icon = category.icon;
            const colors = getCategoryColors(category.color);
            return (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryChange(category.id as Exclude<CategoryId, 'todas'>);
                  onToggle();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-purple-50 transition-colors ${
                  selectedCategory === category.id ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
                <Icon className={`h-4 w-4 ${selectedCategory === category.id ? 'text-purple-600' : 'text-gray-500'}`} />
                <span className="font-medium">{category.name}</span>
                {selectedCategory === category.id && (
                  <Check className="h-4 w-4 text-purple-600 ml-auto" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
