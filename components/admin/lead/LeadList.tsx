/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUserPlus, 
  FiUsers, 
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { User } from "@/interfaces/user";
import { useNotificationState } from "@/components/ui/toast-notification";
import { PeopleLead } from "./LeadManagement";
import LeadListItem from "./LeadListItem";

// Assignment Confirmation Modal
interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
  leadName: string;
  isAssigning: boolean;
}

function AssignmentModal({ isOpen, onClose, onConfirm, selectedCount, leadName, isAssigning }: AssignmentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Confirmar asignación
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          ¿Estás seguro de que quieres asignar <span className="font-medium">{leadName}</span> como People Lead a {selectedCount} usuario{selectedCount !== 1 ? 's' : ''}?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isAssigning}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isAssigning}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isAssigning ? 'Asignando...' : 'Confirmar'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Custom Dropdown for People Lead Selection
interface PeopleLeadDropdownProps {
  selectedLead: string;
  peopleLeads: PeopleLead[];
  onSelect: (leadId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function PeopleLeadDropdown({ selectedLead, peopleLeads, onSelect, isOpen, onToggle }: PeopleLeadDropdownProps) {
  const selectedLeadData = peopleLeads.find(lead => lead.id_usuario === selectedLead);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        disabled={peopleLeads.length === 0}
        className="relative w-full min-h-[48px] bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-3 text-left 
                 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                 sm:text-sm transition duration-150 ease-in-out disabled:bg-gray-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center space-x-2">
          {peopleLeads.length === 0 ? (
            <span className="text-gray-400">No hay People Leads disponibles</span>
          ) : selectedLeadData ? (
            <>
              <UserAvatar user={selectedLeadData} size="sm" />
              <div className="flex-1 min-w-0">
                <span className="block truncate">{selectedLeadData.nombre} {selectedLeadData.apellido}</span>
                {selectedLeadData.titulo && (
                  <span className="block text-xs text-gray-500 truncate">{selectedLeadData.titulo}</span>
                )}
              </div>
            </>
          ) : (
            <span className="text-gray-500">Seleccionar People Lead</span>
          )}
        </div>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <FiChevronDown 
            className={`h-5 w-5 text-gray-400 transform transition-transform duration-150 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </span>
      </button>

      {isOpen && peopleLeads.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base 
                      ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <div
            onClick={() => {
              onSelect("");
              onToggle();
            }}
            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
          >
            <span className="block truncate text-gray-500">Sin asignar</span>
          </div>
          {peopleLeads.map((lead) => (
            <div
              key={lead.id_usuario}
              onClick={() => {
                onSelect(lead.id_usuario);
                onToggle();
              }}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-purple-50"
            >
              <div className="flex items-center space-x-2">
                <UserAvatar user={lead} size="sm" />
                <div className="flex-1">
                  <div className="block truncate font-medium">
                    {lead.nombre} {lead.apellido}
                  </div>
                  {lead.titulo && (
                    <div className="block truncate text-xs text-gray-500">
                      {lead.titulo}
                    </div>
                  )}
                </div>
              </div>
              {selectedLead === lead.id_usuario && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <FiCheck className="h-5 w-5 text-purple-600" />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// User Avatar Component
interface UserAvatarProps {
  user: User | PeopleLead;
  size?: 'sm' | 'md' | 'lg';
}

function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const [imageError, setImageError] = useState(false);
  const fallbackContent = (user.nombre?.charAt(0) || ('email' in user ? user.email?.charAt(0) : '') || 'U').toUpperCase();

  if (user.url_avatar && !imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0`}>
        <img
          src={user.url_avatar}
          alt={`${user.nombre} ${user.apellido}`}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-400 to-purple-600 
                    flex items-center justify-center text-white font-medium flex-shrink-0`}>
      {fallbackContent}
    </div>
  );
}

interface LeadListProps {
  users: User[];
  peopleLeads: PeopleLead[];
  onRefresh: () => void;
  sectionVariants: any;
  search: string;
  setSearch: (search: string) => void;
}

export default function LeadList({ users, peopleLeads, onRefresh, sectionVariants, search }: LeadListProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedLead, setSelectedLead] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLeadDropdownOpen, setIsLeadDropdownOpen] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const notifications = useNotificationState();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLeadDropdownOpen(false);
      }
    };

    if (isLeadDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isLeadDropdownOpen]);

  // Filter users based on search term and exclude people leads
  const filteredUsers = users.filter(user => {
    const matchesSearch = search === "" || 
      `${user.nombre} ${user.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(search.toLowerCase()));
    
    const isNotPeopleLead = user.role?.numero !== 2;
    return matchesSearch && isNotPeopleLead;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Handle user selection
  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  // Handle assign lead action - now opens modal first
  const handleAssignLead = () => {
    if (selectedUsers.size === 0) {
      notifications.showError('Selecciona al menos un usuario');
      return;
    }
    if (!selectedLead) {
      notifications.showError('Selecciona un people lead');
      return;
    }
    if (peopleLeads.length === 0) {
      notifications.showError('No hay people leads disponibles');
      return;
    }
    setShowAssignmentModal(true);
  };

  // Enhanced refresh function with loading state
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      // Add small delay to prevent flicker
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  // Confirm assignment
  const confirmAssignment = async () => {
    setIsAssigning(true);
    try {
      const assignments = Array.from(selectedUsers).map(userId => ({
        userId,
        leadId: selectedLead
      }));

      const response = await fetch('/api/admin/leads/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignments })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to assign lead');
      }

      await response.json();
      
      notifications.showSuccess(`${selectedUsers.size} usuario(s) asignado(s) exitosamente`);
      
      setSelectedUsers(new Set());
      setSelectedLead("");
      handleRefresh(); // Use enhanced refresh

    } catch (error) {
      console.error('Error assigning lead:', error);
      notifications.showError('Error al asignar people lead');
    } finally {
      setIsAssigning(false);
      setShowAssignmentModal(false);
    }
  };

  // Get current people lead name for a user
  const getCurrentLeadName = (user: User) => {
    if (!user.ID_PeopleLead) return "Sin asignar";
    const lead = peopleLeads.find(l => l.id_usuario === user.ID_PeopleLead);
    return lead ? `${lead.nombre} ${lead.apellido}` : "Lead no encontrado";
  };

  const selectedLeadData = peopleLeads.find(lead => lead.id_usuario === selectedLead);
  const selectedLeadName = selectedLeadData ? `${selectedLeadData.nombre} ${selectedLeadData.apellido}` : '';

  return (
    <>
      {/* Controls - Updated layout with consistent sizing */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        variants={sectionVariants}
      >
        {/* People Lead Selector */}
        <div ref={dropdownRef}>
          <PeopleLeadDropdown
            selectedLead={selectedLead}
            peopleLeads={peopleLeads}
            onSelect={setSelectedLead}
            isOpen={isLeadDropdownOpen}
            onToggle={() => setIsLeadDropdownOpen(!isLeadDropdownOpen)}
          />
        </div>

        {/* Assign Button - Fixed height to match dropdown */}
        <button
          onClick={handleAssignLead}
          disabled={selectedUsers.size === 0 || !selectedLead || isAssigning || peopleLeads.length === 0}
          className="w-full min-h-[48px] bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 
                   disabled:from-gray-300 disabled:to-gray-300 text-white px-6 py-3 rounded-lg font-medium 
                   transition-all duration-150 disabled:cursor-not-allowed shadow-md hover:shadow-lg 
                   transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-center">
            <FiUserPlus className="mr-2" />
            {peopleLeads.length === 0 ? 'No hay People Leads' : 'Asignar Lead'}
          </div>
        </button>
      </motion.div>

      {/* Statistics - Updated to match UserManagement style */}
      <motion.div 
        className="bg-gray-50 rounded-lg p-3 mb-8 border border-gray-100 flex items-center text-sm"
        variants={sectionVariants}
      >
        <div className="flex gap-1 items-center mr-2 text-gray-600">
          <FiUsers className="text-blue-600" /> 
          <span className="font-medium">{filteredUsers.length}</span> usuarios disponibles
        </div>
        <div className="border-l border-gray-300 h-5 mx-3"></div>
        <div className="flex gap-1 items-center mr-2 text-gray-600">
          <FiUserPlus className="text-green-600" /> 
          <span className="font-medium">{peopleLeads.length}</span> people leads
        </div>
        <div className="border-l border-gray-300 h-5 mx-3"></div>
        <div className="flex gap-1 items-center text-gray-600">
          <FiCheck className="text-purple-600" /> 
          <span className="font-medium">{selectedUsers.size}</span> seleccionados
        </div>
      </motion.div>

      {/* Users List - Updated with pagination */}
      <motion.div variants={sectionVariants}>
        {filteredUsers.length === 0 && !isRefreshing ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <div className="bg-gray-50 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FiUsers className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron usuarios</h3>
            <p className="text-gray-500">
              {search ? "Intenta con otra búsqueda." : "No hay usuarios disponibles."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Users List - Remove scroll container */}
            <div className={`${isRefreshing ? 'opacity-75' : ''}`} style={{ isolation: 'isolate' }}>
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
                      <LeadListItem
                        user={user}
                        isSelected={selectedUsers.has(user.id_usuario)}
                        onToggleSelection={() => toggleUserSelection(user.id_usuario)}
                        currentLeadName={getCurrentLeadName(user)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
              
              {/* Subtle loading indicator during refresh */}
              {isRefreshing && (
                <motion.div 
                  className="text-center py-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-sm text-gray-500">Actualizando...</div>
                </motion.div>
              )}
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
          </div>
        )}
      </motion.div>

      {/* Assignment Confirmation Modal */}
      <AnimatePresence>
        {showAssignmentModal && (
          <AssignmentModal
            isOpen={showAssignmentModal}
            onClose={() => !isAssigning && setShowAssignmentModal(false)}
            onConfirm={confirmAssignment}
            selectedCount={selectedUsers.size}
            leadName={selectedLeadName}
            isAssigning={isAssigning}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Export UserAvatar for use in other components
export { UserAvatar };
