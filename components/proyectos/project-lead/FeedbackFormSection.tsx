/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';
import RecipientSelector from './RecipientSelector';
import RatingSelector from './RatingSelector';
import CategorySelector from './CategorySelector';

interface FeedbackFormSectionProps {
  projects: any[];
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
  selectedRecipient: string;
  setSelectedRecipient: (recipientId: string) => void;
  rating: number;
  setRating: (rating: number) => void;
  hoverRating: number;
  setHoverRating: (rating: number) => void;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  message: string;
  setMessage: (message: string) => void;
  submittingFeedback: boolean;
  handleSubmitFeedback: (e: React.FormEvent) => void;
  getFilteredRecipients: () => any[];
  toggleCategory: (category: string) => void;
}

const FeedbackFormSection: React.FC<FeedbackFormSectionProps> = ({
  projects,
  selectedProject,
  setSelectedProject,
  selectedRecipient,
  setSelectedRecipient,
  rating,
  setRating,
  hoverRating,
  setHoverRating,
  categories,
  message,
  setMessage,
  submittingFeedback,
  handleSubmitFeedback,
  getFilteredRecipients,
  toggleCategory
}) => {
  return (
    <motion.div 
      className="lg:col-span-1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      <motion.div 
        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-full"
        whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="p-6 border-b border-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-[#EA580C20] to-[#EA580C10] rounded-full flex items-center justify-center mr-4 shadow-lg border border-[#EA580C20]"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="w-5 h-5 text-[#EA580C]" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Enviar Retroalimentación
              </h2>
              <p className="text-sm text-gray-500">
                Comparte tu retroalimentación con los miembros del equipo.
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.form 
          onSubmit={handleSubmitFeedback} 
          className={`p-6 flex flex-col h-full ${submittingFeedback ? 'pointer-events-none opacity-75' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {/* Project selector */}
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span className="h-2 w-2 bg-[#3B82F6] mr-2 rounded-full"></span>
              Seleccionar proyecto:
            </label>
            <motion.select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-md text-sm focus:border-[#3B82F640] focus:ring-1 focus:ring-[#3B82F620] transition-all"
              whileFocus={{ scale: 1.02 }}
            >
              <option value="">Selecciona un proyecto</option>
              {projects.map((project) => (
                <option key={project.id_proyecto} value={project.id_proyecto}>
                  {project.titulo}
                </option>
              ))}
            </motion.select>
          </motion.div>

          {/* Recipient selector */}
          <RecipientSelector
            selectedRecipient={selectedRecipient}
            setSelectedRecipient={setSelectedRecipient}
            getFilteredRecipients={getFilteredRecipients}
            selectedProject={selectedProject}
          />
              
          <div className="grid grid-cols-1 gap-4 mb-4">
            {/* Rating box */}
            <RatingSelector
              rating={rating}
              setRating={setRating}
              hoverRating={hoverRating}
              setHoverRating={setHoverRating}
            />
            
            {/* Category selector */}
            <CategorySelector
              categories={categories}
              toggleCategory={toggleCategory}
            />
          </div>
          
          {/* Message area */}
          <motion.div 
            className="mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span className="h-2 w-2 bg-[#6366F1] mr-2 rounded-full"></span>
              Mensaje:
            </label>
            <motion.textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-[120px] rounded-md border border-gray-200 p-3 text-sm 
                        focus:border-[#6366F140] focus:ring-1 focus:ring-[#6366F120] resize-none
                        shadow-inner bg-[#6366F105]"
              placeholder="Escribe tu retroalimentación detallada aquí..."
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>
          
          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={!selectedProject || !selectedRecipient || !rating || categories.length === 0 || !message || submittingFeedback}
            className={`w-full py-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              selectedProject && selectedRecipient && rating && categories.length > 0 && message
                ? submittingFeedback
                  ? "bg-gradient-to-r from-[#3B82F6] to-[#6366F1] shadow-md text-white cursor-wait"
                  : "bg-gradient-to-r from-[#3B82F6] to-[#6366F1] hover:from-[#2563EB] hover:to-[#4F46E5] shadow-md text-white" 
                : "bg-gray-200 cursor-not-allowed text-gray-500"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.7 }}
            whileHover={selectedProject && selectedRecipient && rating && categories.length > 0 && message && !submittingFeedback ? { scale: 1.02 } : {}}
            whileTap={selectedProject && selectedRecipient && rating && categories.length > 0 && message && !submittingFeedback ? { scale: 0.98 } : {}}
          >
            {submittingFeedback ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Enviar Retroalimentación</span>
              </>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackFormSection;
