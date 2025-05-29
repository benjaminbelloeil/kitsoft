import { createServerClient, CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  let user = null;
  let authError: Error | null = null;

  try {
    const { data, error } = await supabase.auth.getUser()
    user = data.user;
    authError = error;
  } catch (error) {
    console.log('Error getting user in middleware:', error);
    authError = error as Error;
  }

  // Handle invalid refresh token errors or auth errors
  const isRefreshTokenError = authError && (
    authError.message?.includes('Invalid Refresh Token') ||
    authError.message?.includes('refresh_token_not_found') ||
    ('code' in authError && (authError as {code: string}).code === 'refresh_token_not_found')
  );

  if (isRefreshTokenError) {
    console.log('Invalid refresh token detected in main middleware, clearing cookies and redirecting to login');
    
    // Clear auth cookies and redirect to login
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('message', 'session_expired')
    const redirectResponse = NextResponse.redirect(redirectUrl)
    
    // Get all cookies and clear any that might be auth-related
    const cookiesToClear = [
      'sb-access-token',
      'sb-refresh-token',
      'supabase-auth-token',
      'sb-localhost-auth-token',
      'sb-127.0.0.1-auth-token'
    ];

    // Also clear cookies that start with your project ref
    const allCookies = request.cookies.getAll();
    allCookies.forEach((cookie) => {
      if (cookie.name.includes('sb-') || cookie.name.includes('supabase')) {
        cookiesToClear.push(cookie.name);
      }
    });

    // Clear all identified cookies
    cookiesToClear.forEach(cookieName => {
      redirectResponse.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    });
    
    return redirectResponse;
  }

  // If not logged in and trying to access a protected route
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // Admin check has been moved to utils/supabase/middleware.ts

  return response
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}