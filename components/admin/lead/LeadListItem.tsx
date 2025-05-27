"use client";

import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { User } from "@/interfaces/user";
import { UserAvatar } from "./LeadList";

interface LeadListItemProps {
  user: User;
  isSelected: boolean;
  onToggleSelection: () => void;
  currentLeadName: string;
}

export default function LeadListItem({ 
  user, 
  isSelected, 
  onToggleSelection, 
  currentLeadName 
}: LeadListItemProps) {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm px-5 py-7 border-2 cursor-pointer transition-all duration-200 hover:shadow-md relative ${
        isSelected 
          ? 'border-purple-500 bg-purple-50 z-10' 
          : 'border-gray-100 hover:border-gray-200 z-0'
      }`}
      onClick={onToggleSelection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ 
        y: -1,
        zIndex: 5
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      layout
      style={{ 
        isolation: 'isolate',
        willChange: 'transform'
      }}
    >
      <div className="flex items-center">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
            isSelected
              ? 'border-purple-500 bg-purple-500'
              : 'border-gray-300'
          }`}>
            {isSelected && (
              <FiCheck className="text-white text-sm" />
            )}
          </div>
          
          <div className="flex-shrink-0">
            <UserAvatar user={user} size="md" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {user.nombre} {user.apellido}
              </h3>
            </div>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <p className="text-sm text-gray-500 truncate">
              {user.titulo || 'Sin título profesional'}
            </p>
          </div>
        </div>
        
        <div className="text-right ml-6 flex-shrink-0">
          <p className="text-sm font-medium text-gray-700 mb-1">
            {user.role?.titulo || 'Sin rol'}
          </p>
          <div className="text-xs">
            {user.ID_PeopleLead ? (
              <div className="flex items-center justify-end space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium truncate max-w-32">
                  {currentLeadName}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-end space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-500">Sin People Lead</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
