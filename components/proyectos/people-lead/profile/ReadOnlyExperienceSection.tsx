import React from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiCalendar } from "react-icons/fi";
import { RiBuilding4Line } from "react-icons/ri";

interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
}

interface ReadOnlyExperienceSectionProps {
  experiences: Experience[];
  loading?: boolean;
}

// Format date for display (e.g. "marzo de 2021")
const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if date is invalid
    }
    
    return date.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  } catch {
    return dateString; // Fallback to original string if parsing fails
  }
};

// Extract dates from period string
const extractDatesFromPeriod = (period: string): { startDate: string, endDate: string | null } => {
  const parts = period.split(' - ');
  const startDate = parts[0] || '';
  let endDate: string | null = parts[1] || null;

  if (endDate === 'Presente') {
    endDate = null;
  }

  return { startDate, endDate };
};

export default function ReadOnlyExperienceSection({ experiences, loading = false }: ReadOnlyExperienceSectionProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-md mr-3"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4">
                <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                <div className="h-16 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100">
          <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
            <FiBriefcase className="h-5 w-5 text-[#A100FF]" />
          </span>
          Experiencia
        </h3>
        <div className="text-center py-5">
          <div className="bg-gray-50 rounded-full p-3 inline-flex mb-3 shadow-sm">
            <FiBriefcase className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Sin experiencia registrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
        <span className="bg-[#A100FF20] p-2 rounded-md mr-3">
          <FiBriefcase className="h-5 w-5 text-[#A100FF]" />
        </span>
        Experiencia
      </h3>

      <div className="mt-4">
        {experiences.map((exp, index) => {
          const { startDate, endDate } = extractDatesFromPeriod(exp.period);
          
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4 last:mb-0"
            >
              <div className="group">
                <div className="flex flex-col md:flex-row items-start rounded-lg overflow-hidden bg-white transition-all duration-300 ease-in-out hover:shadow-md border border-gray-100 hover:border-[#A100FF20]">
                  <div className="w-full md:w-1 md:h-auto bg-gray-200 group-hover:bg-[#A100FF] transition-colors duration-300 md:self-stretch flex-shrink-0"></div>
                  
                  <div className="flex-grow p-4">
                    <div className="flex flex-col mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                        {exp.position}
                      </h3>
                      
                      <div className="flex items-center">
                        <p className="company-name text-gray-700 font-medium flex items-center gap-1">
                          <RiBuilding4Line size={14} className="text-gray-500" />
                          {exp.company}
                        </p>
                      </div>
                      
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1.5">
                        <FiCalendar size={12} className="text-gray-400" />
                        <span className="inline-block">
                          {startDate && formatDateDisplay(startDate)}
                          {endDate ? 
                            <span> — {formatDateDisplay(endDate)}</span> : 
                            <span className="text-gray-500 font-medium"> — Presente</span>
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-1 border-t border-gray-100">
                      <p className="text-gray-600 text-sm whitespace-pre-line mt-2">{exp.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
