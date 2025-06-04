/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "@/interfaces/user"
import { FiX, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import PlaceholderAvatar from "@/components/ui/placeholder-avatar";
import ReadOnlyResumeSection from "./profile/ReadOnlyResumeSection";
import ReadOnlyExperienceSection from "./profile/ReadOnlyExperienceSection";
import ReadOnlySkillsSection from "./profile/ReadOnlySkillsSection";
import ReadOnlyCertificatesSection from "./profile/ReadOnlyCertificatesSection";
import Image from 'next/image'; 


interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

// Profile Modal Component
export default function ProfileModal({ isOpen, onClose, userId }: Readonly<ProfileModalProps>) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [resume, setResume] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileDataLoaded, setProfileDataLoaded] = useState<{ [key: string]: boolean }>({});

  const loadProfileData = () => {
    if (!userId) return;
    
    if (!profileDataLoaded[userId]) {
      fetchCompleteProfile();
    } else {
      // Load from cache if available
      loadCachedProfileData();
    }
  };

  const handleModalOpen = () => {
    if (userId) {
      loadProfileData();
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleModalOpen();
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
          setProfile(parsedData.profile ?? null);
          setSkills(parsedData.skills ?? []);
          setExperience(parsedData.experience ?? []);
          setCertificates(parsedData.certificates ?? []);
          setResume(parsedData.resume ?? null);
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
      
      setProfileDataLoaded(prev => ({ ...prev, [userId]: true }));
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
          setSkills(skillsData ?? []);
        }
      } catch (err) {
        console.warn('Skills not available:', err);
        setSkills([]);
      }

        // Fetch experience using people-lead endpoint
        try {
          const experienceResponse = await fetch(`/api/people-lead/experience?userId=${userId}`);
          if (experienceResponse.ok) {
            experienceData = await experienceResponse.json();
            setExperience(experienceData ?? []);
          }
        } catch (err) {
          console.warn('Experience not available:', err);
          setExperience([]);
        }

        // Fetch certificates using people-lead endpoint
        try {
          const certificatesResponse = await fetch(`/api/people-lead/certificates?userId=${userId}`);
          if (certificatesResponse.ok) {
            certificatesData = await certificatesResponse.json();
            setCertificates(certificatesData ?? []);
          }
        } catch (err) {
          console.warn('Certificates not available:', err);
          setCertificates([]);
        }

        // Fetch resume using people-lead endpoint
        try {
          const resumeResponse = await fetch(`/api/people-lead/curriculum?userId=${userId}`);
          if (resumeResponse.ok) {
            const resumeResponseData = await resumeResponse.json();
            resumeData = resumeResponseData?.url ?? null;
            setResume(resumeData);
          }
        } catch (err) {
          console.warn('Resume not available:', err);
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
            {loading && (
              <motion.div 
                className="flex items-center justify-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-8 h-8 border-2 border-[#A100FF] border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Cargando perfil...</span>
              </motion.div>
            )}
            
            {error && (
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
            )}
            
            {profile && (
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
                      company: exp.empresa ?? exp.compañia ?? '',
                      position: exp.cargo ?? exp.puesto ?? exp.posicion ?? '',
                      period: `${exp.fecha_inicio ? new Date(exp.fecha_inicio).toLocaleDateString('es-ES') : ''} - ${exp.fecha_fin ? new Date(exp.fecha_fin).toLocaleDateString('es-ES') : 'Presente'}`,
                      description: exp.descripcion ?? ''
                    }))}
                    loading={loading}
                  />

                  {/* Skills Section */}
                  <ReadOnlySkillsSection 
                    skills={skills.map(skill => ({
                      id: skill.id_habilidad?.toString() ?? Math.random().toString(),
                      name: skill.titulo ?? skill.name ?? '',
                      level: skill.nivel_experiencia ?? 1
                    }))}
                    loading={loading}
                  />

                  {/* Certificates Section */}
                  <ReadOnlyCertificatesSection 
                    certificates={certificates.map(cert => ({
                      titulo: cert.titulo ?? cert.nombre ?? '',
                      institucion: cert.institucion ?? cert.organismo ?? '',
                      fecha_obtencion: cert.fecha_obtencion ?? cert.fecha_emision ?? '',
                      fecha_expiracion: cert.fecha_expiracion ?? undefined,
                      url: cert.url ?? cert.URL_Certificado ?? undefined
                    }))}
                    loading={loading}
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}