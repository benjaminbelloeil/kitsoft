/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiUserPlus, FiSearch } from "react-icons/fi";
import { User } from "@/interfaces/user";
import { useNotificationState } from "@/components/ui/toast-notification";
import LeadList from "./LeadList";
import LeadManagementSkeleton from "./LeadManagementSkeleton";

export interface PeopleLead {
  id_usuario: string;
  nombre: string;
  apellido: string;
  titulo?: string;
  url_avatar?: string | null;
}

// Cache keys for lead management data
const LEAD_MANAGEMENT_DATA_KEY = 'lead_management_data';
const LEAD_MANAGEMENT_TIMESTAMP_KEY = 'lead_management_timestamp';

export default function LeadManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [peopleLeads, setPeopleLeads] = useState<PeopleLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [lastVisibilityCheck, setLastVisibilityCheck] = useState<number>(0);
  const [search, setSearch] = useState("");
  const notifications = useNotificationState();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Load cached data with shorter cache time for people leads
  const loadCachedData = () => {
    try {
      const cachedData = localStorage.getItem(LEAD_MANAGEMENT_DATA_KEY);
      const cachedTimestamp = localStorage.getItem(LEAD_MANAGEMENT_TIMESTAMP_KEY);
      
      if (cachedData && cachedTimestamp) {
        const data = JSON.parse(cachedData);
        const timestamp = parseInt(cachedTimestamp);
        const now = Date.now();
        const twoMinutes = 2 * 60 * 1000; // Shorter cache for lead data
        
        // Use cached data if it's less than 2 minutes old
        if (now - timestamp < twoMinutes && data.users && data.peopleLeads) {
          setUsers(data.users);
          setPeopleLeads(data.peopleLeads);
          setDataLoaded(true);
          return true;
        }
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
    return false;
  };

  // Update cache function
  const updateCache = (usersData: User[], leadsData: PeopleLead[]) => {
    try {
      localStorage.setItem(LEAD_MANAGEMENT_DATA_KEY, JSON.stringify({
        users: usersData,
        peopleLeads: leadsData
      }));
      localStorage.setItem(LEAD_MANAGEMENT_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error updating cache:', error);
    }
  };

  // Fetch all users and people leads
  const fetchData = async (force = false) => {
    // Only show loading if we don't have data or it's a forced refresh
    if (!dataLoaded || force) {
      setLoading(true);
    }
    
    try {
      // Fetch all users
      const usersResponse = await fetch('/api/admin/users/list', {
        cache: 'no-store', // Ensure fresh data
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      const usersData = await usersResponse.json();
      const users = usersData.users || [];

      // Fetch people leads with no cache
      const leadsResponse = await fetch('/api/admin/leads/list', {
        cache: 'no-store', // Ensure fresh data
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!leadsResponse.ok) {
        throw new Error('Failed to fetch people leads');
      }
      const leadsData = await leadsResponse.json();

      setUsers(users);
      setPeopleLeads(leadsData || []);
      setDataLoaded(true);
      
      // Update cache
      updateCache(users, leadsData || []);

      console.log('Refreshed lead data - People leads found:', leadsData?.length || 0);

    } catch (error) {
      console.error('Error fetching data:', error);
      notifications.showError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Clear cache when component mounts (force fresh data)
  const clearCache = () => {
    try {
      localStorage.removeItem(LEAD_MANAGEMENT_DATA_KEY);
      localStorage.removeItem(LEAD_MANAGEMENT_TIMESTAMP_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Check if panel is visible
  const checkVisibility = useCallback(() => {
    const panel = document.getElementById('admin-panel-leads');
    return panel && panel.style.display !== 'none';
  }, []);

  // Initial setup - always fetch fresh data
  useEffect(() => {
    if (!hasInitialized) {
      clearCache(); // Clear any stale cache
      setHasInitialized(true);
      
      // Check if panel is visible and fetch data
      if (checkVisibility()) {
        fetchData(true); // Force fresh data
      }
    }
  }, [hasInitialized]);

  // Watch for panel visibility changes and always refresh when becoming visible
  useEffect(() => {
    const panel = document.getElementById('admin-panel-leads');
    if (panel) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const target = mutation.target as HTMLElement;
            const now = Date.now();
            
            // Panel becomes visible
            if (target.style.display !== 'none' && hasInitialized) {
              // Always refresh if it's been more than 30 seconds since last check
              // or if we don't have data
              if (now - lastVisibilityCheck > 30000 || !dataLoaded) {
                console.log('Panel became visible, refreshing data...');
                setLastVisibilityCheck(now);
                fetchData(true); // Force refresh
              }
            }
          }
        });
      });

      observer.observe(panel, {
        attributes: true,
        attributeFilter: ['style']
      });

      return () => observer.disconnect();
    }
  }, [hasInitialized, dataLoaded, lastVisibilityCheck]);

  // Listen for storage events (when user management updates users)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_management_data' && checkVisibility()) {
        console.log('User management data changed, refreshing lead data...');
        // User data was updated, refresh our data
        setTimeout(() => {
          fetchData(true);
        }, 1000); // Small delay to ensure API has processed the changes
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 admin-content-panel"
      id="admin-panel-leads"
      style={{ display: 'none' }}
    >
      {/* Header - Updated to match UserManagement layout */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        variants={sectionVariants}
      >
        <div className="flex items-center text-purple-800">
          <motion.div 
            className="bg-purple-100 p-2 rounded-lg mr-3"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <FiUserPlus className="text-2xl text-purple-600" />
          </motion.div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Gestión de People Leads</h2>
            <p className="text-sm text-gray-500">Asigna people leads a los usuarios</p>
          </div>
        </div>
        
        {/* Search Bar - Updated placeholder text */}
        <motion.div 
          className="relative max-w-md w-full sm:w-64"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.input
            type="text"
            placeholder="Buscar usuarios por nombre, email o rol..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
          <div className="absolute left-0 top-0 h-full flex items-center justify-center pl-3">
            <FiSearch className="text-gray-400 h-4 w-4" />
          </div>
        </motion.div>
      </motion.div>

      {loading && !dataLoaded ? (
        <LeadManagementSkeleton />
      ) : (
        <LeadList 
          users={users}
          peopleLeads={peopleLeads}
          onRefresh={() => fetchData(true)} // Force refresh when explicitly called
          sectionVariants={sectionVariants}
          search={search}
          setSearch={setSearch}
        />
      )}
    </motion.div>
  );
}
