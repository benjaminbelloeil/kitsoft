'use client';

export default function NotesSkeleton() {
  return (
    <div className="flex h-[calc(100vh-160px)]">
      {/* Left Sidebar Skeleton */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        
        {/* Search Bar Skeleton */}
        <div className="p-4 border-b border-gray-200">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Categories Section Skeleton */}
        <div className="flex-1 overflow-y-auto">
          {[...Array(6)].map((_, categoryIndex) => (
            <div key={categoryIndex} className="border-b border-gray-100">
              {/* Category Header */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>

              {/* Notes List Skeleton for Category */}
              {categoryIndex < 2 && ( // Show notes for first 2 categories
                <div className="bg-white">
                  {[...Array(3)].map((_, noteIndex) => (
                    <div key={noteIndex} className="p-3 border-b border-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      
                      <div className="space-y-1 mb-2">
                        <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create Note Button Skeleton */}
        <div className="p-4 border-t border-gray-200">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Right Main Content Skeleton */}
      <div className="flex-1 bg-white">
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="h-20 w-20 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto mb-6 animate-pulse"></div>
            <div className="h-12 w-40 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
