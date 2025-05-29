import React from "react";
import { motion } from "framer-motion";
import { FiFileText, FiExternalLink } from "react-icons/fi";

interface ReadOnlyResumeSectionProps {
  resumeUrl: string | null;
  loading?: boolean;
}

export default function ReadOnlyResumeSection({ resumeUrl, loading = false }: ReadOnlyResumeSectionProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-md mr-3"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!resumeUrl) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="bg-[#A100FF20] p-2 rounded-md mr-3">
            <FiFileText className="h-5 w-5 text-[#A100FF]" />
          </span>
          Currículum
        </h3>
        <div className="text-center py-5">
          <div className="bg-gray-50 rounded-full p-3 inline-flex mb-3 shadow-sm">
            <FiFileText className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Sin currículum disponible</p>
        </div>
      </div>
    );
  }

  const handleViewResume = () => {
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
        <span className="bg-[#A100FF20] p-2 rounded-md mr-3">
          <FiFileText className="h-5 w-5 text-[#A100FF]" />
        </span>
        Currículum
      </h3>

      <motion.div 
        className="p-3 border border-gray-200 rounded-lg flex justify-between items-center hover:border-[#A100FF30] bg-white shadow-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2, shadow: "0 8px 20px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <FiFileText className="text-[#A100FF] mr-2 flex-shrink-0" size={18} />
          </motion.div>
          <div className="max-w-[300px] pr-2">
            <p className="font-medium text-sm text-gray-800 break-all">
              {resumeUrl ? (
                (() => {
                  // Extract the filename from URL
                  const fullFilename = decodeURIComponent(resumeUrl.split('/').pop() || 'Currículum');
                  // Pattern to match UUID-timestamp-actualFilename
                  const parts = fullFilename.match(/^[a-f0-9-]+-\d+-(.+)$/);
                  return parts && parts[1] ? parts[1] : fullFilename;
                })()
              ) : 'Currículum'}
            </p>
            <p className="text-xs text-gray-500">Documento disponible</p>
          </div>
        </div>
        <div className="flex space-x-1 flex-shrink-0">
          <motion.button
            onClick={handleViewResume}
            className="p-1.5 text-gray-500 hover:text-[#A100FF] hover:bg-gray-50 rounded"
            title="Ver Currículum"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <FiExternalLink size={14} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
