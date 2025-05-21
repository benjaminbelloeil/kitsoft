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
  userRole: UserRole | null;
  isAdmin: boolean;
  isLoading: boolean;
  refreshUserRole: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  
  // Define fetchUserRole with supabase as a parameter to avoid dependency issues
  const fetchUserRole = async () => {
    try {
      setIsLoading(true);
      
      // First get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setUserRole(null);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      // Get the user's role via API
      const roleResponse = await fetch('/api/user/level/get-role', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!roleResponse.ok) {
        console.error("Error fetching user role:", await roleResponse.text());
        setUserRole(null);
        setIsAdmin(false);
      } else {
        const roleData = await roleResponse.json();
        setUserRole(roleData as UserRole);
        
        // Explicitly check if user is admin (nivel.numero === 1)
        if (roleData && roleData.numero === 1) {
          console.log("User is ADMIN with role number:", roleData.numero);
          setIsAdmin(true);
        } else {
          console.log("User is NOT admin with role number:", roleData?.numero);
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      setUserRole(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshUserRole = async () => {
    await memoizedFetchUserRole();
  };
  
  // Use useCallback to prevent infinite loop with useEffect dependency
  const memoizedFetchUserRole = useCallback(fetchUserRole, [supabase]);
  
  useEffect(() => {
    memoizedFetchUserRole();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      memoizedFetchUserRole();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [memoizedFetchUserRole, supabase.auth]);
  
  return (
    <UserContext.Provider value={{ userRole, isAdmin, isLoading, refreshUserRole }}>
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
