import { useUser } from "@/context/user-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function NavBadge() {
  const { isAdmin, userRole, isLoading } = useUser();
  
  // Show skeleton loader while loading
  if (isLoading) {
    return (
      <div className="px-4 py-2 mt-1 mb-3 mx-4 bg-gray-50 rounded-lg border border-gray-100">
        <Skeleton className="h-3 w-24 mb-2" />
        <div className="flex items-center mt-1">
          <Skeleton className="w-2 h-2 rounded-full mr-2" />
          <Skeleton className="h-4 w-32" />
          <div className="ml-auto">
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        </div>
      </div>
    );
  }
  
  // No badge if no role data
  if (!userRole) return null;
  
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
