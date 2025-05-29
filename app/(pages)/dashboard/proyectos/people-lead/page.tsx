/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiMail, FiPhone, FiMapPin, FiX, FiEye, FiAlertCircle } from 'react-icons/fi';
import Image from 'next/image';
import PlaceholderAvatar from '@/components/ui/placeholder-avatar';
import PeopleLeadHeader from '@/components/proyectos/people-lead/PeopleLeadHeader';
import PeopleLeadSkeleton from '@/components/proyectos/people-lead/PeopleLeadSkeleton';
import ReadOnlyExperienceSection from '@/components/proyectos/people-lead/profile/ReadOnlyExperienceSection';
import ReadOnlySkillsSection from '@/components/proyectos/people-lead/profile/ReadOnlySkillsSection';
import ReadOnlyCertificatesSection from '@/components/proyectos/people-lead/profile/ReadOnlyCertificatesSection';
import ReadOnlyResumeSection from '@/components/proyectos/people-lead/profile/ReadOnlyResumeSection';
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
      loadCachedProfileData();
    }
  }, [isOpen, userId]);

  const loadCachedProfileData = () => {
    if (!userId) return;
    
    try {
      const cacheKey = `profile-${userId}`;
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}-timestamp`);
      const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
      
      if (cachedData && cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp);
        if (age < cacheExpiry) {
          const parsedData = JSON.parse(cachedData);
          setProfile(parsedData.profile || null);
          setSkills(parsedData.skills || []);
          setExperience(parsedData.experience || []);
          setCertificates(parsedData.certificates || []);
          setResume(parsedData.resume || null);
          return;
        }
      }
      
      // If cache is expired or not available, fetch fresh data
      fetchCompleteProfile();
    } catch (error) {
      console.error('Error loading cached profile data:', error);
      fetchCompleteProfile();
    }
  };

  const saveProfileDataToCache = (profileData: any, skillsData: any[], experienceData: any[], certificatesData: any[], resumeData: string | null) => {
    if (!userId) return;
    
    try {
      const cacheKey = `profile-${userId}`;
      const dataToCache = {
        profile: profileData,
        skills: skillsData,
        experience: experienceData,
        certificates: certificatesData,
        resume: resumeData
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
      localStorage.setItem(`${cacheKey}-timestamp`, Date.now().toString());
    } catch (error) {
      console.error('Error saving profile data to cache:', error);
    }
  };

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

      let skillsData: any[] = [];
      let experienceData: any[] = [];
      let certificatesData: any[] = [];
      let resumeData: string | null = null;

      // Fetch skills using people-lead endpoint
      try {
        const skillsResponse = await fetch(`/api/people-lead/skills?userId=${userId}`);
        if (skillsResponse.ok) {
          skillsData = await skillsResponse.json();
          setSkills(skillsData || []);
        }
      } catch (err) {
        console.log('Skills not available');
        setSkills([]);
      }

      // Fetch experience using people-lead endpoint
      try {
        const experienceResponse = await fetch(`/api/people-lead/experience?userId=${userId}`);
        if (experienceResponse.ok) {
          experienceData = await experienceResponse.json();
          setExperience(experienceData || []);
        }
      } catch (err) {
        console.log('Experience not available');
        setExperience([]);
      }

      // Fetch certificates using people-lead endpoint
      try {
        const certificatesResponse = await fetch(`/api/people-lead/certificates?userId=${userId}`);
        if (certificatesResponse.ok) {
          certificatesData = await certificatesResponse.json();
          setCertificates(certificatesData || []);
        }
      } catch (err) {
        console.log('Certificates not available');
        setCertificates([]);
      }

      // Fetch resume using people-lead endpoint
      try {
        const resumeResponse = await fetch(`/api/people-lead/curriculum?userId=${userId}`);
        if (resumeResponse.ok) {
          const resumeResponseData = await resumeResponse.json();
          resumeData = resumeResponseData?.url || null;
          setResume(resumeData);
        }
      } catch (err) {
        console.log('Resume not available');
        setResume(null);
      }

      // Save to cache
      saveProfileDataToCache(profileData, skillsData, experienceData, certificatesData, resumeData);

    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 10,
      transition: { 
        duration: 0.2,
        ease: "easeOut" 
      } 
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        delay: 0.1,
        duration: 0.3
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        delay: 0.2,
        duration: 0.4
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <motion.div
          className="relative bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header with improved animation */}
          <motion.div 
            className="bg-gradient-to-r from-[#A100FF] to-purple-600 p-6 text-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Perfil Completo</h2>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX size={20} />
              </motion.button>
            </div>
          </motion.div>

          {/* Content with animations */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {loading ? (
              <motion.div 
                className="flex items-center justify-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-8 h-8 border-2 border-[#A100FF] border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Cargando perfil...</span>
              </motion.div>
            ) : error ? (
              <motion.div 
                className="text-center py-12"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="text-red-500 mb-2">{error}</div>
                <motion.button
                  onClick={fetchCompleteProfile}
                  className="text-[#A100FF] hover:text-purple-700 underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reintentar
                </motion.button>
              </motion.div>
            ) : profile ? (
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Left Column - Profile Header with animations */}
                <motion.div 
                  className="lg:col-span-1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.div 
                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-0"
                    whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
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
                        <span className="truncate">{profile.correo?.Correo || 'No especificado'}</span>
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
                  </motion.div>
                </motion.div>

                {/* Right Column - Detailed Info with animations */}
                <motion.div 
                  className="lg:col-span-2 space-y-6"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {/* Resume Section */}
                  <ReadOnlyResumeSection 
                    resumeUrl={resume}
                    loading={loading}
                  />

                  {/* Experience Section */}
                  <ReadOnlyExperienceSection 
                    experiences={experience.map(exp => ({
                      company: exp.empresa || exp.compañia || '',
                      position: exp.cargo || exp.puesto || exp.posicion || '',
                      period: `${exp.fecha_inicio ? new Date(exp.fecha_inicio).toLocaleDateString('es-ES') : ''} - ${exp.fecha_fin ? new Date(exp.fecha_fin).toLocaleDateString('es-ES') : 'Presente'}`,
                      description: exp.descripcion || ''
                    }))}
                    loading={loading}
                  />

                  {/* Skills Section */}
                  <ReadOnlySkillsSection 
                    skills={skills.map(skill => ({
                      id: skill.id_habilidad?.toString() || Math.random().toString(),
                      name: skill.titulo || skill.name || '',
                      level: skill.nivel_experiencia || 1
                    }))}
                    loading={loading}
                  />

                  {/* Certificates Section */}
                  <ReadOnlyCertificatesSection 
                    certificates={certificates.map(cert => ({
                      titulo: cert.titulo || cert.nombre || '',
                      institucion: cert.institucion || cert.organismo || '',
                      fecha_obtencion: cert.fecha_obtencion || cert.fecha_emision || '',
                      fecha_expiracion: cert.fecha_expiracion || undefined,
                      url: cert.url || cert.URL_Certificado || undefined
                    }))}
                    loading={loading}
                  />
                </motion.div>
              </motion.div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// User Card Component with enhanced animations
const UserCard = React.memo(function UserCard({ user, onViewProfile, index }: { user: AssignedUser; onViewProfile: (userId: string) => void, index: number }) {
  // Centralized cache validation for user cards
  const getUserCachedData = () => {
    if (typeof window === 'undefined') {
      return { data: null, isValid: false };
    }
    
    try {
      const cacheKey = `basic-profile-${user.id_usuario}`;
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}-timestamp`);
      const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
      
      if (cachedData && cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp);
        if (age < cacheExpiry) {
          const parsedData = JSON.parse(cachedData);
          return { data: parsedData, isValid: true };
        }
      }
    } catch (error) {
      console.error('Error reading cached profile data:', error);
    }
    
    return { data: null, isValid: false };
  };

  // Get cached data once and use it for state initialization
  const cachedProfileResult = getUserCachedData();
  
  // Initialize states based on the single cache check
  const [userProfile, setUserProfile] = useState<UserProfile | null>(cachedProfileResult.data);
  const [loading, setLoading] = useState(!cachedProfileResult.isValid);
  const fetchInProgressRef = useRef(false);

  // Fetch basic profile info for the card with caching
  useEffect(() => {
    // Only fetch if we don't have valid cached data and no fetch is in progress
    if (cachedProfileResult.isValid || fetchInProgressRef.current) return;
    
    const fetchBasicProfile = async () => {
      if (fetchInProgressRef.current) return;
      
      fetchInProgressRef.current = true;
      setLoading(true);
      
      try {
        const response = await fetch(`/api/profile/get?userId=${user.id_usuario}`);
        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData);
          
          // Cache the data
          const cacheKey = `basic-profile-${user.id_usuario}`;
          localStorage.setItem(cacheKey, JSON.stringify(profileData));
          localStorage.setItem(`${cacheKey}-timestamp`, Date.now().toString());
        }
      } catch (error) {
        console.error('Error fetching basic profile:', error);
      } finally {
        setLoading(false);
        fetchInProgressRef.current = false;
      }
    };
    
    fetchBasicProfile();
  }, []); // Empty dependency array since we only want this to run once per mount

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
});

