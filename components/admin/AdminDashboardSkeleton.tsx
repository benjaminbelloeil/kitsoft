
export default function AdminDashboardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      {/* Header with icon and title */}
      <div className="flex items-center mb-6">
        <div className="bg-gray-200 rounded-lg w-10 h-10 mr-3 animate-pulse"></div>
        <div className="bg-gray-200 h-6 w-48 rounded animate-pulse"></div>
      </div>
      
      {/* Grid layout matching exactly the AdminDashboard layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Report card */}
        <div className="flex flex-col p-6 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center mb-4">
            <div className="bg-gray-200 rounded-lg w-8 h-8 animate-pulse"></div>
            <div className="ml-3 bg-gray-200 h-5 w-20 rounded animate-pulse"></div>
          </div>
          <div className="bg-gray-200 h-4 w-3/4 rounded animate-pulse"></div>
        </div>
        
        {/* "Coming soon" card */}
        <div className="flex items-center justify-center p-6 rounded-xl border border-gray-200 bg-gray-50">
          <div className="bg-gray-300 h-5 w-48 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
