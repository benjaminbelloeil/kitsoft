'use client';

import { useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Priority, priorityOptions } from './constants';

interface PriorityDropdownProps {
  selectedPriority: Priority;
  onPriorityChange: (priority: Priority) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function PriorityDropdown({
  selectedPriority,
  onPriorityChange,
  isOpen,
  onToggle
}: PriorityDropdownProps) {
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
        <span className={`w-2 h-2 rounded-full ${
          selectedPriority === 'alta' ? 'bg-red-500' : 
          selectedPriority === 'media' ? 'bg-yellow-500' : 'bg-green-500'
        }`} />
        <span className="capitalize">{selectedPriority}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Custom Priority Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {priorityOptions.map((priority) => (
            <button
              key={priority.id}
              onClick={() => {
                onPriorityChange(priority.id as Priority);
                onToggle();
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-purple-50 transition-colors ${
                selectedPriority === priority.id ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${priority.color}`} />
              <span>{priority.name}</span>
              {selectedPriority === priority.id && (
                <Check className="h-4 w-4 text-purple-600 ml-auto" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
