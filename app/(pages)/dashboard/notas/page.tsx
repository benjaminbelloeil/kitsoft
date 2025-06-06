"use client";

import { useState, useEffect, useRef } from "react";
import NotesHeader from "@/components/notas/NotesHeader";
import { Pin, Trash2, ChevronDown, ChevronRight, Bold, Italic, Underline, List, AlignLeft, ImageIcon, User, Briefcase, Rocket, Users, Lightbulb, FileText, FolderOpen, Calendar, Check } from "lucide-react";

// Interface for Note structure
interface Note {
  id: string;
  title: string;
  content: string;
  category: 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea';
  priority: 'alta' | 'media' | 'baja';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  color: string;
}

// Category definitions with icons for Apple Notes style
const categories = [
  { id: 'todas', name: 'Todas las notas', icon: FileText, count: 0 },
  { id: 'personal', name: 'Personal', icon: User, count: 0 },
  { id: 'trabajo', name: 'Trabajo', icon: Briefcase, count: 0 },
  { id: 'proyecto', name: 'Proyectos', icon: Rocket, count: 0 },
  { id: 'reunión', name: 'Reuniones', icon: Users, count: 0 },
  { id: 'idea', name: 'Ideas', icon: Lightbulb, count: 0 },
] as const;

// Mock data for notes (will be replaced with database later)
const mockNotes: Note[] = [
  {
    id: "1",
    title: "Reunión de equipo - Sprint Planning",
    content: "Discutir objetivos del próximo sprint, revisar backlog y asignar tareas. Recordar mencionar el nuevo framework de testing.",
    category: "reunión",
    priority: "alta",
    tags: ["sprint", "planning", "equipo"],
    createdAt: new Date("2025-06-05T10:00:00"),
    updatedAt: new Date("2025-06-05T14:30:00"),
    isPinned: true,
    color: "#FEF3C7"
  },
  {
    id: "2",
    title: "Ideas para mejorar UX",
    content: "- Implementar feedback visual en botones\n- Mejorar navegación móvil\n- Añadir tooltips explicativos\n- Optimizar tiempo de carga",
    category: "idea",
    priority: "media",
    tags: ["ux", "diseño", "mejoras"],
    createdAt: new Date("2025-06-04T15:20:00"),
    updatedAt: new Date("2025-06-04T15:20:00"),
    isPinned: false,
    color: "#E0E7FF"
  },
  {
    id: "3",
    title: "Notas proyecto KitSoft",
    content: "Revisar integración con base de datos Supabase. Pendiente implementar autenticación JWT y configurar roles de usuario.",
    category: "proyecto",
    priority: "alta",
    tags: ["kitsoft", "database", "auth"],
    createdAt: new Date("2025-06-03T09:15:00"),
    updatedAt: new Date("2025-06-05T11:45:00"),
    isPinned: true,
    color: "#DCFCE7"
  },
  {
    id: "4",
    title: "Lista de compras personal",
    content: "- Café para la oficina\n- Cuaderno nuevo\n- Auriculares bluetooth\n- Plantas para el escritorio",
    category: "personal",
    priority: "baja",
    tags: ["compras", "personal"],
    createdAt: new Date("2025-06-02T18:30:00"),
    updatedAt: new Date("2025-06-02T18:30:00"),
    isPinned: false,
    color: "#FDE7F3"
  },
  {
    id: "5",
    title: "Aprendizaje React Avanzado",
    content: "Estudiar:\n- Context API avanzado\n- Custom hooks\n- Performance optimization\n- Server components",
    category: "trabajo",
    priority: "media",
    tags: ["react", "aprendizaje", "frontend"],
    createdAt: new Date("2025-06-01T12:00:00"),
    updatedAt: new Date("2025-06-03T16:20:00"),
    isPinned: false,
    color: "#E0F2FE"
  }
];

