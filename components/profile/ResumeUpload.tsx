/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiX, FiFileText, FiDownload } from "react-icons/fi";
import { updateUserCurriculum } from "@/utils/database/client/curriculumSync";
import { createClient } from "@/utils/supabase/client";
import { useNotificationState, UseNotification } from "@/components/ui/toast-notification";

interface ResumeUploadProps {
  userId?: string; // Make it optional for backward compatibility
  notificationState?: UseNotification; // Optional prop to use the parent's notification state
}

export default function ResumeUpload({ userId, notificationState }: ResumeUploadProps) {
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(userId || null);
  const [existingCurriculum, setExistingCurriculum] = useState<string | null>(null);
  const [curriculumFilename, setCurriculumFilename] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string | null>(null);
  
  // Use provided notification state or create a local one
  const localNotifications = useNotificationState();
  const notifications = notificationState || localNotifications;

  // Get user ID on component mount if not provided as prop
  useEffect(() => {
    async function getUserId() {
      if (userId) {
        setCurrentUserId(userId);
        fetchCurriculum(userId);
        return;
      }
      
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        setCurrentUserId(data.user.id);
        fetchCurriculum(data.user.id);
      }
    }

    getUserId();
  }, [userId]);

  // Fetch existing curriculum if available
  const fetchCurriculum = async (id: string) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('usuarios')
        .select('url_curriculum')
        .eq('id_usuario', id)
        .single();

      if (error) {
        console.error("Error fetching curriculum:", error);
      } else if (data?.url_curriculum) {
        setExistingCurriculum(data.url_curriculum);
        
        // Extract filename from URL
        const pathParts = data.url_curriculum.split('/');
        const fileNameWithId = pathParts[pathParts.length - 1];
        
        // Get the original file name (after the userId-)
        if (fileNameWithId.includes('-')) {
          const original = fileNameWithId.substring(fileNameWithId.indexOf('-') + 1);
          try {
            setOriginalFileName(decodeURIComponent(original));
          } catch (e) {
            setOriginalFileName(original);
          }
          setCurriculumFilename(fileNameWithId);
        } else {
          setCurriculumFilename(fileNameWithId);
          setOriginalFileName('curriculum.pdf');
        }
      } else {
        // Reset the state if no CV is found
        setExistingCurriculum(null);
        setCurriculumFilename(null);
        setOriginalFileName(null);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Use notification state to display messages
  const updateStatus = (message: string, isError: boolean = false) => {
    if (isError) {
      notifications.showError(message);
    } else {
      notifications.showSuccess(message);
    }
  };

  const handleUpload = async (file: File) => {
    if (!currentUserId) {
      updateStatus("Error: Usuario no identificado.", true);
      return;
    }

    setLoading(true);
    
    // Force clean up any existing files first
    if (existingCurriculum && curriculumFilename) {
      try {
        // Delete existing file from storage
        await forcefullyDeleteFile(currentUserId, curriculumFilename);
      } catch (error) {
        console.error("Error cleaning up existing file:", error);
        // Continue with upload even if cleanup fails
      }
    }
    
    const result = await updateUserCurriculum(currentUserId, file, 
      (msg) => {
        if (msg.includes('Error') || msg.includes('excede')) {
          updateStatus(msg, true);
        }
      }
    );
    
    if (result.success) {
      updateStatus("Currículum subido con éxito");
      setOriginalFileName(file.name);
      fetchCurriculum(currentUserId);
    } else {
      updateStatus(`Error al subir el currículum: ${result.error}`, true);
    }
    
    setLoading(false);
  };

  // A more aggressive approach to ensure files are removed from storage
  const forcefullyDeleteFile = async (userId: string, filename: string) => {
    const supabase = createClient();
    
    try {
      // Try multiple path formats to ensure we find and delete the file
      const possiblePaths = [
        `Curriculum/${filename}`,
        `Curriculum/${userId}-${filename}`,
        // Try with the original filename without the userId prefix
        filename.includes('-') 
          ? `Curriculum/${filename}` 
          : `Curriculum/${userId}-${filename}`
      ];
      
      // Also try by listing files and looking for the right one
      const { data: listData } = await supabase.storage
        .from('usuarios')
        .list('Curriculum');
        
      if (listData) {
        const matchingFiles = listData.filter(item => 
          item.name.includes(userId) || 
          (filename.includes('-') && item.name.includes(filename))
        );
        
        // Add these paths to our list to try
        matchingFiles.forEach(file => {
          possiblePaths.push(`Curriculum/${file.name}`);
        });
      }
      
      // Try to delete using each path
      for (const path of [...new Set(possiblePaths)]) { // Remove duplicates
        console.log(`Attempting to delete: ${path}`);
        await supabase.storage.from('usuarios').remove([path]);
      }
      
      // Also update the database to remove the reference
      await supabase
        .from('usuarios')
        .update({ url_curriculum: null })
        .eq('id_usuario', userId);
        
    } catch (err) {
      console.error("Error in forcefullyDeleteFile:", err);
      throw err;
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10485760, // 10MB
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        // Upload immediately when file is selected
        handleUpload(acceptedFiles[0]);
      }
    },
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles[0]?.errors[0]?.code === "file-too-large") {
        updateStatus("El archivo excede el tamaño máximo de 10MB.", true);
      } else {
        updateStatus("Tipo de archivo no permitido. Solo se permiten PDF, DOC y DOCX.", true);
      }
    }
  });

  const handleDelete = async () => {
    if (!currentUserId || !existingCurriculum) {
      return;
    }

    setLoading(true);
    
    try {
      // Use the more aggressive deletion approach
      await forcefullyDeleteFile(currentUserId, curriculumFilename || '');
      updateStatus("Currículum eliminado correctamente");
      
      // Clear the local state
      setExistingCurriculum(null);
      setCurriculumFilename(null);
      setOriginalFileName(null);
    } catch (error) {
      console.error("Error deleting file:", error);
      updateStatus("Error al eliminar el currículum", true);
    } finally {
      setLoading(false);
    }
  };

  // Download file directly instead of opening in a new tab
  const handleDownload = async () => {
    if (!existingCurriculum) return;

    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = existingCurriculum;
      link.download = originalFileName || 'curriculum.pdf'; // Set the download filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading file:", err);
      updateStatus("Error al descargar el archivo", true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Currículum</h2>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A100FF] mb-3"></div>
          <p className="text-sm text-gray-600">Procesando tu currículum...</p>
        </div>
      ) : existingCurriculum ? (
        <div>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="bg-[#A100FF20] p-2 rounded-full mr-3">
                <FiFileText size={20} className="text-[#A100FF]" />
              </div>
              <div className="truncate max-w-[150px]">
                <p className="font-medium text-gray-700 truncate" title={originalFileName || ''}>
                  {originalFileName || "curriculum.pdf"}
                </p>
                <p className="text-xs text-gray-500">CV Actual</p>
              </div>
            </div>
            <div className="flex">
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:text-[#A100FF] transition-colors"
                title="Descargar currículum"
              >
                <FiDownload size={18} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Eliminar currículum"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Upload a new one - Just drag or click area */}
          <div {...getRootProps()} className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#A100FF] transition-colors">
            <input {...getInputProps()} />
            <p className="text-sm text-gray-600">Arrastra o haz click para reemplazar tu CV</p>
            <p className="text-xs text-gray-500 mt-1">El archivo se subirá automáticamente</p>
          </div>
        </div>
      ) : (
        <div>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#A100FF] transition-colors cursor-pointer"
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <div className="p-3 bg-[#A100FF20] rounded-full mb-3">
                <FiUpload size={24} className="text-[#A100FF]" />
              </div>
              <p className="text-gray-700 mb-1">Arrastra tu CV aquí o haz click para seleccionar</p>
              <p className="text-xs text-gray-500">PDF, DOC o DOCX (Max: 10MB)</p>
              <p className="text-xs text-gray-500 mt-1">El archivo se subirá automáticamente</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
