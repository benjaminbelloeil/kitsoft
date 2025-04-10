"use client";

import { FiEdit2 } from "react-icons/fi";
import { UserProfile } from "@/interfaces/user";

interface ProfileDisplayProps {
  profile: UserProfile;
  onEditClick: () => void;
  authEmail: string | null;
  isNewUser: boolean;
}

export default function ProfileDisplay({
  profile,
  onEditClick,
  authEmail,
  isNewUser
}: ProfileDisplayProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {profile.Nombre ? profile.Nombre : 'Nombre no especificado'} {profile.Apellido || ''}
          </h1>
          <p className="text-[#A100FF] font-medium">
            {profile.Titulo || 'Título profesional no especificado'}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {profile.direccion?.Ciudad && profile.direccion?.Estado && profile.direccion?.Pais ?
              `${profile.direccion.Ciudad}, ${profile.direccion.Estado}, ${profile.direccion.Pais}` : 
              'Ubicación no especificada'}
          </p>
        </div>
        <button 
          className="mt-4 md:mt-0 px-4 py-2 bg-[#A100FF] text-white rounded-md hover:bg-[#8500D4] fast-transition flex items-center gap-2 mx-auto md:mx-0 shadow-sm"
          onClick={onEditClick}
        >
          <FiEdit2 size={16} className="text-white !important" />
          <span className="text-white !important">
            {isNewUser ? 'Completar perfil' : 'Editar perfil'}
          </span>
        </button>
      </div>
      
      <div className="mt-4 space-y-1">
        <p className="text-gray-600">
          <strong>Email:</strong> {authEmail || profile.correo?.Correo || 'No disponible'}
        </p>
        <p className="text-gray-600">
          <strong>Teléfono:</strong> 
          {profile.telefono?.Codigo_Pais && profile.telefono?.Numero ? 
            `${profile.telefono.Codigo_Pais} ${profile.telefono.Codigo_Estado || ''} ${profile.telefono.Numero}` : 
            'Teléfono no especificado'}
        </p>
      </div>
      
      <div className="mt-4 border-t pt-4">
        {profile.Bio ? (
          <p className="text-gray-700">{profile.Bio}</p>
        ) : (
          <div className="text-gray-500 italic">
            <p>Bio no especificada</p>
            <p className="text-sm mt-1">
              Añade información sobre ti para que otros puedan conocerte mejor.
            </p>
          </div>
        )}
      </div>
    </>
  );
}