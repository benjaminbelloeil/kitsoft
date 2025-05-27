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
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-purple-500 bg-purple-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
      }`}
      onClick={onToggleSelection}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      layout
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
            isSelected
              ? 'border-purple-500 bg-purple-500'
              : 'border-gray-300'
          }`}>
            {isSelected && (
              <FiCheck className="text-white text-xs" />
            )}
          </div>
          
          <UserAvatar user={user} size="md" />
          
          <div>
            <h3 className="font-medium text-gray-900">
              {user.nombre} {user.apellido}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">
            {user.role?.titulo || 'Sin rol'}
          </p>
          <div className="text-xs">
            {user.ID_PeopleLead ? (
              <div className="flex items-center justify-end space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">
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
