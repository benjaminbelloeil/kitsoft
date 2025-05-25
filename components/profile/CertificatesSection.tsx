// components/profile/certificados/CertificatesSection.tsx
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { addUserCertificate, uploadCertificateFile, getUserCertificates, deleteUserCertificate } from "@/utils/database/client/certificateSync";
import { Certificate as DBCertificate } from "@/interfaces/certificate";
import { SkeletonCertificates } from "./SkeletonProfile";
import CertificateCard from "./certificados/CertificateCard";
import CertificateUploadForm from "./certificados/CertificateUploadForm";
import NoCertificatesPlaceholder from "./certificados/NoCertificatesPlaceholder";
import AddCertificateButton from "./certificados/AddCertificateButton";
import { getFileFromUrl } from "@/utils/database/client/certificateSync";
import { certificado } from "@/interfaces/certificate";
import { FiCheckCircle } from "react-icons/fi";
interface CertificatesSectionProps {
  userID: string;
  loading?: boolean;
  className?: string;
}

export interface Certificate {
  nombre: string;
  file: File;
  obtainedDate: string;
  expirationDate?: string;
  raw: DBCertificate;
}

export interface NewCertificate {
  file: File | null;
  obtainedDate: string;
  expirationDate: string;
}

export default function CertificatesSection({ userID, loading = false, className = "" }: CertificatesSectionProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newCertificate, setNewCertificate] = useState<NewCertificate>({
    file: null,
    obtainedDate: new Date().toISOString().split('T')[0],
    expirationDate: ""
  });
  const [selectedCert, setSelectedCert] = useState<certificado | null>(null);

  const fetchCertificates = useCallback(async () => {
    if (!userID) return;
    
    try {
      const data = await getUserCertificates(userID);
      const formatted = await Promise.all(
        data.map(async (item) => {
          let archivo: File | null = null;
          if (item.URL_Certificado) {
            const blob = await getFileFromUrl(item.URL_Certificado);
            if (blob) {
              archivo = new File([blob], item.Nombre + ".pdf", { type: blob.type });
            }
          }
          return {
            nombre: item.Nombre || "Certificado sin nombre",
            file: archivo ?? new File([""], "certificado.pdf"),
            obtainedDate: item.Fecha_Emision,
            expirationDate: item.Fecha_Expiracion ?? undefined,
            raw: item,
          };
        })
      );
      setCertificates(formatted);
    } catch (err) {
      console.error("Error al obtener certificados:", err);
    }
  }, [userID]);

  useEffect(() => {
    fetchCertificates();
  }, [userID, fetchCertificates]);

  const resetForm = () => {
    setNewCertificate({
      file: null,
      obtainedDate: new Date().toISOString().split('T')[0],
      expirationDate: ""
    });
    setSelectedCert(null);
    setShowForm(false);
  };

  const handleCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertificate.file || !selectedCert || !newCertificate.obtainedDate) return;

    try {
      const uploadResult = await uploadCertificateFile(userID, newCertificate.file);
      if (!uploadResult.success || !uploadResult.url) {
        console.error("Error uploading file:", uploadResult.error);
        return;
      }

      const certificateData = {
        id_certificado: selectedCert.id_certificado,
        fecha_emision: newCertificate.obtainedDate,
        fecha_expiracion: newCertificate.expirationDate || null,
        url_certificado: uploadResult.url,
      };

      await addUserCertificate(userID, certificateData);
      resetForm();
      // Refresh the certificates list
      fetchCertificates();
    } catch (error) {
      console.error("Error al agregar certificado:", error);
    }
  };

  const handleRemoveCertificate = async (certToDelete: Certificate) => {
    try {
      if (!certToDelete.raw.ID_Certificado) {
        console.error("Certificate ID is missing");
        return;
      }
      
      const result = await deleteUserCertificate(certToDelete.raw.ID_Certificado, userID);
      if (!result.success) {
        console.error("Error eliminando el certificado:", result.error);
        return;
      }
      setCertificates(certificates.filter(c => c !== certToDelete));
    } catch (error) {
      console.error("Error inesperado al eliminar certificado:", error);
    }
  };

  if (loading) return <SkeletonCertificates />;

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col h-full w-full ${className}`}
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
          <FiCheckCircle className="h-5 w-5 text-[#A100FF]" />
        </motion.span>
        Certificados
      </motion.h2>
      
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="certificate-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CertificateUploadForm
              newCertificate={newCertificate}
              setNewCertificate={setNewCertificate}
              selectedCert={selectedCert}
              setSelectedCert={setSelectedCert}
              handleSubmit={handleCertificateSubmit}
              resetForm={resetForm}
            />
          </motion.div>
        ) : (
          <motion.div 
            className="flex-col flex gap-2"
            key="certificate-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {certificates.length > 0 ? (
                certificates.map((cert, index) => (
                  <motion.div
                    key={cert.raw.ID_Certificado || `cert-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    layout
                  >
                    <CertificateCard cert={cert} onRemove={handleRemoveCertificate} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <NoCertificatesPlaceholder />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: certificates.length * 0.1 + 0.3 }}
            >
              <AddCertificateButton onClick={() => setShowForm(true)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}