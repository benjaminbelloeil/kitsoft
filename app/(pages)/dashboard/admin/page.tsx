import { redirect } from "next/navigation";
import { getAllUsersWithRolesAndAuth } from "@/utils/database/server/userSync";
import { checkCurrentUserIsAdmin } from "@/utils/admin/authorization";
import UserManagementPanel from "@/components/admin/management/UserManagementPanel";
import LeadManagementPanel from "@/components/admin/lead/LeadManagementPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";
import WorkloadMonitoringDashboard from "@/components/admin/WorkloadMonitoringDashboard";
import TabNavigation from "@/components/admin/TabNavigation";
import AdminPageClient from "@/components/admin/AdminPageClient";
import AdminHeader from "@/components/admin/AdminHeader";

// Force dynamic rendering since we use cookies for authentication
export const dynamic = 'force-dynamic';

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
        {/* Admin Header */}
        <AdminHeader />

        {/* Client-side tab navigation */}
        <TabNavigation />

        {/* Pass users to client components */}
        <UserManagementPanel serverUsers={users} />
        <LeadManagementPanel />
        <AdminDashboard />
        <WorkloadMonitoringDashboard />
      </div>
    </AdminPageClient>
  );
}
