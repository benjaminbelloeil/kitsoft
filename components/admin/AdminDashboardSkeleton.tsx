
import { motion } from 'framer-motion';

export default function AdminDashboardSkeleton() {
  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      
      {/* Header with icon and title */}
      <motion.div 
        className="flex items-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-10 h-10 mr-3" style={shimmer}></div>
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-6 w-48 rounded" style={shimmer}></div>
      </motion.div>
      
      {/* Grid layout matching exactly the AdminDashboard layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Report card */}
        <motion.div 
          className="flex flex-col p-6 rounded-xl border border-gray-200 bg-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-8 h-8" style={shimmer}></div>
            <div className="ml-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-5 w-20 rounded" style={shimmer}></div>
          </div>
          <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-4 w-3/4 rounded" style={shimmer}></div>
        </motion.div>
        
        {/* "Coming soon" card */}
        <motion.div 
          className="flex items-center justify-center p-6 rounded-xl border border-gray-200 bg-gray-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-5 w-48 rounded" style={shimmer}></div>
        </motion.div>
      </div>
    </motion.div>
  );
}
