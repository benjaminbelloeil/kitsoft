import { Correo } from '@/interfaces/contact';

/**
 * Get all emails for a specific user
 */
export async function getUserEmails(userId: string): Promise<Correo[]> {
  try {
    const res = await fetch(`/api/email/user?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching user emails:', await res.text());
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error('Exception in getUserEmails:', err);
    return [];
  }
}

/**
 * Add a new email for a user
 */
export async function addUserEmail(userId: string, email: string): Promise<boolean> {
  try {
    const res = await fetch('/api/email/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, email }),
    });

    if (!res.ok) {
      console.error('Error adding user email:', await res.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception in addUserEmail:', err);
    return false;
  }
}

/**
 * Delete a user email
 */
export async function deleteUserEmail(emailId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/email/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailId }),
    });

    if (!res.ok) {
      console.error('Error deleting user email:', await res.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception in deleteUserEmail:', err);
    return false;
  }
}
