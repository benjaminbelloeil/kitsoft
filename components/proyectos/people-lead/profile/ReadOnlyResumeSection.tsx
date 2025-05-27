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
          Currículum Vitae
        </h3>
        <div className="text-center py-8">
          <FiFileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-500 mb-2">Sin currículum disponible</h4>
          <p className="text-gray-400">Este usuario no ha subido su currículum vitae.</p>
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
        Currículum Vitae
        <span className="ml-3 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
          Disponible
        </span>
      </h3>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#A100FF10] to-purple-50 rounded-lg p-6 border border-[#A100FF20]"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-[#A100FF] p-3 rounded-lg">
              <FiFileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Currículum Vitae</h4>
              <p className="text-sm text-gray-600 mb-3">
                Documento PDF con la información profesional completa
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleViewResume}
                  className="inline-flex items-center px-4 py-2 bg-[#A100FF] text-white rounded-lg hover:bg-[#8A00E6] transition-colors text-sm font-medium"
                >
                  <FiExternalLink className="h-4 w-4 mr-2" />
                  Ver Currículum
                </button>
                <button
                  onClick={handleDownloadResume}
                  className="inline-flex items-center px-4 py-2 bg-white text-[#A100FF] border border-[#A100FF] rounded-lg hover:bg-[#A100FF10] transition-colors text-sm font-medium"
                >
                  <FiDownload className="h-4 w-4 mr-2" />
                  Descargar
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full mt-0.5"></div>
          <div>
            <p className="text-sm text-blue-800 font-medium mb-1">Información de visualización</p>
            <p className="text-xs text-blue-700">
              Este documento se abrirá en una nueva ventana. Puedes descargarlo para revisarlo sin conexión.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
