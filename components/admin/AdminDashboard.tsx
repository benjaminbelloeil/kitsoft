"use client";

import { motion } from "framer-motion";
import { FiDatabase, FiActivity } from "react-icons/fi";

export default function AdminDashboard() {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <motion.h2 
        className="text-xl font-semibold mb-6 flex items-center text-gray-800"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.div 
          className="bg-purple-100 p-2 rounded-lg mr-3"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FiDatabase className="text-purple-600" />
        </motion.div>
        Datos y Configuraciones
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          className="flex flex-col p-6 rounded-xl border border-gray-200 bg-white transition-all hover:shadow-md hover:border-gray-300"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ 
            y: -3, 
            scale: 1.02,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="flex items-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <motion.span 
              className="p-2 rounded-lg bg-amber-100 text-amber-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 30, 
                delay: 0.5 
              }}
            >
              <FiActivity size={20} />
            </motion.span>
            <motion.h3 
              className="ml-3 font-medium text-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              Reportes
            </motion.h3>
          </motion.div>
          <motion.p 
            className="text-gray-600 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            Genera y exporta reportes del sistema
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="flex items-center justify-center p-6 rounded-xl border border-gray-200 bg-gray-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ 
            scale: 1.02,
            backgroundColor: "#f8fafc" 
          }}
        >
          <motion.p 
            className="text-gray-500 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            Más funcionalidades próximamente...
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}