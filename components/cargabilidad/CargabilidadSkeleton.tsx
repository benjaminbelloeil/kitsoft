import React from 'react';

export default function CargabilidadSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-6 animate-pulse">
      {/* Header skeleton */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 relative overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-6 justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mr-4"></div>
                <div>
                  <div className="h-7 w-64 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-80 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
                <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Weekly distribution skeleton */}
          <div className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 bg-gray-200 rounded-full"></div>
                  <div className="h-5 w-36 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
              </div>
              
              <div className="h-8 bg-gray-200 rounded-lg mb-4"></div>
              
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex px-4 pt-4 gap-2 border-b border-gray-200">
            <div className="h-10 w-24 bg-gray-200 rounded-t-lg"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-t-lg"></div>
          </div>

          <div className="p-6">
            {/* Dashboard tab skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                    <div className="h-6 w-6 bg-gray-200 rounded-md"></div>
                    <div className="h-5 w-40 bg-gray-200 rounded"></div>
                  </div>

                  {index % 2 === 0 ? (
                    /* Chart-like skeleton */
                    <div className="h-40 flex items-end gap-1">
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t-sm h-[30%]"></div>
                        <div className="h-3 w-3 bg-gray-200 rounded mt-2"></div>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t-sm h-[40%]"></div>
                        <div className="h-3 w-3 bg-gray-200 rounded mt-2"></div>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t-sm h-[60%]"></div>
                        <div className="h-3 w-3 bg-gray-200 rounded mt-2"></div>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t-sm h-[50%]"></div>
                        <div className="h-3 w-3 bg-gray-200 rounded mt-2"></div>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t-sm h-[70%]"></div>
                        <div className="h-3 w-3 bg-gray-200 rounded mt-2"></div>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t-sm h-[45%]"></div>
                        <div className="h-3 w-3 bg-gray-200 rounded mt-2"></div>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t-sm h-[35%]"></div>
                        <div className="h-3 w-3 bg-gray-200 rounded mt-2"></div>
                      </div>
                    </div>
                  ) : index === 1 ? (
                    /* Progress bars skeleton */
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-4 w-8 bg-gray-200 rounded"></div>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  ) : index === 2 ? (
                    /* Circle progress skeleton */
                    <div className="flex flex-col items-center">
                      <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    </div>
                  ) : (
                    /* Timeline-like skeleton */
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                          <div>
                            <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                          </div>
                          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
