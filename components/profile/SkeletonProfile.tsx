import { motion } from 'framer-motion';

export function SkeletonProfileHeader() {
  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  return (
    <motion.header 
      className="bg-white rounded-xl shadow-lg p-0 mb-8 overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className="relative">
        {/* Decorative header background - using matching gray tones */}
        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 w-full absolute top-0 left-0"></div>
        
        <motion.div 
          className="relative pt-12 px-6 pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar skeleton - match EXACT positioning as real component */}
            <motion.div 
              className="relative mt-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="rounded-full p-1.5 bg-white shadow-lg">
                <div className="relative h-36 w-36 md:h-44 md:w-44 rounded-full overflow-hidden border-4 border-white shadow-inner bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}>
                </div>
              </div>
              {/* Edit button positioned exactly like in real component */}
              <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 flex items-center justify-center" style={shimmer}>
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
              </div>
            </motion.div>
            
            {/* Profile content skeleton with EXACT same dimensions/spacing */}
            <motion.div 
              className="flex-1 w-full bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="space-y-3">
                {/* Name and title section with same vertical spacing */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 w-full max-w-md">
                    <div className="h-8 w-full max-w-[260px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                    <div className="h-6 w-full max-w-[200px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                  </div>
                  <div className="h-10 w-32 rounded-lg md:self-start bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                </div>
                
                {/* Contact information - EXACT same padding/margins as real component */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <motion.div 
                    className="flex items-center space-x-2 p-2 rounded-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <div className="h-9 w-9 rounded-md flex-shrink-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                    <div className="flex-1">
                      <div className="h-4 w-16 mb-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                      <div className="h-5 w-full max-w-[180px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-2 p-2 rounded-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <div className="h-9 w-9 rounded-md flex-shrink-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                    <div className="flex-1">
                      <div className="h-4 w-16 mb-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                      <div className="h-5 w-full max-w-[180px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Bio section - exact same margins/padding as real component */}
                <motion.div 
                  className="mt-4 pt-4 border-t border-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <div className="h-5 w-24 mb-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                  <div className="h-24 w-full rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}

export function SkeletonCargabilidad() {
  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <motion.div 
        className="flex items-center pb-3 border-b border-gray-100 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="h-9 w-9 rounded-md mr-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
        <div className="h-6 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
      </motion.div>
      
      <div className="flex flex-wrap gap-6 flex-1">
        <motion.div 
          className="bg-white rounded-lg p-5 flex-1 min-w-[200px] text-center border border-gray-100 shadow-md flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="h-6 w-32 mx-auto mb-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
          <div className="flex justify-center">
            <ProgressCircleSkeleton />
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-lg p-5 flex-1 min-w-[200px] text-center border border-gray-100 shadow-md flex flex-col justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="h-6 w-28 mx-auto mb-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
          <div className="flex justify-center">
            <ProgressCircleSkeleton />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function SkeletonResume() {
  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col h-full w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center mb-6 pb-3 border-b border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-10 w-10 rounded-md mr-2" style={shimmer}></div>
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-7 w-32 rounded" style={shimmer}></div>
      </motion.div>
      
      {/* Content - make sure both skeletons have identical structure and sizing */}
      <motion.div 
        className="flex-grow flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex-grow mb-4 h-24 flex items-center justify-center">
          {/* Empty state placeholder */}
          <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-5 w-48 rounded" style={shimmer}></div>
        </div>
        
        {/* Upload area - ensure same height */}
        <motion.div 
          className="border-2 border-dashed border-gray-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex flex-col items-center space-y-2 py-2 h-[72px] justify-center">
            <div className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full" style={shimmer}></div>
            <div className="h-4 w-36 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
            <div className="h-3 w-44 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function SkeletonCertificates() {
  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col h-full w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center mb-6 pb-3 border-b border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-10 w-10 rounded-md mr-2" style={shimmer}></div>
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-7 w-32 rounded" style={shimmer}></div>
      </motion.div>
      
      {/* Content - make sure both skeletons have identical structure and sizing */}
      <motion.div 
        className="flex-grow flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex-grow mb-4 h-24 flex items-center justify-center">
          {/* Empty state placeholder */}
          <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-5 w-48 rounded" style={shimmer}></div>
        </div>
        
        {/* Upload area - ensure same height */}
        <motion.div 
          className="border-2 border-dashed border-gray-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex flex-col items-center space-y-2 py-2 h-[72px] justify-center">
            <div className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full" style={shimmer}></div>
            <div className="h-4 w-36 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
            <div className="h-3 w-44 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function SkeletonSkills() {
  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <motion.div 
        className="flex items-center pb-3 border-b border-gray-100 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="h-9 w-9 rounded-md mr-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
        <div className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
      </motion.div>
      
      <div className="flex flex-wrap gap-3">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`h-8 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${i < 3 ? 'w-24' : i < 5 ? 'w-32' : 'w-20'}`}
            style={shimmer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
          />
        ))}
        <motion.div 
          className="h-8 w-32 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
          style={shimmer}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        />
      </div>
    </motion.div>
  );
}

export function SkeletonExperience() {
  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <motion.div 
        className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-md mr-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
          <div className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
        </div>
        <div className="h-10 w-24 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
      </motion.div>
      
      <div className="space-y-4">
        {[1, 2].map((_, index) => (
          <motion.div 
            key={index} 
            className="mb-4 last:mb-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="group">
              <div className="flex flex-col md:flex-row items-start rounded-lg overflow-hidden bg-white transition-all duration-300 ease-in-out hover:shadow-md border border-gray-100">
                <div className="w-full md:w-1 md:h-auto bg-gray-200 transition-colors duration-300 md:self-stretch flex-shrink-0"></div>
                
                <div className="flex-grow p-4">
                  <div className="flex flex-col mb-3">
                    <div className="h-5 w-48 mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                    <div className="h-4 w-32 mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                    <div className="h-3 w-24 mb-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                  </div>
                  
                  <div className="pt-1 border-t border-gray-100">
                    <div className="h-16 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mt-2" style={shimmer}></div>
                  </div>
                  
                  {/* Skills tags */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[1, 2, 3].map((_, skillIndex) => (
                      <motion.div
                        key={skillIndex}
                        className="bg-gray-100 border border-gray-200 px-2 py-1 rounded text-xs"
                        style={shimmer}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 + skillIndex * 0.05 }}
                      >
                        <div className="h-3 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" style={shimmer}></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="self-start p-3 flex flex-col gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Helper component for the cargabilidad section
function ProgressCircleSkeleton() {
  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
  };

  return (
    <motion.div 
      className="relative h-[120px] w-[120px] flex items-center justify-center rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
      style={shimmer}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="h-12 w-12 rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" style={shimmer}></div>
    </motion.div>
  );
}