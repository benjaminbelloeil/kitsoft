import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Get the path
  const path = request.nextUrl.pathname;
  
  // Check if we're on the home page and redirect to login
  if (path === '/') {
    // Homepage always redirects to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Protected routes that require authentication
  const isProtectedRoute = path.startsWith('/dashboard');
  
  // Public routes that don't require authentication
  const isPublicRoute = ['/login', '/reset-password'].includes(path);
  
  // Attempt to get the session
  const { data: { session } } = await supabase.auth.getSession();
  
  // If trying to access protected route without authentication
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If already authenticated and trying to access login page
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // For all other cases, continue
  return NextResponse.next();
}

// Configure which paths will trigger the middleware
export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/reset-password'],
};
