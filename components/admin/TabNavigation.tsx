"use client";

import { useState } from "react";
import { FiUsers, FiSettings, FiActivity } from "react-icons/fi";

// Tab Button Component for consistent styling
interface TabButtonProps {
  isActive: boolean;
  isLoading: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: React.ReactNode;
}

function TabButton({ isActive, isLoading, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={() => !isLoading && onClick()}
      className={`
        group relative whitespace-nowrap py-3 px-1 font-medium text-sm transition-all duration-200
        ${isActive 
          ? "text-purple-600" 
          : "text-gray-500 hover:text-gray-700"}
        ${isLoading ? "opacity-70 cursor-wait" : "cursor-pointer"}
      `}
      disabled={isLoading}
    >
      <div className="flex items-center">
        {icon}
        {label}
      </div>
      
      {/* Tab bottom highlight */}
      <span
        className={`
          absolute bottom-0 left-0 w-full h-0.5 transform transition-all duration-300 ease
          ${isActive 
            ? "bg-purple-600" 
            : "bg-transparent group-hover:bg-gray-300"}
        `}
      />
    </button>
  );
}

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(false);
  
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
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-6 sm:space-x-8">
        <TabButton 
          isActive={activeTab === "users"} 
          isLoading={isLoading} 
          onClick={() => updateContentVisibility("users")}
          icon={<FiUsers className="mr-2" />}
          label={<><span className="hidden sm:inline">Gestión de</span> Usuarios</>}
        />
        
        <TabButton 
          isActive={activeTab === "settings"} 
          isLoading={isLoading} 
          onClick={() => updateContentVisibility("settings")}
          icon={<FiSettings className="mr-2" />}
          label="Configuración"
        />
        
        <TabButton 
          isActive={activeTab === "logs"} 
          isLoading={isLoading} 
          onClick={() => updateContentVisibility("logs")}
          icon={<FiActivity className="mr-2" />}
          label="Registros"
        />
      </nav>
    </div>
  );
}