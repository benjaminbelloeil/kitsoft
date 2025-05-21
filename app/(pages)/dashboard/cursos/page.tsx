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
import './page.css';

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

// Component for displaying status badges
const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Check className="mr-1" size={12} /> Completado
      </span>
    );
  } else if (status === 'in-progress') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Clock className="mr-1" size={12} /> En Progreso
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <Star className="mr-1" size={12} /> Pendiente
      </span>
    );
  }
};

// Progress bar component
const ProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full progress-bar-fill`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// Certificate card component
const CertificateCard = ({ certificate, course }: { certificate: any, course: any }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Award className="text-purple-600 mr-2" size={20} />
          <h3 className="font-semibold text-lg">Certificación</h3>
        </div>
        <img 
          src="/api/placeholder/80/30" 
          alt="Accenture Logo" 
          className="h-6" 
        />
      </div>
      
      <h4 className="font-bold text-lg mb-1">{course.title}</h4>
      <p className="text-gray-600 text-sm mb-4">{course.category}</p>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">ID Credencial:</p>
          <p className="font-medium">{certificate.credentialID}</p>
        </div>
        <div>
          <p className="text-gray-500">Fecha Emisión:</p>
          <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Válido Hasta:</p>
          <p className="font-medium">{new Date(certificate.validUntil).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Estado:</p>
          <p className="font-medium text-green-600">Activo</p>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-purple-600 font-medium text-sm hover:text-purple-800 flex items-center justify-center w-full">
          <Star className="mr-1" size={16} /> Ver Credencial Completa
        </button>
      </div>
    </div>
  );
};

// Course detail modal component
const CourseDetailModal = ({ course, onClose }: { course: any, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>
            </div>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                title="Cerrar"
                aria-label="Cerrar"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">Progreso del Curso</h3>
                  <StatusBadge status={course.status} />
                </div>
                <ProgressBar percentage={course.progress} />
                <div className="mt-2 flex justify-between text-sm text-gray-600">
                  <span>{course.progress}% Completado</span>
                  {course.status === 'in-progress' && (
                    <span className="flex items-center">
                      <Calendar className="mr-1" size={14} />
                      Fecha límite: {new Date(course.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Módulos del Curso</h3>
                <div className="space-y-3">
                  {course.modules.map((module: { name: string; completed: boolean }, idx: number) => (
                    <div key={idx} className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${module.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {module.completed ? <Check size={16} /> : (idx + 1)}
                      </div>
                      <div className="ml-3 flex-grow">
                        <div className="text-sm font-medium">{module.name}</div>
                        {module.completed ? (
                          <div className="text-xs text-green-600">Completado</div>
                        ) : (
                          <div className="text-xs text-gray-500">Pendiente</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Información del Curso</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Categoría:</p>
                    <p className="font-medium">{course.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Ruta Relacionada:</p>
                    <p className="font-medium">{course.relatedPath}</p>
                  </div>
                  {course.status === 'completed' && (
                    <div>
                      <p className="text-gray-500">Fecha Completado:</p>
                      <p className="font-medium">{new Date(course.completionDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              {course.certificate ? (
                <CertificateCard 
                  certificate={course.certificate} 
                  course={course} 
                />
              ) : (
                <div className="border border-gray-200 rounded-lg p-4 h-full flex flex-col justify-center items-center text-center bg-gray-50">
                  <Award className="text-gray-400 mb-3" size={32} />
                  <h3 className="font-semibold text-lg mb-1">Certificación Pendiente</h3>
                  <p className="text-gray-500 text-sm mb-4">Completa este curso para obtener tu certificación.</p>
                  {course.status === 'in-progress' && (
                    <p className="text-sm font-medium text-purple-600">{course.progress}% completado</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
          >
            Cerrar
          </button>
          {course.status === 'in-progress' && (
            <button className="bg-purple-600 rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
              Continuar Curso
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Course card component
const CourseCard = ({ course, onClick, viewMode }: { course: any, onClick: (course: any) => void, viewMode: string }) => {
  if (viewMode === 'grid') {
    return (
      <div 
        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onClick(course)}
      >
        <div className="h-36 bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
          <img src={course.imgUrl} alt={course.title} className="h-24 w-24 object-cover rounded-lg" />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{course.title}</h3>
            <StatusBadge status={course.status} />
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progreso</span>
              <span>{course.progress}%</span>
            </div>
            <ProgressBar percentage={course.progress} />
          </div>
          <div className="flex justify-between items-center mt-3 text-sm">
            <span className="text-gray-500">{course.category}</span>
            <span className="text-purple-600 font-medium flex items-center">
              Ver Detalles <ChevronRight className="ml-1" size={16} />
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div 
        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onClick(course)}
      >
        <div className="p-4 flex">
          <div className="flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-purple-100 to-indigo-100 h-20 w-20 rounded-md">
            <img src={course.imgUrl} alt={course.title} className="h-14 w-14 object-cover rounded" />
          </div>
          <div className="ml-4 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
              <StatusBadge status={course.status} />
            </div>
            <p className="text-gray-600 text-sm mb-2">{course.description}</p>
            <div className="mb-1">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progreso</span>
                <span>{course.progress}%</span>
              </div>
              <ProgressBar percentage={course.progress} />
            </div>
          </div>
          <div className="flex flex-col justify-between items-end ml-4 text-sm">
            <span className="text-gray-500">{course.category}</span>
            <span className="text-purple-600 font-medium flex items-center">
              Ver Detalles <ChevronRight className="ml-1" size={16} />
            </span>
          </div>
        </div>
      </div>
    );
  }
};

// Career path visualization component
const CareerPathVisualizer = ({ 
  paths, 
  activePath, 
  onPathChange 
}: { 
  paths: any[], 
  activePath: number, 
  onPathChange: (pathId: number) => void 
}) => {
  const currentPath = paths.find(p => p.id === activePath);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-4">
      <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center ">
            <TrendingUp className="mr-2 bg-purple-500 text-white rounded-full p-1" size={20} /> 
            Mi Trayectoria Profesional
          </h2>
          <p className="text-gray-600 text-sm">Visualiza y planifica tu crecimiento profesional en Accenture</p>
        </div>
        <div className="flex">
          <label htmlFor="path-select" className="sr-only">Seleccionar trayectoria profesional</label>
          <select 
            id="path-select"
            value={activePath}
            onChange={(e) => onPathChange(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md text-sm p-2 bg-white"
            aria-label="Seleccionar trayectoria profesional"
          >
            {paths.map(path => (
              <option key={path.id} value={path.id}>{path.title}</option>
            ))}
          </select>
        </div>
      </div>
      
      {currentPath && (
        <>
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-1 text-[${currentPath.color}]`}>
              {currentPath.title}
            </h3>
            <p className="text-gray-600 text-sm">{currentPath.description}</p>
          </div>
          
          <div className="relative">
            {/* Path visualization */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
              
              {currentPath.levels.map((level: any, index: number) => {
                let bgColor = "bg-gray-200";
                let textColor = "text-gray-500";
                let borderColor = "border-gray-200";
                
                if (level.completed) {
                  bgColor = "bg-purple-600";
                  textColor = "text-white";
                  borderColor = "border-purple-600";
                } else if (level.current) {
                  bgColor = "bg-white";
                  textColor = "text-purple-600";
                  borderColor = "border-purple-600";
                }
                
                return (
                  <div key={level.id} className="relative z-10 flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full ${bgColor} ${level.current ? 'border-2' : ''} ${borderColor} flex items-center justify-center ${textColor} font-bold text-sm mb-2`}
                    >
                      {level.completed ? <Check size={16} /> : index + 1}
                    </div>
                    <div className="text-sm font-medium">{level.name}</div>
                    <div className={`text-xs ${level.completed ? 'text-green-600' : (level.current ? 'text-blue-600' : 'text-gray-500')}`}>
                      {level.completed ? 'Completado' : (level.current ? 'Actual' : 'Pendiente')}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Skills and requirements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <BookOpen className="mr-2 text-purple-600" size={16} /> Habilidades Clave
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Consultoría Estratégica
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Arquitectura de Soluciones
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                    Gestión de Proyectos Técnicos
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                    Liderazgo Técnico
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Award className="mr-2 text-purple-600" size={16} /> Certificaciones Recomendadas
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 text-green-500" size={14} />
                    Arquitectura de Soluciones
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 text-green-500" size={14} />
                    Inteligencia Artificial y ML
                  </li>
                  <li className="flex items-center">
                    <Clock className="mr-2 text-yellow-500" size={14} />
                    AWS Solutions Architect
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                    Azure Cloud Architect
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Info className="mr-2 text-purple-600" size={16} /> Próximos Pasos
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  Para avanzar al siguiente nivel, completa estos cursos recomendados:
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <Clock className="mr-2 text-blue-500" size={14} />
                    Fundamentos de Cloud Computing
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                    Gestión Avanzada de Proyectos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function CursosPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activePath, setActivePath] = useState(1);
  const [filterCategory, setFilterCategory] = useState('');
  
  // Filter courses based on status
  const inProgressCourses = coursesData.filter(course => course.status === 'in-progress');
  const completedCourses = coursesData.filter(course => course.status === 'completed');
  
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
        if (a.status === 'in-progress' && b.status === 'in-progress') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else if (a.status === 'completed' && b.status === 'completed') {
          return new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime();
        } else {
          return a.status === 'in-progress' ? -1 : 1;
        }
      });
    } else if (sortBy === 'name') {
      filteredCourses.sort((a: any, b: any) => a.title.localeCompare(b.title));
    } else if (sortBy === 'progress') {
      filteredCourses.sort((a: any, b: any) => b.progress - a.progress);
    }
    
    return filteredCourses;
  };
  
  // Get all available categories
  const categories = [...new Set(coursesData.map(course => course.category))];
  
  // Handle course click
  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
  };
  
  // Close modal
  const closeModal = () => {
    setSelectedCourse(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="page-header mb-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex item-center p-2">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className='text-left px-4 '>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Mi Desarrollo Profesional
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visualiza y gestiona tu trayectoria profesional y aprendizaje en Accenture
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
      
      {/* Courses Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <BookOpen className="mr-2 text-purple-600" size={20} />
            Mis Cursos y Certificaciones
          </h2>
          <div className="flex space-x-4">
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
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
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
              <option value="progress">Progreso</option>
            </select>
          </div>
        </div>
        
        {/* In Progress Courses */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="text-blue-600 mr-2" size={20} />
            Cursos en Progreso
          </h3>
          
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filterAndSortCourses(inProgressCourses).map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onClick={handleCourseClick}
                viewMode={viewMode}
              />
            ))}
            
            {filterAndSortCourses(inProgressCourses).length === 0 && (
              <div className="col-span-full text-center bg-gray-50 rounded-lg p-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-500 mb-1">No hay cursos en progreso</h3>
                <p className="text-gray-500">No se encontraron cursos en progreso con los filtros actuales.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Completed Courses */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Check className="text-green-600 mr-2" size={20} />
            Cursos Completados
          </h3>
          
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filterAndSortCourses(completedCourses).map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onClick={handleCourseClick}
                viewMode={viewMode}
              />
            ))}
            
            {filterAndSortCourses(completedCourses).length === 0 && (
              <div className="col-span-full text-center bg-gray-50 rounded-lg p-8">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-500 mb-1">No hay cursos completados</h3>
                <p className="text-gray-500">No se encontraron cursos completados con los filtros actuales.</p>
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
