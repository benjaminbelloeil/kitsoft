/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FiAward, FiExternalLink, FiCalendar, FiCheckCircle } from "react-icons/fi";

interface Certificate {
  titulo: string;
  institucion: string;
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

export default function ReadOnlyCertificatesSection({ certificates, loading = false }: ReadOnlyCertificatesSectionProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-md mr-3"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="bg-[#A100FF20] p-2 rounded-md mr-3">
            <FiAward className="h-5 w-5 text-[#A100FF]" />
          </span>
          Certificaciones
        </h3>
        <div className="text-center py-8">
          <FiAward className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-500 mb-2">Sin certificaciones registradas</h4>
          <p className="text-gray-400">Este usuario no ha registrado certificaciones.</p>
        </div>
      </div>
    );
  }

  const activeCertificates = certificates.filter(cert => !isExpired(cert.fecha_expiracion));
  const expiredCertificates = certificates.filter(cert => isExpired(cert.fecha_expiracion));
  const expiringSoonCount = certificates.filter(cert => isExpiringSoon(cert.fecha_expiracion)).length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
        <span className="bg-[#A100FF20] p-2 rounded-md mr-3">
          <FiAward className="h-5 w-5 text-[#A100FF]" />
        </span>
        Certificaciones
        <span className="ml-3 bg-[#A100FF10] text-[#A100FF] px-2 py-1 rounded-full text-sm font-medium">
          {certificates.length} certificado{certificates.length !== 1 ? 's' : ''}
        </span>
      </h3>


      <div className="space-y-4">
        {certificates.map((cert, index) => {
          const expired = isExpired(cert.fecha_expiracion);
          const expiringSoon = isExpiringSoon(cert.fecha_expiracion);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                expired
                  ? 'bg-red-50 border-red-200'
                  : expiringSoon
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200 hover:border-[#A100FF] hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-md ${
                      expired
                        ? 'bg-red-100 text-red-600'
                        : expiringSoon
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-[#A100FF20] text-[#A100FF]'
                    }`}>
                      <FiAward className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1 truncate" title={cert.titulo}>
                        {cert.titulo}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{cert.institucion}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiCalendar className="h-3 w-3 mr-1" />
                          <span>Obtenido: {formatDate(cert.fecha_obtencion)}</span>
                        </div>
                        
                        
                        {!cert.fecha_expiracion && (
                          <div className="flex items-center text-green-600">
                            <FiCheckCircle className="h-3 w-3 mr-1" />
                            <span>Sin expiración</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      expired
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : expiringSoon
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-[#A100FF] text-white hover:bg-[#8A00E6]'
                    }`}
                  >
                    Ver
                    <FiExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
