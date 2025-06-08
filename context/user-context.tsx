"use client";

import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";
import { createClient } from '@/utils/supabase/client';

type UserRole = {
  id_nivel: string;
  numero: number;
  titulo: string;
  descripcion: string;
};

type UserContextType = {
	userId: string | null
  userRole: UserRole | null;
  isAdmin: boolean;
  isProjectLead: boolean;
  isPeopleLead: boolean; // Added people lead check
  isProjectManager: boolean; // Added project manager check
  isLoading: boolean;
  refreshUserRole: () => Promise<void>;  // Keep the name for backward compatibility
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProjectLead, setIsProjectLead] = useState(false);
  const [isPeopleLead, setIsPeopleLead] = useState(false); // Added state for people lead
  const [isProjectManager, setIsProjectManager] = useState(false); // Added state for project manager
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  
  // Define fetchUserLevel with supabase as a parameter to avoid dependency issues
  const fetchUserLevel = async () => {
    try {
      setIsLoading(true);
      
      // First get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setUserRole(null);
        setIsAdmin(false);
        setIsProjectLead(false);
        setIsPeopleLead(false); // Reset people lead state
        setIsProjectManager(false); // Reset project manager state
        setIsLoading(false);
        return;
      }
      
      // Get the user's level via API
      const levelResponse = await fetch('/api/user/level/get-level', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!levelResponse.ok) {
        console.error("Error fetching user level:", await levelResponse.text());
        setUserRole(null);
        setIsAdmin(false);
        setIsProjectLead(false);
        setIsPeopleLead(false); // Reset people lead state
        setIsProjectManager(false); // Reset project manager state
      } else {
        const levelData = await levelResponse.json();
        setUserRole(levelData as UserRole);
		setUserId(user.id);
        
        // Explicitly check if user is admin (nivel.numero === 1)
        if (levelData && levelData.numero === 1) {
          setIsAdmin(true);
          setIsProjectLead(false);
          setIsPeopleLead(false);
          setIsProjectManager(false);
        } 
        // Check if user is people lead (nivel.numero === 2)
        else if (levelData && levelData.numero === 2) {
          console.log("User is PEOPLE LEAD with level number:", levelData.numero);
          setIsAdmin(false);
          setIsProjectLead(false);
          setIsPeopleLead(true);
          setIsProjectManager(false);
        } 
        // Check if user is project lead (nivel.numero === 3)
        else if (levelData && levelData.numero === 3) {
          console.log("User is PROJECT LEAD with level number:", levelData.numero);
          setIsAdmin(false);
          setIsProjectLead(true);
          setIsPeopleLead(false);
          setIsProjectManager(false);
        } 
        // Check if user is project manager (nivel.numero === 4)
        else if (levelData && levelData.numero === 4) {
          console.log("User is PROJECT MANAGER with level number:", levelData.numero);
          setIsAdmin(false);
          setIsProjectLead(false);
          setIsPeopleLead(false);
          setIsProjectManager(true);
        } 
        else {
          console.log("User is regular user with level number:", levelData?.numero);
          setIsAdmin(false);
          setIsProjectLead(false);
          setIsPeopleLead(false);
          setIsProjectManager(false);
        }
      }
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      setUserRole(null);
      setIsAdmin(false);
      setIsProjectLead(false);
      setIsPeopleLead(false);
      setIsProjectManager(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshUserLevel = async () => {
    await memoizedFetchUserLevel();
  };
  
  // Use useCallback to prevent infinite loop with useEffect dependency
  const memoizedFetchUserLevel = useCallback(fetchUserLevel, [supabase]);
  
  useEffect(() => {
    memoizedFetchUserLevel();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      memoizedFetchUserLevel();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [memoizedFetchUserLevel, supabase.auth]);
  
  return (
    <UserContext.Provider value={{ 
		userId,
      userRole, 
      isAdmin, 
      isProjectLead,
      isPeopleLead,
      isProjectManager,
      isLoading, 
      refreshUserRole: refreshUserLevel 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
