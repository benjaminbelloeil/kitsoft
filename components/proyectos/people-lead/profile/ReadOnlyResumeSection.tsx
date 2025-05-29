import React from "react";
import { motion } from "framer-motion";
import { FiFileText, FiDownload, FiExternalLink } from "react-icons/fi";

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
        <div className="text-center py-8">
          <FiFileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-500 mb-2">Sin currículum disponible</h4>
          <p className="text-gray-400">Este usuario no ha subido su currículum.</p>
        </div>
      </div>
    );
  }

  const handleViewResume = () => {
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'curriculum.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <div className="truncate max-w-[200px]">
            <p className="font-medium text-sm text-gray-800">Currículum</p>
            <div className="flex items-center text-xs bg-[#A100FF08] px-2 py-1 rounded mt-1 w-fit">
              <span>Documento PDF disponible</span>
            </div>
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
          <motion.button
            onClick={handleDownloadResume}
            className="p-1.5 text-gray-500 hover:text-[#A100FF] hover:bg-gray-50 rounded"
            title="Descargar"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <FiDownload size={14} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
