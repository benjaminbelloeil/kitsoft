/**
 * Client-side utilities for handling API responses with auth errors
 */

/**
 * Enhanced fetch wrapper that handles auth errors from API responses
 */
export async function fetchWithAuthHandling(
  url: string, 
  options?: RequestInit
): Promise<Response> {
  const response = await fetch(url, options);
  
  // Check for auth errors in the response
  if (response.status === 401) {
    try {
      const errorData = await response.clone().json();
      
      if (errorData.code === 'session_expired' && errorData.redirect) {
        // Redirect to login with session expired message
        if (typeof window !== 'undefined') {
          window.location.href = errorData.redirect;
        }
        throw new Error('Session expired');
      }
    } catch {
      // If we can't parse the response, still redirect for 401s
      if (typeof window !== 'undefined') {
        window.location.href = '/login?message=session_expired';
      }
      throw new Error('Authentication failed');
    }
  }
  
  return response;
}

/**
 * Hook to handle API calls with automatic auth error handling
 */
export async function callApiWithAuth<T>(
  apiCall: () => Promise<Response>
): Promise<T | null> {
  try {
    const response = await apiCall();
    
    if (!response.ok) {
      if (response.status === 401) {
        // Let the fetchWithAuthHandling handle the redirect
        const errorData = await response.json();
        if (errorData.code === 'session_expired' && errorData.redirect) {
          if (typeof window !== 'undefined') {
            window.location.href = errorData.redirect;
          }
        }
        return null;
      }
      throw new Error(`API call failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}
