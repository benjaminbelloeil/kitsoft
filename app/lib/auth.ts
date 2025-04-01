// This file is kept for backward compatibility
// For client-side authentication, use:
// import { createClient } from '@/utils/supabase/client'
// const supabase = createClient()
// await supabase.auth.signInWithPassword({ email, password })

// For server-side authentication, use:
// import { createClient } from '@/utils/supabase/server'
// const supabase = createClient()
// const { data: { user } } = await supabase.auth.getUser()

import { createClient as createServerClient } from '@/utils/supabase/server';
import { createClient as createBrowserClient } from '@/utils/supabase/client';

// This function should only be used in Server Components or API routes
export async function getUser() {
  const supabase = createServerClient();
  const { data } = await (await supabase).auth.getUser();
  return data?.user;
}

// These functions should only be used in Client Components
// Use as a fallback until direct client imports are used everywhere
export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient();
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  const supabase = createBrowserClient();
  return await supabase.auth.signOut();
}

export async function getSession() {
  const supabase = createBrowserClient();
  return await supabase.auth.getSession();
}

export async function resetPassword(email: string) {
  const supabase = createBrowserClient();
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

export async function updatePassword(newPassword: string) {
  const supabase = createBrowserClient();
  return await supabase.auth.updateUser({
    password: newPassword,
  });
}