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
      className="min-h-screen bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Skeleton */}
      <motion.div
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3 animate-pulse">
              <div className="w-8 h-8 bg-purple-200 rounded"></div>
            </div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Stats Bar Skeleton */}
        <motion.div
          className="bg-gray-50 rounded-lg p-3 mb-6 border border-gray-100 animate-pulse"
          variants={itemVariants}
        >
          <div className="flex items-center gap-6">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="h-5 w-px bg-gray-300"></div>
            <div className="h-5 bg-gray-200 rounded w-28"></div>
            <div className="h-5 w-px bg-gray-300"></div>
            <div className="h-5 bg-gray-200 rounded w-36 ml-auto"></div>
          </div>
        </motion.div>

        {/* User List Skeleton */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 animate-pulse"
              variants={itemVariants}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center">
                {/* Avatar skeleton */}
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                </div>

                {/* User info skeleton */}
                <div className="ml-4 flex-1">
                  <div className="flex items-baseline mb-2">
                    <div className="h-5 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-40 mt-1"></div>
                </div>

                {/* Actions skeleton */}
                <div className="ml-4 flex items-center space-x-3">
                  <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pulse animation overlay for extra visual feedback */}
        <motion.div
          className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 z-50"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    </motion.div>
  );
}
