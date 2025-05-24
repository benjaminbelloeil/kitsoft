"use client";

import { useState, useEffect } from 'react';
import { 
  Navigation, 
  Check, 
  Clock, 
  Star, 
  BookOpen, 
  Award, 
  TrendingUp,
  Calendar,
  Filter,
  Search,
  X,
  ChevronRight,
  ChevronLeft,
  Info
} from 'lucide-react';
import PathSkeleton from "@/components/cursos/PathSkeleton";
import CertificateItem from '@/components/cursos/CertificateItem';
import CourseDetailModal from '@/components/cursos/CourseDetailModal';
import NoCoursesFound from '@/components/cursos/NoCoursesFound';
import CareerPathVisualizer from '@/components/cursos/CareerPathVisualizer';
import NoPathFound from '@/components/cursos/NoPathFound';
import PathSelectionModal from '@/components/cursos/PathSelectionModal';
import SkillsQuestionnaire from '@/components/cursos/SkillsQuestionnaire';

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
    color: '#A100FF',
    skills: [
      'Consultoría Estratégica',
      'Arquitectura de Soluciones',
      'Gestión de Proyectos Técnicos',
      'Liderazgo Técnico',
      'JavaScript/TypeScript',
      'React',
      'Cloud Computing'
    ],
    certifications: [
      { name: 'Arquitectura de Soluciones', status: 'completed' as const },
      { name: 'Inteligencia Artificial y ML', status: 'completed' as const },
      { name: 'AWS Solutions Architect', status: 'in-progress' as const },
      { name: 'Azure Cloud Architect', status: 'pending' as const }
    ],
    nextSteps: [
      'Fundamentos de Cloud Computing',
      'Gestión Avanzada de Proyectos'
    ]
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
    color: '#0077B6',
    skills: [
      'Cloud Computing',
      'AWS', 
      'Azure',
      'DevOps',
      'Microservicios',
      'Seguridad Cloud',
      'Arquitectura Cloud'
    ],
    certifications: [
      { name: 'AWS Cloud Practitioner', status: 'completed' as const },
      { name: 'Azure Fundamentals', status: 'in-progress' as const },
      { name: 'Kubernetes Administrator', status: 'pending' as const }
    ],
    nextSteps: [
      'AWS Solutions Architect',
      'DevSecOps Fundamentals'
    ]
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
    color: '#00B050',
    skills: [
      'Gestión de Proyectos',
      'Liderazgo de Equipos',
      'Comunicación Efectiva',
      'Agile/Scrum',
      'Negociación',
      'Planificación Estratégica'
    ],
    certifications: [
      { name: 'Scrum Master', status: 'in-progress' as const },
      { name: 'PMP Certification', status: 'pending' as const },
      { name: 'Agile Leadership', status: 'pending' as const }
    ],
    nextSteps: [
      'Liderazgo y Gestión de Equipos',
      'Certificación Scrum Master'
    ]
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
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activePath, setActivePath] = useState<number | null>(null); // Changed to null to represent no path selected
  const [filterCategory, setFilterCategory] = useState('');
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentPosition, setCurrentPosition] = useState('');
  const [desiredPosition, setDesiredPosition] = useState('');
  
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
    
    // Apply category filter
    if (filterCategory) {
      filteredCourses = filteredCourses.filter(course => 
        course.category === filterCategory
      );
    }
    
    // Apply sorting
    if (sortBy === 'date') {
      filteredCourses.sort((a: any, b: any) => {
        return new Date(b.certificate.issueDate).getTime() - new Date(a.certificate.issueDate).getTime();
      });
    } else if (sortBy === 'name') {
      filteredCourses.sort((a: any, b: any) => a.title.localeCompare(b.title));
    }
    
    return filteredCourses;
  };
  
  // Get all available categories
  const categories = [...new Set(coursesData.map(course => course.category))];
  
  // Handle course click
  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
  };
  
  // Close course detail modal
  const closeModal = () => {
    setSelectedCourse(null);
  };
  
  // Handle questionnaire submission
  const handleQuestionnaireSubmit = (skills: string[], currentPos: string, desiredPos: string) => {
    setSelectedSkills(skills);
    setCurrentPosition(currentPos);
    setDesiredPosition(desiredPos);
    setIsQuestionnaireOpen(false);
    setIsPathModalOpen(true);
  };
  
  // Handle path selection from modal
  const handlePathSelect = (pathId: number) => {
    setActivePath(pathId);
    setIsPathModalOpen(false);
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
      {activePath ? (
        <>
          {console.log("Selected Path:", careerPaths.find(p => p.id === activePath), "Active Path ID:", activePath)}
          <CareerPathVisualizer 
            path={careerPaths.find(p => p.id === activePath)!}
            onEditPath={() => setIsQuestionnaireOpen(true)} 
          />
        </>
      ) : (
        <>
          {console.log("No active path selected")}
          <NoPathFound onStartQuestionnaire={() => setIsQuestionnaireOpen(true)} />
        </>
      )}
      
      {/* Certificates Section */}
      <div className="mb-3 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-2 border-b border-gray-200 p-2">
          <h2 className="text-xl font-bold flex items-center">
            <Award className="mr-2 text-purple-600" size={20} />
            Mis Cursos Completados y Certificaciones
          </h2>
          
          <div className="flex space-x-6">
            
            <div className="flex space-x-2 items-center">
              <Filter className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <label htmlFor="category-select" className="sr-only">Filtrar por categoría</label>
              <select
                id="category-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-md text-sm p-2 bg-white"
                aria-label="Filtrar por categoría"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
              <div className="flex space-x-2 items-center">
              <label htmlFor="sort-select" className="text-sm text-gray-500">Ordenar por:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md text-sm p-2 bg-white"
                aria-label="Ordenar por"
              >
                <option value="date">Fecha</option>
                <option value="name">Nombre</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
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
      
      {/* Skills Questionnaire Modal */}
      {isQuestionnaireOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-800/50 flex items-center justify-center z-50 p-4">
          <SkillsQuestionnaire 
            onSubmit={handleQuestionnaireSubmit}
            onCancel={() => setIsQuestionnaireOpen(false)}
          />
        </div>
      )}
      
      {/* Path Selection Modal */}
      {isPathModalOpen && (
        <PathSelectionModal
          paths={careerPaths}
          userSkills={selectedSkills}
          onPathSelect={(pathId) => {
            setActivePath(pathId);
            setIsPathModalOpen(false);
          }}
          onClose={() => setIsPathModalOpen(false)}
        />
      )}
    </div>
  );
}
