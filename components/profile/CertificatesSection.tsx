import { useState } from "react";
import { FiCheckCircle, FiFileText, FiDownload, FiTrash2, FiPlus, FiCalendar, FiClock, FiX, FiSave } from "react-icons/fi";
import { SkeletonCertificates } from "./SkeletonProfile";

interface CertificatesSectionProps {
  loading?: boolean;
  className?: string;
}

interface Certificate {
  file: File;
  obtainedDate: string; // ISO string format
  expirationDate?: string; // Optional ISO string format
}

export default function CertificatesSection({ loading = false, className = '' }: CertificatesSectionProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
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
  const handleCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCertificate.file && newCertificate.obtainedDate) {
      setCertificates([...certificates, {
        file: newCertificate.file,
        obtainedDate: newCertificate.obtainedDate,
        expirationDate: newCertificate.expirationDate || undefined
      }]);
      resetForm();
    }
  };

  // Certificate removal handler
  const handleRemoveCertificate = (index: number) => {
    const updatedCertificates = [...certificates];
    updatedCertificates.splice(index, 1);
    setCertificates(updatedCertificates);
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
      <h2 className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100">
        <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
          <FiCheckCircle className="h-5 w-5 text-[#A100FF]" />
        </span>
        Certificados
      </h2>
      
      <div className="space-y-4 flex-grow flex flex-col">
        <div className="flex-grow">
          {certificates.length > 0 ? (
            <div className="grid gap-4 mb-4 grid-cols-1">
              {certificates.map((cert, index) => (
                <div 
                  key={index}
                  className="overflow-hidden rounded-lg bg-white border border-gray-200 hover:border-[#A100FF30] shadow-sm transition-all duration-300 hover:shadow-md group"
                >
                  <div className="flex items-start p-4">
                    <div className="bg-gradient-to-br from-[#A100FF20] to-[#A100FF10] rounded-lg p-3 mr-4 shadow-sm">
                      <div className="text-center w-10 h-10 flex items-center justify-center">
                        <span className="text-[#A100FF] font-semibold">{getFileExtension(cert.file)}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{getDisplayName(cert.file)}</h3>
                      
                      <div className="flex flex-wrap gap-3 mt-2">
                        <div className="flex items-center text-xs bg-[#A100FF08] px-2 py-1 rounded">
                          <FiCalendar className="text-[#A100FF] mr-1" size={12} />
                          <span>Obtenido: {formatDate(cert.obtainedDate)}</span>
                        </div>
                        {cert.expirationDate && (
                          <div className="flex items-center text-xs bg-[#A100FF08] px-2 py-1 rounded">
                            <FiClock className="text-[#A100FF] mr-1" size={12} />
                            <span>Expira: {formatDate(cert.expirationDate)}</span>
                          </div>
                        )}
                        <div className="flex items-center text-xs bg-[#A100FF08] px-2 py-1 rounded">
                          <FiFileText className="text-[#A100FF] mr-1" size={12} />
                          <span>{(cert.file.size / 1024).toFixed(0)} KB</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        className="p-2 text-gray-500 hover:text-[#A100FF] hover:bg-[#A100FF10] rounded-full transition-colors"
                        title="Descargar"
                      >
                        <FiDownload size={16} />
                      </button>
                      <button 
                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        onClick={() => handleRemoveCertificate(index)}
                        title="Eliminar"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center mb-4">
              <div className="text-center p-8">
                <div className="bg-[#A100FF08] rounded-full p-3 inline-flex mb-2">
                  <FiFileText className="h-6 w-6 text-[#A100FF]" />
                </div>
                <p className="text-gray-500 text-sm">No hay certificados subidos</p>
              </div>
            </div>
          )}
        </div>
        
        <div className={`mt-4 overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
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
                
                <div className="space-y-2">
                  <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                    Fecha de expiración <span className="text-gray-400 text-xs">(opcional)</span>
                  </label>
                  <div className="relative rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiClock className="text-[#A100FF] h-4 w-4" />
                    </div>
                    <input
                      id="expiration-date"
                      type="date"
                      className="focus:ring-[#A100FF] focus:border-[#A100FF] block w-full pl-10 pr-3 py-2.5 sm:text-sm border border-gray-200 rounded-lg transition-all duration-300 hover:border-[#A100FF30] bg-white"
                      value={newCertificate.expirationDate}
                      onChange={(e) => setNewCertificate({...newCertificate, expirationDate: e.target.value})}
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
                  disabled={!newCertificate.file}
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
