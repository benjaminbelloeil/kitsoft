import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { handleAuthError, isInvalidRefreshTokenError } from '@/utils/auth/error-handler'
import { DEMO_SESSION_COOKIE, DEMO_USER_EMAIL, DEMO_USER_ID, isDemoMode } from '@/lib/demo/config'

const DEMO_USER = {
  id: DEMO_USER_ID,
  aud: 'authenticated',
  role: 'authenticated',
  email: DEMO_USER_EMAIL,
  app_metadata: { provider: 'demo', providers: ['demo'] },
  user_metadata: { full_name: 'Daniela Ortega' },
  created_at: '2019-03-11T00:00:00.000Z',
}

const DEMO_SESSION = {
  access_token: 'demo-access-token',
  refresh_token: 'demo-refresh-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: 4102444800,
  user: DEMO_USER,
}

/**
 * Stand-in for the browser Supabase client when no project is configured.
 * Only implements the auth methods this app actually calls.
 *
 * Must be a singleton: createBrowserClient returns the same instance on every
 * call, and callers put `supabase` / `supabase.auth` in hook dependency arrays.
 * Returning a fresh object each call changes those deps on every render and
 * spins UserProvider into an infinite update loop.
 */
let demoClientInstance: ReturnType<typeof buildDemoClient> | null = null

function buildDemoClient() {
  const setCookie = (value: string, maxAge: number) => {
    if (typeof document !== 'undefined') {
      document.cookie = `${DEMO_SESSION_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
    }
  }

  return {
    auth: {
      getUser: async () => ({ data: { user: DEMO_USER }, error: null }),
      getSession: async () => ({ data: { session: DEMO_SESSION }, error: null }),
      onAuthStateChange: (
        _callback?: (event: string, session: typeof DEMO_SESSION | null) => void
      ) => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signInWithPassword: async () => {
        setCookie('1', 60 * 60 * 24 * 7)
        return { data: { user: DEMO_USER, session: DEMO_SESSION }, error: null }
      },
      signOut: async () => {
        setCookie('', 0)
        return { error: null }
      },
    },
  }
}

function getDemoClient() {
  if (!demoClientInstance) {
    demoClientInstance = buildDemoClient()
  }
  return demoClientInstance
}

export function createClient(): SupabaseClient {
  if (isDemoMode()) {
    return getDemoClient() as unknown as SupabaseClient
  }

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