import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 w-full mb-6">
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="flex h-16 items-center px-4 md:px-6 max-w-[1920px] mx-auto">
            {/* App logo */}
            <div className="flex items-center mr-4">
              <div className="h-7 w-28 bg-gray-200 rounded"></div>
            </div>
            
            {/* Search bar */}
            <div className="flex-1 ml-auto md:mr-auto max-w-md">
              <div className="h-9 w-full bg-gray-200 rounded-lg"></div>
            </div>
            
            {/* Control icons */}
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
              <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
              <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
              
              <div className="border-l pl-3 ml-2">
                <div className="flex items-center">
                  <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
                  <div className="ml-2 hidden md:block space-y-1">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Greeting header skeleton */}
      <div className="relative mb-10 max-w-[1920px] mx-auto px-4">
        <div className="bg-gray-100 rounded-2xl">
          <div className="px-6 py-8">
            <div className="flex items-center mb-2">
              <div className="h-7 w-7 bg-gray-200 rounded-full mr-2"></div>
              <div className="h-8 w-64 bg-gray-200 rounded"></div>
            </div>
            
            <div className="flex items-center mt-2">
              <div className="h-8 w-64 bg-gray-200 rounded-full"></div>
              <div className="mx-2 opacity-0">•</div>
              <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1920px] mx-auto px-4">
        {/* Left column skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="h-5 w-5 bg-gray-200 rounded mr-2"></div>
                  <div className="h-6 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-36 bg-gray-200 rounded"></div>
                    </div>
                    <div className="mt-2 sm:mt-0 h-6 w-24 bg-gray-200 rounded-full"></div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-1/2 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-8 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full"></div>
                    </div>
                    
                    <div className="sm:w-1/2 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        <div className="h-4 w-12 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tasks and charts skeleton sections */}
          {/* Similar sections repeated for tasks and weekly summary */}
        </div>
        
        {/* Right column skeleton */}
        <div className="space-y-6">
          {/* Performance, skills, events skeletons */}
          {/* Similar sections repeated for right sidebar components */}
        </div>
      </div>
    </div>
  );
}
