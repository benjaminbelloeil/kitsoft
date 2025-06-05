/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { motion } from 'framer-motion';

interface TrajectorySkeletonLoaderProps {
  trajectoryData?: {
    nombre: string;
    descripcion: string;
    fecha_inicio: string;
  };
}

const TrajectorySkeletonLoader: React.FC<TrajectorySkeletonLoaderProps> = () => {
  // Consistent shimmer animation matching dashboard skeleton
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
      className="mt-6 bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
    >
      <div className="p-6">
        {/* Trajectory Title and Description Skeleton */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <motion.div 
            className="h-6 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2"
            style={{ backgroundSize: '200% 100%' }}
            animate={shimmer.animate}
            transition={shimmer.transition}
          />
          <motion.div 
            className="h-4 w-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
            style={{ backgroundSize: '200% 100%' }}
            animate={shimmer.animate}
            transition={shimmer.transition}
          />
        </motion.div>

        {/* Main Timeline Container */}
        <motion.div 
          className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Loading indicator */}
          <motion.div 
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
              <motion.div 
                className="w-4 h-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-full"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <span className="text-sm font-medium">Generando trayectoria con IA...</span>
            </div>
          </motion.div>

          {/* Timeline Skeleton */}
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <SkeletonTimelineItem key={index} index={index} shimmer={shimmer} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Grid Sections */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <SkeletonSection shimmer={shimmer} items={3} />
          <SkeletonSection shimmer={shimmer} items={2} />
          <SkeletonSection shimmer={shimmer} items={3} />
        </motion.div>
      </div>
    </motion.div>
  );
};

const SkeletonTimelineItem: React.FC<{ index: number; shimmer: any }> = ({ index, shimmer }) => {
  const isFirst = index === 0;
  
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
    >
      <div className="flex items-start">
        {/* Icon */}
        <motion.div 
          className={`relative z-10 flex-shrink-0 w-12 h-12 ${isFirst ? 'bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200' : 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200'} rounded-full flex items-center justify-center border-4 border-white shadow-md`} 
          style={{ backgroundSize: '200% 100%' }}
          animate={shimmer.animate}
          transition={shimmer.transition}
        />

        {/* Content */}
        <div className="ml-4 flex-1">
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between mb-2">
              <motion.div 
                className="h-5 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
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
            <motion.div 
              className="h-3 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SkeletonSection: React.FC<{ shimmer: any; items: number }> = ({ 
  shimmer, 
  items 
}) => {
  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <div className="flex items-center mb-4">
        <motion.div 
          className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mr-3"
          style={{ backgroundSize: '200% 100%' }}
          animate={shimmer.animate}
          transition={shimmer.transition}
        />
        <motion.div 
          className="h-5 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
          style={{ backgroundSize: '200% 100%' }}
          animate={shimmer.animate}
          transition={shimmer.transition}
        />
      </div>
      <div className="space-y-3">
        {Array.from({ length: items }).map((_, index) => (
          <motion.div 
            key={index} 
            className="flex items-center p-2 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
          >
            <motion.div 
              className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mr-3"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
            <motion.div 
              className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded flex-1"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TrajectorySkeletonLoader;
