"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiUserPlus } from "react-icons/fi";

// Tab Button Component for consistent styling
interface TabButtonProps {
  isActive: boolean;
  isLoading: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: React.ReactNode;
  index: number;
}

function TabButton({ isActive, isLoading, onClick, icon, label, index }: TabButtonProps) {
  return (
    <motion.button
      onClick={() => !isLoading && onClick()}
      className={`
        group relative whitespace-nowrap py-3 px-1 font-medium text-sm transition-all duration-200
        ${isActive 
          ? "text-purple-600" 
          : "text-gray-500 hover:text-gray-700"}
        ${isLoading ? "opacity-70 cursor-wait" : "cursor-pointer"}
      `}
      disabled={isLoading}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        className="flex items-center"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
        >
          {icon}
        </motion.div>
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
        >
          {label}
        </motion.span>
      </motion.div>
      
      {/* Tab bottom highlight */}
      <motion.span
        className={`
          absolute bottom-0 left-0 w-full h-0.5 transform transition-all duration-300 ease
          ${isActive 
            ? "bg-purple-600" 
            : "bg-transparent group-hover:bg-gray-300"}
        `}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading] = useState(false);
  
  // Content visibility control based on active tab
  const updateContentVisibility = (tab: string) => {
    setActiveTab(tab);
    
    // Hide all content panels
    document.querySelectorAll('.admin-content-panel').forEach(panel => {
      (panel as HTMLElement).style.display = 'none';
    });
    
    // Show only active panel
    const activePanel = document.getElementById(`admin-panel-${tab}`);
    if (activePanel) {
      activePanel.style.display = 'block';
    }
  };

  return (
    <motion.div 
      className="border-b border-gray-200 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="-mb-px flex space-x-6 sm:space-x-8">
        <TabButton 
          isActive={activeTab === "users"} 
          isLoading={isLoading} 
          onClick={() => updateContentVisibility("users")}
          icon={<FiUsers className="mr-2" />}
          label={<><span className="hidden sm:inline">Gestión de</span> Usuarios</>}
          index={0}
        />
        
        <TabButton 
          isActive={activeTab === "leads"} 
          isLoading={isLoading} 
          onClick={() => updateContentVisibility("leads")}
          icon={<FiUserPlus className="mr-2" />}
          label="Gestión de Lead"
          index={1}
        />
      </nav>
    </motion.div>
  );
}