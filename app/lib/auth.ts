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
  try {
    // Direct database check for server-side API routes
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return false;
    }

    // Get the user's current level ID
    const { data: userLevelData, error: levelError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();

    if (levelError) {
      console.error('Error getting user level:', levelError);
      return false;
    }

    // Get the level details to check the numero
    const { data: levelDetails, error: detailsError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userLevelData.id_nivel_actual)
      .single();

    if (detailsError) {
      console.error('Error getting level details:', detailsError);
      return false;
    }

    // Check if numero equals 5 (Admin)
    return levelDetails.numero === 5;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Check if the current user has project lead privileges (level 3)
 */
export async function isProjectLead(): Promise<boolean> {
  try {
    // Direct database check for server-side API routes
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return false;
    }

    // Get the user's current level ID
    const { data: userLevelData, error: levelError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();

    if (levelError) {
      console.error('Error getting user level:', levelError);
      return false;
    }

    // Get the level details to check the numero
    const { data: levelDetails, error: detailsError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userLevelData.id_nivel_actual)
      .single();

    if (detailsError) {
      console.error('Error getting level details:', detailsError);
      return false;
    }

    // Check if numero equals 3 (Project Lead)
    return levelDetails.numero === 3;
  } catch (error) {
    console.error('Error checking project lead status:', error);
    return false;
  }
}

/**
 * Check if the current user has project manager privileges (level 4)
 */
export async function isProjectManager(): Promise<boolean> {
  try {
    // Direct database check for server-side API routes
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return false;
    }

    // Get the user's current level ID
    const { data: userLevelData, error: levelError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();

    if (levelError) {
      console.error('Error getting user level:', levelError);
      return false;
    }

    // Get the level details to check the numero
    const { data: levelDetails, error: detailsError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userLevelData.id_nivel_actual)
      .single();

    if (detailsError) {
      console.error('Error getting level details:', detailsError);
      return false;
    }

    // Check if numero equals 4 (Project Manager)
    return levelDetails.numero === 4;
  } catch (error) {
    console.error('Error checking project manager status:', error);
    return false;
  }
}

/**
 * Sign the user out
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}