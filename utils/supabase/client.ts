import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Add global auth error handler
  client.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' && !session) {
      // Clear any remaining auth data when signed out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
      }
    }
  });

  return client;
}