export default function NotasPage() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<'todas' | 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea'>('todas');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['personal', 'trabajo', 'proyecto', 'reunión', 'idea']));
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState<'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea'>('personal');
  const [newNotePriority, setNewNotePriority] = useState<'alta' | 'media' | 'baja'>('media');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);

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

  // Filter notes based on search and category
  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery === "" || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "todas" || note.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
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
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSelectCategory = (categoryId: 'todas' | 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea') => {
    setSelectedCategory(categoryId);
    setSelectedNote(null);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  const handleSaveNewNote = () => {
    if (newNoteTitle.trim() || newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: newNoteTitle.trim() || "Nueva nota",
        content: newNoteContent,
        category: newNoteCategory,
        priority: newNotePriority,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: false,
        color: "#F3F4F6"
      };
      
      setNotes(prev => [newNote, ...prev]);
      setSelectedNote(newNote);
      setNewNoteTitle("");
      setNewNoteContent("");
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  const handleTogglePin = (noteId: string) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ));
    if (selectedNote?.id === noteId) {
      setSelectedNote(prev => prev ? { ...prev, isPinned: !prev.isPinned } : null);
    }
  };

  const handleEditNote = (field: 'title' | 'content', value: string) => {
    if (selectedNote) {
      const updatedNote = { ...selectedNote, [field]: value, updatedAt: new Date() };
      setNotes(prev => prev.map(note =>
        note.id === selectedNote.id ? updatedNote : note
      ));
      setSelectedNote(updatedNote);
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

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Restored Original Header */}
      <NotesHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalNotes={notes.length}
        pinnedNotes={notes.filter(n => n.isPinned).length}
      />

      {/* Main Apple Notes Style Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-230px)] py-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
          <div className="flex h-full">
            
            {/* Left Sidebar - Categories and Notes List */}
            <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
              
              {/* Apple Notes Style Categories - Scrollable */}
              <div className="p-4 border-b border-gray-200 flex-1 overflow-y-auto">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-gray-600" />
                  Categorías
                </h3>
                <div className="space-y-1">
                  {categoriesWithCounts.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.id;
                    const isExpanded = expandedCategories.has(category.id);
                    const categoryNotes = category.id === 'todas' ? filteredNotes : filteredNotes.filter(note => note.category === category.id);
                    
                    return (
                      <div key={category.id}>
                        {/* Category Header */}
                        <div 
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            handleSelectCategory(category.id as 'todas' | 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea');
                            toggleCategory(category.id);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            {category.id !== 'todas' && (
                              <div className="w-4 h-4 flex items-center justify-center">
                                {isExpanded ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </div>
                            )}
                            <Icon className={`h-4 w-4 ${isSelected ? 'text-purple-600' : 'text-gray-500'}`} />
                            <span className="font-medium text-sm">{category.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            isSelected 
                              ? 'bg-purple-200 text-purple-800' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {category.count}
                          </span>
                        </div>

                        {/* Notes List for Expanded Category */}
                        {isExpanded && categoryNotes.length > 0 && (
                          <div className="ml-6 mt-1 space-y-2 mb-4">
                            {categoryNotes.map((note) => (
                              <div
                                key={note.id}
                                onClick={() => handleSelectNote(note)}
                                className={`p-3 rounded-md cursor-pointer transition-colors ${
                                  selectedNote?.id === note.id 
                                    ? 'bg-purple-50 border-l-2 border-purple-500' 
                                    : 'hover:bg-gray-100'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-gray-800 text-sm line-clamp-1 flex-1">
                                    {note.title}
                                  </h4>
                                  {note.isPinned && (
                                    <Pin className="h-3 w-3 text-purple-600 ml-2 flex-shrink-0" />
                                  )}
                                </div>
                                
                                <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                                  {note.content}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(note.priority)}`}>
                                      {note.priority}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {new Date(note.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Main Content - Note Viewer/Editor */}
            <div className="flex-1 bg-white">
              {selectedNote ? (
                /* Selected Note Viewer - Clean Style */
                <div className="h-full flex flex-col">
                  {/* Note Toolbar */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className={`px-3 py-1 rounded-lg font-medium ${getPriorityColor(selectedNote.priority)}`}>
                          {selectedNote.priority} prioridad
                        </span>
                        <span className="px-3 py-1 bg-gray-100 rounded-lg font-medium flex items-center gap-2">
                          {(() => {
                            const categoryIcon = categories.find(cat => cat.id === selectedNote.category)?.icon;
                            const CategoryIcon = categoryIcon || FileText;
                            return <CategoryIcon className="h-3 w-3" />;
                          })()}
                          {selectedNote.category}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(selectedNote.updatedAt).toLocaleDateString()}</span>
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
                    
                    {/* Rich Text Toolbar */}
                    <div className="flex items-center gap-1 p-2 bg-white rounded-lg border border-gray-200">
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Negrita">
                        <Bold className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Cursiva">
                        <Italic className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Subrayado">
                        <Underline className="h-4 w-4 text-gray-600" />
                      </button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Lista">
                        <List className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Alineación">
                        <AlignLeft className="h-4 w-4 text-gray-600" />
                      </button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Imagen">
                        <ImageIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Tags */}
                    {selectedNote.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedNote.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Note Title and Content Area */}
                  <div className="flex-1 flex flex-col bg-white">
                    {/* Note Title */}
                    <div className="p-6 pb-4">
                      <input
                        type="text"
                        value={selectedNote.title}
                        onChange={(e) => handleEditNote('title', e.target.value)}
                        className="w-full text-3xl font-bold text-gray-800 bg-transparent border-none outline-none placeholder-gray-400"
                        placeholder="Título de la nota"
                      />
                    </div>
                    
                    {/* Divider */}
                    <div className="border-t border-gray-300 mx-6"></div>
                    
                    {/* Note Content */}
                    <div className="flex-1 p-6 pt-4">
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
                                    <Icon className={`h-4 w-4 ${newNoteCategory === category.id ? 'text-purple-600' : 'text-gray-500'}`} />
                                    <span>{category.name}</span>
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
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveNewNote}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium shadow-sm"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                    
                    {/* Rich Text Toolbar */}
                    <div className="flex items-center gap-1 p-2 bg-white rounded-lg border border-gray-200">
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Negrita">
                        <Bold className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Cursiva">
                        <Italic className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Subrayado">
                        <Underline className="h-4 w-4 text-gray-600" />
                      </button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Lista">
                        <List className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Alineación">
                        <AlignLeft className="h-4 w-4 text-gray-600" />
                      </button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Imagen">
                        <ImageIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Note Title and Content Area */}
                  <div className="flex-1 flex flex-col bg-white">
                    {/* Note Title Input */}
                    <div className="p-6 pb-4">
                      <input
                        type="text"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        className="w-full text-3xl font-bold text-gray-800 bg-transparent border-none outline-none placeholder-gray-400"
                        placeholder="Título sin título"
                        autoFocus
                      />
                    </div>
                    
                    {/* Divider */}
                    <div className="border-t border-gray-300 mx-6"></div>
                    
                    {/* Note Content */}
                    <div className="flex-1 p-6 pt-4">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
