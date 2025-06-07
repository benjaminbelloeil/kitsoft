"use client";

import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

interface FeedbackHeaderProps {
  avgRating: number;
  getCurrentPeriod: () => string;
}

export default function FeedbackHeader({ avgRating, getCurrentPeriod }: FeedbackHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8"
    >
      <motion.div 
        className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="bg-gradient-to-br from-[#A100FF20] to-[#A100FF10] p-3 rounded-lg mr-4 shadow-sm"
              >
                <FiStar size={24} className="text-[#A100FF]" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-2xl font-bold text-black"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Retroalimentación
                </motion.h1>
                <motion.p 
                  className="text-gray-600 mt-2 max-w-2xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Este espacio permite compartir valoraciones con tu equipo para promover el crecimiento profesional.
                </motion.p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-end"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
              >
                <p className="text-sm text-gray-600">Último periodo evaluado</p>
                <p className="text-lg font-bold text-gray-900">{getCurrentPeriod()}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#A100FF20] text-[#A100FF] font-medium">
                    Promedio: {avgRating}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
