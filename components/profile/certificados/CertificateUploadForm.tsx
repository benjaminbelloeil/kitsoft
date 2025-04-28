// components/profile/certificados/CertificateUploadForm.tsx
import { FiFileText, FiPlus, FiSave, FiX, FiCalendar } from "react-icons/fi";
import CertificateSearchInput from "./CertificateSearchInput";
import { certificado } from "@/interfaces/certificate";
import { NewCertificate } from "../CertificatesSection";

interface CertificateUploadFormProps {
  newCertificate: NewCertificate;
  setNewCertificate: React.Dispatch<React.SetStateAction<NewCertificate>>;
  selectedCert: certificado | null;
  setSelectedCert: (cert: certificado) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}

export default function CertificateUploadForm({
  newCertificate,
  setNewCertificate,
  selectedCert,
  setSelectedCert,
  handleSubmit,
  resetForm
}: CertificateUploadFormProps) {
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCertificate({
        ...newCertificate,
        file: e.target.files[0]
      });
      e.target.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Nuevo Certificado</h3>
        <button onClick={resetForm} type="button" className="text-gray-400 hover:text-red-500">
          <FiX size={20} />
        </button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {newCertificate.file ? (
          <div>
            <FiFileText className="mx-auto text-[#A100FF] mb-2" size={40} />
            <p className="text-sm font-medium">{newCertificate.file.name}</p>
            <p className="text-xs text-gray-500">{(newCertificate.file.size / 1024).toFixed(0)} KB</p>
          </div>
        ) : (
          <label className="cursor-pointer block">
            <input type="file" className="hidden" onChange={handleFileSelection} accept=".pdf,.jpg,.jpeg,.png" />
            <div className="flex flex-col items-center">
              <FiPlus className="text-[#A100FF] mb-2" size={40} />
              <p className="text-sm text-[#A100FF]">Selecciona un archivo</p>
              <p className="text-xs text-gray-400">PDF, JPG, PNG</p>
            </div>
          </label>
        )}
      </div>

      <CertificateSearchInput onSelect={setSelectedCert} />

      <div>
        <label htmlFor="obtainedDate" className="block text-sm font-medium mb-1">Fecha de obtención</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiCalendar className="text-[#A100FF]" />
          </div>
          <input
            id="obtainedDate"
            type="date"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            value={newCertificate.obtainedDate}
            onChange={(e) => setNewCertificate({...newCertificate, obtainedDate: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!newCertificate.file || !selectedCert || !newCertificate.obtainedDate}
          className="inline-flex items-center px-4 py-2 bg-[#A100FF] text-white rounded-md hover:bg-[#8400d1] disabled:opacity-40"
        >
          <FiSave className="mr-2" /> Agregar
        </button>
      </div>
    </form>
  );
}