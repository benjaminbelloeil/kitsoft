import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, getSession } from '@/app/lib/auth';

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
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        // Redirect after successful login
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
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

// Hook for checking authentication status
export function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const checkAuth = async () => {
    const { data } = await getSession();
    const session = data.session;
    
    if (session) {
      setIsAuthenticated(true);
      setUser(session.user);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    
    return !!session;
  };

  const handleSignOut = async () => {
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