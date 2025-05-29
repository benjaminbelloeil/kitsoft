"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FiUsers, FiAlertCircle } from 'react-icons/fi';
import PeopleLeadHeader from '@/components/proyectos/people-lead/PeopleLeadHeader';
import PeopleLeadSkeleton from '@/components/proyectos/people-lead/PeopleLeadSkeleton';
import ProfileModal from '@/components/proyectos/people-lead/ProfileModal';
import { UserCard } from '@/components/proyectos/people-lead/UserCard';
import { useUser } from '@/context/user-context';
import { useRouter } from 'next/navigation';
import { useAssignedUsers, useProfileModal } from '@/utils/database/client/peopleLeadSync';
import UnauthorizedState from '@/components/auth/UnauhtorizedState';

// Main Page Component with enhanced animations
export default function PeopleLeadPage() {
  const { isPeopleLead, isLoading: userLoading } = useUser();
  const router = useRouter();
  
  const { 
    users, 
    filteredUsers, 
    loading, 
    error, 
    searchTerm, 
    setSearchTerm, 
    fetchAssignedUsers, 
    refreshData, 
    dataLoaded 
  } = useAssignedUsers();
  
  const {
    selectedUserId,
    showProfileModal,
    handleViewProfile,
    handleCloseProfileModal
  } = useProfileModal();

  // Permission check - redirect unauthorized users
  useEffect(() => {
    if (!userLoading && !isPeopleLead) {
      router.push('/dashboard');
    }
  }, [userLoading, isPeopleLead, router]);
  // Fetch assigned users when component mounts
  useEffect(() => {
    // Prevent multiple simultaneous fetches and ensure we only run this once per mount
    if (fetchInProgress.current || hasInitialized.current) return;
    
    // Only fetch if user is loaded, is people lead, and we don't have valid cached data
    if (!userLoading && isPeopleLead && !dataLoaded) {
      hasInitialized.current = true;
      fetchAssignedUsers();
    }
  }, [userLoading, isPeopleLead, dataLoaded, fetchAssignedUsers]);  // Container animation variants
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  // Show loading while checking user permissions
  if (userLoading) {
    return <PeopleLeadSkeleton />;
  }

  // Prevent rendering if user is not authorized (additional safety check)
  if (!isPeopleLead) {
    return (
      <UnauthorizedState
        message="No tienes permiso para acceder a esta sección."
      /> 
    );
  }

  // Loading state with AnimatePresence like in ProjectLeadPage
  if (loading) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PeopleLeadSkeleton />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.div 
            className="text-red-500 mb-4 text-lg"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {error}
          </motion.div>          <motion.button
            onClick={fetchAssignedUsers}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05, backgroundColor: "#7E22CE" }}
            whileTap={{ scale: 0.95 }}
          >
            Reintentar
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <PeopleLeadHeader 
            searchQuery={searchTerm}
            setSearchQuery={setSearchTerm}
            totalUsers={users.length}
            activeUsers={users.length} // For now, all users are considered active
          />
        </motion.div>

        {/* Users Grid with enhanced animations */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8"
        >
          {filteredUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              >
                <FiUsers className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              </motion.div>
              <motion.h3 
                className="text-lg font-medium text-gray-700 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {searchTerm ? 'No se encontraron usuarios' : 'No tienes usuarios asignados'}
              </motion.h3>
              <motion.p 
                className="text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {searchTerm 
                  ? 'Intenta con un término de búsqueda diferente' 
                  : 'Los usuarios asignados aparecerán aquí cuando se te asignen'
                }
              </motion.p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
              variants={containerVariants}
            >
              {filteredUsers.map((user, index) => (
                <UserCard key={user.id_usuario} user={user} onViewProfile={handleViewProfile} index={index} />
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Results Summary with animation */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center text-gray-600"
          >
            {filteredUsers.length > 0 ? (
              <motion.p
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Mostrando {filteredUsers.length} de {users.length} usuarios
              </motion.p>
            ) : (
              <motion.p
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                No se encontraron usuarios que coincidan con &quot;{searchTerm}&quot;
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Profile Modal */}
        <ProfileModal
          isOpen={showProfileModal}
          onClose={handleCloseProfileModal}
          userId={selectedUserId}
        />
      </motion.div>
    </AnimatePresence>
  );
}