"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import NotesHeader from "@/components/notas/NotesHeader";
import NotesSkeleton from "@/components/notas/NotesSkeleton";
import { Pin, Trash2, ChevronDown, ChevronRight, User, Briefcase, Rocket, Users, Lightbulb, FileText, FolderOpen, Calendar, Check } from "lucide-react";
import { Note } from "@/interfaces/note";
import { getUserNotes, createNote, updateNote, deleteNote } from "@/utils/database/client/notesSync";
import { createClient } from "@/utils/supabase/client";

// Category definitions with icons and colors for Apple Notes style
const categories = [
  { id: 'todas', name: 'Todas las notas', icon: FileText, count: 0, color: 'gray' },
  { id: 'personal', name: 'Personal', icon: User, count: 0, color: 'blue' },
  { id: 'trabajo', name: 'Trabajo', icon: Briefcase, count: 0, color: 'green' },
  { id: 'proyecto', name: 'Proyectos', icon: Rocket, count: 0, color: 'purple' },
  { id: 'reunión', name: 'Reuniones', icon: Users, count: 0, color: 'orange' },
  { id: 'idea', name: 'Ideas', icon: Lightbulb, count: 0, color: 'yellow' },
] as const;

// Helper function to get category color classes
const getCategoryColors = (color: string) => {
  const colorMap: Record<string, {
    bg: string;
    border: string;
    text: string;
    icon: string;
    cardBg: string;
    cardBorder: string;
    cardHover: string;
    dot: string;
    dotBorder: string;
  }> = {
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      icon: 'text-gray-600',
      cardBg: 'bg-gray-50/50',
      cardBorder: 'border-gray-200',
      cardHover: 'hover:border-gray-300',
      dot: 'bg-gray-500',
      dotBorder: 'border-gray-300'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'text-blue-600',
      cardBg: 'bg-blue-50/50',
      cardBorder: 'border-blue-200',
      cardHover: 'hover:border-blue-300',
      dot: 'bg-blue-500',
      dotBorder: 'border-blue-300'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: 'text-green-600',
      cardBg: 'bg-green-50/50',
      cardBorder: 'border-green-200',
      cardHover: 'hover:border-green-300',
      dot: 'bg-green-500',
      dotBorder: 'border-green-300'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      icon: 'text-purple-600',
      cardBg: 'bg-purple-50/50',
      cardBorder: 'border-purple-200',
      cardHover: 'hover:border-purple-300',
      dot: 'bg-purple-500',
      dotBorder: 'border-purple-300'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      icon: 'text-orange-600',
      cardBg: 'bg-orange-50/50',
      cardBorder: 'border-orange-200',
      cardHover: 'hover:border-orange-300',
      dot: 'bg-orange-500',
      dotBorder: 'border-orange-300'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: 'text-yellow-600',
      cardBg: 'bg-yellow-50/50',
      cardBorder: 'border-yellow-200',
      cardHover: 'hover:border-yellow-300',
      dot: 'bg-yellow-500',
      dotBorder: 'border-yellow-300'
    }
  };
  
  return colorMap[color] || colorMap.gray;
};

