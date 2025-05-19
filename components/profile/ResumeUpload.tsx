import React, { useState, useEffect } from "react";
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
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300 flex flex-col h-full ${className}`}>
      <h2 className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100">
        <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
          <FiFile className="h-5 w-5 text-[#A100FF]" />
        </span>
        Currículum
      </h2>
      
      <div className="space-y-4 flex-grow flex flex-col">
        <div className="flex-grow">
          {resumeFile ? (
            <div className="p-3 border border-gray-200 rounded-lg flex justify-between items-center hover:border-[#A100FF30] bg-white shadow-sm mb-4">
              <div className="flex items-center">
                <FiFileText className="text-[#A100FF] mr-2 flex-shrink-0" size={18} />
                <div className="truncate max-w-[200px]">
                  <p className="font-medium text-sm text-gray-800">{resumeFile.name}</p>
                  <p className="text-xs text-gray-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <div className="flex space-x-1 flex-shrink-0">
                <button
                  className="p-1.5 text-gray-500 hover:text-[#A100FF] hover:bg-gray-50 rounded"
                  onClick={() => {
                    if (resumeFile) {
                      downloadFile(resumeFile);
                    }
                  }}
                  title="Descargar"
                >
                  <FiDownload size={14} />
                </button>
                <button 
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
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center mb-4">
              <div className="text-center p-8">
                <div className="bg-[#A100FF08] rounded-full p-3 inline-flex mb-2">
                  <FiFile className="h-6 w-6 text-[#A100FF]" />
                </div>
                <p className="text-gray-500 text-sm">No hay currículum subido</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-2 border-dashed border-[#A100FF20] rounded-lg p-4 text-center hover:bg-[#A100FF05] transition-colors duration-200 mt-auto">
          <label htmlFor="file-upload" className="cursor-pointer block py-4">
            <div className="flex items-center justify-center">
              <div className="bg-[#A100FF10] rounded-full p-2 mr-3 hover:scale-110 hover:bg-[#A100FF15] transition-all duration-300">
                {resumeFile ? (
                  <FiUpload size={18} className="text-[#A100FF]" />
                ) : (
                  <FiPlus size={18} className="text-[#A100FF]" />
                )}
              </div>
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
        </div>
      </div>
    </div>
  );
}