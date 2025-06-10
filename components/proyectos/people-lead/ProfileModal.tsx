/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "@/interfaces/user"
import { Project } from "@/interfaces/cargabilidad";
import { FiX } from "react-icons/fi";
import ReadOnlyResumeSection from "./profile/ReadOnlyResumeSection";
import ReadOnlyExperienceSection from "./profile/ReadOnlyExperienceSection";
import ReadOnlySkillsSection from "./profile/ReadOnlySkillsSection";
import ReadOnlyCertificatesSection from "./profile/ReadOnlyCertificatesSection";
import FlippableProfileCard from "./profile/FlippableProfileCard"; 


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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileDataLoaded, setProfileDataLoaded] = useState<{ [key: string]: boolean }>({});

  // Cryptographically secure random ID generator
  const generateSecureId = (): string => {
    const crypto = window.crypto || (window as any).msCrypto;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0].toString(36);
  };

  const loadProfileData = () => {
    if (!userId) return;
    
    // Check if we already have data loaded for this user
    if (profileDataLoaded[userId] && profile) {
      // Data is already loaded, just set loading to false
      setLoading(false);
      return;
    }
    
    // Try to load from cache first, then fetch if needed
    loadCachedProfileData();
  };

  const handleClose = () => {
    setLoading(false);
    setError(null);
    onClose();
  };

  const handleModalOpen = () => {
    if (userId) {
      // Set loading immediately to show skeletons
      setLoading(true);
      setError(null);
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
          setProjects(parsedData.projects ?? []);
          setProjects(parsedData.projects ?? []);
          // Add a small delay to show skeleton even with cached data for better UX
          setTimeout(() => {
            setLoading(false);
          }, 300);
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

  const saveProfileDataToCache = (profileData: any, skillsData: any[], experienceData: any[], certificatesData: any[], resumeData: string | null, projectsData: any[]) => {
    if (!userId) return;
    
    try {
      const cacheKey = `profile-${userId}`;
      const dataToCache = {
        profile: profileData,
        skills: skillsData,
        experience: experienceData,
        certificates: certificatesData,
        resume: resumeData,
        projects: projectsData
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
    
    // Prevent multiple concurrent requests for the same user
    if (profileDataLoaded[userId]) {
      setLoading(false);
      return;
    }
    
    setError(null);
    
    try {
      // Mark as loading to prevent duplicate requests
      setProfileDataLoaded(prev => ({ ...prev, [userId]: true }));
      
      // Fetch profile data
      const profileResponse = await fetch(`/api/profile/get?userId=${userId}`);
      if (!profileResponse.ok) throw new Error('Failed to fetch profile');
      const profileData = await profileResponse.json();
      setProfile(profileData);

      let skillsData: any[] = [];
      let experienceData: any[] = [];
      let certificatesData: any[] = [];
      let resumeData: string | null = null;
      let projectsData: any[] = [];

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

        // Fetch projects for cargabilidad using user proyectos endpoint
        try {
          const projectsResponse = await fetch(`/api/user/proyectos?status=active&userId=${userId}`);
          if (projectsResponse.ok) {
            const projectsResponseData = await projectsResponse.json();
            // Transform projects data to match cargabilidad interface
            projectsData = projectsResponseData.map((project: any) => ({
              id_proyecto: project.id_proyecto,
              titulo: project.titulo,
              name: project.titulo,
              load: Math.round((project.user_hours / project.horas_totales) * 100) || 0,
              deadline: project.fecha_fin || undefined,
              hoursPerWeek: Math.round((project.user_hours || 0) / 
                (project.fecha_fin 
                  ? Math.max(1, Math.ceil((new Date(project.fecha_fin).getTime() - new Date(project.fecha_inicio).getTime()) / (1000 * 60 * 60 * 24 * 7)))
                  : 1)),
              color: project.color || null,
              user_hours: project.user_hours || 0,
              horas_totales: project.horas_totales || 0,
              fecha_inicio: project.fecha_inicio,
              fecha_fin: project.fecha_fin
            }));
            setProjects(projectsData);
          }
        } catch (err) {
          console.warn('Projects not available:', err);
          setProjects([]);
        }

      // Save to cache
      saveProfileDataToCache(profileData, skillsData, experienceData, certificatesData, resumeData, projectsData);

    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Error al cargar el perfil');
      // Reset the loading state for this user on error
      setProfileDataLoaded(prev => ({ ...prev, [userId]: false }));
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
          onClick={handleClose}
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
                onClick={handleClose}
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
            
            {/* Always render the content grid - components handle their own loading states */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Left Column - Flippable Profile Card and Resume */}
              <motion.div 
                className="lg:col-span-1 space-y-4"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Sticky container for flippable card and resume */}
                <div className="sticky top-0 space-y-4">
                  <FlippableProfileCard 
                    profile={profile}
                    projects={projects}
                    loading={loading}
                  />
                  
                  {/* Resume Section */}
                  <ReadOnlyResumeSection 
                    resumeUrl={resume}
                    loading={loading}
                  />
                </div>
              </motion.div>

              {/* Right Column - Detailed Info with animations */}
              <motion.div 
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Experience Section */}
                <ReadOnlyExperienceSection 
                  experiences={experience.map(exp => ({
                    company: exp.empresa ?? exp.compañia ?? '',
                    position: exp.cargo ?? exp.puesto ?? exp.posicion ?? '',
                    period: `${exp.fecha_inicio ? new Date(exp.fecha_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''} - ${exp.fecha_fin ? new Date(exp.fecha_fin).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Presente'}`,
                    description: exp.descripcion ?? ''
                  }))}
                  loading={loading}
                />

                {/* Skills Section */}
                <ReadOnlySkillsSection 
                  skills={skills.map(skill => ({
                    id: skill.id_habilidad?.toString() ?? generateSecureId(),
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}