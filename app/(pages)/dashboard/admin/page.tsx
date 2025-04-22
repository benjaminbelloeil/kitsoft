import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Accenture Resource Management",
  description: "Administrative controls and user management"
};

export default function AdminPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <p className="mb-6">Welcome to the admin panel. You have elevated privileges.</p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-lg mb-2">User Roles</h3>
            <p className="text-gray-600">Manage user access levels and permissions</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-lg mb-2">System Settings</h3>
            <p className="text-gray-600">Configure global application settings</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-lg mb-2">Audit Logs</h3>
            <p className="text-gray-600">View system activity and user actions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
