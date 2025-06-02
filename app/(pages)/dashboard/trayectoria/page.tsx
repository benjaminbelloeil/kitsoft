/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Search,
} from 'lucide-react';
import PathSkeleton from "@/components/trajectory/TrajectorySkeleton";
import CertificateItem from '@/components/trajectory/CertificateItem';
import TrajectoryDetailModal from '@/components/trajectory/TrajectoryDetailModal';
import NoTrajectoriesFound from '@/components/trajectory/NoTrajectoriesFound';
import CareerPathVisualizer from '@/components/trajectory/CareerPathVisualizer';

// CSS styles 
const styles = `
  /* Styles for the progress bar */
  .progress-bar-fill {
    /* The width will still be set dynamically via inline style */
    height: 0.5rem;
    transition: width 0.3s ease;
  }

  /* Define different percentage widths as classes */
  .progress-10 { width: 10%; }
  .progress-20 { width: 20%; }
  .progress-30 { width: 30%; }
  .progress-40 { width: 40%; }
  .progress-50 { width: 50%; }
  .progress-60 { width: 60%; }
  .progress-70 { width: 70%; }
  .progress-80 { width: 80%; }
  .progress-90 { width: 90%; }
  .progress-100 { width: 100%; }
`;

// Mock data for courses
const coursesData = [
  {
    id: 1,
    title: 'Fundamentos de Cloud Computing',
    description: 'Introducción a servicios y arquitecturas cloud',
    progress: 75,
    status: 'in-progress',
    dueDate: '2025-06-15',
    category: 'Tecnología',
    modules: [
      { name: 'Introducción a Cloud', completed: true },
      { name: 'Servicios IaaS', completed: true },
      { name: 'Servicios PaaS', completed: true },
      { name: 'Servicios SaaS', completed: false },
      { name: 'Seguridad en la Nube', completed: false }
    ],
    relatedPath: 'Especialista en Cloud',
    imgUrl: '/api/placeholder/150/150'
  },
  {
    id: 2,
    title: 'Gestión Ágil de Proyectos',
    description: 'Metodologías Scrum y aplicación en proyectos reales',
    progress: 40,
    status: 'in-progress',
    dueDate: '2025-05-30',
    category: 'Gestión',
    modules: [
      { name: 'Introducción a Agile', completed: true },
      { name: 'Fundamentos de Scrum', completed: true },
      { name: 'Roles y Responsabilidades', completed: false },
      { name: 'Implementación Práctica', completed: false },
      { name: 'Casos de Estudio', completed: false }
    ],
    relatedPath: 'Líder de Proyecto',
    imgUrl: '/api/placeholder/150/150'
  },
  {
    id: 3,
    title: 'Arquitectura de Soluciones',
    description: 'Diseño y planificación de arquitecturas empresariales',
    progress: 100,
    status: 'completed',
    completionDate: '2025-04-10',
    category: 'Tecnología',
    modules: [
      { name: 'Principios de Arquitectura', completed: true },
      { name: 'Diseño de Sistemas', completed: true },
      { name: 'Arquitecturas Distribuidas', completed: true },
      { name: 'Patrones de Diseño', completed: true }
    ],
    relatedPath: 'Consultor Tecnológico',
    imgUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    certificate: {
      id: 'cert-arch-001',
      issueDate: '2025-04-12',
      validUntil: '2027-04-12',
      credentialID: 'ACC-AS-2025-04321'
    }
  },
  {
    id: 4,
    title: 'Inteligencia Artificial y ML',
    description: 'Fundamentos y aplicaciones de IA en entornos empresariales',
    progress: 100,
    status: 'completed',
    completionDate: '2025-03-25',
    category: 'Tecnología',
    modules: [
      { name: 'Fundamentos de IA', completed: true },
      { name: 'Machine Learning', completed: true },
      { name: 'Redes Neuronales', completed: true },
      { name: 'Implementación en Proyectos', completed: true }
    ],
    relatedPath: 'Consultor Tecnológico',
    imgUrl: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    certificate: {
      id: 'cert-ai-002',
      issueDate: '2025-03-28',
      validUntil: '2027-03-28',
      credentialID: 'ACC-AI-2025-08752'
    }
  },
  {
    id: 5,
    title: 'Liderazgo y Gestión de Equipos',
    description: 'Desarrollo de habilidades de liderazgo efectivo',
    progress: 100,
    status: 'completed',
    completionDate: '2025-02-15',
    category: 'Liderazgo',
    modules: [
      { name: 'Principios de Liderazgo', completed: true },
      { name: 'Comunicación Efectiva', completed: true },
      { name: 'Gestión de Conflictos', completed: true },
      { name: 'Desarrollo de Equipos', completed: true }
    ],
    relatedPath: 'Líder de Proyecto',
    imgUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    certificate: {
      id: 'cert-lead-003',
      issueDate: '2025-02-18',
      validUntil: '2027-02-18',
      credentialID: 'ACC-LD-2025-12453'
    }
  }
];


