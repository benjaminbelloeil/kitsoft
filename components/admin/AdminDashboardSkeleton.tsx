import { motion } from 'framer-motion';

export default function AdminDashboardSkeleton() {
  const shimmer = {
    animate: {
      backgroundPosition: '200% 0',
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with icon and title */}
      <motion.div 
        className="flex items-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.div 
          className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-10 h-10 mr-3" 
          style={{ backgroundSize: '200% 100%' }}
          animate={shimmer.animate}
          transition={shimmer.transition}
        />
        <motion.div 
          className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-6 w-48 rounded" 
          style={{ backgroundSize: '200% 100%' }}
          animate={shimmer.animate}
          transition={shimmer.transition}
        />
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
            <motion.div 
              className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-8 h-8" 
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
            <motion.div 
              className="ml-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-5 w-20 rounded" 
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
          </div>
          <motion.div 
            className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-4 w-3/4 rounded" 
            style={{ backgroundSize: '200% 100%' }}
            animate={shimmer.animate}
            transition={shimmer.transition}
          />
        </motion.div>
        
        {/* "Coming soon" card */}
        <motion.div 
          className="flex items-center justify-center p-6 rounded-xl border border-gray-200 bg-gray-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <motion.div 
            className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-5 w-48 rounded" 
            style={{ backgroundSize: '200% 100%' }}
            animate={shimmer.animate}
            transition={shimmer.transition}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}