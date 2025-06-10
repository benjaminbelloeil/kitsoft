/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FiAward, FiExternalLink, FiCalendar, FiCheckCircle, FiDownload } from "react-icons/fi";

interface Certificate {
  titulo: string;
  fecha_obtencion: string;
  fecha_expiracion?: string;
  url?: string;
}

interface ReadOnlyCertificatesSectionProps {
  certificates: Certificate[];
  loading?: boolean;
}

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

const isExpired = (expirationDate?: string): boolean => {
  if (!expirationDate) return false;
  return new Date(expirationDate) < new Date();
};

const isExpiringSoon = (expirationDate?: string): boolean => {
  if (!expirationDate) return false;
  const expDate = new Date(expirationDate);
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
  return expDate > today && expDate <= thirtyDaysFromNow;
};

const handleDownload = async (url: string, title: string) => {
  if (!url) return;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch file');
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // Use certificate title as filename
    const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const filename = `${cleanTitle}.pdf`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
    // Fallback to opening in new tab if download fails
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

export default function ReadOnlyCertificatesSection({ certificates, loading = false }: ReadOnlyCertificatesSectionProps) {
  if (loading) {
    return (
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="animate-pulse">
          <motion.div 
            className="flex items-center mb-6 pb-3 border-b border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-gray-200 p-2 rounded-md mr-2 shadow-sm w-9 h-9"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </motion.div>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border border-gray-200 rounded-lg flex justify-between items-center bg-white shadow-sm">
                <div className="flex items-center flex-1">
                  <div className="bg-gray-200 p-2 rounded-md mr-3 w-8 h-8"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (certificates.length === 0) {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300"
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
          <FiAward className="h-5 w-5 text-[#A100FF]" />
        </motion.span>
        Certificaciones
      </motion.h2>
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="text-center py-5">
          <div className="bg-gray-50 rounded-full p-3 inline-flex mb-3 shadow-sm">
            <FiAward className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Sin certificaciones registradas</p>
        </div>
      </motion.div>
    </motion.div>
  );
  }

  const activeCertificates = certificates.filter(cert => !isExpired(cert.fecha_expiracion));
  const expiredCertificates = certificates.filter(cert => isExpired(cert.fecha_expiracion));
  const expiringSoonCount = certificates.filter(cert => isExpiringSoon(cert.fecha_expiracion)).length;

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300"
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
          <FiAward className="h-5 w-5 text-[#A100FF]" />
        </motion.span>
        Certificaciones
        <span className="ml-3 bg-[#A100FF10] text-[#A100FF] px-2 py-1 rounded-full text-sm font-medium">
          {certificates.length} certificado{certificates.length !== 1 ? 's' : ''}
        </span>
      </motion.h2>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="space-y-4">
          {certificates.map((cert, index) => {
            const expired = isExpired(cert.fecha_expiracion);
            const expiringSoon = isExpiringSoon(cert.fecha_expiracion);
            
            return (
              <motion.div
                key={index}
                className="p-3 border border-gray-200 rounded-lg flex justify-between items-center hover:border-[#A100FF30] bg-white shadow-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2, shadow: "0 8px 20px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex items-center flex-1">
                  <motion.div
                    className={`p-2 rounded-md mr-3 ${
                      expired
                        ? 'bg-red-100 text-red-600'
                        : expiringSoon
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-[#A100FF20] text-[#A100FF]'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiAward className="h-4 w-4" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate" title={cert.titulo}>
                      {cert.titulo}
                    </p>
                    {cert.url && (
                      <p className="text-xs text-gray-600">
                        Documento disponible
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      <span className="flex items-center">
                        <FiCalendar className="h-3 w-3 mr-1" />
                        {formatDate(cert.fecha_obtencion)}
                      </span>
                      {!cert.fecha_expiracion && (
                        <span className="flex items-center text-green-600">
                          <FiCheckCircle className="h-3 w-3 mr-1" />
                          Sin expiración
                        </span>
                      )}
                      {expired && (
                        <span className="text-red-600 font-medium">
                          Expirado
                        </span>
                      )}
                      {expiringSoon && (
                        <span className="text-yellow-600 font-medium">
                          Expira pronto
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1 flex-shrink-0">
                  {cert.url && (
                    <>
                      <motion.button
                        onClick={() => handleDownload(cert.url!, cert.titulo)}
                        className="p-1.5 text-gray-500 hover:text-[#A100FF] hover:bg-gray-50 rounded"
                        title="Descargar certificado"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        <FiDownload size={14} />
                      </motion.button>
                      <motion.button
                        onClick={() => window.open(cert.url, '_blank', 'noopener,noreferrer')}
                        className="p-1.5 text-gray-500 hover:text-[#A100FF] hover:bg-gray-50 rounded"
                        title="Ver certificado"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        <FiExternalLink size={14} />
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
