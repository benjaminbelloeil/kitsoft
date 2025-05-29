import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { UserProfile } from '@/interfaces/user';
import { FiMail, FiMapPin, FiPhone, FiEye } from 'react-icons/fi';
import PlaceholderAvatar from '@/components/ui/placeholder-avatar';


export interface AssignedUser {
  id_usuario: string;
  nombre: string;
  apellido: string;
  titulo: string;
  url_avatar: string | null;
  correo: string;
  fecha_inicio_empleo: string | null;
}

// User Card Component with enhanced animations
export function UserCard({ user, onViewProfile, index }: { user: AssignedUser; onViewProfile: (userId: string) => void, index: number }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch basic profile info for the card
  useEffect(() => {
    const fetchBasicProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/profile/get?userId=${user.id_usuario}`);
        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching basic profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBasicProfile();
  }, [user.id_usuario]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 24, 
        delay: 0.1 + index * 0.05,
        duration: 0.4 
      }}
      whileHover={{ y: -4, boxShadow: "0 12px 25px -5px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
    >
      <motion.div 
        className="flex items-start space-x-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
      >
        <motion.div 
          className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {user.url_avatar ? (
            <Image
              src={user.url_avatar}
              alt={`${user.nombre} ${user.apellido}`}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          ) : (
            <PlaceholderAvatar size={64} />
          )}
        </motion.div>
        <div className="flex-1 min-w-0">
          <motion.h3 
            className="font-semibold text-gray-900 text-lg mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
          >
            {user.nombre} {user.apellido}
          </motion.h3>
          <motion.p 
            className="text-[#A100FF] text-sm font-medium mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
          >
            {user.titulo || 'Sin título'}
          </motion.p>
          <motion.p 
            className="text-gray-500 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
          >
            {user.correo}
          </motion.p>
        </div>
      </motion.div>
      
      {/* Basic Information with staggered animations */}
      <motion.div 
        className="mt-4 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.45 + index * 0.05 }}
      >
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                className="h-4 bg-gray-200 rounded animate-pulse"
                initial={{ width: "30%" }}
                animate={{ width: ["30%", "100%", "60%"][i] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Email */}
            <motion.div 
              className="flex items-center text-sm text-gray-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            >
              <FiMail className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate">{userProfile?.correo?.Correo || user.correo}</span>
            </motion.div>
            
            {/* Phone */}
            <motion.div 
              className="flex items-center text-sm text-gray-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.55 + index * 0.05 }}
            >
              <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                {userProfile?.telefono?.Codigo_Pais && userProfile?.telefono?.Numero
                  ? `${userProfile.telefono.Codigo_Pais} ${userProfile.telefono.Numero}`
                  : 'No especificado'
                }
              </span>
            </motion.div>
            
            {/* Location */}
            <motion.div 
              className="flex items-center text-sm text-gray-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
            >
              <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate">
                {userProfile?.direccion && (userProfile.direccion.Ciudad || userProfile.direccion.Estado || userProfile.direccion.Pais)
                  ? [userProfile.direccion.Ciudad, userProfile.direccion.Estado, userProfile.direccion.Pais]
                      .filter(Boolean)
                      .join(', ')
                  : 'No especificado'
                }
              </span>
            </motion.div>
            
            {/* Bio */}
            {userProfile?.Bio && (
              <motion.div 
                className="mt-3 pt-3 border-t border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.65 + index * 0.05 }}
              >
                <p className="text-sm text-gray-600 line-clamp-2">
                  {userProfile.Bio}
                </p>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
      
      <motion.div 
        className="mt-4 pt-4 border-t border-gray-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
      >
        <motion.button
          onClick={() => onViewProfile(user.id_usuario)}
          className="w-full flex items-center justify-center px-4 py-2 bg-[#A100FF] text-white rounded-lg hover:bg-[#8A00E6] transition-colors"
          whileHover={{ scale: 1.03, backgroundColor: "#8A00E6" }}
          whileTap={{ scale: 0.97 }}
        >
          <FiEye className="w-4 h-4 mr-2" />
          Ver perfil completo
        </motion.button>
      </motion.div>
    </motion.div>
  );
}