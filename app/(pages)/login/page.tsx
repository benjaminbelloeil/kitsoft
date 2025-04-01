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
      <div className="hidden md:block w-1/2 h-full accenture-gradient">
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
            Manage Your Accenture Projects
          </motion.h2>
          
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-lg mb-10 text-center max-w-lg mx-auto text-white"
          >
            Your centralized platform for tracking assignments, managing tasks, and monitoring performance metrics for all your Accenture projects.
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
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-white">Project Tracking</h3>
              <p className="text-white text-sm">Monitor all your assigned projects and their key milestones in one centralized dashboard</p>
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
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-white">Task Management</h3>
              <p className="text-white text-sm">Organize priorities, track progress and update task statuses with intuitive tools</p>
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
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-white">Feedback Channel</h3>
              <p className="text-white text-sm">Receive real-time feedback from managers and collaborate effectively with team members</p>
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
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-white">Workload Analytics</h3>
              <p className="text-white text-sm">Monitor resource allocation with percentage-based metrics and optimize your productivity</p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-8 bg-white/5 p-5 border border-white/10 text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <p className="text-lg font-medium text-white">Greater than expectations</p>
            <p className="text-sm mt-2 text-white">Empowering Accenture employees to deliver exceptional outcomes through better collaboration and resource management</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
