/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useNavigation } from '@/context/navigation-context';
import { useUser } from '@/context/user-context';
import { ensureUserHasLevel } from '@/utils/database/client/userLevelSync';
import { handleAuthError } from '@/utils/auth/error-handler';

// Utility function to handle invalid refresh token errors
// Clears the auth state and redirects to login
export async function handleInvalidRefreshToken() {
  await handleAuthError({ message: 'Invalid refresh token' });
}

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

  // Check for session expiration message on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const message = urlParams.get('message');
      
      if (message === 'session_expired') {
        setError('Your session has expired. Please sign in again.');
        // Clear the URL parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

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
          await ensureUserHasLevel(data.user.id);
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
        const { data, error } = await supabase.auth.getSession();
        
        // Handle invalid refresh token errors
        if (error && error.message?.includes('Invalid Refresh Token')) {
          console.log('Invalid refresh token detected in auth check, clearing auth state');
          await handleInvalidRefreshToken();
          return;
        }
        
        const session = data.session;
        
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
          
          // Ensure user has a role assigned
          await ensureUserHasLevel(session.user.id);
          
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
      async (event, session) => {
        // Handle sign out events or invalid token errors
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        
        if (session) {
          try {
            // Ensure user has a role assigned
            await ensureUserHasLevel(session.user.id);
            
            // Update user role information when auth state changes
            await refreshUserRole();
          } catch (error) {
            console.error('Error in auth state change handler:', error);
            // If there's an error, it might be due to invalid tokens
            if (error instanceof Error && error.message?.includes('Invalid Refresh Token')) {
              await handleInvalidRefreshToken();
            }
          }
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