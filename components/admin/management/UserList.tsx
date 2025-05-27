import { FiUsers } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { User, UserRole } from "@/interfaces/user";
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
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  // Filter users by search term and role filter
  const filteredUsers = (users || []).filter(user => {
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
      <motion.div
        className="space-y-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div 
            key={i} 
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 animate-pulse"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gray-200 rounded-full h-12 w-12"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="bg-gray-200 rounded h-8 w-24"></div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <motion.div 
        className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div 
          className="bg-gray-50 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <FiUsers className="text-gray-400 text-4xl" />
        </motion.div>
        <motion.h3 
          className="text-lg font-medium text-gray-900 mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          No se encontraron usuarios
        </motion.h3>
        <motion.p 
          className="text-gray-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {search ? "Intenta con otra búsqueda." : "No hay usuarios disponibles."}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-4 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id_usuario}
            variants={itemVariants}
            layout
            layoutId={user.id_usuario}
          >
            <UserListItem 
              user={user}
              roles={roles}
              onConfirmRoleChange={onConfirmRoleChange}
              onConfirmDelete={onConfirmDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
