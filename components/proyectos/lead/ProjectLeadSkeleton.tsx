import { motion } from 'framer-motion';

export default function ProjectLeadSkeleton() {
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
              </div>
              <motion.div 
                className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-64"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Side by Side Layout - Matching actual page structure */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
          {/* Project Management Section Skeleton - Left Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mr-4"
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

              {/* Projects List */}
              <div className="p-4">
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="p-3">
                        {/* Project header */}
                        <div className="flex items-center justify-between mb-3">
                          <motion.div 
                            className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-48"
                            style={{ backgroundSize: '200% 100%' }}
                            animate={shimmer.animate}
                            transition={shimmer.transition}
                          />
                          <div className="flex items-center space-x-3">
                            <motion.div 
                              className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16"
                              style={{ backgroundSize: '200% 100%' }}
                              animate={shimmer.animate}
                              transition={shimmer.transition}
                            />
                            <motion.div 
                              className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"
                              style={{ backgroundSize: '200% 100%' }}
                              animate={shimmer.animate}
                              transition={shimmer.transition}
                            />
                          </div>
                        </div>

                        {/* Progress bar */}
                        <motion.div 
                          className="w-full bg-gray-200 rounded-full h-3 mb-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <motion.div 
                            className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-3 rounded-full"
                            style={{ backgroundSize: '200% 100%', width: `${Math.random() * 60 + 20}%` }}
                            animate={shimmer.animate}
                            transition={shimmer.transition}
                          />
                        </motion.div>

                        {/* Progress text */}
                        <div className="flex justify-between items-center text-xs mb-2">
                          <motion.div 
                            className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24"
                            style={{ backgroundSize: '200% 100%' }}
                            animate={shimmer.animate}
                            transition={shimmer.transition}
                          />
                          <motion.div 
                            className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"
                            style={{ backgroundSize: '200% 100%' }}
                            animate={shimmer.animate}
                            transition={shimmer.transition}
                          />
                        </div>

                        {/* Action button */}
                        <div className="flex justify-end">
                          <motion.div 
                            className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md w-28"
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
            </div>
          </motion.div>

          {/* Feedback Form Section Skeleton - Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mr-4"
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
              </div>

              {/* Form Content */}
              <div className="p-6 flex flex-col h-full">
                {/* Form fields */}
                <div className="space-y-4">
                  {/* Project selector */}
                  <div>
                    <motion.div 
                      className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 mb-2"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md w-full"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>

                  {/* Recipient selector */}
                  <div>
                    <motion.div 
                      className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-36 mb-2"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <div className="bg-gray-50 rounded-md border border-gray-200 p-3">
                      <div className="space-y-1.5">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <motion.div 
                            key={i}
                            className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"
                            style={{ backgroundSize: '200% 100%' }}
                            animate={shimmer.animate}
                            transition={{ ...shimmer.transition, delay: i * 0.1 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rating and Category */}
                  <div className="grid grid-cols-1 gap-4">
                    {/* Rating */}
                    <div>
                      <motion.div 
                        className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 mb-2"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-[80px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md w-full"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <motion.div 
                        className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24 mb-2"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-[100px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md w-full"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                  </div>

                  {/* Message area */}
                  <div className="flex-1">
                    <motion.div 
                      className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16 mb-2"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-[120px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md w-full"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>

                  {/* Submit button */}
                  <motion.div 
                    className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md w-full"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}