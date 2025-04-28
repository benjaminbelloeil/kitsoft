"use client";

import { motion } from "framer-motion";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  // Card container animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };
  
  // Individual card variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.15, 
        ease: [0.25, 0.1, 0.25, 1.0]  // Improved easing curve
      }
    }
  };

  // Define Accenture gradient style
  const accentureGradientStyle = {
    background: "linear-gradient(135deg, #A100FF 0%, #7F00FF 100%)",
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <LoginForm />
        </motion.div>
      </div>
      
      {/* Right side - Purple card with updated content for project management */}
      <div 
        className="hidden md:block w-1/2 h-full" 
        style={accentureGradientStyle}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full flex flex-col justify-center p-8 lg:p-12 text-white login-card"
        >
          <motion.h2 
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="text-3xl lg:text-4xl font-bold mb-6 text-center text-white"
          >
            Gestione Sus Proyectos Accenture
          </motion.h2>
          
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-lg mb-10 text-center max-w-lg mx-auto text-white"
          >
            Su plataforma centralizada para seguir asignaciones, gestionar tareas y monitorear métricas de rendimiento para todos sus proyectos Accenture.
          </motion.p>
          
          {/* Cards container with staggered animation - updated for project management features */}
          <motion.div 
            className="grid grid-cols-2 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Project Management */}
            <motion.div 
              className="bg-white/10 backdrop-blur-sm p-5 lg:p-6 shadow-lg border border-white/20"
              variants={cardVariants}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.15)", transition: { duration: 0.15 } }}
            >
              <div className="rounded-full bg-white/30 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-white">Seguimiento de Proyectos</h3>
              <p className="text-white text-sm">Monitoree todos sus proyectos asignados y sus hitos clave en un panel centralizado</p>
            </motion.div>
            
            {/* Task Management */}
            <motion.div 
              className="bg-white/10 backdrop-blur-sm p-5 lg:p-6 shadow-lg border border-white/20"
              variants={cardVariants}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.15)", transition: { duration: 0.15 } }}
            >
              <div className="rounded-full bg-white/30 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-white">Gestión de Tareas</h3>
              <p className="text-white text-sm">Organice prioridades, siga el progreso y actualice estados de tareas con herramientas intuitivas</p>
            </motion.div>
            
            {/* Feedback System */}
            <motion.div 
              className="bg-white/10 backdrop-blur-sm p-5 lg:p-6 shadow-lg border border-white/20"
              variants={cardVariants}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.15)", transition: { duration: 0.15 } }}
            >
              <div className="rounded-full bg-white/30 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-white">Canal de Retroalimentación</h3>
              <p className="text-white text-sm">Reciba comentarios en tiempo real de gerentes y colabore efectivamente con miembros del equipo</p>
            </motion.div>
            
            {/* Work Allocation */}
            <motion.div 
              className="bg-white/10 backdrop-blur-sm p-5 lg:p-6 shadow-lg border border-white/20"
              variants={cardVariants}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.15)", transition: { duration: 0.15 } }}
            >
              <div className="rounded-full bg-white/30 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-white">Análisis de Carga Laboral</h3>
              <p className="text-white text-sm">Monitoree la asignación de recursos con métricas porcentuales y optimice su productividad</p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-8 bg-white/5 p-5 border border-white/10 text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <p className="text-lg font-medium text-white">Más allá de las expectativas</p>
            <p className="text-sm mt-2 text-white">Capacitando a los empleados de Accenture para entregar resultados excepcionales a través de mejor colaboración y gestión de recursos</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
