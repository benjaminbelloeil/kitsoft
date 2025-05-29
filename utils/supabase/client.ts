import { createBrowserClient } from '@supabase/ssr'
import { handleAuthError, isInvalidRefreshTokenError } from '@/utils/auth/error-handler'

export function createClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Add global auth error handler
  client.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT' && !session) {
      // Clear any remaining auth data when signed out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
      }
    }
    
    // Handle token refresh failures
    if (event === 'TOKEN_REFRESHED' && !session) {
      console.log('Token refresh failed, handling auth error');
      await handleAuthError({ message: 'Token refresh failed' });
    }
  });

  // Add error interceptor for API calls
  const originalRequest = client.auth.getUser;
  client.auth.getUser = async () => {
    try {
      return await originalRequest.call(client.auth);
    } catch (error) {
      if (isInvalidRefreshTokenError(error)) {
        await handleAuthError(error);
        throw error;
      }
      throw error;
    }
  };
  
  return client;
}