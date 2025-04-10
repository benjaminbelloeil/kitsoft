import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCalendar() {
  return (
    <div className="h-full flex flex-col relative animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-auto pb-6">
        {/* Left sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
          <div className="flex flex-row lg:flex-col gap-4">
            {/* Mini calendar skeleton */}
            <div className="flex-1 lg:flex-none bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex space-x-1">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-6 w-6 rounded" />
                </div>
              </div>

              {/* Calendar weekdays */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {Array(7).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-3 w-3 mx-auto rounded" />
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {Array(35).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-7 mx-auto rounded-full" />
                ))}
              </div>

              {/* Today button */}
              <Skeleton className="h-8 w-full mt-3 rounded-md" />
            </div>

            {/* Filters skeleton */}
            <div className="flex-1 lg:flex-none bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              
              {/* Project list */}
              <div className="space-y-2">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center p-2">
                    <Skeleton className="h-3 w-3 rounded-full mr-2" />
                    <Skeleton className="h-5 w-full rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Small screen events skeleton */}
          <div className="lg:hidden bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <Skeleton className="h-6 w-36 mb-3" />
            
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-3 rounded-md border-l-4 border-gray-200">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main calendar skeleton */}
        <div className="flex-1 flex flex-col min-h-[650px]">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-gray-100 flex flex-col h-full w-full overflow-hidden">
            {/* Calendar header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2 sm:mb-4 flex-shrink-0">
              <Skeleton className="h-6 w-40" />
              <div className="flex items-center justify-between sm:justify-end space-x-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>

            {/* Calendar weekdays */}
            <div className="hidden sm:grid sm:grid-cols-7 gap-1 mb-1 flex-shrink-0">
              {Array(7).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
            
            {/* Calendar days grid container */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 grid-rows-6 h-full">
                {Array(42).fill(0).map((_, i) => (
                  <div key={i} className="border rounded-md p-1 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-1 flex-shrink-0">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                    {/* Event placeholders */}
                    {i % 7 === 0 || i % 7 === 3 || i % 7 === 5 ? (
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-full rounded-sm" />
                        <Skeleton className="h-4 w-full rounded-sm" />
                      </div>
                    ) : i % 5 === 0 ? (
                      <Skeleton className="h-4 w-full rounded-sm" />
                    ) : null}
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