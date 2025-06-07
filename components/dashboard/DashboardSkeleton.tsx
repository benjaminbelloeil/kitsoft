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
    <div className="animate-pulse min-h-screen bg-gray-50">
      {/* Header skeleton - render immediately */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="sticky top-0 z-30 w-full mb-6"
      >
        <div className="bg-white shadow-md border-b border-gray-100">
          <div className="flex h-16 items-center px-4 md:px-6 max-w-[1920px] mx-auto">
            {/* App logo placeholder - empty to match actual header */}
            <div className="flex items-center mr-4">
              <div className="hidden md:flex items-center">
                {/* Empty space - no logo in actual header */}
              </div>
            </div>
            
            {/* Extended search bar to match actual max-w-2xl */}
            <div className="flex-1 ml-auto md:mr-auto max-w-2xl relative">
              <motion.div 
                className="h-10 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>
            
            {/* Control icons - only notification bell now */}
            <div className="flex items-center space-x-3">
              <motion.div 
                className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
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
      
      {/* Greeting header skeleton - render immediately */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-[1920px] mx-auto mb-10 px-4"
      >
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {/* Content with decorative elements */}
          <div className="relative px-6 py-8">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-gray-100 to-transparent rounded-full -mt-48 -mr-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-gray-100 to-transparent rounded-full -mb-40 -ml-40"></div>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-gray-100 to-transparent rounded-full"></div>
            
            <div className="relative z-10">
              {/* Greeting section */}
              <motion.div 
                className="flex items-center mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <span className="mr-3 relative">
                  <div className="p-2 bg-gradient-to-br from-gray-100 to-white rounded-xl shadow-sm">
                    <motion.div 
                      className="h-6 w-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                  <span className="absolute top-0 right-0 h-2 w-2 bg-gray-300 rounded-full animate-pulse"></span>
                </span>
                <div>
                  <motion.div 
                    className="h-8 w-80 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                  />
                  <motion.div 
                    className="h-5 w-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                  />
                </div>
              </motion.div>
              
              {/* Date and time section */}
              <motion.div 
                className="flex flex-wrap items-center mt-4 gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <motion.div 
                  className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full shadow-sm border border-gray-100"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div 
                    className="h-4 w-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mr-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-4 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </motion.div>
                <div className="mx-2 text-gray-400 hidden sm:block">•</div>
                <motion.div 
                  className="bg-gray-50 px-3 py-1.5 rounded-full shadow-sm border border-gray-100"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div 
                    className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content skeleton - render immediately */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
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
                  className="h-6 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
            
            <div className="p-6 flex-grow flex flex-col">
              {/* Pentagon chart skeleton */}
              <div className="flex justify-center mb-6 flex-1">
                <div className="relative h-[260px] w-[260px]">
                  {/* Main pentagon shape */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                    style={{ 
                      backgroundSize: '200% 100%',
                      clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
                    }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  
                  {/* Skill labels around pentagon - matching PerformanceCard positioning */}
                  {[
                    { name: 'Comunicación', radius: 47 },
                    { name: 'Calidad', radius: 56 },
                    { name: 'Colaboración', radius: 58 }, // Increased from 52 to avoid overlap
                    { name: 'Cumplimiento', radius: 58 }, // Increased from 50 to avoid overlap
                    { name: 'General', radius: 56 }
                  ].map((skill, i) => {
                    const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
                    const x = 50 + skill.radius * Math.cos(angle);
                    const y = 50 + skill.radius * Math.sin(angle);
                    
                    return (
                      <motion.div
                        key={i}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                        }}
                      >
                        <motion.div 
                          className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded border border-gray-100"
                          style={{ 
                            backgroundSize: '200% 100%',
                            width: skill.name === 'Comunicación' ? '60px' : '50px',
                            minWidth: skill.name === 'Comunicación' ? '60px' : '50px'
                          }}
                          animate={shimmer.animate}
                          transition={shimmer.transition}
                        />
                      </motion.div>
                    );
                  })}
                  
                  {/* Center score circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full shadow-lg"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                </div>
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
      
      {/* Add Note Card skeleton - Bottom placement */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="max-w-[1920px] mx-auto px-4 md:px-6 mt-6 mb-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
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
            {/* Empty state */}
            <div className="text-center py-8">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mx-auto mb-4"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <motion.div 
                className="h-6 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mx-auto mb-2"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <motion.div 
                className="h-4 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mx-auto mb-6"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              
              {/* Create note button */}
              <motion.div 
                className="h-10 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mx-auto"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
