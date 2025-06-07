'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Tag, Palette } from 'lucide-react';

interface Note {
  title: string;
  content: string;
  category: 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea';
  priority: 'alta' | 'media' | 'baja';
  tags: string[];
  isPinned: boolean;
  color: string;
}

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
}

const categoryOptions = [
  { value: 'personal', label: 'Personal', emoji: '🏠' },
  { value: 'trabajo', label: 'Trabajo', emoji: '💼' },
  { value: 'proyecto', label: 'Proyecto', emoji: '🚀' },
  { value: 'reunión', label: 'Reunión', emoji: '👥' },
  { value: 'idea', label: 'Idea', emoji: '💡' }
] as const;

const priorityOptions = [
  { value: 'baja', label: 'Baja', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'media', label: 'Media', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'alta', label: 'Alta', color: 'bg-red-100 text-red-800 border-red-200' }
] as const;

const colorOptions = [
  '#FEF3C7', // Yellow
  '#E0E7FF', // Blue
  '#F3E8FF', // Purple
  '#DCFCE7', // Green
  '#FEE2E2', // Red
  '#F0F9FF', // Light Blue
  '#F7FEE7', // Light Green
  '#FDF4FF', // Light Purple
  '#FFFBEB', // Light Orange
  '#F8FAFC'  // Gray
];

export default function CreateNoteModal({ isOpen, onClose, onSave }: CreateNoteModalProps) {
  const [formData, setFormData] = useState<Note>({
    title: '',
    content: '',
    category: 'personal',
    priority: 'media',
    tags: [],
    isPinned: false,
    color: colorOptions[0]
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { title?: string; content?: string } = {};
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'El contenido es requerido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      category: 'personal',
      priority: 'media',
      tags: [],
      isPinned: false,
      color: colorOptions[0]
    });
    setTagInput('');
    setErrors({});
    onClose();
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Nueva Nota</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, title: e.target.value }));
                      if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF20] focus:border-[#A100FF] transition-colors ${
                      errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Título de tu nota..."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenido *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, content: e.target.value }));
                      if (errors.content) setErrors(prev => ({ ...prev, content: undefined }));
                    }}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF20] focus:border-[#A100FF] transition-colors resize-none ${
                      errors.content ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Escribe aquí el contenido de tu nota..."
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.content.length} caracteres
                  </p>
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        category: e.target.value as Note['category']
                      }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF20] focus:border-[#A100FF] transition-colors"
                    >
                      {categoryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.emoji} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridad
                    </label>
                    <div className="flex gap-2">
                      {priorityOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, priority: option.value }))}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                            formData.priority === option.value
                              ? option.color + ' ring-2 ring-offset-1 ring-gray-300'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiquetas
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#A100FF10] text-[#A100FF] text-sm rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF20] focus:border-[#A100FF] transition-colors"
                      placeholder="Añadir etiqueta..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Tag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Palette className="w-4 h-4 inline mr-2" />
                    Color de fondo
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map((color, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color 
                            ? 'border-[#A100FF] ring-2 ring-[#A100FF20]' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Pin option */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPinned: e.target.checked }))}
                      className="w-4 h-4 text-[#A100FF] bg-gray-100 border-gray-300 rounded focus:ring-[#A100FF] focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Fijar esta nota al inicio
                    </span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <motion.button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-[#A100FF] text-white rounded-lg hover:bg-[#8A00FF] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-4 h-4" />
                  Crear Nota
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
