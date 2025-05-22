import { FiAlertTriangle, FiArchive } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface ArchiveProjectModalProps {
  isOpen: boolean;
  isArchiving: boolean;
  projectTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ArchiveProjectModal({ 
  isOpen, 
  isArchiving, 
  projectTitle,
  onClose, 
  onConfirm
}: ArchiveProjectModalProps) {
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
          onClick={() => !isArchiving && onClose()}
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
              <div className="mr-4 p-3 rounded-full bg-amber-100">
                <FiAlertTriangle className="text-amber-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar archivo</h3>
            </div>
            
            <div className="pl-12 space-y-3">
              <p className="text-gray-700">
                {projectTitle ? (
                  <>¿Estás seguro que deseas archivar el proyecto <span className="font-medium">{projectTitle}</span>?</>
                ) : (
                  <>¿Estás seguro que deseas archivar este proyecto?</>
                )}
              </p>
              
              <div className="bg-amber-50 border border-amber-100 rounded-md p-3 mb-2">
                <div className="flex items-center">
                  <FiAlertTriangle className="text-amber-600 mr-2 flex-shrink-0" size={16} />
                  <p className="text-amber-700 text-sm">
                    Al archivar este proyecto:
                  </p>
                </div>
                <ul className="mt-2 text-sm text-amber-700 list-disc pl-5 space-y-1">
                  <li>Se marcará como inactivo en la lista</li>
                  <li>Seguirá siendo visible en la lista de proyectos</li>
                  <li>Podrás reactivarlo en el futuro cambiando su estado a Activo</li>
                  <li>La información histórica se mantendrá intacta</li>
                </ul>
              </div>
              
              <p className="text-gray-600 text-sm">
                Los proyectos inactivos se muestran con un indicador de estado diferente en la misma vista.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onClose}
                className={`px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition-colors focus:outline-none focus:ring-0 ${
                  isArchiving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
                disabled={isArchiving}
              >
                Cancelar
              </button>
              <motion.button
                whileHover={!isArchiving ? { scale: 1.05 } : {}}
                whileTap={!isArchiving ? { scale: 0.95 } : {}}
                onClick={onConfirm}
                disabled={isArchiving}
                className="px-4 py-2.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-2 shadow-sm border border-amber-200 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-103 active:scale-97"
                style={{ transition: 'transform 0.2s ease, background-color 0.2s ease' }}
              >
                <div className="flex items-center justify-center min-w-[140px]">
                  {isArchiving ? (
                    <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      <FiArchive className="mr-2" size={16} />
                      <span>Archivar Proyecto</span>
                    </>
                  )}
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
