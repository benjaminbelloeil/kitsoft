import React from 'react';
import { motion } from 'framer-motion';

const PathSkeleton: React.FC = () => {
  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      
      {/* Page Header Skeleton */}
      <motion.div 
        className="mb-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center p-2">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
          <div className='text-left px-4'>
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-64 mb-2" style={shimmer}></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-96" style={shimmer}></div>
          </div>
        </div>
      </motion.div>
      
      {/* Career Path Visualizer Skeleton */}
      <motion.div 
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.div 
          className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-500/10 to-gray-500/20 rounded-full flex-shrink-0 mr-3 shadow-lg"></div>
            <div>
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48 mb-2" style={shimmer}></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-64" style={shimmer}></div>
            </div>
          </div>
          <div className="flex">
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-40" style={shimmer}></div>
          </div>
        </motion.div>
        
        {/* Path Title and Description */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-56 mb-2" style={shimmer}></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-96" style={shimmer}></div>
        </motion.div>
        
        {/* Timeline Visualization */}
        <motion.div 
          className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
            
            {/* Timeline items */}
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <motion.div 
                  key={idx} 
                  className="relative flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + idx * 0.1 }}
                >
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-md" style={shimmer}>
                  </div>
                  
                  {/* Content */}
                  <div className="ml-4 flex-1 p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24" style={shimmer}></div>
                      <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-20" style={shimmer}></div>
                    </div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full mt-2" style={shimmer}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
          
        {/* Skills and Requirements Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <motion.div 
              key={idx} 
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.0 + idx * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mr-3" style={shimmer}></div>
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32" style={shimmer}></div>
              </div>
              <ul className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-center p-2 rounded-lg"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.1 + idx * 0.1 + i * 0.05 }}
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mr-3" style={shimmer}></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-40" style={shimmer}></div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Certificates Section Skeleton */}
      <motion.div 
        className="mb-3 bg-white rounded-lg border border-gray-200 shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.3 }}
      >
        <motion.div 
          className="flex items-start justify-between border-b border-gray-200 pb-4 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.4 }}
        >
          <div className="flex item-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
            <div className='text-left px-4'>
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-72 mb-2" style={shimmer}></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-96" style={shimmer}></div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="p-2 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-9 w-9" style={shimmer}></div>
              <div className="p-2 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-9 w-9" style={shimmer}></div>
            </div>
          </div>
        </motion.div>
        
        {/* Filters and Search */}
        <motion.div 
          className=" flex flex-wrap gap-4 items-center mb-6 p-2 w-full pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.5 }}
        >
          <div className="relative flex-grow w-xl ">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
            </div>
            <div className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
          </div>
        </motion.div>
        
        {/* Certificates Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(3)].map((_, idx) => (
            <motion.div 
              key={idx} 
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.6 + idx * 0.1 }}
            >
              <div className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 z-10 w-8 h-8 flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="h-36 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 relative overflow-hidden" style={shimmer}>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-40 mb-1" style={shimmer}></div>
                  <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-24" style={shimmer}></div>
                </div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full mb-3" style={shimmer}></div>
                
                <div className="space-y-2 mb-2">
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32" style={shimmer}></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-40" style={shimmer}></div>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20" style={shimmer}></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32" style={shimmer}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PathSkeleton;