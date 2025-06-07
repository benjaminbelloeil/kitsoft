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

  // Loading pulse animation
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
  };

  const pulseTransition = {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
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

        {/* Main content area - two column layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4"
        >
          {/* Feedback list column (7 cols) */}
          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
              <div className="p-4 border-b border-gray-100 bg-white flex items-center">
                <div className="flex items-center">
                  <motion.div 
                    className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={{
                      ...shimmer.animate,
                      ...pulseAnimation
                    }}
                    transition={pulseTransition}
                  />
                  <div>
                    <motion.div 
                      className="h-5 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-1"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-3 w-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                {/* Feedback cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 flex-1 min-h-[400px]">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i} 
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: pulseAnimation.scale 
                      }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.5 + i * 0.1,
                        scale: {
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.2
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <motion.div 
                            className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                            style={{ backgroundSize: '200% 100%' }}
                            animate={shimmer.animate}
                            transition={shimmer.transition}
                          />
                          <div className="ml-3">
                            <motion.div 
                              className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-1"
                              style={{ backgroundSize: '200% 100%' }}
                              animate={shimmer.animate}
                              transition={shimmer.transition}
                            />
                            <motion.div 
                              className="h-3 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                              style={{ backgroundSize: '200% 100%' }}
                              animate={shimmer.animate}
                              transition={shimmer.transition}
                            />
                          </div>
                        </div>
                        <motion.div 
                          className="h-6 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
                          style={{ backgroundSize: '200% 100%' }}
                          animate={shimmer.animate}
                          transition={shimmer.transition}
                        />
                      </div>
                      
                      <div className="flex gap-2 mb-3">
                        <motion.div 
                          className="h-5 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                          style={{ backgroundSize: '200% 100%' }}
                          animate={shimmer.animate}
                          transition={shimmer.transition}
                        />
                        <motion.div 
                          className="h-5 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
                          style={{ backgroundSize: '200% 100%' }}
                          animate={shimmer.animate}
                          transition={shimmer.transition}
                        />
                      </div>
                      
                      <motion.div 
                        className="h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md mb-3"
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
                </div>
              </div>
              
              {/* Footer with pagination */}
              <div className="p-3 border-t border-gray-100 bg-white flex justify-center">
                <motion.div 
                  className="h-8 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={{
                    ...shimmer.animate,
                    ...pulseAnimation
                  }}
                  transition={pulseTransition}
                />
              </div>
            </div>
          </motion.div>
          
          {/* Competency chart column (5 cols) */}
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
              <div className="p-4 border-b border-gray-100 bg-white flex items-center">
                <div className="flex items-center">
                  <motion.div 
                    className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={{
                      ...shimmer.animate,
                      ...pulseAnimation
                    }}
                    transition={pulseTransition}
                  />
                  <div>
                    <motion.div 
                      className="h-5 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-1"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-3 w-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                {/* Pentagon chart area */}
                <div className="flex items-center justify-center flex-1 min-h-[300px]">
                  <motion.div 
                    className="h-64 w-64 relative"
                    animate={{
                      scale: pulseAnimation.scale
                    }}
                    transition={pulseTransition}
                  >
                    {/* Pentagon shape using clip-path */}
                    <motion.div 
                      className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                      style={{ 
                        backgroundSize: '200% 100%',
                        clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
                      }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    
                    {/* Pentagon grid lines skeleton */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[...Array(5)].map((_, i) => (
                        <motion.div 
                          key={i}
                          className="absolute w-32 h-32 border-2 border-gray-300"
                          style={{ 
                            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                            transform: `scale(${0.2 + i * 0.2})`,
                            opacity: 0.3 + i * 0.1
                          }}
                          animate={{
                            opacity: [0.3 + i * 0.1, 0.6 + i * 0.1, 0.3 + i * 0.1],
                          }}
                          transition={{
                            duration: 2 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Center point */}
                    <motion.div 
                      className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-full"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={{
                        ...shimmer.animate,
                        ...pulseAnimation
                      }}
                      transition={{
                        ...shimmer.transition,
                        ...pulseTransition
                      }}
                    />
                    
                    {/* Pentagon vertex points */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-full"
                        style={{
                          backgroundSize: '200% 100%',
                          top: `${50 + 40 * Math.cos((i * 2 * Math.PI) / 5 - Math.PI / 2)}%`,
                          left: `${50 + 40 * Math.sin((i * 2 * Math.PI) / 5 - Math.PI / 2)}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        animate={{
                          ...shimmer.animate,
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          ...shimmer.transition,
                          scale: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3
                          },
                          opacity: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3
                          }
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
                
                {/* Bottom info area */}
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between items-center">
                    <motion.div 
                      className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                    <motion.div 
                      className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmer.animate}
                      transition={shimmer.transition}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <motion.div 
                      className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
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
              
              {/* Footer */}
              <div className="p-3 border-t border-gray-100 bg-white flex justify-center">
                <motion.div 
                  className="h-8 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"
                  style={{ backgroundSize: '200% 100%' }}
                  animate={{
                    ...shimmer.animate,
                    ...pulseAnimation
                  }}
                  transition={pulseTransition}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}