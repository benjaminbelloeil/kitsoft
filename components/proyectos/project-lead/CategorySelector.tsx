'use client';

import { motion } from "framer-motion";
import { ThumbsUp, CheckCircle, Clock, MessageSquare } from "lucide-react";

interface CategorySelectorProps {
  categories: string[];
  toggleCategory: (category: string) => void;
}

export default function CategorySelector({ categories, toggleCategory }: CategorySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.1 }}
    >
      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <span className="h-2 w-2 bg-[#06B6D4] mr-2 rounded-full"></span>
        Categoría: <span className="ml-1 text-xs text-gray-500 font-normal">(múltiple)</span>
      </label>
      <div className="flex flex-col h-[100px] p-3 bg-white rounded-md border border-gray-200 shadow-inner overflow-auto">
        <div className="grid grid-rows-2 grid-cols-2 gap-3 h-full">
          {[
            { id: "colaboracion", name: "Colaboración", icon: <ThumbsUp className="h-4 w-4 min-w-4" /> },
            { id: "calidad", name: "Calidad", icon: <CheckCircle className="h-4 w-4 min-w-4" /> },
            { id: "cumplimiento", name: "Cumplimiento", icon: <Clock className="h-4 w-4 min-w-4" /> },
            { id: "comunicacion", name: "Comunicación", icon: <MessageSquare className="h-4 w-4 min-w-4" /> }
          ].map((cat, index) => (
            <motion.button
              type="button"
              key={cat.id}
              onClick={() => toggleCategory(cat.name)}
              className={`
                flex items-center py-3 px-3 
                text-xs rounded-md transition-all 
                ${categories.includes(cat.name) 
                  ? "bg-[#06B6D408] border-[#06B6D4] text-[#06B6D4] font-medium shadow-sm" 
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-[#06B6D405]"
                } 
                border
              `}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex-shrink-0 mr-2">{cat.icon}</div>
              <span className="truncate text-left">{cat.name}</span>
              {categories.includes(cat.name) && (
                <motion.span 
                  className="w-2 h-2 bg-[#06B6D4] rounded-full ml-auto"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
