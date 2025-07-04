import React, { useEffect, useState, useRef } from 'react';
import { getAllCertificados } from '@/utils/database/client/certificateSync';
import { certificado } from '@/interfaces/certificate'; // Asegúrate que esta interfaz esté bien importada
import { FiSearch, FiCheck, FiX } from 'react-icons/fi';

interface Props {
  onSelect: (certificado: certificado) => void | null;
  initialCertificado?: certificado | null;
}

const CertificateSearchInput: React.FC<Props> = ({ onSelect, initialCertificado = null }) => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<certificado[]>([]);
  const [remoteCertificates, setRemoteCertificates] = useState<certificado[]>([]);
  const [selected, setSelected] = useState<certificado | null>(initialCertificado);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCertificados = async () => {
      const data = await getAllCertificados();
      setRemoteCertificates(data);
    };
    loadCertificados();
  }, []);

  useEffect(() => {
    const filtered = remoteCertificates.filter(cert =>
      cert.curso?.toLowerCase().includes(input.toLowerCase())
    );

    setResults(filtered);
  }, [input, remoteCertificates]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (cert: certificado) => {
    setSelected(cert);
    setInput('');
    setResults([]);
    onSelect(cert);
  };

  const handleClear = () => {
    setSelected(null);
    setInput('');
    setResults(remoteCertificates); // opcional: mostrar todos de nuevo
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSelect(null as any);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Buscar certificado</label>

      {!selected ? (
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF] bg-white shadow-sm transition-all duration-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej. Advanced Flask Certification"
          />

          {results.length > 0 && (
            <div className="absolute z-50 w-full bg-white mt-1 border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {results.map((cert) => (
                <div
                  key={cert.id_certificado}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center"
                  onClick={() => handleSelect(cert)}
                >
                  {cert.curso}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex items-center justify-between p-2.5 border border-[#A100FF30] bg-[#A100FF08] rounded-lg">
          <span className="text-sm text-[#A100FF] flex items-center gap-2 font-medium">
            <FiCheck size={16} /> {selected.curso}
          </span>
          <button
            onClick={handleClear}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
            aria-label="Eliminar certificado seleccionado"
            title="Eliminar certificado seleccionado"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificateSearchInput;