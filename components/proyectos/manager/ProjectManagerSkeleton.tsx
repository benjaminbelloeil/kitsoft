export default function ProjectManagerSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden animate-pulse">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex items-center">
              <div className="bg-gray-200 w-12 h-12 rounded-lg mr-4"></div>
              <div>
                <div className="h-7 bg-gray-200 rounded w-56 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-72"></div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="flex">
                <div className="h-10 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Project Form Card Skeleton */}
          <div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 h-full animate-pulse">
              {/* Form Header */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-56"></div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                  <div className="h-24 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
                
                {/* Form Buttons */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Project List Skeleton */}
          <div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-full animate-pulse">
              {/* List Header */}
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center mb-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-56"></div>
                  </div>
                </div>
              </div>
              
              {/* Table Header */}
              <div className="bg-white sticky top-0 z-10 shadow-sm">
                <div className="grid grid-cols-7 px-6 py-3.5">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
              
              {/* Project Rows */}
              <div className="overflow-y-auto flex-grow">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="border-b border-gray-100 px-6 py-3">
                    <div className="grid grid-cols-7 gap-4">
                      <div className="h-5 bg-gray-200 rounded"></div>
                      <div className="h-5 bg-gray-200 rounded"></div>
                      <div className="h-5 bg-gray-200 rounded"></div>
                      <div className="h-5 bg-gray-200 rounded"></div>
                      <div className="h-5 bg-gray-200 rounded"></div>
                      <div className="h-5 bg-gray-200 rounded flex items-center justify-center">
                        <div className="h-5 bg-gray-300 rounded-full w-16"></div>
                      </div>
                      <div className="h-5 bg-gray-200 rounded flex justify-end space-x-2">
                        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Scroll indicator */}
              <div className="bg-gradient-to-b from-transparent to-gray-100 h-4 w-full opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
