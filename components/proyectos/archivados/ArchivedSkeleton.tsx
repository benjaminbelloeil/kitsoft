import React from 'react';
import { motion } from 'framer-motion';

const ArchivedPSkeleton: React.FC = () => {
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
    <div className="min-h-screen bg-gray-50 py-6 mx-auto sm:px-6 lg:px-8 mb-10">
      {/* Header skeleton */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mb-8'
      >
        <div className="bg-gray-50 shadow-md border border-gray-200 rounded-t-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center">
          {/* Icono placeholder */}
          <div className="flex items-center mb-4 md:mb-0">
            <motion.div 
              className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg h-12 w-12 mr-4"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
            <div className="flex flex-col">
              <motion.div 
                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-5 w-32 mb-2 rounded"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <motion.div 
                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-4 w-20 rounded"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>
          </div>
          {/* Contador de proyectos placeholder */}
          <div className="flex items-center">
            <motion.div 
              className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-6 w-44 rounded mr-4"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
            <div className="relative">
              <motion.div 
                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg h-14 w-34"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {/* Footer Skeleton */}
          <div className="bg-gray-50 shadow-md rounded-b-xl p-4 flex flex-col md:flex-row justify-between border-t border-x border-gray-200">
            {/* Tareas Completadas */}
            <div className="mb-4 md:mb-0 space-y-2">
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-6 w-40 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div 
                  className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-5 w-32 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content skeleton */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Estado: Vista de grid (skeleton) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(3)].map((_, idx) => (
            <motion.div 
              key={idx} 
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
            >
              <div className="bg-gray-200 p-4 rounded-t-xl">
                <div className="flex justify-between items-center mb-2">
                  <motion.div 
                    className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
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
                  className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-1"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
              <div className="p-5">
                <motion.div 
                  className="h-4 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-6"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <div className="relative w-full h-24 flex flex-col justify-center">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <motion.div 
                        className="h-4 w-32 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded mb-1"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-6 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                    <div>
                      <motion.div 
                        className="h-4 w-32 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded mb-1"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-6 w-28 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                  </div>
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