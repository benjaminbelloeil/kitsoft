/* eslint-disable @typescript-eslint/no-unused-vars */
import { FiUsers, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { User, UserRole } from "@/interfaces/user";
import UserListItem from "./UserListItem";
import { useState, useEffect } from "react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  // Fix pagination when current page exceeds total pages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <motion.div
        className="space-y-6 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i} 
            className="bg-white rounded-xl shadow-sm px-5 py-7 border-2 border-gray-100 animate-pulse"
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
      className="space-y-6 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Users List */}
      <div className="pr-3 py-2 relative" style={{ isolation: 'isolate' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {currentUsers.map((user, index) => (
              <motion.div
                key={user.id_usuario}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                layout
                style={{ 
                  position: 'relative',
                  zIndex: currentUsers.length - index
                }}
              >
                <UserListItem 
                  user={user}
                  roles={roles}
                  onConfirmRoleChange={onConfirmRoleChange}
                  onConfirmDelete={onConfirmDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div 
          className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-sm text-gray-500">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} usuarios
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            >
              <FiChevronLeft className="w-4 h-4" />
            </motion.button>
            
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;
                
                return (
                  <motion.button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      isCurrentPage
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pageNumber}
                  </motion.button>
                );
              })}
            </div>
            
            <motion.button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            >
              <FiChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
