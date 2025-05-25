import React from "react";
import { motion } from 'framer-motion';
import { SkeletonCargabilidad } from './SkeletonProfile';

interface ProjectCargabilidad {
  name: string;
  cargabilidad: number;
  color: string;
}

interface CargabilidadSectionProps {
  projects: ProjectCargabilidad[];
  loading?: boolean;
}

// Progress circle component for cargabilidad
const ProgressCircle = ({ percentage, color }: { percentage: number, color: string }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const colorClasses: Record<string, string> = {
    emerald: "stroke-emerald-500",
    blue: "stroke-blue-500",
    purple: "stroke-purple-500"
  };

  const bgColorClasses: Record<string, string> = {
    emerald: "bg-emerald-50",
    blue: "bg-blue-50",
    purple: "bg-purple-50"
  };
  
  return (
    <div className={`relative h-[120px] w-[120px] flex items-center justify-center rounded-full ${bgColorClasses[color] || "bg-emerald-50"} p-2`}>
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="transparent"
          stroke="#e6e6e6"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${colorClasses[color] || "stroke-emerald-500"} drop-shadow-sm`}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-2xl font-bold">{percentage}%</span>
    </div>
  );
};

export default function CargabilidadSection({ projects, loading = false }: CargabilidadSectionProps) {
  if (loading) {
    return <SkeletonCargabilidad />;
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -2 }}
    >
      <motion.h2 
        className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.span 
          className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A100FF]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
        </motion.span>
        Cargabilidad actual
      </motion.h2>
      
      <motion.div 
        className="flex flex-wrap gap-6 flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {projects.map((project, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-lg p-5 flex-1 min-w-[200px] text-center border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 hover:border-[#A100FF40] flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            whileHover={{ 
              y: -3, 
              scale: 1.02,
              shadow: "0 10px 25px -5px rgba(161, 0, 255, 0.1)"
            }}
          >
            <motion.h3 
              className="font-medium text-lg mb-4 text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              {project.name}
            </motion.h3>
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <ProgressCircle percentage={project.cargabilidad} color={project.color} />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
