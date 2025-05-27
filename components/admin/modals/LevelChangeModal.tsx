import { FiAlertCircle, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface LevelChangeModalProps {
  isOpen: boolean;
  isChanging?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LevelChangeModal({ isOpen, isChanging = false, onClose, onConfirm }: LevelChangeModalProps) {
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
          onClick={() => !isChanging && onClose()}
        >
          <motion.div 
            className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl border border-gray-100"
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <div className="mr-4 p-3 rounded-full bg-purple-100">
                <FiAlertCircle className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar cambio de nivel</h3>
            </div>
            <div className="pl-12 space-y-3">
              <p className="text-gray-700">
                ¿Estás seguro que deseas cambiar el nivel de este usuario?
              </p>
              <div className="bg-purple-50 border border-purple-100 rounded-md p-3 mb-2">
                <p className="text-purple-700 text-sm">
                  Este cambio modificará los permisos del usuario en el sistema y puede afectar su acceso a diferentes funcionalidades.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onClose}
                className={`px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition-colors focus:outline-none focus:ring-0 ${
                  isChanging ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
                disabled={isChanging}
              >
                Cancelar
              </button>
              <motion.button
                whileHover={!isChanging ? { scale: 1.02 } : {}}
                whileTap={!isChanging ? { scale: 0.98 } : {}}
                onClick={onConfirm}
                disabled={isChanging}
                className={`flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-0 ${
                  isChanging ? 'opacity-80 cursor-not-allowed' : 'hover:bg-purple-700'
                }`}
              >
                {isChanging ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Cambiando...
                  </>
                ) : (
                  <>
                    <FiUser className="mr-2" size={16} />
                    Confirmar Cambio
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
