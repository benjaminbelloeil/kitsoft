import React, { useState, useEffect } from "react";
import { FiDownload, FiTrash2 } from 'react-icons/fi';
import { getUserCurriculum, updateUserCurriculum, deleteUserCurriculum } from '@/utils/database/client/curriculumSync';
import { UseNotification } from "@/components/ui/toast-notification";

interface ResumeUploadProps {
  userId: string; // Make it optional for backward compatibility
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
  const [status, setStatus] = useState<string | null>(null);
  console.log('ResumeUpload component mounted with userId:', userId);
  
  useEffect(() => {
    if (!userId || userId === 'user-id') return;

    const fetchCurriculum = async () => {
      const file = await getUserCurriculum(userId);
      if (file) {
        setResumeFile(file);
    if (!userId || userId === 'user-id') return;

    const fetchCurriculum = async () => {
      const file = await getUserCurriculum(userId);
      if (file) {
        setResumeFile(file);
      }
    };
    };

    fetchCurriculum();
    fetchCurriculum();
  }, [userId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      await updateUserCurriculum(userId, file, setStatus);
      setStatus('Currículum actualizado correctamente.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300">
      <h2 className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100">
        <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A100FF]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        </span>
        Currículum
      </h2>
      
      <div className="border-2 border-dashed border-[#A100FF30] rounded-lg p-6 text-center bg-[#A100FF05]">
        {resumeFile ? (
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">
              <span className="block truncate">{resumeFile.name}</span>
              <span className="block text-gray-500 mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div className="flex justify-center gap-2">
              <button
                className="px-3 py-2 bg-[#A100FF] rounded flex items-center gap-1 hover:bg-[#8500D4] fast-transition shadow"
                onClick={() => {
                  if (resumeFile) {
                    downloadFile(resumeFile);
                  }
                }}
              >
                <FiDownload size={16} className="text-white !important" />
                <span className="text-white !important">Descargar</span>
              </button>
              <button 
                className="px-3 py-2 bg-red-600 rounded flex items-center gap-1 hover:bg-red-700 fast-transition shadow"
                onClick={async () => {
                  if (resumeFile) {
                    await deleteUserCurriculum(userId, resumeFile.name, setStatus);
                    setResumeFile(null);
                  }
                }}
              >
                <FiTrash2 size={16} className="text-white !important" />
                <span className="text-white !important">Eliminar</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-[#A100FF10] rounded-full inline-flex mx-auto">
              <svg className="h-12 w-12 text-[#A100FF]" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex justify-center text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-[#A100FF] hover:text-[#8500D4]">
                <span>Subir archivo</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
              </label>
              <p className="pl-1">o arrastra y suelta</p>
            </div>
            <p className="text-xs text-gray-500">
              PDF, DOC, DOCX hasta 10MB
            </p>
          </div>
        )}
      </div>
      {status && <p className="mt-4 text-sm text-center text-green-600">{status}</p>}
    </div>
  );
}