import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonProfileHeader() {
  return (
    <header className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 animate-pulse">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Avatar skeleton */}
        <div className="relative">
          <div className="p-2 bg-gray-100 rounded-full">
            <div className="w-40 h-40 relative rounded-full border-4 border-white shadow overflow-hidden">
              <Skeleton className="absolute inset-0" />
            </div>
          </div>
          <div className="absolute bottom-1 right-1 bg-gray-200 p-2 rounded-full">
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>
        
        <div className="flex-1 w-full space-y-4">
          {/* Name and title skeletons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-60" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-32 rounded-md mx-auto md:mx-0 mt-4 md:mt-0" />
          </div>
          
          {/* Contact info skeletons */}
          <div className="mt-4 space-y-2 pt-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          
          {/* Border divider skeleton */}
          <div className="my-4">
            <Skeleton className="h-[1px] w-full" />
          </div>
          
          {/* Bio skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function SkeletonCargabilidad() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col h-full animate-pulse">
      <div className="flex items-center pb-3 border-b border-gray-100 mb-6">
        <Skeleton className="h-9 w-9 rounded-md mr-2" />
        <Skeleton className="h-6 w-48" />
      </div>
      
      <div className="flex flex-wrap gap-6 flex-1">
        <div className="bg-white rounded-lg p-5 flex-1 min-w-[200px] text-center border border-gray-100 shadow-md flex flex-col justify-center">
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <div className="flex justify-center">
            <ProgressCircleSkeleton />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-5 flex-1 min-w-[200px] text-center border border-gray-100 shadow-md flex flex-col justify-center">
          <Skeleton className="h-6 w-28 mx-auto mb-4" />
          <div className="flex justify-center">
            <ProgressCircleSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonResume() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-pulse flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center mb-6 pb-3 border-b border-gray-100">
        <div className="bg-gray-200 h-10 w-10 rounded-md mr-2"></div>
        <div className="bg-gray-200 h-7 w-32 rounded"></div>
      </div>
      
      {/* Content - make sure both skeletons have identical structure and sizing */}
      <div className="flex-grow flex flex-col">
        <div className="flex-grow mb-4 h-24 flex items-center justify-center">
          {/* Empty state placeholder */}
          <div className="bg-gray-100 h-5 w-48 rounded"></div>
        </div>
        
        {/* Upload area - ensure same height */}
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
          <div className="flex flex-col items-center space-y-2 py-2 h-[72px] justify-center">
            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-36 bg-gray-200 rounded"></div>
            <div className="h-3 w-44 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCertificates() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-pulse flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center mb-6 pb-3 border-b border-gray-100">
        <div className="bg-gray-200 h-10 w-10 rounded-md mr-2"></div>
        <div className="bg-gray-200 h-7 w-32 rounded"></div>
      </div>
      
      {/* Content - make sure both skeletons have identical structure and sizing */}
      <div className="flex-grow flex flex-col">
        <div className="flex-grow mb-4 h-24 flex items-center justify-center">
          {/* Empty state placeholder */}
          <div className="bg-gray-100 h-5 w-48 rounded"></div>
        </div>
        
        {/* Upload area - ensure same height */}
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
          <div className="flex flex-col items-center space-y-2 py-2 h-[72px] justify-center">
            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-36 bg-gray-200 rounded"></div>
            <div className="h-3 w-44 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonSkills() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 animate-pulse">
      <div className="flex items-center pb-3 border-b border-gray-100 mb-6">
        <Skeleton className="h-9 w-9 rounded-md mr-2" />
        <Skeleton className="h-6 w-32" />
      </div>
      
      <div className="flex flex-wrap gap-3">
        {[...Array(8)].map((_, i) => (
          <Skeleton 
            key={i} 
            className={`h-8 rounded-md ${i < 3 ? 'w-24' : i < 5 ? 'w-32' : 'w-20'}`} 
          />
        ))}
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>
    </div>
  );
}

export function SkeletonExperience() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 animate-pulse">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
        <div className="flex items-center">
          <Skeleton className="h-9 w-9 rounded-md mr-2" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
      
      <div className="space-y-6">
        {[1, 2].map((_, index) => (
          <div 
            key={index} 
            className="border-l-3 border-gray-200 pl-6 relative p-4 rounded-r-lg mb-2"
          >
            <div className="absolute -left-1.5 top-6 h-4 w-4 rounded-full bg-gray-200"></div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="w-full">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24 mb-3" />
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
              <div className="mt-2 md:mt-0 md:ml-4">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper component for the cargabilidad section
function ProgressCircleSkeleton() {
  return (
    <div className="relative h-[120px] w-[120px] flex items-center justify-center rounded-full bg-gray-100">
      <Skeleton className="absolute w-full h-full rounded-full opacity-30" />
      <Skeleton className="h-12 w-12 rounded-md" />
    </div>
  );
}