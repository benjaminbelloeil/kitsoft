import { FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface LevelChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LevelChangeModal({ isOpen, onClose, onConfirm }: LevelChangeModalProps) {
  // Modal animation variants
  const modalBackdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const modalContentVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 500, 
        duration: 0.3 
      } 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div 
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-100"
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <div className="mr-4 p-2 rounded-full bg-purple-100">
                <FiAlertCircle className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar cambio de nivel</h3>
            </div>
            <p className="text-gray-600 mb-6 pl-12">
              ¿Estás seguro que deseas cambiar el nivel de este usuario? 
              Este cambio modificará los permisos del usuario en el sistema.
            </p>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancelar
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Confirmar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