export default function TrayectoriaPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activePath, setActivePath] = useState(1);
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [pathsLoading, setPathsLoading] = useState(true);
  
  // Fetch career paths from database
  const fetchPaths = async () => {
    try {
      const response = await fetch('/api/trajectory/list');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.paths.length > 0) {
          setCareerPaths(data.paths);
          setActivePath(data.paths[0].id); // Set first path as active
        } else {
          // If no paths found, keep empty array but stop loading
          setCareerPaths([]);
        }
      } else {
        console.error('Failed to fetch paths:', response.statusText);
        setCareerPaths([]);
      }
    } catch (error) {
      console.error('Error fetching paths:', error);
      setCareerPaths([]);
    } finally {
      setPathsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaths();
  }, []);
  
  // Get only completed courses with certificates
  const completedCourses = coursesData.filter(course => 
    course.status === 'completed' && course.certificate
  );
  
  // Apply filters and sorting
  const filterAndSortCourses = (courses: any[]) => {
    let filteredCourses = [...courses];
    
    // Apply search filter
    if (searchTerm) {
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredCourses;
  };
  
  // Handle course click
  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
  };
  
  // Close modal
  const closeModal = () => {
    setSelectedCourse(null);
  };

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate loading delay
    return () => clearTimeout(timer);
  }, []);
  
  // Show loading if either paths or general content is loading
  if (isLoading || pathsLoading) {
    return (
      <PathSkeleton />
    );
  }  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-gray-50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <style jsx global>{styles}</style>
        
        {/* Page Header */}
        <motion.div 
          className="page-header mb-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        >
          <div className="flex item-center p-2">
            <motion.div 
              className="flex items-center justify-center mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </motion.div>
            <motion.div 
              className='text-left px-4'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Mi Trayectoria y Certificaciones
              </h1>
              <p className="text-gray-600 text-sm mx-auto">
                Explora tu progreso en las rutas de carrera y gestiona tus certificaciones profesionales en Accenture.
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Career Path Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <CareerPathVisualizer 
            paths={careerPaths} 
            activePath={activePath} 
            onPathChange={setActivePath}
            onPathCreated={fetchPaths}
          />
        </motion.div>
        
        {/* Certificates Section */}
        <motion.div 
          className="mb-3 bg-white rounded-lg border border-gray-200 shadow-sm p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        >
          <motion.div 
            className="flex items-start justify-between border-b border-gray-200 pb-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex item-center">
              <motion.div 
                className="flex items-center justify-center mb-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
              </motion.div>
              <motion.div 
                className='text-left px-4'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2 className="text-lg font-bold text-gray-800">Mis Cursos Completados y Certificaciones</h2>
                <p className="text-gray-600 text-sm">Aquí puedes encontrar todos los cursos que has completado y las certificaciones obtenidas.</p>
              </motion.div>
            </div>
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                  aria-label="Ver como cuadrícula"
                  title="Ver como cuadrícula"
                  whileHover={{ scale: 1.05, backgroundColor: viewMode === 'grid' ? '#A100FF20' : '#f3f4f6' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                  aria-label="Ver como lista"
                  title="Ver como lista"
                  whileHover={{ scale: 1.05, backgroundColor: viewMode === 'list' ? '#A100FF20' : '#f3f4f6' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Filters and Search */}
          <motion.div 
            className=" flex flex-wrap gap-4 items-center mb-6 p-2 w-full pb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div 
              className="relative flex-grow w-xl"
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
            >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all"
                  placeholder="Buscar certificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </motion.div>
          </motion.div>
          
          {/* Certificates List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filterAndSortCourses(completedCourses).map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <CertificateItem 
                    course={course} 
                    onClick={handleCourseClick}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
              
              {filterAndSortCourses(completedCourses).length === 0 && (
                <motion.div 
                  className="col-span-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <NoTrajectoriesFound />
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
        
        {/* Course Detail Modal */}
        <AnimatePresence>
          {selectedCourse && (
            <TrajectoryDetailModal 
              course={selectedCourse}
              onClose={closeModal}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
