
/**
 * A React functional component that displays a message indicating that no courses were found.
 * This component is styled with Tailwind CSS and includes an icon, a title, and a description.
 *
 * @component
 * @returns {JSX.Element} A styled message box indicating no courses were found.
 *
 * @example
 * // Usage in a parent component
 * import NoCoursesFound from './NoCoursesFound';
 *
 * function App() {
 *   return (
 *     <div>
 *       <NoCoursesFound />
 *     </div>
 *   );
 * }
 */
import { Award } from 'lucide-react';

export default function NoCoursesFound() {
  return (
    <div className=" rounded-lg p-12 text-center bg-gray-50 rounded-lg p-8">
      <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-gray-500 mb-1">No hay certificaciones</h3>
      <p className="text-gray-500">No se encontraron certificaciones con los filtros actuales.</p>
    </div>
  );
}