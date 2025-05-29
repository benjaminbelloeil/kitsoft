/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Server-side auth error handler for API routes
 */

import { NextResponse } from 'next/server';

/**
 * Check if an error is related to invalid refresh tokens
 */
export function isAuthError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = error.message || error.error_description || '';
  const errorCode = error.code || '';
  
  return (
    errorMessage.includes('Invalid Refresh Token') ||
    errorMessage.includes('refresh_token_not_found') ||
    errorCode === 'refresh_token_not_found' ||
    errorMessage.includes('Invalid JWT') ||
    errorMessage.includes('JWT expired') ||
    errorMessage.includes('session_not_found')
  );
}

/**
 * Handle auth errors in API routes
 */
export function handleApiAuthError(error: any): NextResponse {
  console.log('API auth error detected:', error);
  
  return NextResponse.json(
    { 
      error: 'Authentication session expired',
      code: 'session_expired',
      details: 'Please log in again'
    },
    { 
      status: 401,
      headers: {
        'Clear-Site-Data': '"cookies", "storage"'
      }
    }
  );
}

/**
 * Wrapper for API route handlers that handles auth errors
 */
export function withAuthErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (isAuthError(error)) {
        return handleApiAuthError(error);
      }
      throw error;
    }
  };
}
