"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { FiStar } from "react-icons/fi";
import { EnhancedFeedbackItem } from "@/utils/database/client/feedbackSync";
import FeedbackCard from "./FeedbackCard";

interface FeedbackListProps {
  feedbackItems: EnhancedFeedbackItem[];
  currentItems: EnhancedFeedbackItem[];
  currentPage: number;
  totalPages: number;
  formatDate: (dateStr: string) => string;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handlePageClick: (page: number) => void;
}

export default function FeedbackList({ 
  feedbackItems, 
  currentItems, 
  currentPage, 
  totalPages,
  formatDate,
  handlePreviousPage,
  handleNextPage,
  handlePageClick
}: FeedbackListProps) {
  return (
    <motion.div 
      className="lg:col-span-7"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow duration-300"
      >
        <div 
          className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center"
        >
          <div className="flex items-center">
            <div
              className="w-8 h-8 bg-gradient-to-br from-[#F59E0B10] to-[#F59E0B20] rounded-full flex items-center justify-center mr-3 shadow-sm border border-[#F59E0B10]"
            >
              <Star className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Retroalimentación recibida
              </h2>
              <p className="text-xs text-gray-500">
                Feedback de tu equipo y supervisores
              </p>
            </div>
          </div>
        </div>

        <div 
          className="flex-1 flex flex-col"
        >
          {feedbackItems.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 flex-1 min-h-[400px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              key={currentPage}
            >
              {currentItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.1 + index * 0.05,
                    ease: "easeOut"
                  }}
                >
                  <FeedbackCard 
                    item={item}
                    formatDate={formatDate}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <motion.div 
                className="text-center p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <FiStar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-xs">Los comentarios de tu equipo aparecerán aquí cuando recibas retroalimentación</p>
              </motion.div>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-gray-100 bg-[#F59E0B05] flex justify-center">
          {totalPages > 1 && (
            <div 
              className="flex items-center gap-2"
            >
              <button 
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="text-xs font-medium text-[#F59E0B] hover:text-[#EA580C] bg-white px-3 py-1.5 rounded-md border border-[#F59E0B20] hover:border-[#F59E0B40] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`text-xs font-medium px-2 py-1.5 rounded-md border shadow-sm transition-all ${
                      currentPage === page
                        ? 'bg-[#F59E0B] text-white border-[#F59E0B]'
                        : 'text-[#F59E0B] hover:text-[#EA580C] bg-white border-[#F59E0B20] hover:border-[#F59E0B40]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="text-xs font-medium text-[#F59E0B] hover:text-[#EA580C] bg-white px-3 py-1.5 rounded-md border border-[#F59E0B20] hover:border-[#F59E0B40] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
