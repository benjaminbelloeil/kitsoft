// components/profile/certificados/NoCertificatesPlaceholder.tsx
import { FiFileText } from "react-icons/fi";

export default function NoCertificatesPlaceholder() {
  return (
    <div className="flex-grow flex items-center justify-center mb-4">
      <div className="text-center p-8">
        <div className="bg-[#A100FF08] rounded-full p-3 inline-flex mb-2">
          <FiFileText className="h-6 w-6 text-[#A100FF]" />
        </div>
        <p className="text-gray-500 text-sm">No hay certificados subidos</p>
      </div>
    </div>
  );
}