// Centralized cache validation function
const getCachedData = () => {
  if (typeof window === 'undefined') {
    return { data: [], isValid: false };
  }
  
  try {
    const cachedData = localStorage.getItem('people-lead-users');
    const cacheTimestamp = localStorage.getItem('people-lead-users-timestamp');
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
    
    if (cachedData && cacheTimestamp) {
      const age = Date.now() - parseInt(cacheTimestamp);
      if (age < cacheExpiry) {
        const parsedData = JSON.parse(cachedData);
        return { data: parsedData, isValid: true };
      }
    }
  } catch (error) {
    console.error('Error reading cached data:', error);
  }
  
  return { data: [], isValid: false };
};

// Main Page Component with enhanced animations
export default function PeopleLeadPage() {
  const { isPeopleLead, isLoading: userLoading } = useUser();
  const router = useRouter();
  
  // Get cached data once and use it for all state initialization
  const cachedResult = getCachedData();
  
  // Initialize all states based on the single cache check
  const [users, setUsers] = useState<AssignedUser[]>(cachedResult.data);
  const [filteredUsers, setFilteredUsers] = useState<AssignedUser[]>([]);
  const [loading, setLoading] = useState(!cachedResult.isValid);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(cachedResult.isValid);
  
  // Ref to track if a fetch is already in progress to prevent race conditions
  const fetchInProgress = useRef(false);
  const hasInitialized = useRef(false);

  // Permission check - redirect unauthorized users
  useEffect(() => {
    if (!userLoading && !isPeopleLead) {
      router.push('/dashboard');
    }
  }, [userLoading, isPeopleLead, router]);

  // Data fetching effect - only runs once when conditions are met
  useEffect(() => {
    // Prevent multiple simultaneous fetches and ensure we only run this once per mount
    if (fetchInProgress.current || hasInitialized.current) return;
    
    // Only fetch if user is loaded, is people lead, and we don't have valid cached data
    if (!userLoading && isPeopleLead && !dataLoaded) {
      hasInitialized.current = true;
      fetchAssignedUsers();
    }
  }, [userLoading, isPeopleLead, dataLoaded]);

  // Filter users whenever users or search term changes
  useEffect(() => {
    const filtered = users.filter(user =>
      `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.titulo && user.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchAssignedUsers = async () => {
    if (fetchInProgress.current) return; // Prevent concurrent fetches
    
    try {
      fetchInProgress.current = true;
      setLoading(true);
      setError(null);
      
      // Fetch fresh data from API
      const response = await fetch('/api/people-lead/users');
      if (!response.ok) {
        throw new Error('Failed to fetch assigned users');
      }
      const data = await response.json();
      
      // Cache the data
      localStorage.setItem('people-lead-users', JSON.stringify(data.users));
      localStorage.setItem('people-lead-users-timestamp', Date.now().toString());
      
      setUsers(data.users);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching assigned users:', error);
      setError('Error al cargar los usuarios asignados');
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  };

  const refreshData = () => {
    // Clear cache
    localStorage.removeItem('people-lead-users');
    localStorage.removeItem('people-lead-users-timestamp');
    
    // Reset refs and state
    hasInitialized.current = false;
    fetchInProgress.current = false;
    setDataLoaded(false);
    setLoading(true);
    
    // Fetch fresh data
    fetchAssignedUsers();
  };

  const handleViewProfile = (userId: string) => {
    setSelectedUserId(userId);
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedUserId(null);
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  // Show loading while checking user permissions
  if (userLoading) {
    return <PeopleLeadSkeleton />;
  }

  // Prevent rendering if user is not authorized (additional safety check)
  if (!isPeopleLead) {
    return (
      <motion.div 
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="text-center bg-white rounded-xl p-8 shadow-lg border border-gray-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          </motion.div>
          <motion.h2 
            className="text-xl font-semibold text-gray-800 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Acceso Denegado
          </motion.h2>
          <motion.p 
            className="text-gray-600 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            No tienes permisos para acceder a esta sección. Solo los usuarios con rol de People Lead pueden ver esta página.
          </motion.p>
          <motion.button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05, backgroundColor: "#7E22CE" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Volver al Dashboard
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // Loading state with AnimatePresence like in ProjectLeadPage
  if (loading) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PeopleLeadSkeleton />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.div 
            className="text-red-500 mb-4 text-lg"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {error}
          </motion.div>
          <motion.button
            onClick={fetchAssignedUsers}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05, backgroundColor: "#7E22CE" }}
            whileTap={{ scale: 0.95 }}
          >
            Reintentar
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <PeopleLeadHeader 
            searchQuery={searchTerm}
            setSearchQuery={setSearchTerm}
            totalUsers={users.length}
            activeUsers={users.length} // For now, all users are considered active
          />
        </motion.div>

        {/* Users Grid with enhanced animations */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8"
        >
          {filteredUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              >
                <FiUsers className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              </motion.div>
              <motion.h3 
                className="text-lg font-medium text-gray-700 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {searchTerm ? 'No se encontraron usuarios' : 'No tienes usuarios asignados'}
              </motion.h3>
              <motion.p 
                className="text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {searchTerm 
                  ? 'Intenta con un término de búsqueda diferente' 
                  : 'Los usuarios asignados aparecerán aquí cuando se te asignen'
                }
              </motion.p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
              variants={containerVariants}
            >
              {filteredUsers.map((user, index) => (
                <UserCard key={user.id_usuario} user={user} onViewProfile={handleViewProfile} index={index} />
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Results Summary with animation */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center text-gray-600"
          >
            {filteredUsers.length > 0 ? (
              <motion.p
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Mostrando {filteredUsers.length} de {users.length} usuarios
              </motion.p>
            ) : (
              <motion.p
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                No se encontraron usuarios que coincidan con &quot;{searchTerm}&quot;
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Profile Modal */}
        <ProfileModal
          isOpen={showProfileModal}
          onClose={handleCloseProfileModal}
          userId={selectedUserId}
        />
      </motion.div>
    </AnimatePresence>
  );
}