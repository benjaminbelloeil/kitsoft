/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiMail, FiPhone, FiMapPin, FiX, FiEye, FiAlertCircle } from 'react-icons/fi';
import Image from 'next/image';
import PlaceholderAvatar from '@/components/ui/placeholder-avatar';
import PeopleLeadHeader from '@/components/proyectos/people-lead/PeopleLeadHeader';
import PeopleLeadSkeleton from '@/components/proyectos/people-lead/PeopleLeadSkeleton';
import { UserProfile } from '@/interfaces/user';
import { useUser } from '@/context/user-context';
import { useRouter } from 'next/navigation';

interface AssignedUser {
  id_usuario: string;
  nombre: string;
  apellido: string;
  titulo: string;
  url_avatar: string | null;
  correo: string;
  fecha_inicio_empleo: string | null;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

// Profile Modal Component
function ProfileModal({ isOpen, onClose, userId }: ProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [resume, setResume] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchCompleteProfile();
    }
  }, [isOpen, userId]);

  const fetchCompleteProfile = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch profile data
      const profileResponse = await fetch(`/api/profile/get?userId=${userId}`);
      if (!profileResponse.ok) throw new Error('Failed to fetch profile');
      const profileData = await profileResponse.json();
      setProfile(profileData);

      // Fetch skills
      try {
        const skillsResponse = await fetch(`/api/skills/get?userId=${userId}`);
        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json();
          setSkills(skillsData || []);
        }
      } catch (err) {
        console.log('Skills not available');
        setSkills([]);
      }

      // Fetch experience
      try {
        const experienceResponse = await fetch(`/api/experience/get?userId=${userId}`);
        if (experienceResponse.ok) {
          const experienceData = await experienceResponse.json();
          setExperience(experienceData || []);
        }
      } catch (err) {
        console.log('Experience not available');
        setExperience([]);
      }

      // Fetch certificates
      try {
        const certificatesResponse = await fetch(`/api/certificate/get?userId=${userId}`);
        if (certificatesResponse.ok) {
          const certificatesData = await certificatesResponse.json();
          setCertificates(certificatesData || []);
        }
      } catch (err) {
        console.log('Certificates not available');
        setCertificates([]);
      }

      // Fetch resume
      try {
        const resumeResponse = await fetch(`/api/curriculum/get?userId=${userId}`);
        if (resumeResponse.ok) {
          const resumeData = await resumeResponse.json();
          setResume(resumeData?.url || null);
        }
      } catch (err) {
        console.log('Resume not available');
        setResume(null);
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#A100FF] to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Perfil Completo</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#A100FF] border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Cargando perfil...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-2">{error}</div>
                <button
                  onClick={fetchCompleteProfile}
                  className="text-[#A100FF] hover:text-purple-700 underline"
                >
                  Reintentar
                </button>
              </div>
            ) : profile ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Header */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-0">
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
                        <FiMail className="w-4 h-4 mr-3 text-[#A100FF]" />
                        <span className="truncate">{profile.correo?.Correo || 'No especificado'}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <FiPhone className="w-4 h-4 mr-3 text-[#A100FF]" />
                        <span>
                          {profile.telefono?.Codigo_Pais && profile.telefono?.Numero
                            ? `${profile.telefono.Codigo_Pais} ${profile.telefono.Numero}`
                            : 'No especificado'
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <FiMapPin className="w-4 h-4 mr-3 text-[#A100FF]" />
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
                        <p className="text-sm text-gray-600 leading-relaxed">{profile.Bio}</p>
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
                  </div>
                </div>

                {/* Right Column - Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Resume Section */}
                  {resume && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <span className="bg-[#A100FF20] p-2 rounded-md mr-3">
                          <FiAlertCircle className="h-5 w-5 text-[#A100FF]" />
                        </span>
                        Currículum
                      </h3>
                      <a
                        href={resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-[#A100FF] text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Ver Currículum
                      </a>
                    </div>
                  )}

                  {/* Experience Section */}
                  {experience.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <span className="bg-[#A100FF20] p-2 rounded-md mr-3">
                          <FiAlertCircle className="h-5 w-5 text-[#A100FF]" />
                        </span>
                        Experiencia
                      </h3>
                      <div className="space-y-4">
                        {experience.map((exp, index) => (
                          <div key={index} className="border-l-4 border-[#A100FF] pl-4">
                            <h4 className="font-semibold text-gray-900">{exp.cargo || exp.puesto}</h4>
                            <p className="text-[#A100FF] font-medium">{exp.empresa}</p>
                            <p className="text-sm text-gray-600">
                              {exp.fecha_inicio && new Date(exp.fecha_inicio).toLocaleDateString('es-ES')} - 
                              {exp.fecha_fin ? new Date(exp.fecha_fin).toLocaleDateString('es-ES') : 'Presente'}
                            </p>
                            {exp.descripcion && (
                              <p className="text-sm text-gray-700 mt-2">{exp.descripcion}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Section */}
                  {skills.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <span className="bg-[#A100FF20] p-2 rounded-md mr-3">
                          <FiAlertCircle className="h-5 w-5 text-[#A100FF]" />
                        </span>
                        Habilidades
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#A100FF10] text-[#A100FF] rounded-full text-sm font-medium"
                          >
                            {skill.titulo || skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certificates Section */}
                  {certificates.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <span className="bg-[#A100FF20] p-2 rounded-md mr-3">
                          <FiAlertCircle className="h-5 w-5 text-[#A100FF]" />
                        </span>
                        Certificados
                      </h3>
                      <div className="space-y-3">
                        {certificates.map((cert, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">{cert.titulo}</h4>
                              <p className="text-sm text-gray-600">{cert.institucion}</p>
                              {cert.fecha_obtencion && (
                                <p className="text-xs text-gray-500">
                                  {new Date(cert.fecha_obtencion).toLocaleDateString('es-ES')}
                                </p>
                              )}
                            </div>
                            {cert.url && (
                              <a
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#A100FF] hover:text-purple-700 text-sm font-medium"
                              >
                                Ver
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// User Card Component
function UserCard({ user, onViewProfile }: { user: AssignedUser; onViewProfile: (userId: string) => void }) {
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
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
    >
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
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
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {user.nombre} {user.apellido}
          </h3>
          <p className="text-[#A100FF] text-sm font-medium mb-1">{user.titulo || 'Sin título'}</p>
          <p className="text-gray-500 text-xs">{user.correo}</p>
        </div>
      </div>
      
      {/* Basic Information */}
      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            {/* Email */}
            <div className="flex items-center text-sm text-gray-600">
              <FiMail className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate">{userProfile?.correo?.Correo || user.correo}</span>
            </div>
            
            {/* Phone */}
            <div className="flex items-center text-sm text-gray-600">
              <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                {userProfile?.telefono?.Codigo_Pais && userProfile?.telefono?.Numero
                  ? `${userProfile.telefono.Codigo_Pais} ${userProfile.telefono.Numero}`
                  : 'No especificado'
                }
              </span>
            </div>
            
            {/* Location */}
            <div className="flex items-center text-sm text-gray-600">
              <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate">
                {userProfile?.direccion && (userProfile.direccion.Ciudad || userProfile.direccion.Estado || userProfile.direccion.Pais)
                  ? [userProfile.direccion.Ciudad, userProfile.direccion.Estado, userProfile.direccion.Pais]
                      .filter(Boolean)
                      .join(', ')
                  : 'No especificado'
                }
              </span>
            </div>
            
            {/* Bio */}
            {userProfile?.Bio && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {userProfile.Bio}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onViewProfile(user.id_usuario)}
          className="w-full flex items-center justify-center px-4 py-2 bg-[#A100FF] text-white rounded-lg hover:bg-[#8A00E6] transition-colors"
        >
          <FiEye className="w-4 h-4 mr-2" />
          Ver perfil completo
        </button>
      </div>
    </motion.div>
  );
}

// Main Page Component
export default function PeopleLeadPage() {
  const { isPeopleLead, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<AssignedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AssignedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Permission check - redirect unauthorized users
  useEffect(() => {
    if (!userLoading && !isPeopleLead) {
      router.push('/dashboard');
    }
  }, [userLoading, isPeopleLead, router]);

  useEffect(() => {
    if (!userLoading && isPeopleLead) {
      fetchAssignedUsers();
    }
  }, [userLoading, isPeopleLead]);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user =>
      `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.titulo && user.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchAssignedUsers = async () => {
    try {
      const response = await fetch('/api/people-lead/users');
      if (!response.ok) {
        throw new Error('Failed to fetch assigned users');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching assigned users:', error);
      setError('Error al cargar los usuarios asignados');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId: string) => {
    setSelectedUserId(userId);
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedUserId(null);
  };

  // Show loading while checking user permissions
  if (userLoading) {
    return <PeopleLeadSkeleton />;
  }

  // Prevent rendering if user is not authorized (additional safety check)
  if (!isPeopleLead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta sección. Solo los usuarios con rol de People Lead pueden ver esta página.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <PeopleLeadSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-lg">{error}</div>
          <button
            onClick={fetchAssignedUsers}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <PeopleLeadHeader 
        searchQuery={searchTerm}
        setSearchQuery={setSearchTerm}
        totalUsers={users.length}
        activeUsers={users.length} // For now, all users are considered active
      />

      {/* Users Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8"
      >
        {filteredUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100"
          >
            <FiUsers className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {searchTerm ? 'No se encontraron usuarios' : 'No tienes usuarios asignados'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Intenta con un término de búsqueda diferente' 
                : 'Los usuarios asignados aparecerán aquí cuando se te asignen'
              }
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id_usuario}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <UserCard user={user} onViewProfile={handleViewProfile} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Results Summary */}
      {searchTerm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center text-gray-600"
        >
          {filteredUsers.length > 0 ? (
            <p>
              Mostrando {filteredUsers.length} de {users.length} usuarios
            </p>
          ) : (
            <p>No se encontraron usuarios que coincidan con &quot;{searchTerm}&quot;</p>
          )}
        </motion.div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={handleCloseProfileModal}
        userId={selectedUserId}
      />
    </div>
  );
}