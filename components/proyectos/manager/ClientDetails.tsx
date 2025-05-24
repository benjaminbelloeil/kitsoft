/* eslint-disable @next/next/no-img-element */
'use client';

import { Client } from '@/interfaces/project';

interface ClientDetailsProps {
  client: Client;
}

export default function ClientDetails({ client }: ClientDetailsProps) {
  return (
    <div className="p-4 mt-2 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Logo at the top, spanning horizontally */}
      {client.url_logo ? (
        <div className="w-full h-14 py-2 mb-4 rounded-md overflow-hidden bg-white flex items-center justify-center border border-gray-100">
          <img 
            src={client.url_logo} 
            alt={`Logo de ${client.nombre}`}
            className="max-h-full max-w-full object-contain p-1"
          />
        </div>
      ) : (
        <div className="w-full h-14 py-2 mb-4 bg-gray-100 rounded-md flex items-center justify-center text-xl font-medium text-gray-600">
          {client.nombre.charAt(0)}
        </div>
      )}
      <div className="flex flex-col gap-2">
        
        {/* Client details */}
        <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
          {client.correo && (
            <div className="flex items-center">
              <span className="w-20 text-gray-500">Correo:</span>
              <span className="font-medium">{client.correo}</span>
            </div>
          )}
          
          {client.telefono && (
            <div className="flex items-center">
              <span className="w-20 text-gray-500">Teléfono:</span>
              <span className="font-medium">{client.telefono}</span>
            </div>
          )}
          
          {client.direccion && (
            <div className="flex items-start">
              <span className="w-20 text-gray-500">Dirección:</span>
              <span className="font-medium">{client.direccion}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
