"use client";

import { FiEdit2, FiMail, FiPhone, FiMapPin, FiBriefcase } from "react-icons/fi";
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
  // Function to handle missing data with a styled placeholder
  const renderMissingData = (message: string) => (
    <span className="text-gray-400 italic text-sm">{message}</span>
  );

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-3">
          {/* Name section with improved typography */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 group">
              {profile.Nombre ? (
                <>
                  {profile.Nombre} <span className="font-semibold">{profile.Apellido || ''}</span>
                </>
              ) : (
                renderMissingData('Nombre no especificado')
              )}
            </h1>
            
            {/* Location with icon - Changed icon color to match professional title icon */}
            {(profile.direccion?.Ciudad || profile.direccion?.Estado || profile.direccion?.Pais) && (
              <div className="mt-2 flex items-center">
                <FiMapPin size={14} className="mr-1.5 flex-shrink-0 text-gray-800" />
                {[
                  profile.direccion?.Ciudad,
                  profile.direccion?.Estado,
                  profile.direccion?.Pais
                ]
                  .filter(Boolean)
                  .join(', ') ? (
                  <span className="text-gray-500">
                    {[
                      profile.direccion?.Ciudad,
                      profile.direccion?.Estado,
                      profile.direccion?.Pais
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                ) : (
                  renderMissingData('Ubicación no especificada')
                )}
              </div>
            )}
            
            {/* Professional title with accent color - moved below location and properly aligned */}
            <div className="mt-2 flex items-center">
              <FiBriefcase size={14} className="mr-1.5 flex-shrink-0 text-gray-800" />
              {profile.Titulo ? (
                <span className="titulo-profesional text-gray-800 font-medium">
                  {profile.Titulo}
                </span>
              ) : (
                renderMissingData('Título profesional no especificado')
              )}
            </div>
          </div>
        </div>
        
        {/* Edit profile button with fixed width to ensure full text visibility */}
        <button 
          className="mt-2 md:mt-0 px-5 py-2.5 min-w-[140px] bg-[#A100FF] text-white rounded-lg hover:bg-[#8500D4] transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:translate-y-[-1px] self-center md:self-start whitespace-nowrap"
          onClick={onEditClick}
        >
          <FiEdit2 size={16} className="text-white flex-shrink-0" />
          <span className="text-white font-medium">
            {isNewUser ? 'Completar perfil' : 'Editar perfil'}
          </span>
        </button>
      </div>
      
      {/* Contact information with icons and better spacing */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-purple-50 transition-colors">
          <div className="p-1.5 bg-purple-100 rounded-md">
            <FiMail size={16} className="text-[#A100FF]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Email</p>
            <p className="text-gray-700">
              {authEmail || profile.correo?.Correo || renderMissingData('No disponible')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-purple-50 transition-colors">
          <div className="p-1.5 bg-purple-100 rounded-md">
            <FiPhone size={16} className="text-[#A100FF]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Teléfono</p>
            <p className="text-gray-700">
              {profile.telefono?.Codigo_Pais && profile.telefono?.Numero ? (
                <span>
                  {profile.telefono.Codigo_Pais} {profile.telefono.Codigo_Estado || ''} {profile.telefono.Numero}
                </span>
              ) : (
                renderMissingData('Teléfono no especificado')
              )}
            </p>
          </div>
        </div>
      </div>
      
      {/* Bio section with better card styling */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Biografía</h3>
        {profile.Bio ? (
          <div className="bg-white rounded-lg p-4 text-gray-700 border border-gray-100 shadow-sm">
            <p className="leading-relaxed">{profile.Bio}</p>
          </div>
        ) : (
          <div className="bg-gray-50 text-gray-500 rounded-lg p-4 border border-dashed border-gray-300">
            <p className="italic">Bio no especificada</p>
            <p className="text-sm mt-1">
              Añade información sobre ti para que otros puedan conocerte mejor.
            </p>
          </div>
        )}
      </div>
    </>
  );
}