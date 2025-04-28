export default function FeedbackSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse py-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex items-center">
              <div className="h-14 w-14 bg-gray-200 rounded-lg mr-4"></div>
              <div>
                <div className="h-8 w-64 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-96 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-16 w-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-1.5">
                <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                <div className="h-3 w-6 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 w-10 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        
        {/* Two column layout for form and chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* Form column - more compact */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[460px]">
              <div className="p-3 border-b border-gray-100 flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                <div className="h-5 w-40 bg-gray-200 rounded"></div>
              </div>
              
              <div className="p-3 space-y-3">
                <div>
                  <div className="h-3 w-24 bg-gray-200 rounded mb-1.5"></div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <div className="h-10 bg-gray-200 rounded-md"></div>
                    <div className="h-10 bg-gray-200 rounded-md"></div>
                    <div className="h-10 bg-gray-200 rounded-md"></div>
                    <div className="h-10 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="h-3 w-20 bg-gray-200 rounded mb-1.5"></div>
                    <div className="h-20 w-full bg-gray-200 rounded-md"></div>
                  </div>
                  <div>
                    <div className="h-3 w-20 bg-gray-200 rounded mb-1.5"></div>
                    <div className="h-20 w-full bg-gray-200 rounded-md"></div>
                  </div>
                </div>
                
                <div>
                  <div className="h-3 w-16 bg-gray-200 rounded mb-1.5"></div>
                  <div className="h-24 w-full bg-gray-200 rounded-md"></div>
                </div>
                
                <div className="h-10 w-full bg-gray-200 rounded-md"></div>
              </div>
            </div>
          </div>
          
          {/* Chart column - same height */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[460px]">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  <div className="h-5 w-40 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
              </div>
              
              <div className="flex items-center justify-center py-4 px-4 h-[374px]">
                <div className="h-64 w-64 rounded-full bg-gray-200"></div>
              </div>
              
              <div className="border-t border-gray-100 p-2">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  <div className="flex gap-1">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feedback list - more compact */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-2.5 rounded-lg border border-gray-100">
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="ml-2">
                      <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
                      <div className="h-2 w-14 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
                </div>
                
                <div className="flex gap-1 mb-1.5">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
                
                <div className="h-12 bg-gray-200 rounded-md"></div>
              </div>
            ))}
          </div>
          
          <div className="p-2.5 border-t border-gray-100 bg-gray-50 flex justify-center">
            <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
