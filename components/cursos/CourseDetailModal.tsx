import { useRef } from 'react';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import { colorClasses } from './CourseUtils';

interface CourseDetailModalProps {
  course: any;
  onClose: () => void;
}

export default function CourseDetailModal({ course, onClose }: CourseDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  if (!course) return null;
  
  const courseColor = colorClasses[course.category as keyof typeof colorClasses] || colorClasses.accenture;
  const progress = course.status === 'in-progress' ? calculateProgress(course) : 100;
  
  return (
    
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Encabezado */}
        <div className={`${courseColor.bg} p-4 sm:p-6 text-white relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold mb-1">{course.name}</h2>
          <p className="text-lg opacity-90">{course.issuer}</p>
        </div>
        
        {/* Contenido */}
        <div className="p-4 sm:p-6">
          {/* Estado y Progreso */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div>
                <StatusBadge status={course.status} />
              </div>
              
              {course.status === 'completed' && course.completionDate && (
                <span className="text-sm text-gray-600">
                  Completado: {new Date(course.completionDate).toLocaleDateString('es-ES')}
                </span>
              )}
              
              {course.expirationDate && (
                <span className="text-sm text-gray-600">
                  Vence: {new Date(course.expirationDate).toLocaleDateString('es-ES')}
                </span>
              )}
              
              {!course.expirationDate && course.status === 'completed' && (
                <span className="text-sm text-gray-600">
                  No expira
                </span>
              )}
            </div>
            
            {course.status === 'in-progress' && (
              <ProgressBar
                progress={progress}
                category={course.category}
                colorClass={courseColor.bg}
                showLabel={true} 
              />
            )}
          </div>
          
          {/* Descripción */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-gray-700">{course.description}</p>
          </div>
          
          {/* Credenciales si es completado */}
          {course.status === 'completed' && course.credentialID && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Credenciales</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">ID de Credencial:</span>
                  <span className="ml-2 text-gray-900">{course.credentialID}</span>
                </div>
                {course.credentialURL && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Verificar en:</span>
                    <a 
                      href={course.credentialURL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`ml-2 text-${course.category === 'cloud' ? 'blue' : course.category === 'data' ? 'green' : 'purple'}-600 hover:underline`}
                    >
                      {new URL(course.credentialURL).hostname}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Módulos si está en progreso */}
          {course.status === 'in-progress' && course.modules && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Módulos</h3>
              <div className="space-y-3">
                {course.modules.map((module: any) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {module.completed ? (
                          <div className={`${courseColor.bg} rounded-full h-5 w-5 flex items-center justify-center mr-3`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="rounded-full h-5 w-5 border-2 border-gray-300 mr-3"></div>
                        )}
                        <h4 className="text-base font-medium">{module.name}</h4>
                      </div>
                      <span className={`text-sm ${module.completed ? 'text-green-600' : 'text-gray-500'}`}>
                        {module.completed ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>
                    {module.description && (
                      <p className="text-sm text-gray-600 mt-2 ml-8">{module.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Habilidades */}
          {course.skills && course.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill: string, index: number) => (
                  <span 
                    key={index} 
                    className={`${courseColor.border} bg-white border rounded-full px-3 py-1 text-sm`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Acciones */}
        <div className="border-t border-gray-200 p-4 sm:p-6 flex justify-end">
          {course.status === 'completed' && course.credentialURL && (
            <a 
              href={course.credentialURL} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${courseColor.bg} text-white px-4 py-2 rounded-lg shadow-sm hover:opacity-90 mr-3`}
            >
              Verificar Certificado
            </a>
          )}
          <button 
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// Función auxiliar para calcular el progreso
function calculateProgress(course: any) {
  if (course.modules) {
    const completedModules = course.modules.filter((m: any) => m.completed).length;
    return Math.round((completedModules / course.modules.length) * 100);
  }
  return 0;
}