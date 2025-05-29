import {motion} from 'framer-motion';
import {FiAlertCircle} from 'react-icons/fi';
import {useRouter} from 'next/navigation';

interface UnauthorizedStateProps {
    title?: string;
    message?: string; 
    buttonText?: string; 
    redirectTo?: string; 
}

export default function UnauthorizedState({
    title = "Acceso no autorizado",
    message = "No tienes permiso para acceder a esta sección.",
    buttonText = "Volver al inicio",
    redirectTo = "/dashboard"
}: UnauthorizedStateProps) {
    const router = useRouter();

    return (
        <motion.div 
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="text-center bg-white rounded-xl p-8 shadow-lg border border-gray-200"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        >
          <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        </motion.div>
        <motion.h2 
          className="text-xl font-semibold text-gray-800 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {title}
        </motion.h2>
        <motion.p 
          className="text-gray-600 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {message}
        </motion.p>
        <motion.button
          onClick={() => router.push(redirectTo)}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          whileHover={{ scale: 1.05, backgroundColor: "#7E22CE" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {buttonText}
        </motion.button>
      </motion.div>
    </motion.div>
    );
}
