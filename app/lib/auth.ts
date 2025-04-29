import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Server-side utility to get the authenticated user
 * Redirects to login if no user is found
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }
  
  return user;
}

/**
 * Get the authenticated user without redirecting
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

/**
 * Check if the current user has admin privileges
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }
  
  // Get user's role from usuarios_niveles
  const { data } = await supabase
    .from('usuarios_niveles')
    .select(`
      niveles:id_nivel_actual(numero)
    `)
    .eq('id_usuario', user.id)
    .order('fecha_cambio', { ascending: false })
    .limit(1)
    .single();
  
  // Admin is role number 1
  return data?.niveles?.[0]?.numero === 1;
}

/**
 * Sign the user out
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}