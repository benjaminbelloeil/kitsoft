/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { 
  Award, 
  Search,
} from 'lucide-react';
import PathSkeleton from "@/components/cursos/PathSkeleton";
import CertificateItem from '@/components/cursos/CertificateItem';
import CourseDetailModal from '@/components/cursos/CourseDetailModal';
import NoCoursesFound from '@/components/cursos/NoCoursesFound';
import CareerPathVisualizer from '@/components/cursos/CareerPathVisualizer';

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

// Mock data for career paths
const careerPaths = [
  {
    id: 1,
    title: 'Consultor Tecnológico',
    levels: [
      { id: 'ct-1', name: 'Nivel 1', completed: true },
      { id: 'ct-2', name: 'Nivel 2', completed: true },
      { id: 'ct-3', name: 'Nivel 3', completed: false, current: true },
      { id: 'ct-4', name: 'Nivel 4', completed: false },
      { id: 'ct-5', name: 'Nivel 5', completed: false }
    ],
    description: 'Ruta especializada en consultoría tecnológica y soluciones digitales.',
    color: '#A100FF'
  },
  {
    id: 2,
    title: 'Especialista en Cloud',
    levels: [
      { id: 'cl-1', name: 'Nivel 1', completed: true },
      { id: 'cl-2', name: 'Nivel 2', completed: false },
      { id: 'cl-3', name: 'Nivel 3', completed: false },
      { id: 'cl-4', name: 'Nivel 4', completed: false }
    ],
    description: 'Especialización en tecnologías cloud y arquitectura de soluciones.',
    color: '#0077B6'
  },
  {
    id: 3,
    title: 'Líder de Proyecto',
    levels: [
      { id: 'lp-1', name: 'Nivel 1', completed: false },
      { id: 'lp-2', name: 'Nivel 2', completed: false },
      { id: 'lp-3', name: 'Nivel 3', completed: false }
    ],
    description: 'Ruta para desarrollo de habilidades de gestión y liderazgo de proyectos.',
    color: '#00B050'
  }
];

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
    imgUrl: '/api/placeholder/150/150',
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
    imgUrl: '/api/placeholder/150/150',
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
    imgUrl: '/api/placeholder/150/150',
    certificate: {
      id: 'cert-lead-003',
      issueDate: '2025-02-18',
      validUntil: '2027-02-18',
      credentialID: 'ACC-LD-2025-12453'
    }
  }
];


export default function CursosPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activePath, setActivePath] = useState(1);
  
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
  
  if (isLoading) {
    return (
      <PathSkeleton />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <style jsx global>{styles}</style>
      <div className="page-header mb-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex item-center p-2">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className='text-left px-4 '>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Mi Trayectoria y Certificaciones
            </h1>
            <p className="text-gray-600 text-sm mx-auto">
              Explora tu progreso en las rutas de carrera y gestiona tus certificaciones profesionales en Accenture.
            </p>
          </div>
        </div>
      </div>
      
      {/* Career Path Visualizer */}
      <CareerPathVisualizer 
        paths={careerPaths} 
        activePath={activePath} 
        onPathChange={setActivePath} 
      />
      
      {/* Certificates Section */}
      <div className="mb-3 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <Award className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Mis Cursos Completados y Certificaciones</h2>
              <p className="text-gray-600 text-sm">Aquí puedes encontrar todos los cursos que has completado y las certificaciones obtenidas.</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
              aria-label="Ver como cuadrícula"
              title="Ver como cuadrícula"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
              aria-label="Ver como lista"
              title="Ver como lista"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className=" flex flex-wrap gap-4 items-center mb-6 p-2 w-full pb-4">
          <div className="relative flex-grow w-xl ">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Buscar certificaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </div>
        
        {/* Certificates List */}
        <div>
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filterAndSortCourses(completedCourses).map(course => (
              <CertificateItem 
                key={course.id} 
                course={course} 
                onClick={handleCourseClick}
                viewMode={viewMode}
              />
            ))}
            
            {filterAndSortCourses(completedCourses).length === 0 && (
              <div className="col-span-full">
              <NoCoursesFound />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal 
          course={selectedCourse}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
