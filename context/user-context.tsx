"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
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
      
      // Get the user's current role from usuarios_niveles
      const { data: userNivel, error } = await supabase
        .from('usuarios_niveles')
        .select(`
          id_nivel_actual,
          niveles:id_nivel_actual(id_nivel, numero, titulo, descripcion)
        `)
        .eq('id_usuario', user.id)
        .order('fecha_cambio', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error || !userNivel || !userNivel.niveles) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
        setIsAdmin(false);
      } else {
        // Handle niveles as the correct type - it appears to be an array in the response
        const roleData = Array.isArray(userNivel.niveles) ? userNivel.niveles[0] : userNivel.niveles;
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
    await fetchUserRole();
  };
  
  useEffect(() => {
    fetchUserRole();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
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
