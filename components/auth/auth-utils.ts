import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, getSession } from '@/app/lib/auth';
import { supabase } from '@/app/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

// Hook for handling login form state and submission
export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn(email, password);
      
      if (result.error) {
        setError(result.error.message || "Invalid email or password");
      } else if (result.data?.session) {
        // Redirect after successful login
        router.push('/dashboard');
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error(err);
    } finally {
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

// Define a type for the authentication state
interface AuthState {
  isAuthenticated: boolean | null;
  user: User | null;
  checkAuth: () => Promise<boolean>;
  handleSignOut: () => Promise<void>;
}

// Hook for checking authentication status
export function useAuthCheck(): AuthState {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const checkInitialSession = async () => {
      try {
        const result = await getSession();
        
        if (result.data?.session) {
          setIsAuthenticated(true);
          setUser(result.data.session.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    
    checkInitialSession();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: string, session: Session | null) => {
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    );
    
    // Clean up subscription
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const result = await getSession();
      
      if (result.data?.session) {
        setIsAuthenticated(true);
        setUser(result.data.session.user);
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return {
    isAuthenticated,
    user,
    checkAuth,
    handleSignOut,
  };
}