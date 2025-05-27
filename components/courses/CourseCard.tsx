/* eslint-disable @typescript-eslint/no-explicit-any */
import { colorClasses } from './CourseUtils';

interface CourseCardProps {
  course: any;
  onClick: (course: any) => void;
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
  const progress = course.status === 'in-progress' ? calculateProgress(course) : 100;
  const courseColor = colorClasses[course.category as keyof typeof colorClasses] || colorClasses.accenture;

  return (
    <div 
      onClick={() => onClick(course)}
      className={`bg-white border rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-md ${courseColor.border}`}
    >
      <div className={`h-1 ${courseColor.bg}`}></div>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{course.name}</h3>
          <p className="text-sm text-gray-600">{course.issuer}</p>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{course.description}</p>

        {course.status === 'in-progress' && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progreso</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`h-2 rounded-full ${courseColor.bg}`} style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        <div className="mt-3 flex justify-between items-center">
          <div>
            {course.completionDate && course.status === 'completed' && (
              <span className="text-xs text-gray-500">
                Completado: {new Date(course.completionDate).toLocaleDateString('es-ES')}
              </span>
            )}
            {course.expirationDate && (
              <span className="text-xs text-gray-500">
                {course.status === 'completed' ? 'Vence' : 'Vence'}: {new Date(course.expirationDate).toLocaleDateString('es-ES')}
              </span>
            )}
          </div>
          <div>
            <StatusBadge status={course.status} />
          </div>
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

// Componente StatusBadge integrado
function StatusBadge({ status }: { status: string }) {
  return status === 'completed' ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      Completado
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      En Curso
    </span>
  );
}