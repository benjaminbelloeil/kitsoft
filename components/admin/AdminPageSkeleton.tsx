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
            <div className="flex items-center mb-6">
              <motion.div 
                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-10 h-10 mr-3"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <motion.div 
                className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>

            {/* Search and Filters */}
            <motion.div 
              className="mb-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <motion.div 
                className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-full max-w-md"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <motion.div 
                    key={index}
                    className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                ))}
              </div>
            </motion.div>

            {/* User List Items */}
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center p-4 border border-gray-200 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                >
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mr-4"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <div className="flex-1">
                    <motion.div 
                      className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 mb-2"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                  <div className="flex gap-2">
                    <motion.div 
                      className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-8"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Settings Panel Skeleton */}
          <motion.div 
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <motion.div 
                  className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-10 h-10 mr-3"
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
                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-64"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
              </div>
              <motion.div 
                className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-28"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>

            {/* Statistics Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <motion.div 
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                >
                  <div className="flex items-center">
                    <motion.div 
                      className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mr-3"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <div>
                      <motion.div 
                        className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-12 mb-1"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Lead List Skeleton */}
            <div className="bg-gray-50 rounded-lg p-4">
              <motion.div 
                className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 mb-4"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white p-4 border border-gray-200 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <motion.div 
                            className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-40 mr-3"
                            style={{ backgroundSize: '200% 100%' }}
                            animate={shimmer.animate}
                            transition={shimmer.transition}
                          />
                          <motion.div 
                            className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16 mr-2"
                            style={{ backgroundSize: '200% 100%' }}
                            animate={shimmer.animate}
                            transition={shimmer.transition}
                          />
                          <motion.div 
                            className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-12"
                            style={{ backgroundSize: '200% 100%' }}
                            animate={shimmer.animate}
                            transition={shimmer.transition}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <motion.div 
                              key={i}
                              className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32"
                              style={{ backgroundSize: '200% 100%' }}
                              animate={shimmer.animate}
                              transition={shimmer.transition}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16"
                          style={{ backgroundSize: '200% 100%' }}
                          animate={shimmer.animate}
                          transition={shimmer.transition}
                        />
                        <motion.div 
                          className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24"
                          style={{ backgroundSize: '200% 100%' }}
                          animate={shimmer.animate}
                          transition={shimmer.transition}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Admin Dashboard Skeleton */}
          <motion.div 
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <div className="flex items-center mb-6">
              <motion.div 
                className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-10 h-10 mr-3"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <motion.div 
                className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-56"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                className="p-6 border border-gray-200 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.1 }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mr-3"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                <motion.div 
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </motion.div>

              <motion.div 
                className="p-6 border border-gray-200 rounded-xl bg-gray-50"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.2 }}
              >
                <motion.div 
                  className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48 mx-auto"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
