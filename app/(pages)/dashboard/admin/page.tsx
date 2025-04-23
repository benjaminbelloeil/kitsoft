/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { FiUsers, FiSettings, FiActivity } from "react-icons/fi";
import { NotificationContainer, useNotificationState } from "@/components/ui/toast-notification";
import UserManagementPanel from "@/components/admin/UserManagementPanel";
import SettingsPanel from "@/components/admin/SettingsPanel";
import LogsPanel from "@/components/admin/LogsPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminDashboardSkeleton from "@/components/admin/AdminDashboardSkeleton";

// Cache key for local storage - more persistent than session storage
const ADMIN_DATA_LOADED_KEY = 'admin_data_loaded_persistent';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const notifications = useNotificationState();
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [visibilityChanged, setVisibilityChanged] = useState(false);

  // Handle visibility changes to prevent unnecessary refreshes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setVisibilityChanged(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Load data only on initial render, and cache the loaded state
  useEffect(() => {
    // Skip if we've already initialized or just changing visibility
    if (hasInitialized && !visibilityChanged) return;

    // Check if we already loaded data in this session
    const dataAlreadyLoaded = localStorage.getItem(ADMIN_DATA_LOADED_KEY) === 'true';

    // If returning from another tab and data was loaded, don't show loading state
    if (visibilityChanged && dataAlreadyLoaded) {
      setIsLoading(false);
      setHasInitialized(true);
      setVisibilityChanged(false);
      return;
    }

    // If data was already loaded in this session, don't show loading state
    if (dataAlreadyLoaded) {
      setIsLoading(false);
      setHasInitialized(true);
      setVisibilityChanged(false);
      return;
    }

    // Otherwise, load data as usual
    const loadData = async () => {
      try {
        // Add real data fetching here
        await Promise.all([
          // Your data fetching promises
          new Promise(resolve => setTimeout(resolve, 800)),
        ]);

        // Mark data as loaded using localStorage for better persistence
        localStorage.setItem(ADMIN_DATA_LOADED_KEY, 'true');
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading admin data:", error);
        setIsLoading(false);
      } finally {
        setHasInitialized(true);
        setVisibilityChanged(false);
      }
    };

    loadData();
  }, [hasInitialized, visibilityChanged]);

  // Function to force refresh data if needed
  const refreshData = () => {
    setIsLoading(true);
    localStorage.removeItem(ADMIN_DATA_LOADED_KEY);
    // Re-initialize everything
    setHasInitialized(false);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Administración</h1>

      <div className="mb-8">
        <p className="text-gray-600">
          Bienvenido al panel de administración. Aquí puedes gestionar usuarios, configurar el sistema y acceder a herramientas administrativas.
        </p>
      </div>

      {/* Tabs navigation - always show this part */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-4 sm:space-x-8">
          <button
            onClick={() => !isLoading && setActiveTab("users")}
            className={`whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "users"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } ${isLoading ? "opacity-70 cursor-wait" : ""}`}
            disabled={isLoading}
          >
            <div className="flex items-center">
              <FiUsers className="mr-2" />
              <span className="hidden sm:inline">Gestión de</span> Usuarios
            </div>
          </button>
          <button
            onClick={() => !isLoading && setActiveTab("settings")}
            className={`whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "settings"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } ${isLoading ? "opacity-70 cursor-wait" : ""}`}
            disabled={isLoading}
          >
            <div className="flex items-center">
              <FiSettings className="mr-2" />
              Configuración
            </div>
          </button>
          <button
            onClick={() => !isLoading && setActiveTab("logs")}
            className={`whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "logs"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } ${isLoading ? "opacity-70 cursor-wait" : ""}`}
            disabled={isLoading}
          >
            <div className="flex items-center">
              <FiActivity className="mr-2" />
              Registros
            </div>
          </button>
        </nav>
      </div>

      {/* Content area with skeletons or actual content */}
      {isLoading ? (
        <>
          {/* UsersPanel Skeleton - only show on users tab */}
          {activeTab === "users" && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <div className="bg-gray-200 w-6 h-6 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="bg-gray-200 h-5 w-44 rounded animate-pulse"></div>
                    <div className="bg-gray-200 h-4 w-64 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="bg-gray-200 w-64 h-9 rounded-md animate-pulse"></div>
                  <div className="bg-gray-200 w-10 h-9 rounded-md animate-pulse"></div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-3 mb-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-gray-200 w-full h-6 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center">
                      <div className="bg-gray-200 rounded-full h-12 w-12 animate-pulse"></div>
                      <div className="ml-4 flex-1">
                        <div className="bg-gray-200 h-5 w-1/3 rounded mb-2 animate-pulse"></div>
                        <div className="bg-gray-200 h-4 w-1/4 rounded mb-1 animate-pulse"></div>
                        <div className="bg-gray-200 h-3 w-1/2 rounded animate-pulse"></div>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <div className="bg-gray-200 rounded-full px-3 py-1 h-7 w-24 animate-pulse"></div>
                        <div className="bg-gray-200 rounded-full w-8 h-8 animate-pulse"></div>
                        <div className="bg-gray-200 rounded-full w-8 h-8 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Panel Skeleton - only show on settings tab */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <div className="bg-gray-200 w-6 h-6 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="bg-gray-200 h-5 w-32 rounded mb-1 animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-48 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 flex justify-center items-center">
                <div className="bg-gray-200 h-5 w-60 rounded animate-pulse"></div>
              </div>
            </div>
          )}

          {/* Logs Panel Skeleton - only show on logs tab */}
          {activeTab === "logs" && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <div className="bg-gray-200 w-6 h-6 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="bg-gray-200 h-5 w-48 rounded mb-1 animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-64 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 flex justify-center items-center">
                <div className="bg-gray-200 h-5 w-60 rounded animate-pulse"></div>
              </div>
            </div>
          )}

          {/* Always show dashboard skeleton */}
          <AdminDashboardSkeleton />
        </>
      ) : (
        <>
          {/* Actual content */}
          {activeTab === "users" && <UserManagementPanel />}
          {activeTab === "settings" && <SettingsPanel />}
          {activeTab === "logs" && <LogsPanel />}
          <AdminDashboard />
        </>
      )}

      {/* Always show notification container */}
      <NotificationContainer
        notifications={notifications.notifications}
        onClose={(id) => notifications.clearNotifications()}
      />
    </div>
  );
}
