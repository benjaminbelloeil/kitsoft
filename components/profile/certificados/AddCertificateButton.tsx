// components/profile/certificados/AddCertificateButton.tsx
import { FiPlus } from "react-icons/fi";

interface AddCertificateButtonProps {
  onClick: () => void;
}

export default function AddCertificateButton({ onClick }: AddCertificateButtonProps) {
  return (
    <button 
      onClick={onClick}
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
  );
}