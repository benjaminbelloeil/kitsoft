export default function ProjectManagerSkeleton() {
  return (
    <div>
      {/* Header Skeleton - matching the new design */}
      <div className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden animate-pulse">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
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
              <div className="flex gap-2">
                <div className="h-9 bg-gray-200 rounded flex-grow"></div>
                <div className="h-9 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Grid View Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white p-5 rounded-lg shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
            <div className="flex justify-between mt-6">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* List View Skeleton (hidden by default) */}
      <div className="hidden">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 animate-pulse">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="col-span-2">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="col-span-2">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="col-span-2">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="col-span-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
          
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-4 border-b border-gray-100 hover:bg-gray-50 animate-pulse">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="col-span-2">
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="col-span-2">
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="col-span-2">
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="col-span-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
