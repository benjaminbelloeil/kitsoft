"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from "@/app/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and redirect accordingly
    const checkAuth = async () => {
      try {
        const { data } = await getSession();
        
        if (data?.session) {
          // If authenticated, redirect to dashboard
          router.push('/dashboard');
        } else {
          // If not authenticated, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // On error, redirect to login as fallback
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  // Show a loading state while checking auth
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accenture"></div>
    </div>
  );
}
