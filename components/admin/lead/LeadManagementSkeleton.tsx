"use client";

import { motion } from "framer-motion";

export default function LeadManagementSkeleton() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="animate-pulse"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Controls Skeleton - Updated to match larger buttons */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        variants={itemVariants}
      >
        <div className="min-h-[48px] bg-gray-200 rounded-lg"></div>
        <div className="min-h-[48px] bg-gray-200 rounded-lg"></div>
      </motion.div>

      {/* Statistics Skeleton */}
      <motion.div
        className="bg-gray-50 rounded-lg p-3 mb-8 border border-gray-100"
        variants={itemVariants}
      >
        <div className="flex items-center text-sm">
          <div className="flex gap-1 items-center mr-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="w-px h-5 bg-gray-300 mx-3"></div>
          <div className="flex gap-1 items-center mr-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="w-px h-5 bg-gray-300 mx-3"></div>
          <div className="flex gap-1 items-center">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </motion.div>

      {/* Users List Skeleton - Show exactly 5 items with proper spacing */}
      <motion.div
        className="space-y-6"
        variants={containerVariants}
      >
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl shadow-sm px-5 py-7 border-2 border-gray-100 animate-pulse"
              variants={itemVariants}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center">
                {/* Checkbox skeleton - Updated to be more subtle */}
                <div className="w-5 h-5 bg-gray-200 rounded mr-4"></div>
                
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
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>

                {/* Status info skeleton */}
                <div className="text-right ml-6 flex-shrink-0">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="flex items-center justify-end space-x-1">
                    <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
    </motion.div>
  );
}
