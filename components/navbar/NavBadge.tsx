import { useUser } from "@/context/user-context";

export default function NavBadge() {
  const { isAdmin, userRole } = useUser();
  
  if (!userRole) return null;
  
  console.log("NavBadge rendering with isAdmin:", isAdmin, "and userRole:", userRole);
  
  return (
    <div className="px-4 py-2 mt-1 mb-3 mx-4 bg-gray-50 rounded-lg border border-gray-100">
      <p className="text-xs text-gray-500">Nivel de acceso</p>
      <div className="flex items-center mt-1">
        <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-[#A100FF]' : 'bg-green-500'} mr-2`}></div>
        <p className="text-sm font-medium">
          {isAdmin 
            ? "Administrador" 
            : (userRole.titulo || "Staff")}
        </p>
        
        {isAdmin && (
          <span className="ml-auto text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
            Admin
          </span>
        )}
        
        {!isAdmin && userRole.numero === 0 && (
          <span className="ml-auto text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
            Nuevo
          </span>
        )}
      </div>
    </div>
  );
}
