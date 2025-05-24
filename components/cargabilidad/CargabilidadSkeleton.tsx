import React from 'react';
import { motion } from 'framer-motion';

export default function CargabilidadSkeleton() {
  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      
      {/* Header skeleton */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div 
          className="bg-white rounded-xl shadow-md border border-gray-100 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-6 justify-between">
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="h-12 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mr-4" style={shimmer}></div>
                <div>
                  <div className="h-7 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2" style={shimmer}></div>
                  <div className="h-4 w-80 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center gap-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                <div className="h-20 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full" style={shimmer}></div>
              </motion.div>
            </div>
          </div>
          
          {/* Weekly distribution skeleton */}
          <motion.div 
            className="p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full" style={shimmer}></div>
                  <div className="h-5 w-36 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                </div>
                <div className="h-5 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
              </div>
              
              <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mb-4" style={shimmer}></div>
              
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full" 
                    style={shimmer}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs skeleton */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex px-4 pt-4 gap-2 border-b border-gray-200">
            <motion.div 
              className="h-10 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-t-lg" 
              style={shimmer}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            />
            <motion.div 
              className="h-10 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-t-lg" 
              style={shimmer}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.65 }}
            />
          </div>

          <div className="p-6">
            {/* Dashboard tab skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <div className="h-6 w-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md" style={shimmer}></div>
                    <div className="h-5 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                  </div>

                  {index % 2 === 0 ? (
                    /* Chart-like skeleton */
                    <div className="h-40 flex items-end gap-1">
                      {[...Array(7)].map((_, i) => (
                        <motion.div 
                          key={i}
                          className="flex-1 flex flex-col items-center"
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          transition={{ duration: 0.3, delay: 0.8 + index * 0.1 + i * 0.05 }}
                        >
                          <div className={`w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-t-sm h-[${[30, 40, 60, 50, 70, 45, 35][i]}%]`} style={shimmer}></div>
                          <div className="h-3 w-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mt-2" style={shimmer}></div>
                        </motion.div>
                      ))}
                    </div>
                  ) : index === 1 ? (
                    /* Progress bars skeleton */
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <motion.div 
                          key={i} 
                          className="space-y-1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.8 + index * 0.1 + i * 0.05 }}
                        >
                          <div className="flex justify-between">
                            <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                            <div className="h-4 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                          </div>
                          <div className="h-2 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full" style={shimmer}></div>
                        </motion.div>
                      ))}
                    </div>
                  ) : index === 2 ? (
                    /* Circle progress skeleton */
                    <motion.div 
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    >
                      <div className="h-32 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mb-4" style={shimmer}></div>
                      <div className="h-6 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2" style={shimmer}></div>
                      <div className="h-4 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                    </motion.div>
                  ) : (
                    /* Timeline-like skeleton */
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <motion.div 
                          key={i} 
                          className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.8 + index * 0.1 + i * 0.05 }}
                        >
                          <div>
                            <div className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-2" style={shimmer}></div>
                            <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                          </div>
                          <div className="h-5 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full" style={shimmer}></div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
