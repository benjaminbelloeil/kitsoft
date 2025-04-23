import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCalendar() {
  return (
    <div className="h-full flex flex-col relative animate-pulse">
      {/* Header skeleton that exactly matches the real header layout */}
      <div className="mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Title section with identical structure to the real component */}
            <div className="flex items-center">
              <div className="bg-gray-200 p-3 rounded-lg mr-4 w-12 h-12 flex items-center justify-center">
                <Skeleton className="h-6 w-6 rounded" />
              </div>
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            
            {/* Right side controls with same dimensions as real component */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative group flex-1 sm:flex-initial sm:w-64">
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Left sidebar - exact same width as the real component */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
          {/* Mini calendar section - matches real mini calendar dimensions */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex space-x-1">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            </div>

            {/* Calendar weekdays with same spacing as real component */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {Array(7).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-4 w-4 mx-auto rounded" />
              ))}
            </div>

            {/* Calendar days - matches exact grid layout of real component */}
            <div className="grid grid-cols-7 gap-1">
              {Array(35).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-7 w-7 mx-auto rounded-full" />
              ))}
            </div>

            {/* Today button - matches button in real component */}
            <Skeleton className="h-8 w-full mt-3 rounded-md" />
          </div>

          {/* Filters section - matches filters in real component */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            
            {/* Project list with identical structure */}
            <div className="space-y-2">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center p-2 rounded-md">
                  <Skeleton className="h-3 w-3 rounded-full mr-2 flex-shrink-0" />
                  <Skeleton className="h-5 w-full rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main calendar skeleton - matches exact dimensions of real calendar */}
        <div className="flex-1 flex flex-col min-h-[650px] overflow-hidden">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-gray-100 flex flex-col h-full w-full">
            {/* Calendar header with matching layout */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2 sm:mb-4 flex-shrink-0">
              <Skeleton className="h-7 w-48" />
              <div className="flex items-center justify-between sm:justify-end space-x-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>

            {/* Calendar weekdays - same layout as real calendar */}
            <div className="hidden sm:grid sm:grid-cols-7 gap-1 mb-1 flex-shrink-0">
              {Array(7).fill(0).map((_, i) => (
                <div key={i} className="text-center py-2 border-b border-gray-100">
                  <Skeleton className="h-5 w-10 mx-auto" />
                </div>
              ))}
            </div>
            
            {/* Mobile weekdays */}
            <div className="grid grid-cols-7 sm:hidden gap-1 mb-1 flex-shrink-0">
              {Array(7).fill(0).map((_, i) => (
                <div key={i} className="text-center py-1 border-b border-gray-100">
                  <Skeleton className="h-4 w-4 mx-auto" />
                </div>
              ))}
            </div>
            
            {/* Calendar days grid - matches identical structure to real calendar */}
            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 grid-rows-6 h-full">
                {Array(42).fill(0).map((_, i) => (
                  <div key={i} className="border border-transparent rounded-md p-0.5 sm:p-1 flex flex-col">
                    <div className="flex justify-between items-center mb-0.5 sm:mb-1 flex-shrink-0">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      {/* Some days have event count indicator */}
                      {(i % 7 === 1 || i % 7 === 3 || i % 7 === 5) && (
                        <Skeleton className="h-6 w-6 rounded-full" />
                      )}
                    </div>
                    
                    {/* Add event skeleton items to some cells - matches same cells as real calendar */}
                    <div className="overflow-hidden flex-1">
                      {(i % 7 === 0 || i % 7 === 3 || i % 9 === 0) && (
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-full rounded-sm" />
                          {(i % 7 === 3) && <Skeleton className="h-4 w-full rounded-sm" />}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}