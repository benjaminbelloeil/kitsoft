import { CertificateVisualData } from "@/interfaces";
import { FiCalendar, FiDownload, FiFileText, FiTrash2 } from "react-icons/fi";
import { motion } from 'framer-motion';


export default function CertificateCard({ cert, onRemove }: {cert: CertificateVisualData, onRemove: (cert: CertificateVisualData) => void;}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleDownload = async () => {
    if (!cert.url_archivo) return;
    
    try {
      const response = await fetch(cert.url_archivo);
      if (!response.ok) throw new Error('Failed to fetch file');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Use certificate course name as filename
      const cleanCourseName = cert.certificados.curso.replace(/[^a-zA-Z0-9\s]/g, '').trim();
      const filename = `${cleanCourseName}.pdf`;
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback to opening in new tab if download fails
      window.open(cert.url_archivo, '_blank');
    }
  };

  return (
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
          <p className="font-medium text-sm text-gray-800">{cert.certificados.curso}</p>
          <div className="flex items-center text-xs bg-[#A100FF08] px-2 py-1 rounded mt-1 w-fit">
            <FiCalendar className="text-[#A100FF] mr-1" size={12} />
            <span>Obtenido: {formatDate(cert.fecha_inicio)}</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-1 flex-shrink-0">
        <motion.button
          onClick={handleDownload}
          disabled={!cert.url_archivo}
          className={`p-1.5 rounded ${cert.url_archivo 
            ? 'text-gray-500 hover:text-[#A100FF] hover:bg-gray-50 cursor-pointer' 
            : 'text-gray-300 cursor-not-allowed'
          }`}
          title={cert.url_archivo ? "Descargar" : "Archivo no disponible"}
          whileHover={{ scale: cert.url_archivo ? 1.1 : 1 }}
          whileTap={{ scale: cert.url_archivo ? 0.95 : 1 }}
          transition={{ duration: 0.1 }}
        >
          <FiDownload size={14} />
        </motion.button>
        <motion.button 
          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
          onClick={() => onRemove(cert)}
          title="Eliminar"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
        >
          <FiTrash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}