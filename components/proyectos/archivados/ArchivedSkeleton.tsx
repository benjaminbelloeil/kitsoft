import React from 'react';
import { motion } from 'framer-motion';

const ArchivedPSkeleton: React.FC = () => {
  const shimmer = {
    animate: {
      backgroundPosition: '200% 0',
    },
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: 'linear',
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton - matching ArchivedProjectsHeader structure */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6 lg:px-8 mb-8"
      >
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex items-center">
              {/* Archive icon placeholder */}
              <motion.div 
                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 w-12 h-12 rounded-lg mr-4"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <div>
                {/* Title with badge placeholder */}
                <div className="flex items-center mb-2">
                  <motion.div 
                    className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-56 mr-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-20"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                {/* Description placeholder */}
                <motion.div 
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-96"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
            
            {/* View mode buttons placeholder */}
            <div className="flex items-center">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <motion.div 
                  className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-10 mr-1"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div 
                  className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-10"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content skeleton - matching archived projects structure */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6"
      >
        {/* Grid view skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <motion.div 
              key={idx} 
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
            >
              {/* Project colored header */}
              <motion.div 
                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 p-4 rounded-t-xl"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              >
                <div className="flex justify-between items-center mb-2">
                  <motion.div 
                    className="h-5 w-32 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-5 w-16 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                <motion.div 
                  className="h-4 w-24 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </motion.div>
              
              <div className="p-5">
                {/* Description */}
                <motion.div 
                  className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div 
                  className="h-4 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-6"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                
                {/* Stats section */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <motion.div 
                      className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-1"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <div className="flex items-center">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 mr-1.5"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-4 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                  </div>
                  <div>
                    <motion.div 
                      className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-1"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                </div>
                
                {/* Team avatars */}
                <div className="flex -space-x-2 overflow-hidden">
                  {[1, 2, 3].map((_, index) => (
                    <motion.div 
                      key={index}
                      className="inline-block h-7 w-7 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ring-2 ring-white"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  ))}
                  <motion.div 
                    className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ring-2 ring-white"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ArchivedPSkeleton;