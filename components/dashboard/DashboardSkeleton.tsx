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
        className="relative mb-6 max-w-[1920px] mx-auto px-4 md:px-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-2">
            <motion.div 
              className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mr-3"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
            <motion.div 
              className="h-7 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
          </div>
          
          <motion.div 
            className="h-5 w-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
            style={{ backgroundSize: '200% 100%' }}
            animate={shimmer.animate}
            transition={shimmer.transition}
          />
        </div>
      </motion.div>

      {/* Main content skeleton */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1920px] mx-auto px-4 md:px-6"
      >
        {/* Left column - spans 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects section skeleton */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
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
            
            <div className="p-6 space-y-4 max-h-[400px]">
              {[1, 2].map(i => (
                <motion.div 
                  key={i} 
                  className="p-4 border border-gray-100 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                >
                  <div className="mb-4">
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
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-1/2 space-y-2">
                      <div className="flex justify-between items-center">
                        <motion.div 
                          className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                          style={{ backgroundSize: '200% 100%' }}
                          animate={shimmer.animate}
                          transition={shimmer.transition}
                        />
                        <motion.div 
                          className="h-4 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
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
                          className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
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
          
          {/* Tasks section skeleton */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <motion.div 
                    className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mr-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-6 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
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
            
            <div className="p-6 space-y-4 max-h-[400px]">
              {[1, 2, 3].map(i => (
                <motion.div 
                  key={i} 
                  className="flex items-center p-4 border border-gray-100 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                >
                  <motion.div 
                    className="w-2 h-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mr-4"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <div className="flex-1 space-y-2">
                    <motion.div 
                      className="h-5 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      <motion.div 
                        className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                  </div>
                  <motion.div 
                    className="ml-4 h-9 w-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Work Summary skeleton */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center">
                <motion.div 
                  className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mr-2"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div 
                  className="h-6 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
            
            <div className="p-4 pt-0">
              <div className="grid grid-cols-7 gap-2 my-4 h-32">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={i} className="flex flex-col h-full">
                    <motion.div 
                      className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-t-sm border border-gray-200"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="flex-grow bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 border-l border-r border-gray-200"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-b-sm border border-gray-200"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                ))}
              </div>
              
              <motion.div 
                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg h-20"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Right column skeleton */}
        <div className="space-y-6">
          {/* Performance card skeleton */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
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
            </div>
            
            <div className="p-6">
              {/* Circular chart */}
              <div className="flex justify-center mb-6">
                <motion.div 
                  className="w-32 h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
              
              {/* Progress bars */}
              <div className="space-y-4 mb-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <motion.div 
                        className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-4 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                    <motion.div 
                      className="h-1.5 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                ))}
              </div>
              
              {/* Bottom link */}
              <div className="text-center">
                <motion.div 
                  className="h-4 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mx-auto"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
          </motion.div>

          {/* Training card skeleton */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <motion.div 
                  className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mr-2"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div 
                  className="h-6 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
            
            <div className="p-6">
              <motion.div 
                className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-4"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <motion.div 
                    key={i} 
                    className="border border-gray-100 rounded-lg p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <motion.div 
                        className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-5 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                    
                    <motion.div 
                      className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-3"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    
                    <div className="flex justify-between items-center mb-1">
                      <motion.div 
                        className="h-3 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-3 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                    <motion.div 
                      className="h-1.5 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-end items-center pt-4">
                <motion.div 
                  className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
          </motion.div>

          {/* Additional third card skeleton */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <motion.div 
                  className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mr-2"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div 
                  className="h-6 w-36 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <motion.div 
                    key={i} 
                    className="p-4 border border-gray-100 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1.1 + i * 0.1 }}
                  >
                    <motion.div 
                      className="h-5 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
