import { createClient } from '@supabase/supabase-js';
import type { AuthError, Session, User } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface SignInResponse {
  data: {
    session: Session | null;
    user: User | null;
  } | null;
  error: AuthError | { message: string } | null;
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<SignInResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  } catch (error: unknown) {
    console.error('Error signing in:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign in. Please try again.';
    return { 
      data: null, 
      error: { message: errorMessage } 
    };
  }
}

// Sign out the current user
export async function signOut(): Promise<{ error: AuthError | { message: string } | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error: unknown) {
    console.error('Error signing out:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign out. Please try again.';
    return { 
      error: { message: errorMessage } 
    };
  }
}

// Get the current session
export async function getSession(): Promise<{ data: { session: Session | null } | null; error: AuthError | { message: string } | null }> {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { data: data || { session: null }, error };
  } catch (error: unknown) {
    console.error('Error getting session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get session.';
    return { 
      data: { session: null }, 
      error: { message: errorMessage } 
    };
  }
}

// Get the current user
export async function getUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user || null;
  } catch (error: unknown) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Request a password reset email
export async function resetPassword(email: string): Promise<{ data: object | null; error: AuthError | { message: string } | null }> {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
    });
    return { data, error };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email.';
    return { 
      data: null, 
      error: { message: errorMessage } 
    };
  }
}

// Update user password
export async function updatePassword(newPassword: string): Promise<{ data: { user: User | null } | null; error: AuthError | { message: string } | null }> {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update password.';
    return { 
      data: null, 
      error: { message: errorMessage } 
    };
  }
}

// Set up auth state change listener
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  try {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return { data };
  } catch (error) {
    console.error('Error setting up auth listener:', error);
    return { data: null };
  }
}