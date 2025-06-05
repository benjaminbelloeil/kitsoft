
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
import { motion } from 'framer-motion';

export default function NoCoursesFound() {
  return (
    <motion.div 
      className="w-full py-10 flex flex-col items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <motion.div 
        className="bg-[#A100FF08] rounded-full p-3 inline-flex mb-3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
      >
        <Award className="h-6 w-6 text-[#A100FF]" />
      </motion.div>
      <motion.h3 
        className="text-base font-medium text-gray-700 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        No hay certificaciones
      </motion.h3>
      <motion.p 
        className="text-gray-500 text-center text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        No se encontraron certificaciones con los filtros actuales
      </motion.p>
    </motion.div>
  );
}