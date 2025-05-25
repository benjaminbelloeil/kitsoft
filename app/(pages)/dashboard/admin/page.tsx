import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getAllUsersWithRolesAndAuth } from "@/utils/database/server/userSync";
import UserManagementPanel from "@/components/admin/UserManagementPanel";
import SettingsPanel from "@/components/admin/SettingsPanel";
import LogsPanel from "@/components/admin/LogsPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";
import TabNavigation from "@/components/admin/TabNavigation";
import AdminPageClient from "@/components/admin/AdminPageClient";

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
  const niveles = userRole?.niveles;
  const isAdmin = niveles && 
    (Array.isArray(niveles) 
      ? niveles[0]?.numero === 1 
      : (niveles as { numero: number })?.numero === 1);
  if (!isAdmin) {
    redirect("/dashboard");
  }

  // Fetch all users with their roles and auth status from the database (server-side)
  const users = await getAllUsersWithRolesAndAuth();

  return (
    <AdminPageClient>
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
    </AdminPageClient>
  );
}
