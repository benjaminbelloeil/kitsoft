'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { UserProfile } from "@/interfaces/user";
import { Project } from "@/interfaces/cargabilidad";
import { FiMail, FiPhone, FiMapPin, FiRefreshCw, FiBarChart2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import PlaceholderAvatar from "@/components/ui/placeholder-avatar";
import ReadOnlyWeeklyLoadSection from "./ReadOnlyWeeklyLoadSection";
import Image from 'next/image';

interface FlippableProfileCardProps {
  profile: UserProfile | null;
  projects: Project[];
  loading: boolean;
}

export default function FlippableProfileCard({ 
  profile, 
  projects, 
  loading 
}: FlippableProfileCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Function to check if bio is long and needs truncation
  const shouldTruncateBio = (bio: string) => {
    return bio && bio.length > 80;
  };

  const getTruncatedBio = (bio: string) => {
    if (!bio) return '';
    return bio.length > 80 ? bio.substring(0, 80) + '...' : bio;
  };

  if (loading) {
    return (
      <motion.div 
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 relative min-h-[450px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Profile Header Skeleton */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 animate-pulse mb-4"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-3/4 mx-auto"></div>
        </div>
        
        {/* Contact Info Skeleton */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse mr-3"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse mr-3"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse mr-3"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
          </div>
        </div>
        
        {/* Bio Skeleton */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!profile) return null;

  return (
    <div className="relative" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", damping: 20, stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side - Profile Information */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 relative min-h-[450px]"
          style={{ backfaceVisibility: 'hidden' }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.2 }}
        >
          {/* Flip Button */}
          <motion.button
            onClick={handleFlip}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Ver carga semanal"
          >
            <FiBarChart2 className="w-4 h-4 text-gray-400 group-hover:text-[#A100FF] transition-colors" />
          </motion.button>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-[#A100FF20] mb-4">
              {profile.URL_Avatar ? (
                <Image
                  src={profile.URL_Avatar}
                  alt={`${profile.Nombre} ${profile.Apellido}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <PlaceholderAvatar size={96} />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {profile.Nombre} {profile.Apellido}
            </h3>
            {profile.Titulo && (
              <p className="text-[#A100FF] font-medium mb-4">{profile.Titulo}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <FiMail className="w-4 h-4 mr-3 text-gray-400" />
              <span className="truncate">{profile.correo?.Correo ?? 'No especificado'}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <FiPhone className="w-4 h-4 mr-3 text-gray-400" />
              <span>
                {profile.telefono?.Codigo_Pais && profile.telefono?.Numero
                  ? `${profile.telefono.Codigo_Pais} ${profile.telefono.Numero}`
                  : 'No especificado'
                }
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <FiMapPin className="w-4 h-4 mr-3 text-gray-400" />
              <span className="truncate">
                {profile.direccion && (profile.direccion.Ciudad || profile.direccion.Estado || profile.direccion.Pais)
                  ? [profile.direccion.Ciudad, profile.direccion.Estado, profile.direccion.Pais]
                      .filter(Boolean)
                      .join(', ')
                  : 'No especificado'
                }
              </span>
            </div>
          </div>

          {/* Bio */}
          {profile.Bio && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-900 mb-2">Biografía</h4>
              <div className="text-sm text-gray-600 leading-relaxed">
                {shouldTruncateBio(profile.Bio) && !isExpanded ? (
                  <>
                    <p>{getTruncatedBio(profile.Bio)}</p>
                    <motion.button
                      onClick={handleToggleExpand}
                      className="mt-2 text-[#A100FF] hover:text-purple-700 text-sm font-medium flex items-center gap-1 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Leer más
                      <FiChevronDown className="w-3 h-3" />
                    </motion.button>
                  </>
                ) : (
                  <>
                    <p>{profile.Bio}</p>
                    {shouldTruncateBio(profile.Bio) && (
                      <motion.button
                        onClick={handleToggleExpand}
                        className="mt-2 text-[#A100FF] hover:text-purple-700 text-sm font-medium flex items-center gap-1 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Leer menos
                        <FiChevronUp className="w-3 h-3" />
                      </motion.button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Employment Date */}
          {profile.Fecha_Inicio_Empleo && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-900 mb-2">Fecha de Inicio</h4>
              <p className="text-sm text-[#A100FF]">
                {new Date(profile.Fecha_Inicio_Empleo).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </motion.div>

        {/* Back Side - Weekly Load */}
        <motion.div 
          className="absolute inset-0 bg-white rounded-xl shadow-lg border border-gray-100 min-h-[450px]"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Flip Button */}
          <motion.button
            onClick={handleFlip}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors group z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Ver información básica"
          >
            <FiRefreshCw className="w-4 h-4 text-gray-400 group-hover:text-[#A100FF] transition-colors" />
          </motion.button>

          {/* Weekly Load Content - Takes full card */}
          <div className="h-full">
            <ReadOnlyWeeklyLoadSection 
              projects={projects}
              loading={false}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
