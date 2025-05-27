/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from 'framer-motion';

export default function PeopleLeadSkeleton() {
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
              <div className="w-14 h-14 bg-gray-200 rounded-xl mr-4 animate-pulse"></div>
              <div>
                <div className="h-8 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center min-w-[100px]">
                <div className="h-4 w-12 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center min-w-[100px]">
                <div className="h-4 w-12 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="h-10 w-80 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </motion.div>

      {/* Users Grid Skeleton */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}