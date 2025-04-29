import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getAllUsers } from "@/utils/database/server/userSync";
import UserManagementPanel from "@/components/admin/UserManagementPanel";
import SettingsPanel from "@/components/admin/SettingsPanel";
import LogsPanel from "@/components/admin/LogsPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";
import TabNavigation from "@/components/admin/TabNavigation";

export default async function AdminPage() {
  // Server-side authorization check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // If no user is authenticated, redirect to login
  if (!user) {
    redirect("/login");
  }
  
  // Check if the user is an admin
  const { data: userRole } = await supabase
    .from('usuarios_niveles')
    .select(`
      niveles:id_nivel_actual(numero)
    `)
    .eq('id_usuario', user.id)
    .order('fecha_cambio', { ascending: false })
    .limit(1)
    .single();
  
  // If user is not admin (level 1), redirect to dashboard
  const isAdmin = userRole?.niveles?.numero === 1;
  if (!isAdmin) {
    redirect("/dashboard");
  }

  // Fetch all users from the database (server-side)
  const users = await getAllUsers();

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Administración</h1>

      <div className="mb-8">
        <p className="text-gray-600">
          Bienvenido al panel de administración. Aquí puedes gestionar usuarios, configurar el sistema y acceder a herramientas administrativas.
        </p>
      </div>

      {/* Client-side tab navigation */}
      <TabNavigation />

      {/* Pass users to client components */}
      <UserManagementPanel serverUsers={users} />
      <SettingsPanel />
      <LogsPanel />
      <AdminDashboard />
    </div>
  );
}
