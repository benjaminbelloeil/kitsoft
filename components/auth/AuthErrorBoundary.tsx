/**
 * Auth error boundary component to catch and handle auth errors globally
 */
'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { handleAuthError, isInvalidRefreshTokenError } from '@/utils/auth/error-handler';

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
}

export function AuthErrorBoundary({ children }: AuthErrorBoundaryProps) {
  useEffect(() => {
    const supabase = createClient();

    // Listen for auth state changes and handle errors
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Handle sign in errors
      if (event === 'SIGNED_IN' && !session) {
        console.log('Sign in failed - no session received');
      }
      
      // Handle token refresh errors
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.log('Token refresh failed - no session received');
        await handleAuthError({ message: 'Token refresh failed' });
      }
    });

    // Global error handler for unhandled promise rejections
    const handleUnhandledRejection = async (event: PromiseRejectionEvent) => {
      if (isInvalidRefreshTokenError(event.reason)) {
        event.preventDefault(); // Prevent the default unhandled rejection behavior
        await handleAuthError(event.reason);
      }
    };

    // Global error handler for window errors
    const handleWindowError = async (event: ErrorEvent) => {
      if (isInvalidRefreshTokenError(event.error)) {
        event.preventDefault(); // Prevent the default error behavior
        await handleAuthError(event.error);
      }
    };

    // Add global error listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleWindowError);

    // Cleanup function
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleWindowError);
    };
  }, []);

  return <>{children}</>;
}
