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
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <TrendingUp className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
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
        
        {/* Timeline Visualization */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
            
            {/* Timeline items */}
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="relative flex items-center">
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  </div>
                  
                  {/* Content */}
                  <div className="ml-4 flex-1 p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="h-5 bg-gray-200 rounded w-24"></div>
                      <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
          
        {/* Skills and Requirements Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
                <div className="h-5 bg-gray-200 rounded w-32"></div>
              </div>
              <ul className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <li key={i} className="flex items-center p-2 rounded-lg">
                    <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* Certificates Section Skeleton */}
      <div className="mb-3 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between border-b border-gray-200 pb-4 mb-4">
          <div className="flex item-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-200" />
              </div>
            </div>
            <div className='text-left px-4'>
              <div className="h-6 bg-gray-200 rounded w-72 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="p-2 rounded-md bg-gray-200 h-9 w-9"></div>
              <div className="p-2 rounded-md bg-gray-200 h-9 w-9"></div>
            </div>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className=" flex flex-wrap gap-4 items-center mb-6 p-2 w-full pb-4">
          <div className="relative flex-grow w-xl ">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </div>
            <div className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md h-10 bg-gray-200"></div>
          </div>
        </div>
        
        {/* Certificates Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative">
              <div className="absolute top-2 right-2 bg-purple-100 rounded-full p-1 z-10 w-8 h-8 flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-200 rounded"></div>
              </div>
              <div className="h-36 bg-gray-200 relative overflow-hidden">
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