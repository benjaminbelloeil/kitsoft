/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useNavigation } from '@/context/navigation-context';
import { useUser } from '@/context/user-context';
import { ensureUserHasRole } from '@/utils/database/client/userRoleSync';

// Hook for handling login form state and submission
export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { startNavigation } = useNavigation();
  const { refreshUserRole } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) {
        setError(authError.message);
        setIsLoading(false);
      } else {
        // Ensure user has a role assigned (level 0 by default)
        if (data?.user) {
          await ensureUserHasRole(data.user.id);
        }
        
        // Refresh user role information
        await refreshUserRole();
        
        // Only start navigation animation after successful authentication
        startNavigation();
        
        // Redirect after a slight delay to ensure the animation shows
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 300);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error(err);
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  };
}

// Hook for checking authentication status
export function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const { refreshUserRole } = useUser();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
          
          // Ensure user has a role assigned
          await ensureUserHasRole(session.user.id);
          
          // Update user role information
          await refreshUserRole();
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        
        if (session) {
          // Ensure user has a role assigned
          await ensureUserHasRole(session.user.id);
          
          // Update user role information when auth state changes
          await refreshUserRole();
        }
        
        setIsLoading(false);
      }
    );

    checkAuth();
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, router, refreshUserRole]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    handleSignOut,
  };
}