import { createClient } from '@/utils/supabase/client';
import { Correo } from '@/interfaces/contact';

/**
 * Get all emails for a specific user
 */
export async function getUserEmails(userId: string): Promise<Correo[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('Correos')
    .select('*')
    .eq('ID_Usuario', userId);
  
  if (error || !data) {
    console.error('Error fetching user emails:', error);
    return [];
  }
  
  return data as Correo[];
}

/**
 * Add a new email for a user
 */
export async function addUserEmail(userId: string, email: string): Promise<boolean> {
  const supabase = createClient();
  
  // Extract domain for type
  const domain = email.split('@')[1]?.split('.')[0] || 'other';
  
  const { error } = await supabase
    .from('Correos')
    .insert({
      ID_Correo: crypto.randomUUID(),
      Correo: email,
      ID_Usuario: userId,
      Tipo: domain
    });
  
  if (error) {
    console.error('Error adding user email:', error);
    return false;
  }
  
  return true;
}

/**
 * Delete a user email
 */
export async function deleteUserEmail(emailId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('Correos')
    .delete()
    .eq('ID_Correo', emailId);
  
  if (error) {
    console.error('Error deleting user email:', error);
    return false;
  }
  
  return true;
}
