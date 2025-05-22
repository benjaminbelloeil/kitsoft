import { createServerClient, CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create a response object that we can modify
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
          // NOTE: When working with cookies in middleware, you have to both:
          // 1. Set the cookie in the Request object for downstream use
          request.cookies.set({
            name,
            value,
            ...options,
          })
          
          // 2. Also set it in the Response object to be sent to the browser
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

  // IMPORTANT: DO NOT add code between createServerClient and
  // supabase.auth.getUser() to avoid unexpected auth issues
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
      console.log('Middleware: User trying to access admin page:', user.id);
      // Use the API endpoint to check if user is admin with absolute URL constructed from request
      const origin = request.nextUrl.origin; // Get the origin (protocol + hostname + port)
      const apiUrl = `${origin}/api/user/level/is-admin`;
      console.log('Middleware: Calling admin check API at:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: { 
          'Authorization': `Bearer ${await supabase.auth.getSession().then(res => res.data.session?.access_token || '')}` 
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify admin status');
      }
      
      const { isAdmin } = await response.json();
      
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

  // Check for project lead access if user is trying to access project lead pages
  if (user && request.nextUrl.pathname.startsWith('/dashboard/projects')) {
    try {
      console.log('Middleware: User trying to access project lead page:', user.id);
      // Use the API endpoint to check if user is project lead with absolute URL constructed from request
      const origin = request.nextUrl.origin; // Get the origin (protocol + hostname + port)
      const apiUrl = `${origin}/api/user/level/is-project-lead`;
      console.log('Middleware: Calling project lead check API at:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: { 
          'Authorization': `Bearer ${await supabase.auth.getSession().then(res => res.data.session?.access_token || '')}` 
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify project lead status');
      }
      
      const { isProjectLead } = await response.json();
      
      if (!isProjectLead) {
        console.log('Non-project-lead user tried to access projects page:', user.id);
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error('Error checking project lead status in middleware:', error);
      // For safety, if we can't verify status, redirect to dashboard
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Check for project manager access if user is trying to access project manager pages
  if (user && (request.nextUrl.pathname.startsWith('/dashboard/proyectos/manager') || 
               request.nextUrl.pathname.startsWith('/dashboard/management'))) {
    try {
      console.log('Middleware: User trying to access project manager page:', user.id);
      // Use the API endpoint to check if user is project manager with absolute URL constructed from request
      const origin = request.nextUrl.origin; // Get the origin (protocol + hostname + port)
      const apiUrl = `${origin}/api/user/level/is-project-manager`;
      console.log('Middleware: Calling project manager check API at:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: { 
          'Authorization': `Bearer ${await supabase.auth.getSession().then(res => res.data.session?.access_token || '')}` 
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify project manager status');
      }
      
      const { isProjectManager } = await response.json();
      
      if (!isProjectManager) {
        console.log('Non-project-manager user tried to access management page:', user.id);
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error('Error checking project manager status in middleware:', error);
      // For safety, if we can't verify status, redirect to dashboard
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response
}

// Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.
// Always use supabase.auth.getUser() to protect pages and user data.
// Never trust supabase.auth.getSession() inside server code such as middleware. It isn't guaranteed to revalidate the Auth token.
// It's safe to trust getUser() because it sends a request to the Supabase Auth server every time to revalidate the Auth token.