import React from 'react';
import { Award, TrendingUp } from 'lucide-react';

const PathSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="mb-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center p-2">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-purple-200" />
            </div>
          </div>
          <div className='text-left px-4'>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
      </div>
      
      {/* Career Path Visualizer Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-4">
        <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <TrendingUp className="mr-2 bg-purple-200 text-white rounded-full p-1" size={20} /> 
              <div className="h-6 bg-gray-200 rounded w-48"></div>
            </h2>
            <div className="h-4 bg-gray-200 rounded w-64 mt-2"></div>
          </div>
          <div className="flex">
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
        
        {/* Path Title and Description */}
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-56 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        
        {/* Path Visualization */}
        <div className="relative">
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
            
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-14"></div>
              </div>
            ))}
          </div>
          
          {/* Skills and Requirements Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-28"></div>
                </div>
                <ul className="space-y-3 mt-3">
                  {[...Array(4)].map((_, i) => (
                    <li key={i} className="flex items-center">
                      <div className="w-3 h-3 bg-gray-200 rounded-full mr-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Certificates Section Skeleton */}
      <div className="mb-3 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between border-b border-gray-200 pb-4 mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-72 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-200" />
            </div>
            <div className="flex space-x-2">
              <div className="p-2 rounded-md bg-gray-200 h-9 w-9"></div>
              <div className="p-2 rounded-md bg-gray-200 h-9 w-9"></div>
            </div>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4 items-center mb-6 p-2 w-full pb-4">
          <div className="relative flex-grow w-xl">
            <div className="h-10 bg-gray-200 rounded w-full max-w-lg"></div>
          </div>
        </div>
        
        {/* Certificates Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative">
              <div className="absolute top-2 right-2 bg-purple-100 rounded-full p-1 z-10 w-8 h-8 flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-200 rounded"></div>
              </div>
              <div className="h-36 bg-gray-50 flex items-center justify-center">
                <div className="h-24 w-24 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="h-6 bg-gray-200 rounded w-40 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                
                <div className="space-y-2 mb-2">
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-40"></div>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PathSkeleton;