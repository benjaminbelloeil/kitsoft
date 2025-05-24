import { motion } from 'framer-motion';

export default function FeedbackSkeleton() {
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
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex items-center">
              <motion.div 
                className="h-14 w-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mr-4"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <div>
                <motion.div 
                  className="h-8 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-3"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div 
                  className="h-4 w-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
            <motion.div 
              className="h-16 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
          </div>
        </motion.div>
      
        {/* Stats row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.div 
              key={i} 
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
            >
              <div className="flex justify-between items-center mb-1.5">
                <motion.div 
                  className="h-8 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div 
                  className="h-3 w-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
              <motion.div 
                className="h-6 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-1"
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
            </motion.div>
          ))}
        </motion.div>
        
        {/* Two column layout for form and chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4"
        >
          {/* Form column - more compact */}
          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[460px]">
              <div className="p-3 border-b border-gray-100 flex items-center gap-2">
                <motion.div 
                  className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
                <motion.div 
                  className="h-5 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
              
              <div className="p-3 space-y-3">
                <div>
                  <motion.div 
                    className="h-3 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-1.5"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div 
                        key={i}
                        className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <motion.div 
                      className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-1.5"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-20 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                  <div>
                    <motion.div 
                      className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-1.5"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-20 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                </div>
                
                <div>
                  <motion.div 
                    className="h-3 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-1.5"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-24 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                
                <motion.div 
                  className="h-10 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
            </div>
          </motion.div>
          
          {/* Chart column - same height */}
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[460px]">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-5 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                <motion.div 
                  className="h-5 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
              
              <div className="flex items-center justify-center py-4 px-4 h-[374px]">
                <motion.div 
                  className="h-64 w-64 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </div>
              
              <div className="border-t border-gray-100 p-2">
                <div className="flex justify-between items-center">
                  <motion.div 
                    className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <div className="flex gap-1">
                    <motion.div 
                      className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Feedback list - more compact */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <motion.div 
                className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
              <motion.div 
                className="h-5 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmer.animate}
                transition={shimmer.transition}
              />
            </div>
            <motion.div 
              className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i} 
                className="p-2.5 rounded-lg border border-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center">
                    <motion.div 
                      className="h-8 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <div className="ml-2">
                      <motion.div 
                        className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-1"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                      <motion.div 
                        className="h-2 w-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                        style={{ backgroundSize: '200% 100%' }}
                        animate={shimmer.animate}
                        transition={shimmer.transition}
                      />
                    </div>
                  </div>
                  <motion.div 
                    className="h-5 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                
                <div className="flex gap-1 mb-1.5">
                  <motion.div 
                    className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                  <motion.div 
                    className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmer.animate}
                    transition={shimmer.transition}
                  />
                </div>
                
                <motion.div 
                  className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={shimmer.animate}
                  transition={shimmer.transition}
                />
              </motion.div>
            ))}
          </div>
          
          <div className="p-2.5 border-t border-gray-100 bg-gray-50 flex justify-center">
            <motion.div 
              className="h-6 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmer.animate}
              transition={shimmer.transition}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}