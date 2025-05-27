import { motion } from 'framer-motion';

export default function AdminPageSkeleton() {
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
    <div className="min-h-screen bg-gray-50">
      {/* Container with padding matching the real page */}
      <motion.div 
        className="container mx-auto p-4 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section Skeleton */}
        <motion.div 
          className="px-0 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
          >
            <motion.div 
              className="h-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-80 mb-6"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
            
            <motion.div 
              className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-96 mb-2"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
            <motion.div 
              className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-72"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
          </motion.div>
        </motion.div>

        {/* Tab Navigation Skeleton */}
        <motion.div 
          className="border-b border-gray-200 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex space-x-6 sm:space-x-8 pb-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <motion.div 
                key={index}
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <motion.div 
                  className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mr-2"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div 
                  className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Area Skeleton */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* User Management Panel Skeleton */}
          <motion.div 
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Panel Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center">
                <motion.div 
                  className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-10 h-10 mr-3"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <div>
                  <motion.div 
                    className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48 mb-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-64"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
              </div>
              
              <motion.div 
                className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-64"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>

            {/* Statistics Bar */}
            <motion.div
              className="bg-gray-50 rounded-lg p-3 mb-8 border border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <div className="flex items-center gap-6">
                <motion.div 
                  className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <div className="h-5 w-px bg-gray-300"></div>
                <motion.div 
                  className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-28"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <div className="h-5 w-px bg-gray-300"></div>
                <motion.div 
                  className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-36 ml-auto"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </motion.div>

            {/* User List Items - Show exactly 5 */}
            <div className="space-y-6 mb-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-xl shadow-sm px-5 py-7 border-2 border-gray-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-center">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mr-4"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <div className="flex-1 min-w-0">
                      <motion.div 
                        className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48 mb-2"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 mb-1"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-40"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-24"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-8"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-8"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls Skeleton */}
            <motion.div 
              className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.2 }}
            >
              <motion.div 
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <div className="flex items-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  ))}
                </div>
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Lead Management Panel Skeleton */}
          <motion.div 
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {/* Lead Management Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <motion.div 
                className="min-h-[48px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <motion.div 
                className="min-h-[48px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 rounded-lg p-3 mb-8 border border-gray-100">
              <div className="flex items-center text-sm">
                <motion.div 
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 mr-3"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <div className="w-px h-5 bg-gray-300 mx-3"></div>
                <motion.div 
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24 mr-3"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <div className="w-px h-5 bg-gray-300 mx-3"></div>
                <motion.div 
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>

            {/* Lead Assignment Items - Show exactly 5 */}
            <div className="space-y-6 mb-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-xl shadow-sm px-5 py-7 border-2 border-gray-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                >
                  <div className="flex items-center">
                    <motion.div 
                      className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mr-4"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mr-4"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <div className="flex-1 min-w-0">
                      <motion.div 
                        className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48 mb-2"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 mb-1"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-40"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                    <div className="text-right ml-6 flex-shrink-0">
                      <motion.div 
                        className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 mb-1"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls Skeleton */}
            <motion.div 
              className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.4 }}
            >
              <motion.div 
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <div className="flex items-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  ))}
                </div>
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
