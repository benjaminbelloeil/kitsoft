import { FiUsers } from "react-icons/fi";
import { User, UserRole } from "@/utils/database/client/userManagementSync";
import UserListItem from "./UserListItem";

interface UserListProps {
  users: User[];
  roles: UserRole[];
  loading: boolean;
  search: string;
  filter: string;
  onConfirmRoleChange: (userId: string, roleId: string) => void;
  onConfirmDelete: (userId: string) => void;
}

export default function UserList({
  users,
  roles,
  loading,
  search,
  filter,
  onConfirmRoleChange,
  onConfirmDelete
}: UserListProps) {
  // Filter users by search term and role filter
  const filteredUsers = users.filter(user => {
    const fullName = `${user.nombre || ""} ${user.apellido || ""}`.toLowerCase();
    const searchTerm = search.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm) || 
                        (user.titulo || "").toLowerCase().includes(searchTerm) ||
                        (user.role?.titulo || "").toLowerCase().includes(searchTerm) ||
                        (user.email || "").toLowerCase().includes(searchTerm);
    
    // Apply role filter
    if (filter === "all") return matchesSearch;
    if (filter === "admin") return matchesSearch && user.role?.numero === 1;
    if (filter === "empleado") return matchesSearch && user.role?.numero === 0;
    if (filter === "unregistered") return matchesSearch && !user.registered;
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gray-200 rounded-full h-12 w-12"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="bg-gray-200 rounded h-8 w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
        <div className="bg-gray-50 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <FiUsers className="text-gray-400 text-4xl" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron usuarios</h3>
        <p className="text-gray-500">
          {search ? "Intenta con otra búsqueda." : "No hay usuarios disponibles."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {filteredUsers.map(user => (
        <UserListItem 
          key={user.id_usuario}
          user={user}
          roles={roles}
          onConfirmRoleChange={onConfirmRoleChange}
          onConfirmDelete={onConfirmDelete}
        />
      ))}
    </div>
  );
}
