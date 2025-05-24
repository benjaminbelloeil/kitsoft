import { motion } from 'framer-motion';

export default function ProjectManagerSkeleton() {
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
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6 lg:px-8 mb-8"
      >
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex items-center">
              <motion.div 
                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 w-12 h-12 rounded-lg mr-4"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <div>
                <motion.div 
                  className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-56 mb-2"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div 
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-72"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <motion.div
                  className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div
                  className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div
                  className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
              <div className="flex">
                <motion.div
                  className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-64"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two-Column Layout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Project Form Card Skeleton */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 h-full">
              {/* Form Header */}
              <div className="flex items-center mb-6">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mr-4"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <div>
                  <motion.div 
                    className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-40 mb-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-56"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div>
                  <motion.div 
                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 mb-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                <div>
                  <motion.div 
                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24 mb-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                <div>
                  <motion.div 
                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-28 mb-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <motion.div 
                      className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-28 mb-2"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                  <div>
                    <motion.div 
                      className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24 mb-2"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                </div>
                <div>
                  <motion.div 
                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 mb-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                
                {/* Form Buttons */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <motion.div 
                    className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Project List Skeleton */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-full">
              {/* List Header */}
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center mb-0">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mr-4"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <div>
                    <motion.div 
                      className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-40 mb-2"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-56"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                </div>
              </div>
              
              {/* Table Header */}
              <div className="bg-white sticky top-0 z-10 shadow-sm">
                <div className="grid grid-cols-7 px-6 py-3.5 gap-4">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <motion.div 
                      key={index}
                      className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  ))}
                </div>
              </div>
              
              {/* Project Rows */}
              <div className="overflow-y-auto flex-grow">
                {Array.from({ length: 5 }).map((_, index) => (
                  <motion.div 
                    key={index} 
                    className="border-b border-gray-100 px-6 py-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="grid grid-cols-7 gap-4">
                      <motion.div 
                        className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <div className="flex items-center justify-center">
                        <motion.div 
                          className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-16"
                          style={{ backgroundSize: '200% 100%' }}
                          animate={shimmer.animate}
                          transition={shimmer.transition}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <motion.div 
                          className="h-8 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                          style={{ backgroundSize: '200% 100%' }}
                          animate={shimmer.animate}
                          transition={shimmer.transition}
                        />
                        <motion.div 
                          className="h-8 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                          style={{ backgroundSize: '200% 100%' }}
                          animate={shimmer.animate}
                          transition={shimmer.transition}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Scroll indicator */}
              <div className="bg-gradient-to-b from-transparent to-gray-100 h-4 w-full opacity-50"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
