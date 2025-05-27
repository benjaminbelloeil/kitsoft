/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  FiUserPlus, 
  FiSearch, 
  FiUsers, 
  FiRefreshCw,
  FiCheck,
  FiChevronDown
} from "react-icons/fi";
import { User } from "@/interfaces/user";
import { useNotificationState } from "@/components/ui/toast-notification";
import { PeopleLead } from "./LeadManagement";
import LeadListItem from "./LeadListItem";

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
        className="relative w-full bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-left 
                 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                 sm:text-sm transition duration-150 ease-in-out"
      >
        <div className="flex items-center space-x-2">
          {selectedLeadData ? (
            <>
              <UserAvatar user={selectedLeadData} size="sm" />
              <span className="truncate">{selectedLeadData.nombre} {selectedLeadData.apellido}</span>
            </>
          ) : (
            <span className="text-gray-500">Seleccionar People Lead</span>
          )}
        </div>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <FiChevronDown 
            className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </span>
      </button>

      {isOpen && (
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
}

export default function LeadList({ users, peopleLeads, onRefresh, sectionVariants }: LeadListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedLead, setSelectedLead] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLeadDropdownOpen, setIsLeadDropdownOpen] = useState(false);
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
    const matchesSearch = searchTerm === "" || 
      `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const isNotPeopleLead = user.role?.numero !== 2;
    return matchesSearch && isNotPeopleLead;
  });

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

  // Handle assign lead action
  const handleAssignLead = async () => {
    if (selectedUsers.size === 0 || !selectedLead) {
      notifications.showError('Selecciona usuarios y un people lead');
      return;
    }

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
      onRefresh();

    } catch (error) {
      console.error('Error assigning lead:', error);
      notifications.showError('Error al asignar people lead');
    } finally {
      setIsAssigning(false);
    }
  };

  // Get current people lead name for a user
  const getCurrentLeadName = (user: User) => {
    if (!user.ID_PeopleLead) return "Sin asignar";
    const lead = peopleLeads.find(l => l.id_usuario === user.ID_PeopleLead);
    return lead ? `${lead.nombre} ${lead.apellido}` : "Lead no encontrado";
  };

  return (
    <>
      {/* Search and Controls */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6"
        variants={sectionVariants}
      >
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white 
                    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 
                    focus:border-purple-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAssignLead}
            disabled={selectedUsers.size === 0 || !selectedLead || isAssigning}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 
                     disabled:from-gray-300 disabled:to-gray-300 text-white px-6 py-2.5 rounded-lg font-medium 
                     transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl 
                     transform hover:scale-105 active:scale-95"
          >
            {isAssigning ? (
              <div className="flex items-center justify-center">
                <FiRefreshCw className="animate-spin mr-2" />
                Asignando...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FiUserPlus className="mr-2" />
                Asignar Lead
              </div>
            )}
          </button>
          
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 
                     transition-colors"
          >
            <FiRefreshCw />
          </button>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div 
        className="bg-gray-50 rounded-lg p-3 mb-6 border border-gray-100 flex items-center text-sm"
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

      {/* Users List */}
      <motion.div variants={sectionVariants}>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiUsers className="mx-auto text-4xl mb-2" />
            <p>No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <LeadListItem
                key={user.id_usuario}
                user={user}
                isSelected={selectedUsers.has(user.id_usuario)}
                onToggleSelection={() => toggleUserSelection(user.id_usuario)}
                currentLeadName={getCurrentLeadName(user)}
              />
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
}

// Export UserAvatar for use in other components
export { UserAvatar };
