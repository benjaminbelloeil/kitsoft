"use client";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiFile, FiX, FiFileText, FiDownload } from "react-icons/fi";
import { updateUserCurriculum, deleteUserCurriculum, getUserCurriculum } from "@/utils/database/client/curriculumSync";
import { createClient } from "@/utils/supabase/client";

interface ResumeUploadProps {
  userId?: string; // Make it optional for backward compatibility
}

export default function ResumeUpload({ userId }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(userId || null);
  const [existingCurriculum, setExistingCurriculum] = useState<string | null>(null);
  const [curriculumFilename, setCurriculumFilename] = useState<string | null>(null);

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
        const fileName = pathParts[pathParts.length - 1].split('-').slice(1).join('-');
        setCurriculumFilename(fileName || 'curriculum.pdf');
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
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
        setFile(acceptedFiles[0]);
        setStatus("");
      }
    },
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles[0]?.errors[0]?.code === "file-too-large") {
        setStatus("El archivo excede el tamaño máximo de 10MB.");
      } else {
        setStatus("Tipo de archivo no permitido. Solo se permiten PDF, DOC y DOCX.");
      }
    }
  });

  const handleUpload = async () => {
    if (!currentUserId) {
      setStatus("Error: Usuario no identificado.");
      return;
    }

    if (!file) {
      setStatus("Por favor selecciona un archivo.");
      return;
    }

    setLoading(true);
    const result = await updateUserCurriculum(currentUserId, file, setStatus);
    if (result.success) {
      setStatus("Currículum subido con éxito.");
      fetchCurriculum(currentUserId);
    } else {
      setStatus(`Error al subir el currículum: ${result.error}`);
    }
    setFile(null);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!currentUserId || !existingCurriculum) {
      return;
    }

    if (!curriculumFilename) {
      setStatus("No se puede identificar el nombre del archivo.");
      return;
    }

    setLoading(true);
    await deleteUserCurriculum(currentUserId, curriculumFilename, setStatus);
    setExistingCurriculum(null);
    setCurriculumFilename(null);
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!existingCurriculum) return;

    try {
      window.open(existingCurriculum, '_blank');
    } catch (err) {
      console.error("Error downloading file:", err);
      setStatus("Error al descargar el archivo");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Currículum</h2>
      
      {loading ? (
        <div className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A100FF]"></div>
        </div>
      ) : existingCurriculum ? (
        <div>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="bg-[#A100FF20] p-2 rounded-full mr-3">
                <FiFileText size={20} className="text-[#A100FF]" />
              </div>
              <div className="truncate max-w-[150px]">
                <p className="font-medium text-gray-700 truncate">
                  {curriculumFilename || "curriculum.pdf"}
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

          {/* Upload a new one */}
          <div {...getRootProps()} className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#A100FF] transition-colors">
            <input {...getInputProps()} />
            <p className="text-sm text-gray-600">Arrastra o haz click para reemplazar tu CV</p>
          </div>

          {file && (
            <div className="mt-4">
              <div className="flex items-center bg-[#A100FF10] p-3 rounded-lg">
                <FiFile size={18} className="text-[#A100FF] mr-2" />
                <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                <button
                  onClick={() => setFile(null)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <FiX size={18} />
                </button>
              </div>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-3 w-full py-2 bg-[#A100FF] text-white rounded-lg hover:bg-[#8500D4] transition-colors disabled:opacity-50"
              >
                <span className="flex items-center justify-center">
                  <FiUpload size={16} className="mr-2" /> Reemplazar CV
                </span>
              </button>
            </div>
          )}
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
            </div>
          </div>
          
          {file && (
            <div className="mt-4">
              <div className="flex items-center bg-[#A100FF10] p-3 rounded-lg">
                <FiFile size={18} className="text-[#A100FF] mr-2" />
                <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                <button
                  onClick={() => setFile(null)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <FiX size={18} />
                </button>
              </div>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-3 w-full py-2 bg-[#A100FF] text-white rounded-lg hover:bg-[#8500D4] transition-colors disabled:opacity-50"
              >
                <span className="flex items-center justify-center">
                  <FiUpload size={16} className="mr-2" /> Subir CV
                </span>
              </button>
            </div>
          )}
        </div>
      )}
      
      {status && (
        <div className={`mt-4 text-sm p-2 rounded ${status.includes('Error') || status.includes('excede') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {status}
        </div>
      )}
    </div>
  );
}
