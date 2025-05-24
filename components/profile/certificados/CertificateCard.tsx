// components/profile/certificados/CertificateCard.tsx
import { certificado, CertificateVisualData } from "@/interfaces";
import { FiCalendar, FiClock, FiDownload, FiFileText, FiTrash2 } from "react-icons/fi";


export default function CertificateCard({ cert, onRemove }: {cert: CertificateVisualData, onRemove: (cert: certificado) => void;}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getFileExtension = (file: File) => {
    return file.name.split('.').pop()?.toUpperCase() || '';
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white border border-gray-200 hover:border-[#A100FF30] shadow-sm transition-all duration-300 hover:shadow-md group">
      <div className="flex items-start p-4">
        <div className="bg-gradient-to-br from-[#A100FF20] to-[#A100FF10] rounded-lg p-3 mr-4 shadow-sm">
          <div className="text-center w-10 h-10 flex items-center justify-center">
            {/* <span className="text-[#A100FF] font-semibold">{getFileExtension(cert.file)}</span> */}
			{/* TODO: Implementar datos de archivo de certificado */}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{cert.certificados.curso}</h3>
          <div className="flex flex-wrap gap-3 mt-2">
            <div className="flex items-center text-xs bg-[#A100FF08] px-2 py-1 rounded">
              <FiCalendar className="text-[#A100FF] mr-1" size={12} />
              <span>Obtenido: {formatDate(cert.fecha_inicio)}</span>
            </div>
            {cert.fecha_fin && (
              <div className="flex items-center text-xs bg-[#A100FF08] px-2 py-1 rounded">
                <FiClock className="text-[#A100FF] mr-1" size={12} />
                <span>Expira: {formatDate(cert.fecha_fin)}</span>
              </div>
            )}
            <div className="flex items-center text-xs bg-[#A100FF08] px-2 py-1 rounded">
              <FiFileText className="text-[#A100FF] mr-1" size={12} />
              {/* <span>{(cert.file.size / 1024).toFixed(0)} KB</span> */}
				{/* TODO: Implementar datos de archivo de certificado*/}

            </div>
          </div>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            className="p-2 text-gray-500 hover:text-[#A100FF] hover:bg-[#A100FF10] rounded-full"
            title="Descargar"
            // onClick={() => {
            //   const blobUrl = URL.createObjectURL(cert.file);
            //   const a = document.createElement('a');
            //   a.href = blobUrl;
            //   a.download = cert.nombre + ".pdf";
            //   document.body.appendChild(a);
            //   a.click();
            //   document.body.removeChild(a);
            //   URL.revokeObjectURL(blobUrl);
            // }}

			// TODO: Implementar datos de archivo de certificado
          >
            <FiDownload size={16} />
          </button>
          <button
            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full"
            // onClick={() => onRemove(cert)}
			// TODO: Implement onRemove certificado
            title="Eliminar"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}