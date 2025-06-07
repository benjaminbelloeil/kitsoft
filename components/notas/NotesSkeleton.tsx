'use client';

import { motion } from 'framer-motion';

export default function NotesSkeleton() {
  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02
      }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="h-screen bg-gray-50 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      {/* Header Skeleton */}
      <motion.div 
        className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8 mb-2"
        variants={fadeInUp}
      >
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
          <div>
            <div className="flex flex-col md:flex-row gap-8 justify-between">
              <div className="flex items-center">
                {/* Icon placeholder */}
                <motion.div 
                  className="h-14 w-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mr-5"
                  style={shimmer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.02 }}
                />
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {/* Title */}
                    <motion.div 
                      className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-36"
                      style={shimmer}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: 0.04 }}
                    />
                    {/* Badge placeholders */}
                    <div className="flex gap-2">
                      <motion.div 
                        className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-16"
                        style={shimmer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15, delay: 0.06 }}
                      />
                      <motion.div 
                        className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-16"
                        style={shimmer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15, delay: 0.08 }}
                      />
                    </div>
                  </div>
                  {/* Description */}
                  <motion.div 
                    className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mt-3 w-96"
                    style={shimmer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-210px)] pt-0 pb-2"
        variants={fadeInUp}
        transition={{ delay: 0.05 }}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
          <div className="flex h-full">
            
            {/* Left Sidebar */}
            <motion.div 
              className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col"
              variants={slideInLeft}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 border-b border-gray-200 flex-1 overflow-y-auto">
                
                {/* Categories Header */}
                <div className="flex items-center gap-3 mb-4 px-2">
                  <motion.div 
                    className="h-8 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                    style={shimmer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.12 }}
                  />
                  <motion.div 
                    className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24"
                    style={shimmer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.14 }}
                  />
                </div>

                <div className="border-b border-gray-200 mb-4"></div>
                
                {/* Category Items - All Closed */}
                <motion.div 
                  className="space-y-1"
                  variants={staggerContainer}
                >
                  {Array.from({ length: 6 }, (_, i) => (
                    <motion.div 
                      key={i} 
                      className="mb-1"
                      variants={fadeInUp}
                      transition={{ delay: i * 0.02 }}
                    >
                      {/* Category Header with border-l-4 style */}
                      <motion.div 
                        className="flex items-center justify-between px-3 py-2.5 rounded-md border-l-4 border-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15, delay: 0.16 + i * 0.02 }}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {/* Chevron for expandable categories (skip first one - "Todas") */}
                          {i !== 0 && (
                            <div className="w-5 h-5 flex items-center justify-center">
                              <div 
                                className="h-4 w-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                                style={shimmer}
                              ></div>
                            </div>
                          )}
                          <div 
                            className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                            style={shimmer}
                          ></div>
                          <div 
                            className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"
                            style={shimmer}
                          ></div>
                        </div>
                        <div 
                          className="h-5 w-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                          style={shimmer}
                        ></div>
                      </motion.div>

                      {/* No expanded notes - all categories closed */}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Right Main Content - New Note Creation Interface */}
            <motion.div 
              className="flex-1 bg-white"
              variants={slideInRight}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <div className="h-full flex flex-col">
                
                {/* New Note Toolbar */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    {/* Category and Priority Dropdowns */}
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-32"
                        style={shimmer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15, delay: 0.28 }}
                      />
                      <motion.div 
                        className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-24"
                        style={shimmer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15, delay: 0.3 }}
                      />
                      <motion.div 
                        className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
                        style={shimmer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15, delay: 0.32 }}
                      />
                    </div>
                    
                    {/* Save button */}
                    <motion.div 
                      className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-20"
                      style={shimmer}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: 0.34 }}
                    />
                  </div>
                </div>
                
                {/* Note Content Area */}
                <div className="flex-1 flex flex-col bg-white">
                  {/* Title */}
                  <div className="p-6 pb-3">
                    <motion.div 
                      className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"
                      style={shimmer}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: 0.36 }}
                    />
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 mx-6"></div>
                  
                  {/* Content lines */}
                  <div className="flex-1 p-6 pt-3">
                    <motion.div 
                      className="space-y-3"
                      variants={staggerContainer}
                    >
                      {Array.from({ length: 8 }, (_, i) => (
                        <motion.div 
                          key={i} 
                          className={`h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${
                            i === 7 ? 'w-2/3' : i === 5 ? 'w-4/5' : 'w-full'
                          }`}
                          style={shimmer}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15, delay: 0.38 + i * 0.01 }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
