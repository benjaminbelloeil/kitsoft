'use client';

import { motion } from 'framer-motion';

export default function NotesSkeleton() {
  const shimmer = {
    hidden: { opacity: 0.4 },
    visible: { opacity: 0.8 },
  };

  const shimmerTransition = {
    duration: 1.2,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut"
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Header Skeleton - Matching NotesHeader layout */}
      <motion.div 
        className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6 lg:px-8 mb-2"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div 
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
          variants={fadeInUp}
        >
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex items-center">
              <motion.div 
                className="bg-gray-200 p-3 rounded-lg mr-4 shadow-sm border border-gray-200"
                variants={shimmer}
                initial="hidden"
                animate="visible"
                transition={shimmerTransition}
              >
                <div className="h-6 w-6 bg-gray-400 rounded"></div>
              </motion.div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <motion.div 
                    className="h-8 w-32 bg-gray-300 rounded"
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    transition={shimmerTransition}
                  />
                  <div className="flex gap-2">
                    <motion.div 
                      className="h-6 w-16 bg-gray-300 rounded-full"
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      transition={{ ...shimmerTransition, delay: 0.1 }}
                    />
                    <motion.div 
                      className="h-6 w-20 bg-gray-300 rounded-full"
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      transition={{ ...shimmerTransition, delay: 0.2 }}
                    />
                  </div>
                </div>
                <motion.div 
                  className="h-4 w-96 bg-gray-300 rounded mt-2"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  transition={{ ...shimmerTransition, delay: 0.3 }}
                />
              </div>
            </div>
            
            {/* Search bar skeleton */}
            <motion.div 
              className="flex items-center gap-4"
              variants={fadeInUp}
            >
              <motion.div 
                className="h-12 w-80 bg-gray-300 rounded-lg"
                variants={shimmer}
                initial="hidden"
                animate="visible"
                transition={{ ...shimmerTransition, delay: 0.4 }}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Container */}
      <motion.div 
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-210px)] pt-0 pb-2"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full"
          variants={fadeInUp}
        >
          <div className="flex h-full">
            
            {/* Left Sidebar Skeleton */}
            <motion.div 
              className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col"
              variants={fadeInUp}
            >
              
              {/* Categories Section */}
              <div className="p-4 border-b border-gray-200 flex-1 overflow-y-auto">
                {/* Categories Header */}
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="bg-gray-200 p-2 rounded-lg shadow-sm border border-gray-200"
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      transition={shimmerTransition}
                    >
                      <div className="h-4 w-4 bg-gray-400 rounded"></div>
                    </motion.div>
                    <motion.div 
                      className="h-5 w-24 bg-gray-300 rounded"
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      transition={{ ...shimmerTransition, delay: 0.1 }}
                    />
                  </div>
                </div>
                
                {/* Separator line */}
                <div className="border-b border-gray-200 mb-4"></div>
                
                {/* Categories List */}
                <motion.div 
                  className="space-y-1"
                  variants={staggerContainer}
                >
                  {[...Array(6)].map((_, categoryIndex) => (
                    <motion.div 
                      key={categoryIndex}
                      variants={fadeInUp}
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between px-3 py-2.5 rounded-md bg-gray-100">
                        <div className="flex items-center gap-3">
                          {categoryIndex !== 0 && (
                            <motion.div 
                              className="h-4 w-4 bg-gray-300 rounded"
                              variants={shimmer}
                              initial="hidden"
                              animate="visible"
                              transition={{ ...shimmerTransition, delay: categoryIndex * 0.1 }}
                            />
                          )}
                          <motion.div 
                            className="h-5 w-5 bg-gray-300 rounded"
                            variants={shimmer}
                            initial="hidden"
                            animate="visible"
                            transition={{ ...shimmerTransition, delay: categoryIndex * 0.1 + 0.05 }}
                          />
                          <motion.div 
                            className="h-4 w-20 bg-gray-300 rounded"
                            variants={shimmer}
                            initial="hidden"
                            animate="visible"
                            transition={{ ...shimmerTransition, delay: categoryIndex * 0.1 + 0.1 }}
                          />
                        </div>
                        <motion.div 
                          className="h-5 w-6 bg-gray-300 rounded-full"
                          variants={shimmer}
                          initial="hidden"
                          animate="visible"
                          transition={{ ...shimmerTransition, delay: categoryIndex * 0.1 + 0.15 }}
                        />
                      </div>

                      {/* Notes List for expanded categories */}
                      {categoryIndex < 2 && (
                        <div className="ml-6 mt-1 space-y-1 mb-3">
                          {[...Array(2)].map((_, noteIndex) => (
                            <motion.div 
                              key={noteIndex}
                              className="p-3 rounded-lg bg-white border border-gray-200"
                              variants={fadeInUp}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <motion.div 
                                  className="h-4 w-32 bg-gray-300 rounded"
                                  variants={shimmer}
                                  initial="hidden"
                                  animate="visible"
                                  transition={{ ...shimmerTransition, delay: (categoryIndex * 2 + noteIndex) * 0.1 }}
                                />
                                <motion.div 
                                  className="h-3 w-3 bg-gray-300 rounded"
                                  variants={shimmer}
                                  initial="hidden"
                                  animate="visible"
                                  transition={{ ...shimmerTransition, delay: (categoryIndex * 2 + noteIndex) * 0.1 + 0.05 }}
                                />
                              </div>
                              
                              <div className="space-y-1 mb-2">
                                <motion.div 
                                  className="h-3 w-full bg-gray-300 rounded"
                                  variants={shimmer}
                                  initial="hidden"
                                  animate="visible"
                                  transition={{ ...shimmerTransition, delay: (categoryIndex * 2 + noteIndex) * 0.1 + 0.1 }}
                                />
                                <motion.div 
                                  className="h-3 w-3/4 bg-gray-300 rounded"
                                  variants={shimmer}
                                  initial="hidden"
                                  animate="visible"
                                  transition={{ ...shimmerTransition, delay: (categoryIndex * 2 + noteIndex) * 0.1 + 0.15 }}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <motion.div 
                                  className="h-3 w-12 bg-gray-300 rounded-full"
                                  variants={shimmer}
                                  initial="hidden"
                                  animate="visible"
                                  transition={{ ...shimmerTransition, delay: (categoryIndex * 2 + noteIndex) * 0.1 + 0.2 }}
                                />
                                <motion.div 
                                  className="h-3 w-16 bg-gray-300 rounded"
                                  variants={shimmer}
                                  initial="hidden"
                                  animate="visible"
                                  transition={{ ...shimmerTransition, delay: (categoryIndex * 2 + noteIndex) * 0.1 + 0.25 }}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Right Main Content Skeleton */}
            <motion.div 
              className="flex-1 bg-white flex flex-col"
              variants={fadeInUp}
            >
              {/* Note Editor Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-sm">
                    <motion.div 
                      className="h-6 w-24 bg-gray-300 rounded-lg"
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      transition={shimmerTransition}
                    />
                    <motion.div 
                      className="h-6 w-20 bg-gray-300 rounded-lg"
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      transition={{ ...shimmerTransition, delay: 0.1 }}
                    />
                    <motion.div 
                      className="h-6 w-24 bg-gray-300 rounded-lg"
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      transition={{ ...shimmerTransition, delay: 0.2 }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="h-8 w-8 bg-gray-300 rounded"
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      transition={{ ...shimmerTransition, delay: 0.3 }}
                    />
                    <motion.div 
                      className="h-8 w-8 bg-gray-300 rounded"
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      transition={{ ...shimmerTransition, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>

              {/* Note Content Area */}
              <div className="flex-1 p-6">
                <motion.div 
                  className="space-y-4"
                  variants={staggerContainer}
                >
                  {/* Title */}
                  <motion.div 
                    className="h-8 w-1/2 bg-gray-300 rounded"
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    transition={{ ...shimmerTransition, delay: 0.3 }}
                  />
                  
                  {/* Content lines */}
                  <div className="space-y-3 mt-8">
                    {Array.from({ length: 8 }, (_, i) => (
                      <motion.div 
                        key={i} 
                        className={`h-4 bg-gray-300 rounded ${
                          i === 7 ? 'w-2/3' : i === 5 ? 'w-4/5' : 'w-full'
                        }`}
                        variants={shimmer}
                        initial="hidden"
                        animate="visible"
                        transition={{ ...shimmerTransition, delay: 0.4 + i * 0.1 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
