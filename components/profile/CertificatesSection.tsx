import { useState } from "react";
import { FiCheckCircle, FiFileText, FiDownload, FiTrash2, FiPlus } from "react-icons/fi";
import { SkeletonCertificates } from "./SkeletonProfile";

interface CertificatesSectionProps {
  loading?: boolean;
  className?: string; // Add className prop for custom styling
}

export default function CertificatesSection({ loading = false, className = '' }: CertificatesSectionProps) {
  const [certificates, setCertificates] = useState<{name: string, file: File}[]>([]);

  // Certificate upload handler
  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Add the new certificate to the array
      setCertificates([...certificates, {
        name: e.target.files[0].name.includes('.') 
          ? e.target.files[0].name.split('.').slice(0, -1).join('.')  // Remove extension
          : e.target.files[0].name,
        file: e.target.files[0]
      }]);
      
      // Reset the input value to allow uploading the same file again if needed
      e.target.value = '';
    }
  };

  // Certificate removal handler
  const handleRemoveCertificate = (index: number) => {
    const updatedCertificates = [...certificates];
    updatedCertificates.splice(index, 1);
    setCertificates(updatedCertificates);
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
        
        <div className="border-2 border-dashed border-[#A100FF20] rounded-lg p-4 text-center hover:bg-[#A100FF05] transition-colors duration-200 mt-auto">
          <label htmlFor="certificate-upload" className="cursor-pointer block py-2">
            <div className="flex flex-col items-center">
              <FiPlus size={20} className="text-[#A100FF] mb-1" />
              <span className="text-sm font-medium text-[#A100FF]">Añadir certificado</span>
              <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG hasta 5MB</span>
            </div>
            <input 
              id="certificate-upload" 
              type="file" 
              className="sr-only" 
              onChange={handleCertificateUpload} 
              accept=".pdf,.jpg,.jpeg,.png" 
            />
          </label>
        </div>
      </div>
    </div>
  );
}
