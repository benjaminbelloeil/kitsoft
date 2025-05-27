/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiUserPlus } from "react-icons/fi";
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

export default function LeadManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [peopleLeads, setPeopleLeads] = useState<PeopleLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
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

  // Fetch all users and people leads
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all users
      const usersResponse = await fetch('/api/admin/users/list');
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      const usersData = await usersResponse.json();
      setUsers(usersData.users || []);

      // Fetch people leads
      const leadsResponse = await fetch('/api/admin/leads/list');
      if (!leadsResponse.ok) {
        throw new Error('Failed to fetch people leads');
      }
      const leadsData = await leadsResponse.json();
      setPeopleLeads(leadsData || []);

      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      notifications.showError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Check if panel is visible
  const checkVisibility = useCallback(() => {
    const panel = document.getElementById('admin-panel-leads');
    return panel && panel.style.display !== 'none';
  }, []);

  // Initial data fetch only when component mounts and is visible
  useEffect(() => {
    if (checkVisibility() && !dataLoaded) {
      fetchData();
    }

    const panel = document.getElementById('admin-panel-leads');
    if (panel) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const target = mutation.target as HTMLElement;
            if (target.style.display !== 'none' && !dataLoaded) {
              fetchData();
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
      {/* Header */}
      <motion.div 
        className="flex items-center text-purple-800 mb-6"
        variants={sectionVariants}
      >
        <div className="bg-purple-100 p-2 rounded-lg mr-3">
          <FiUserPlus className="text-2xl text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Gestión de People Leads</h2>
          <p className="text-sm text-gray-500">Asigna people leads a los usuarios</p>
        </div>
      </motion.div>

      {loading ? (
        <LeadManagementSkeleton />
      ) : (
        <LeadList 
          users={users}
          peopleLeads={peopleLeads}
          onRefresh={fetchData}
          sectionVariants={sectionVariants}
        />
      )}
    </motion.div>
  );
}
