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

  const {
    data: { user },
  } = await supabase.auth.getUser()

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

  // Check for admin access if user is trying to access admin pages
  if (user && request.nextUrl.pathname.startsWith('/dashboard/admin')) {
    try {
      // Use the API endpoint to check if user is admin
      // Use a relative URL to avoid issues with NEXT_PUBLIC_SITE_URL
      console.log('Middleware: User trying to access admin page:', user.id);
      // Get admin status directly from the database - more reliable in middleware
      const { data: userLevelData } = await supabase
        .from('usuarios_niveles')
        .select('id_nivel_actual')
        .eq('id_usuario', user.id)
        .order('fecha_cambio', { ascending: false })
        .limit(1)
        .single();
      
      if (!userLevelData) {
        throw new Error('User level not found');
      }
      
      const { data: levelDetails } = await supabase
        .from('niveles')
        .select('numero')
        .eq('id_nivel', userLevelData.id_nivel_actual)
        .single();
      
      const isAdmin = levelDetails?.numero === 1;
      
      if (!isAdmin) {
        console.log('Non-admin user tried to access admin page:', user.id);
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error('Error checking admin status in middleware:', error);
      // For safety, if we can't verify admin status, redirect to dashboard
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
  }

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