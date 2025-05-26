import { redirect } from "next/navigation";
import { getAllUsersWithRolesAndAuth } from "@/utils/database/server/userSync";
import { checkCurrentUserIsAdmin } from "@/utils/admin/authorization";
import UserManagementPanel from "@/components/admin/UserManagementPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";
import TabNavigation from "@/components/admin/TabNavigation";
import AdminPageClient from "@/components/admin/AdminPageClient";

export default async function AdminPage() {
  // Server-side authorization check using the utility function
  const { user, isAdmin } = await checkCurrentUserIsAdmin();
  
  // If no user is authenticated, redirect to login
  if (!user) {
    redirect("/login");
  }
  
  // If user is not admin, redirect to dashboard
  if (!isAdmin) {
    redirect("/dashboard");
  }

  // Fetch all users with their roles and auth status from the database (server-side)
  const users = await getAllUsersWithRolesAndAuth();

  return (
    <AdminPageClient>
      <div className="container mx-auto p-4 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Administración</h1>
          <p className="text-gray-600">
            Bienvenido al panel de administración. Aquí puedes gestionar usuarios, configurar el sistema y acceder a herramientas administrativas.
          </p>
        </div>

        {/* Client-side tab navigation */}
        <TabNavigation />

        {/* Pass users to client components */}
        <UserManagementPanel serverUsers={users} />
        <AdminDashboard />
      </div>
    </AdminPageClient>
  );
}
