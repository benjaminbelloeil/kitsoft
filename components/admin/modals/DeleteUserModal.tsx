import { FiAlertCircle, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteUserModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteUserModal({ 
  isOpen, 
  isDeleting, 
  onClose, 
  onConfirm 
}: DeleteUserModalProps) {
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
          onClick={() => !isDeleting && onClose()}
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
              <div className="mr-4 p-3 rounded-full bg-red-100">
                <FiAlertCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar eliminación</h3>
            </div>
            
            <div className="pl-12 space-y-3">
              <p className="text-gray-700">
                ¿Estás seguro que deseas eliminar este usuario?
              </p>
              
              <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-2">
                <div className="flex items-center">
                  <FiAlertCircle className="text-red-600 mr-2 flex-shrink-0" size={16} />
                  <p className="text-red-700 text-sm">
                    Esta acción <span className="font-medium">no se puede deshacer</span> y eliminará:
                  </p>
                </div>
                <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
                  <li>Todos los datos personales del usuario</li>
                  <li>Experiencia laboral y habilidades</li>
                  <li>Certificaciones y curriculum</li>
                  <li>Configuración y preferencias</li>
                </ul>
              </div>
              
              <p className="text-gray-600 text-sm">
                El usuario tendrá que volver a registrarse si necesita acceder a la plataforma de nuevo.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onClose}
                className={`px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition-colors focus:outline-none focus:ring-0 ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <motion.button
                whileHover={!isDeleting ? { scale: 1.05 } : {}}
                whileTap={!isDeleting ? { scale: 0.95 } : {}}
                onClick={onConfirm}
                disabled={isDeleting}
                className={`flex items-center px-4 py-2 bg-red-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-0 ${
                  isDeleting ? 'opacity-80 cursor-not-allowed' : 'hover:bg-red-700'
                }`}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="mr-2" size={16} />
                    Eliminar Usuario
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
