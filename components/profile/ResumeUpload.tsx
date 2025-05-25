import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiTrash2, FiFileText, FiUpload, FiFile, FiPlus } from 'react-icons/fi';
import { getUserCurriculum, updateUserCurriculum, deleteUserCurriculum } from '@/utils/database/client/curriculumSync';
import { UseNotification } from "@/components/ui/toast-notification";
import { SkeletonResume } from "./SkeletonProfile";

interface ResumeUploadProps {
  userId: string; // Make it optional for backward compatibility
  notificationState?: UseNotification; // Optional prop to use the parent's notification state
  loading?: boolean; // Added loading prop
  className?: string; // Add className prop for custom styling
}

const downloadFile = (file: File) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export default function ResumeUpload({ userId, notificationState, loading = false, className = '' }: ResumeUploadProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  useEffect(() => {
    if (!userId || userId === 'user-id') return;

    const fetchCurriculum = async () => {
      const file = await getUserCurriculum(userId);
      if (file) {
        setResumeFile(file);
      }
    };

    fetchCurriculum();
  }, [userId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];
      
      try {
        // If there's already a curriculum file, delete it first
        if (resumeFile) {
          try {
            // Delete the existing file before setting the new one
            await deleteUserCurriculum(userId, resumeFile.name, undefined);
          } catch (error) {
            console.error("Error deleting previous curriculum:", error);
            // Continue with upload even if delete fails
          }
        }
        
        // Update with new file
        setResumeFile(newFile);
        await updateUserCurriculum(userId, newFile, undefined);
        
        if (notificationState) {
          notificationState.showSuccess('Currículum actualizado correctamente');
        }
      } catch (error) {
        console.error("Error updating curriculum:", error);
        if (notificationState) {
          notificationState.showError('Error al actualizar el currículum');
        }
      }
    }
  };

  if (loading) {
    return <SkeletonResume />;
  }

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300 flex flex-col h-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -2 }}
    >
      <motion.h2 
        className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.span 
          className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <FiFile className="h-5 w-5 text-[#A100FF]" />
        </motion.span>
        Currículum
      </motion.h2>
      
      <motion.div 
        className="space-y-4 flex-grow flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {resumeFile ? (
              <motion.div 
                key="resume-file"
                className="p-3 border border-gray-200 rounded-lg flex justify-between items-center hover:border-[#A100FF30] bg-white shadow-sm mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
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
                    <p className="font-medium text-sm text-gray-800">{resumeFile.name}</p>
                    <p className="text-xs text-gray-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex space-x-1 flex-shrink-0">
                  <motion.button
                    className="p-1.5 text-gray-500 hover:text-[#A100FF] hover:bg-gray-50 rounded"
                    onClick={() => {
                      if (resumeFile) {
                        downloadFile(resumeFile);
                      }
                    }}
                    title="Descargar"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    <FiDownload size={14} />
                  </motion.button>
                  <motion.button 
                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                    onClick={async () => {
                      if (resumeFile) {
                        try {
                          await deleteUserCurriculum(userId, resumeFile.name, undefined);
                          setResumeFile(null);
                          if (notificationState) {
                            notificationState.showInfo('Currículum eliminado');
                          }
                        } catch (error) {
                          console.error("Error deleting curriculum:", error);
                          if (notificationState) {
                            notificationState.showError('Error al eliminar el currículum');
                          }
                        }
                      }
                    }}
                    title="Eliminar"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    <FiTrash2 size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="no-resume"
                className="flex-grow flex items-center justify-center mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center p-8">
                  <motion.div 
                    className="bg-[#A100FF08] rounded-full p-3 inline-flex mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <FiFile className="h-6 w-6 text-[#A100FF]" />
                  </motion.div>
                  <p className="text-gray-500 text-sm">No hay currículum subido</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          className="border-2 border-dashed border-[#A100FF20] rounded-lg p-4 text-center hover:bg-[#A100FF05] transition-colors duration-200 mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.02, borderColor: "#A100FF40" }}
        >
          <label htmlFor="file-upload" className="cursor-pointer block py-4">
            <div className="flex items-center justify-center">
              <motion.div 
                className="bg-[#A100FF10] rounded-full p-2 mr-3 hover:scale-110 hover:bg-[#A100FF15] transition-all duration-300"
                whileHover={{ scale: 1.15, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                {resumeFile ? (
                  <FiUpload size={18} className="text-[#A100FF]" />
                ) : (
                  <FiPlus size={18} className="text-[#A100FF]" />
                )}
              </motion.div>
              <div className="text-center">
                <span className="block text-sm font-medium text-[#A100FF]">
                  {resumeFile ? 'Actualizar currículum' : 'Subir currículum'}
                </span>
                <span className="text-xs text-gray-500 mt-1 block">
                  {resumeFile ? 'El archivo actual será reemplazado' : 'PDF, DOC, DOCX hasta 10MB'}
                </span>
              </div>
            </div>
            <input 
              id="file-upload" 
              type="file" 
              className="sr-only" 
              onChange={handleFileChange} 
              accept=".pdf,.doc,.docx" 
            />
          </label>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}