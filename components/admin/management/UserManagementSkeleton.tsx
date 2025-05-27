"use client";

import { motion } from "framer-motion";

export default function UserManagementSkeleton() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="space-y-6 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* User List Skeleton - Show exactly 5 items */}
      <div className="pr-3 py-2 relative" style={{ isolation: 'isolate' }}>
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl shadow-sm px-5 py-7 border-2 border-gray-100 animate-pulse"
              variants={itemVariants}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center">
                {/* Avatar skeleton */}
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                </div>

                {/* User info skeleton */}
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-baseline mb-2">
                    <div className="h-5 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-40 mt-1"></div>
                </div>

                {/* Actions skeleton - Keep horizontal layout */}
                <div className="ml-6 flex items-center space-x-3">
                  <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pagination Controls Skeleton */}
      <motion.div 
        className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-100 animate-pulse"
        variants={itemVariants}
      >
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        
        <div className="flex items-center space-x-2">
          {/* Previous button */}
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          
          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          
          {/* Next button */}
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>
      </motion.div>
    </motion.div>
  );
}
