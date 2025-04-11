import { colorClasses } from './CourseUtils';
import StatusBadge from './StatusBadge';

interface CourseListItemProps {
  course: any;
  onClick: (course: any) => void;
}

export default function CourseListItem({ course, onClick }: CourseListItemProps) {
  const progress = course.status === 'in-progress' ? calculateProgress(course) : 100;
  const courseColor = colorClasses[course.category as keyof typeof colorClasses] || colorClasses.accenture;

  return (
    <div 
      onClick={() => onClick(course)}
      className={`bg-white border rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md ${courseColor.border} flex flex-col sm:flex-row`}
    >
      <div className={`w-full sm:w-1 h-1 sm:h-auto ${courseColor.bg}`}></div>
      <div className="p-4 sm:p-6 flex-grow">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="mb-2 sm:mb-0">
            <h3 className="text-lg font-semibold">{course.name}</h3>
            <p className="text-sm text-gray-600">{course.issuer}</p>
          </div>
          <div className="sm:ml-4 flex items-start">
            <StatusBadge status={course.status} />
          </div>
        </div>

        <p className="text-gray-700 text-sm my-2">{course.description}</p>

        <div className="mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            {course.completionDate && course.status === 'completed' && (
              <span className="text-xs text-gray-500 block sm:inline mr-4">
                Completado: {new Date(course.completionDate).toLocaleDateString('es-ES')}
              </span>
            )}
            {course.expirationDate && (
              <span className="text-xs text-gray-500 block sm:inline">
                {course.status === 'completed' ? 'Vence' : 'Vence'}: {new Date(course.expirationDate).toLocaleDateString('es-ES')}
              </span>
            )}
          </div>

          {course.status === 'in-progress' && (
            <div className="mt-2 sm:mt-0 w-full sm:w-1/3">
              <div className="flex justify-between text-xs mb-1">
                <span>Progreso</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${courseColor.bg}`} style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
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