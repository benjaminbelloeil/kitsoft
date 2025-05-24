// components/profile/certificados/CertificatesSection.tsx
import { useState, useEffect } from "react";
import { addUsuarioCertificado, uploadCertificadoFile, deleteUsuarioCertificado, getUserCertificates } from "@/utils/database/client/certificateSync";
import { CertificateVisualData, usuario_certificado } from "@/interfaces/certificate";
import { SkeletonCertificates } from "./SkeletonProfile";
import CertificateCard from "./certificados/CertificateCard";
import CertificateUploadForm from "./certificados/CertificateUploadForm";
import NoCertificatesPlaceholder from "./certificados/NoCertificatesPlaceholder";
import AddCertificateButton from "./certificados/AddCertificateButton";
import { certificado } from "@/interfaces/certificate";
import { FiCheckCircle } from "react-icons/fi";

interface CertificatesSectionProps {
  userID: string;
  loading?: boolean;
  className?: string;
}


export interface NewCertificate {
  file: File | null;
  obtainedDate: string;
  expirationDate: string;
}

export default function CertificatesSection({ userID, loading = false, className = "" }: CertificatesSectionProps) {
  const [certificates, setCertificates] = useState<CertificateVisualData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newCertificate, setNewCertificate] = useState<NewCertificate>({
    file: null,
    obtainedDate: new Date().toISOString().split('T')[0],
    expirationDate: ""
  });
  const [selectedCert, setSelectedCert] = useState<certificado | null>(null);

  useEffect(() => {
    if (!userID) return;

    const fetchCertificates = async () => {
		async function fetchCertificates() {
			try {
				const fetchedCertificates = await getUserCertificates(userID);
				setCertificates(fetchedCertificates);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			catch(e: any) {
				console.log(e.message);
			}
		}

		fetchCertificates();
    };

    fetchCertificates();
  }, [userID]);

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
      const { url } = await uploadCertificadoFile(userID, newCertificate.file);
      const nuevoRegistro: usuario_certificado = {
        id_certificado: selectedCert.id_certificado,
        id_usuario: userID,
        url_archivo: url,
        fecha_inicio: newCertificate.obtainedDate,
        fecha_fin: null,
      };

      await addUsuarioCertificado(nuevoRegistro);
      resetForm();
    } catch (error) {
      console.error("Error al agregar certificado:", error);
    }
  };

  const handleRemoveCertificate = async (certToDelete: CertificateVisualData) => {
    try {
      const result = await deleteUsuarioCertificado(certToDelete.id_usuario, certToDelete.id_usuario);
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
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col h-full w-full ${className}`}>
      <h2 className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100">
        <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
          <FiCheckCircle className="h-5 w-5 text-[#A100FF]" />
        </span>
        Certificados
      </h2>
      {showForm ? (
        <CertificateUploadForm
          newCertificate={newCertificate}
          setNewCertificate={setNewCertificate}
          selectedCert={selectedCert}
          setSelectedCert={setSelectedCert}
          handleSubmit={handleCertificateSubmit}
          resetForm={resetForm}
        />
      ) : (
        <div className="flex-col flex gap-2">
          {certificates.length > 0 ? (
            certificates.map(cert => (
              <CertificateCard key={cert.certificados.id_certificado} cert={cert} onRemove={handleRemoveCertificate} />
            ))
          ) : (
            <NoCertificatesPlaceholder />
          )}
          <AddCertificateButton onClick={() => setShowForm(true)} />
        </div>
      )}
    </div>
  );
}