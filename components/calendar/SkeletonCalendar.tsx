import { motion } from 'framer-motion';

export function SkeletonCalendar() {
  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  return (
    <motion.div 
      className="h-full flex flex-col relative"
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
      
      {/* Header skeleton that exactly matches the real header layout */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Title section with identical structure to the real component */}
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 p-3 rounded-lg mr-4 w-12 h-12 flex items-center justify-center" style={shimmer}>
                <div className="h-6 w-6 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
              </div>
              <div>
                <div className="h-8 w-64 mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                <div className="h-4 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
              </div>
            </motion.div>
            
            {/* Right side controls with same dimensions as real component */}
            <motion.div 
              className="flex items-center gap-3 w-full sm:w-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="relative group flex-1 sm:flex-initial sm:w-64">
                <div className="h-9 w-full rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
              </div>
              <div className="h-10 w-10 rounded-full flex-shrink-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        {/* Left sidebar - exact same width as the real component */}
        <motion.div 
          className="w-full lg:w-64 flex-shrink-0 space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {/* Mini calendar section - matches real mini calendar dimensions */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-4 border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
              <div className="flex space-x-1">
                <div className="h-6 w-6 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                <div className="h-6 w-6 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
              </div>
            </div>

            {/* Calendar weekdays with same spacing as real component */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {Array(7).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-4 w-4 mx-auto rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                  style={shimmer}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.7 + i * 0.03 }}
                />
              ))}
            </div>

            {/* Calendar days - matches exact grid layout of real component */}
            <div className="grid grid-cols-7 gap-1">
              {Array(35).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-7 w-7 mx-auto rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                  style={shimmer}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.8 + (i % 7) * 0.05 }}
                />
              ))}
            </div>

            {/* Today button - matches button in real component */}
            <motion.div
              className="h-8 w-full mt-3 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
              style={shimmer}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.0 }}
            />
          </motion.div>

          {/* Filters section - matches filters in real component */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-4 border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
              <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
            </div>
            
            {/* Project list with identical structure */}
            <div className="space-y-2">
              {Array(4).fill(0).map((_, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center p-2 rounded-md"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 1.1 + i * 0.1 }}
                >
                  <div className="h-3 w-3 rounded-full mr-2 flex-shrink-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                  <div className="h-5 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Main calendar skeleton - matches exact dimensions of real calendar */}
        <motion.div 
          className="flex-1 flex flex-col min-h-[650px] overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-gray-100 flex flex-col h-full w-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            {/* Calendar header with matching layout */}
            <motion.div 
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2 sm:mb-4 flex-shrink-0"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <div className="h-7 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
              <div className="flex items-center justify-between sm:justify-end space-x-2">
                <div className="h-9 w-9 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                <div className="h-9 w-20 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                <div className="h-9 w-9 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
              </div>
            </motion.div>

            {/* Calendar weekdays - same layout as real calendar */}
            <motion.div 
              className="hidden sm:grid sm:grid-cols-7 gap-1 mb-1 flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              {Array(7).fill(0).map((_, i) => (
                <div key={i} className="text-center py-2 border-b border-gray-100">
                  <motion.div
                    className="h-5 w-10 mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                    style={shimmer}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.9 + i * 0.05 }}
                  />
                </div>
              ))}
            </motion.div>
            
            {/* Mobile weekdays */}
            <motion.div 
              className="grid grid-cols-7 sm:hidden gap-1 mb-1 flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              {Array(7).fill(0).map((_, i) => (
                <div key={i} className="text-center py-1 border-b border-gray-100">
                  <motion.div
                    className="h-4 w-4 mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
                    style={shimmer}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.9 + i * 0.05 }}
                  />
                </div>
              ))}
            </motion.div>
            
            {/* Calendar days grid - matches identical structure to real calendar */}
            <motion.div 
              className="flex-1 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.0 }}
            >
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 grid-rows-6 h-full">
                {Array(42).fill(0).map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="border border-transparent rounded-md p-0.5 sm:p-1 flex flex-col"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 1.1 + (i % 14) * 0.03 }}
                  >
                    <div className="flex justify-between items-center mb-0.5 sm:mb-1 flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                      {/* Some days have event count indicator */}
                      {(i % 7 === 1 || i % 7 === 3 || i % 7 === 5) && (
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                      )}
                    </div>
                    
                    {/* Add event skeleton items to some cells - matches same cells as real calendar */}
                    <div className="overflow-hidden flex-1">
                      {(i % 7 === 0 || i % 7 === 3 || i % 9 === 0) && (
                        <div className="space-y-1">
                          <div className="h-4 w-full rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                          {(i % 7 === 3) && <div className="h-4 w-full rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}