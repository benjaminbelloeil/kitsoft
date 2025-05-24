import React from 'react';
import { motion } from 'framer-motion';

export function DashboardSkeleton() {
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
    <div>
      {/* Header skeleton */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-30 w-full mb-6"
      >
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="flex h-16 items-center px-4 md:px-6 max-w-[1920px] mx-auto">
            {/* App logo */}
            <div className="flex items-center mr-4">
              <motion.div 
                className="h-7 w-28 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>
            
            {/* Search bar */}
            <div className="flex-1 ml-auto md:mr-auto max-w-md">
              <motion.div 
                className="h-9 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>
            
            {/* Control icons */}
            <div className="flex items-center space-x-3">
              <motion.div 
                className="h-9 w-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <motion.div 
                className="h-9 w-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <motion.div 
                className="h-9 w-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              
              <div className="border-l pl-3 ml-2">
                <div className="flex items-center">
                  <motion.div 
                    className="h-9 w-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <div className="ml-2 hidden md:block space-y-1">
                    <motion.div 
                      className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-3 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Greeting header skeleton */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative mb-10 max-w-[1920px] mx-auto px-4"
      >
        <div className="bg-gray-100 rounded-2xl">
          <div className="px-6 py-8">
            <div className="flex items-center mb-2">
              <motion.div 
                className="h-7 w-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mr-2"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <motion.div 
                className="h-8 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>
            
            <div className="flex items-center mt-2">
              <motion.div 
                className="h-8 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <div className="mx-2 opacity-0">•</div>
              <motion.div 
                className="h-8 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content skeleton */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1920px] mx-auto px-4"
      >
        {/* Left column skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects skeleton */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <motion.div 
                    className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mr-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                <motion.div 
                  className="h-5 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <motion.div 
                  key={i} 
                  className="p-4 border border-gray-100 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <motion.div 
                        className="h-5 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-4 w-36 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                    <motion.div 
                      className="mt-2 sm:mt-0 h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-1/2 space-y-2">
                      <div className="flex justify-between items-center">
                        <motion.div 
                          className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                          style={{ backgroundSize: '200% 100%' }}
                          animate={shimmer.animate}
                          transition={shimmer.transition}
                        />
                        <motion.div 
                          className="h-4 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                          style={{ backgroundSize: '200% 100%' }}
                          animate={shimmer.animate}
                          transition={shimmer.transition}
                        />
                      </div>
                      <motion.div 
                        className="h-2 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                    
                    <div className="sm:w-1/2 space-y-2">
                      <div className="flex justify-between items-center">
                        <motion.div 
                          className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
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
                      <motion.div 
                        className="h-2 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
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
          
          {/* Tasks and charts skeleton sections */}
          {/* Similar sections repeated for tasks and weekly summary */}
        </div>
        
        {/* Right column skeleton */}
        <div className="space-y-6">
          {/* Performance, skills, events skeletons */}
          {/* Similar sections repeated for right sidebar components */}
        </div>
      </motion.div>
    </div>
  );
}
