import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Sign in with email and password
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

// Sign out the current user
export async function signOut() {
  return await supabase.auth.signOut();
}

// Get the current session
export async function getSession() {
  return await supabase.auth.getSession();
}

// Get the current user
export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user;
}

// Request a password reset email
export async function resetPassword(email: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

// Update user password
export async function updatePassword(newPassword: string) {
  return await supabase.auth.updateUser({
    password: newPassword,
  });
}