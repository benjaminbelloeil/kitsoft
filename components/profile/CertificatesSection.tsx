import { useState, useEffect } from "react";
import { addUsuarioCertificado, uploadCertificadoFile, getCertificadosPorUsuario, deleteUsuarioCertificado } from "@/utils/database/client/certificateSync";
import { usuario_certificado } from "@/interfaces/certificate";
import { FiCheckCircle, FiFileText, FiDownload, FiTrash2, FiPlus, FiCalendar, FiClock, FiX, FiSave } from "react-icons/fi";
import { SkeletonCertificates } from "./SkeletonProfile";
import CertificateSearchInput from "./certificados/CertificateSearchInput";
import { getArchivoDesdeUrl, getNombreCertificadoPorId } from "@/utils/database/client/certificateSync";
import { certificado } from "@/interfaces/certificate"; // Asegúrate que esta interfaz esté bien importada

interface CertificatesSectionProps {
  userID: string;
  loading?: boolean;
  className?: string;
}

interface Certificate {
  nombre: string;
  file: File;
  obtainedDate: string; // ISO string format
  expirationDate?: string; // Optional ISO string format
  raw: usuario_certificado;
}

export default function CertificatesSection({ userID, loading = false, className = '' }: CertificatesSectionProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  console.log('Certificates component mounted with userId:', userID);
  useEffect(() => {
    if (!userID) return;

    const fetchCertificates = async () => {
      const userId = userID;
      try {
        const data = await getCertificadosPorUsuario(userId);
        const formatted = await Promise.all(
          data.map(async (item: any) => {
            let archivo: File | null = null;
            if (item.url_archivo) {
              archivo = await getArchivoDesdeUrl(item.url_archivo);
            }
            return {
              nombre: (await getNombreCertificadoPorId(item.id_certificado)) ?? "Certificado sin nombre",
              file: archivo ?? new File([""], "certificado.pdf"),
              obtainedDate: item.fecha_inicio,
              expirationDate: item.fecha_fin,
              raw: item,
            };
          })
        );
        setCertificates(formatted);
      } catch (err) {
        console.error("Error al obtener certificados:", err);
      }
    };

    fetchCertificates();
  }, [userID]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newCertificate, setNewCertificate] = useState<{
    file: File | null,
    obtainedDate: string,
    expirationDate: string
  }>({
    file: null,
    obtainedDate: new Date().toISOString().split('T')[0], // Default to today
    expirationDate: ""
  });
  // Nuevo estado para el certificado seleccionado
  const [selectedCert, setSelectedCert] = useState<certificado | null>(null);

  // Reset form state
  const resetForm = () => {
    setNewCertificate({
      file: null,
      obtainedDate: new Date().toISOString().split('T')[0],
      expirationDate: ""
    });
    setShowForm(false);
  };

  // Certificate file selection handler
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      setNewCertificate({
        ...newCertificate,
        file
      });
      
      // Reset the input value
      e.target.value = '';
    }
  };

  // Certificate form submission handler
  const handleCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertificate.file || !selectedCert || !newCertificate.obtainedDate) return;

    const userId = userID;
    console.log("Certificado ID:", selectedCert);
    try {
      // 1. Subir el archivo y obtener la URL
      const url = await uploadCertificadoFile(userId, newCertificate.file);

      // 2. Crear el objeto usuario_certificado
      const nuevoRegistro: usuario_certificado = {
        id_certificado: selectedCert.id_certificado,
        id_usuario: userId,
        url_archivo: url,
        fecha_inicio: newCertificate.obtainedDate,
        fecha_fin: null
      };

      // 3. Insertar en la base de datos
      await addUsuarioCertificado(nuevoRegistro);

      // 4. Resetear formulario y estado
      resetForm();
    } catch (error) {
      console.error("Error al agregar certificado:", error);
    }
  };

  // Certificate removal handler
  const handleRemoveCertificate = async (certToDelete: Certificate) => {
    try {
      const result = await deleteUsuarioCertificado(certToDelete.raw);
      if (!result.success) {
        console.error("Error eliminando el certificado:", result.error);
        return;
      }
      const updatedCertificates = certificates.filter(c => c !== certToDelete);
      setCertificates(updatedCertificates);
    } catch (error) {
      console.error("Error inesperado al eliminar certificado:", error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get file name without extension for display
  const getDisplayName = (file: File) => {
    return file.name.includes('.') 
      ? file.name.split('.').slice(0, -1).join('.')
      : file.name;
  };

  // Get file extension for display
  const getFileExtension = (file: File) => {
    return file.name.split('.').pop()?.toUpperCase() || '';
  };

  if (loading) {
    return <SkeletonCertificates />;
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300 flex flex-col h-full w-full ${className}`}>
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300 flex flex-col h-full w-full ${className}`}>
      <h2 className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100">
        <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
          <FiCheckCircle className="h-5 w-5 text-[#A100FF]" />
        </span>
        Certificados
      </h2>
      
      <div className="space-y-4 flex-grow flex flex-col">
        <div className="flex-grow">
          {certificates.length > 0 ? (
            <div className="space-y-3 mb-4">
              {certificates.map((cert, index) => (
                <div 
                  key={index} 
                  className="p-3 border border-gray-200 rounded-lg flex justify-between items-center hover:border-[#A100FF20] bg-white shadow-sm"
                >
                  <div className="flex items-center">
                    <FiFileText className="text-[#A100FF] mr-2 flex-shrink-0" size={18} />
                    <div className="truncate max-w-[200px]">
                      <p className="font-medium text-sm text-gray-800">{cert.name}</p>
                      <p className="text-xs text-gray-500">{(cert.file.size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      className="p-1.5 text-gray-500 hover:text-[#A100FF] hover:bg-gray-50 rounded"
                      title="Descargar"
                    >
                      <FiDownload size={14} />
                    </button>
                    <button 
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                      onClick={() => handleRemoveCertificate(index)}
                      title="Eliminar"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center mb-4">
              <p className="text-center text-gray-500 text-sm italic">No hay certificados subidos</p>
            </div>
          )}
        </div>
        
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'mt-4 opacity-100 max-h-[1000px]' : 'h-0 opacity-0'}`}>
          <div className={`p-5 bg-gradient-to-r from-white to-[#A100FF08] border-2 border-[#A100FF20] rounded-xl shadow-sm transform transition-transform duration-500 ease-in-out ${showForm ? 'translate-y-0' : 'translate-y-10'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-medium text-gray-700 flex items-center">
                <span className="bg-[#A100FF15] p-1.5 rounded-md mr-2">
                  <FiFileText className="h-4 w-4 text-[#A100FF]" />
                </span>
                Nuevo Certificado
              </h3>
              <button 
                onClick={resetForm}
                className="p-1.5 rounded-full hover:bg-[#A100FF10] text-gray-500 hover:text-[#A100FF] transition-colors"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCertificateSubmit} className="space-y-4">
              <div 
                className={`
                  border-2 border-dashed rounded-xl p-6 text-center
                  ${newCertificate.file ? 
                    'bg-[#A100FF08] border-[#A100FF30]' : 
                    'bg-white border-gray-200 hover:border-[#A100FF30] hover:bg-[#A100FF05]'}
                  transition-all duration-300 relative group overflow-hidden
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#A100FF05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-full group-hover:translate-x-full transform ease-in-out" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}></div>
                
                {newCertificate.file ? (
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 border border-[#A100FF20] transition-transform duration-300 transform hover:scale-105">
                      <FiFileText className="h-7 w-7 text-[#A100FF]" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">{newCertificate.file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(newCertificate.file.size / 1024).toFixed(0)} KB</p>
                    <button 
                      type="button" 
                      className="mt-3 px-4 py-1.5 text-xs bg-[#A100FF] text-white font-medium rounded-md hover:bg-[#8400d1] transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center mx-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewCertificate({...newCertificate, file: null})
                      }}
                    >
                      <FiTrash2 className="mr-1" size={12} />
                      Cambiar archivo
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block text-center relative z-10">
                    <input 
                      id="certificate-input"
                      type="file" 
                      className="sr-only" 
                      onChange={handleFileSelection} 
                      accept=".pdf,.jpg,.jpeg,.png" 
                    />
                    <div className="w-16 h-16 bg-gradient-to-r from-[#A100FF08] to-[#A100FF15] rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <FiPlus className="h-7 w-7 text-[#A100FF]" />
                    </div>
                    <p className="text-sm font-medium text-[#A100FF]">Arrastra o selecciona un archivo</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG hasta 5MB</p>
                  </label>
                )}
              </div>
              <div>
              <CertificateSearchInput
                onSelect={(cert) => setSelectedCert(cert)}
              />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <div className="space-y-2">
                  <label htmlFor="obtained-date" className="block text-sm font-medium text-gray-700">Fecha de obtención</label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-[#A100FF] h-4 w-4" />
                    </div>
                    <input
                      id="obtained-date"
                      type="date"
                      className="focus:ring-[#A100FF] focus:border-[#A100FF] block w-full pl-10 pr-3 py-2.5 sm:text-sm border border-gray-200 rounded-lg transition-all duration-300 hover:border-[#A100FF30] bg-white"
                      value={newCertificate.obtainedDate}
                      onChange={(e) => setNewCertificate({...newCertificate, obtainedDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
              </div>
              
              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-red-500 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                >
                  <FiX className="mr-1.5" size={16} />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newCertificate.file || !selectedCert || !newCertificate.obtainedDate}
                  className="px-4 py-2 bg-[#A100FF] text-white rounded-lg text-sm font-medium hover:bg-[#8400d1] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A100FF] flex items-center"
                >
                  <FiSave className="mr-1.5" size={16} />
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="mt-auto w-full flex items-center justify-center border-2 border-dashed border-[#A100FF20] rounded-lg hover:border-[#A100FF40] hover:bg-[#A100FF05] transition-all duration-300 group p-4"
          >
            <div className="flex items-center justify-center py-4">
              <div className="bg-[#A100FF10] rounded-full p-2 mr-3 group-hover:scale-110 group-hover:bg-[#A100FF15] transition-all duration-300">
                <FiPlus size={18} className="text-[#A100FF]" />
              </div>
              <div className="text-center">
                <span className="block text-sm font-medium text-[#A100FF] group-hover:text-[#8400d1] transition-colors">Añadir certificado</span>
                <span className="text-xs text-gray-500 mt-1 block">PDF, JPG, PNG hasta 5MB</span>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
