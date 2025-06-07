/* eslint-disable @next/next/no-img-element */
'use client';

import { motion } from "framer-motion";
import { User } from "lucide-react";

interface RecipientSelectorProps {
  selectedProject: string;
  selectedRecipient: string;
  setSelectedRecipient: (recipientId: string) => void;
  getFilteredRecipients: () => Array<{
    id: string;
    name: string;
    role: string;
    avatar: string | null;
  }>;
}

export default function RecipientSelector({ 
  selectedProject, 
  selectedRecipient, 
  setSelectedRecipient, 
  getFilteredRecipients 
}: RecipientSelectorProps) {
  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <span className="h-2 w-2 bg-[#14B8A6] mr-2 rounded-full"></span>
        Seleccionar destinatario:
      </label>
      <div className="bg-white rounded-md border border-gray-200 shadow-inner p-3">
        <div className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto">
          {getFilteredRecipients().map((recipient: {id: string, name: string, role: string, avatar: string | null}, index: number) => (
            <motion.div
              key={recipient.id}
              onClick={() => setSelectedRecipient(recipient.id)}
              className={`flex items-center p-1.5 rounded-md border text-xs ${
                selectedRecipient === recipient.id
                  ? "border-[#14B8A6] bg-[#14B8A608]" 
                  : "border-gray-200 hover:border-[#14B8A640] hover:bg-[#14B8A605]"
              } cursor-pointer transition-all`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
            >
              <div className="h-5 w-5 rounded-full bg-[#14B8A610] mr-2 flex items-center justify-center overflow-hidden border border-gray-200">
                {recipient.avatar ? (
                  <img 
                    src={recipient.avatar} 
                    alt={recipient.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-3 w-3 text-[#14B8A6]" />
                )}
              </div>
              <div className="ml-1.5 overflow-hidden">
                <p className="text-xs font-medium text-gray-800 truncate">{recipient.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{recipient.role}</p>
              </div>
            </motion.div>
          ))}
          {getFilteredRecipients().length === 0 && selectedProject && (
            <p className="text-xs text-gray-500 py-2 text-center">No hay usuarios asignados a este proyecto</p>
          )}
          {!selectedProject && (
            <p className="text-xs text-gray-500 py-2 text-center">Selecciona un proyecto primero</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
