"use client";

import { motion } from 'framer-motion';

export default function PeopleLeadSkeleton() {
  // Define shimmer animation that's consistent across all skeleton components
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
  
  // Define consistent animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2 + (custom * 0.1),
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    })
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Skeleton */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, delay: 0.1 }
          }
        }}
        initial="hidden"
        animate="visible"
        className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6 lg:px-8 mb-8"
      >
        <motion.div 
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex items-center">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mr-4"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <div>
                <motion.div 
                  className="h-8 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div 
                  className="h-4 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
            
            {/* Search bar skeleton */}
            <div className="flex-1 max-w-md">
              <motion.div 
                className="h-10 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>
          </div>
          
          {/* Statistics skeleton - made smaller */}
          <motion.div 
            className="mt-6 grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 p-3 rounded-lg"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            >
              <div className="flex items-center justify-between">
                <div>
                  <motion.div 
                    className="h-3 w-20 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded mb-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-5 w-10 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                <motion.div 
                  className="w-6 h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 p-3 rounded-lg"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            >
              <div className="flex items-center justify-between">
                <div>
                  <motion.div 
                    className="h-3 w-20 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded mb-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-5 w-10 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                <motion.div 
                  className="w-6 h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Users Grid Skeleton */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { 
              when: "beforeChildren",
              staggerChildren: 0.15
            }
          }
        }}
        initial="hidden"
        animate="visible"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              custom={index}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
              whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            >
              <div className="flex items-start space-x-4">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <div className="flex-1">
                  <motion.div 
                    className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
              </div>
              
              {/* Contact info skeleton */}
              <motion.div 
                className="mt-4 space-y-3"
                variants={{
                  hidden: { opacity: 0, y: 5 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.4, 
                      delay: 0.2,
                      staggerChildren: 0.08
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center space-x-2"
                    variants={{
                      hidden: { opacity: 0, y: 5 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <motion.div 
                      className="w-4 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded flex-1"
                      style={{ backgroundSize: '200% 100%', width: i === 0 ? '60%' : i === 1 ? '40%' : '50%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div 
                className="mt-4 pt-4 border-t border-gray-100"
                variants={{
                  hidden: { opacity: 0, y: 5 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.3, delay: 0.4 }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="h-8 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}