// Mock data for notes (will be replaced with database later)
// const mockNotes: Note[] = [];

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
  const [selectedCategory, setSelectedCategory] = useState<'todas' | 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea'>('todas');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState<'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea'>('personal');
  const [newNotePriority, setNewNotePriority] = useState<'alta' | 'media' | 'baja'>('media');
  const [newNotePinned, setNewNotePinned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);
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
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [supabase.auth]);

  // Handle URL parameters to auto-select note
  useEffect(() => {
    const noteId = searchParams.get('note');
    if (noteId && notes.length > 0) {
      const noteToSelect = notes.find(note => note.id === noteId);
      if (noteToSelect) {
        setSelectedNote(noteToSelect);
        // Set the category to match the note's category or 'todas'
        setSelectedCategory(noteToSelect.category);
        // Expand the appropriate category
        setExpandedCategories(new Set([noteToSelect.category]));
      }
    }
  }, [searchParams, notes]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target as Node)) {
        setIsPriorityDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate category counts
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    count: category.id === 'todas' ? notes.length : notes.filter(note => note.category === category.id).length
  }));

  // Filter notes based on category
  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === "todas" || note.category === selectedCategory;
    return matchesCategory;
  }).sort((a, b) => {
    // Pinned notes first, then by update date
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      // Close all other categories when opening a new one
      newExpanded.clear();
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSelectCategory = (categoryId: 'todas' | 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea') => {
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
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('User not authenticated');
          return;
        }

        const newNoteData = {
          title: newNoteTitle.trim() || "Nueva nota",
          content: newNoteContent,
          category: newNoteCategory,
          priority: newNotePriority,
          isPinned: newNotePinned
        };
        
        const createdNote = await createNote(newNoteData);
        if (createdNote) {
          setNotes(prev => [createdNote, ...prev]);
          setSelectedNote(createdNote);
          setNewNoteTitle("");
          setNewNoteContent("");
        }
      } catch (error) {
        console.error('Error creating note:', error);
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
        // Clear note parameter from URL when deleting the selected note
        const url = new URL(window.location.href);
        url.searchParams.delete('note');
        router.replace(url.pathname + url.search);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleTogglePin = async (noteId: string) => {
    try {
      const noteToUpdate = notes.find(note => note.id === noteId);
      if (!noteToUpdate) return;

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "text-red-700 bg-red-50";
      case "media": return "text-yellow-700 bg-yellow-50";
      case "baja": return "text-green-700 bg-green-50";
      default: return "text-gray-700 bg-gray-50";
    }
  };
  
  // Functions to handle category management
  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Loading State */}
      {loading ? (
        <NotesSkeleton />
      ) : (
        <>
          {/* Header */}
          <NotesHeader
            totalNotes={notes.length}
            pinnedNotes={notes.filter(n => n.isPinned).length}
          />
          
          {/* Main Content */}
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
            
            {/* Left Sidebar - Categories and Notes List */}
            <motion.div 
              className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              
              {/* Apple Notes Style Categories - Scrollable */}
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
                            handleSelectCategory(category.id as 'todas' | 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea');
                            toggleCategory(category.id);
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
                            {categoryNotes.map((note) => {
                              const noteCategoryColor = categories.find(cat => cat.id === note.category)?.color || 'gray';
                              const categoryColors = getCategoryColors(noteCategoryColor);
                              
                              return (
                                <motion.div
                                  key={note.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2 }}
                                  onClick={() => handleSelectNote(note)}
                                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                                    selectedNote?.id === note.id 
                                      ? `bg-gray-100 shadow-sm ${categoryColors.cardBorder}` 
                                      : `bg-white hover:shadow-sm ${categoryColors.cardBorder}`
                                  }`}
                                >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                                    {note.title}
                                  </h4>
                                  {note.isPinned && (
                                    <Pin className="h-3.5 w-3.5 text-gray-600 ml-2 flex-shrink-0" />
                                  )}
                                </div>
                                
                                <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                                  {note.content}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${getPriorityColor(note.priority)} ${
                                      note.priority === 'alta' 
                                        ? 'border-red-200' 
                                        : note.priority === 'media'
                                        ? 'border-yellow-200'
                                        : 'border-green-200'
                                    }`}>
                                      {note.priority === 'alta' && <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                                      {note.priority === 'media' && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>}
                                      {note.priority === 'baja' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>}
                                      {note.priority}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <span className="font-semibold text-gray-500">
                                      {new Date(note.createdAt).toLocaleDateString('es-ES', { 
                                        day: 'numeric', 
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right Main Content - Note Viewer/Editor */}
            <motion.div 
              className="flex-1 bg-white"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {selectedNote ? (
                /* Selected Note Viewer - Clean Style */
                <div className="h-full flex flex-col">
                    {/* Note Toolbar */}
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Priority Badge */}
                        <div className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm border-2 ${getPriorityColor(selectedNote.priority)} ${
                          selectedNote.priority === 'alta' 
                            ? 'border-red-200 ring-2 ring-red-100' 
                            : selectedNote.priority === 'media'
                            ? 'border-yellow-200 ring-2 ring-yellow-100'
                            : 'border-green-200 ring-2 ring-green-100'
                        }`}>
                          <span className="flex items-center gap-1.5">
                            {selectedNote.priority === 'alta' && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                            {selectedNote.priority === 'media' && <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>}
                            {selectedNote.priority === 'baja' && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                            {selectedNote.priority} prioridad
                          </span>
                        </div>
                        
                        {/* Category Badge */}
                        <div className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm border-2 flex items-center gap-2 ${
                          (() => {
                            const categoryColor = categories.find(cat => cat.id === selectedNote.category)?.color || 'gray';
                            const colors = getCategoryColors(categoryColor);
                            return `${colors.bg} ${colors.text} ${colors.border}`;
                          })()
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            (() => {
                              const categoryColor = categories.find(cat => cat.id === selectedNote.category)?.color || 'gray';
                              const colors = getCategoryColors(categoryColor);
                              return colors.dot;
                            })()
                          }`}></div>
                          {(() => {
                            const categoryIcon = categories.find(cat => cat.id === selectedNote.category)?.icon;
                            const CategoryIcon = categoryIcon || FileText;
                            return <CategoryIcon className="h-4 w-4" />;
                          })()}
                          <span className="capitalize">{selectedNote.category}</span>
                        </div>
                        
                        {/* Date Badge */}
                        <div className="px-4 py-2 bg-white rounded-full font-medium text-sm text-gray-700 shadow-sm border border-gray-200 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{new Date(selectedNote.updatedAt).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePin(selectedNote.id)}
                          className={`p-2 rounded-lg transition-all ${
                            selectedNote.isPinned
                              ? 'text-purple-600 bg-purple-100'
                              : 'text-gray-600 hover:text-purple-600 hover:bg-purple-100'
                          }`}
                          title={selectedNote.isPinned ? "Desanclar" : "Anclar"}
                        >
                          <Pin className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(selectedNote.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Eliminar nota"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Note Title and Content Area */}
                  <div className="flex-1 flex flex-col bg-white">
                    {/* Note Title */}
                    <div className="p-6 pb-3">
                      <input
                        type="text"
                        value={selectedNote.title}
                        onChange={(e) => handleEditNote('title', e.target.value)}
                        className="w-full text-2xl font-semibold text-gray-800 bg-transparent border-none outline-none placeholder-gray-400"
                        placeholder="Título de la nota"
                      />
                    </div>
                    
                    {/* Divider */}
                    <div className="border-t border-gray-200 mx-6"></div>
                    
                    {/* Note Content */}
                    <div className="flex-1 p-6 pt-3">
                      <textarea
                        value={selectedNote.content}
                        onChange={(e) => handleEditNote('content', e.target.value)}
                        className="w-full h-full resize-none border-none outline-none text-gray-700 leading-relaxed text-base bg-transparent placeholder-gray-400"
                        placeholder="Escribe el contenido de tu nota..."
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* New Note Creation Interface - Always Open */
                <div className="h-full flex flex-col">
                  {/* New Note Toolbar */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Category Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                          <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer shadow-sm transition-colors"
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              (() => {
                                const categoryColor = categories.find(cat => cat.id === newNoteCategory)?.color || 'gray';
                                const colors = getCategoryColors(categoryColor);
                                return colors.dot;
                              })()
                            }`}></div>
                            {(() => {
                              const categoryIcon = categories.find(cat => cat.id === newNoteCategory)?.icon;
                              const CategoryIcon = categoryIcon || User;
                              return <CategoryIcon className="h-4 w-4 text-gray-500" />;
                            })()}
                            <span className="capitalize">{newNoteCategory}</span>
                            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {/* Custom Category Dropdown */}
                          {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              {categories.slice(1).map((category) => {
                                const Icon = category.icon;
                                const colors = getCategoryColors(category.color);
                                return (
                                  <button
                                    key={category.id}
                                    onClick={() => {
                                      setNewNoteCategory(category.id as 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea');
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-purple-50 transition-colors ${
                                      newNoteCategory === category.id ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                                    }`}
                                  >
                                    <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
                                    <Icon className={`h-4 w-4 ${newNoteCategory === category.id ? 'text-purple-600' : 'text-gray-500'}`} />
                                    <span className="font-medium">{category.name}</span>
                                    {newNoteCategory === category.id && (
                                      <Check className="h-4 w-4 text-purple-600 ml-auto" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Priority Dropdown */}
                        <div className="relative" ref={priorityDropdownRef}>
                          <button
                            onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer shadow-sm transition-colors"
                          >
                            <span className={`w-2 h-2 rounded-full ${
                              newNotePriority === 'alta' ? 'bg-red-500' : 
                              newNotePriority === 'media' ? 'bg-yellow-500' : 'bg-green-500'
                            }`} />
                            <span className="capitalize">{newNotePriority}</span>
                            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isPriorityDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {/* Custom Priority Dropdown */}
                          {isPriorityDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              {[
                                { id: 'alta', name: 'Alta', color: 'bg-red-500' },
                                { id: 'media', name: 'Media', color: 'bg-yellow-500' },
                                { id: 'baja', name: 'Baja', color: 'bg-green-500' }
                              ].map((priority) => (
                                <button
                                  key={priority.id}
                                  onClick={() => {
                                    setNewNotePriority(priority.id as 'alta' | 'media' | 'baja');
                                    setIsPriorityDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-purple-50 transition-colors ${
                                    newNotePriority === priority.id ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${priority.color}`} />
                                  <span>{priority.name}</span>
                                  {newNotePriority === priority.id && (
                                    <Check className="h-4 w-4 text-purple-600 ml-auto" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Pin Button */}
                        <button 
                          onClick={() => setNewNotePinned(!newNotePinned)}
                          className={`flex items-center justify-center p-2 rounded-lg border ${
                            newNotePinned 
                              ? 'bg-purple-100 border-purple-200 text-purple-600' 
                              : 'border-gray-200 bg-white text-gray-500 hover:text-purple-500'
                          }`}
                          title={newNotePinned ? 'Desanclar nota' : 'Anclar nota'}
                        >
                          <Pin className={`h-4 w-4 ${newNotePinned ? 'text-purple-600' : 'text-gray-500'}`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveNewNote}
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
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
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
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        className="w-full h-full resize-none border-none outline-none text-gray-700 leading-relaxed text-base bg-transparent placeholder-gray-400"
                        placeholder="Empieza a escribir..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
        </>
      )}

      {/* Delete Category Confirmation Modal */}
    </div>
  );
}
