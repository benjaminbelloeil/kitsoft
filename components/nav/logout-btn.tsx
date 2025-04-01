"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useNavigation } from '@/context/navigation-context';

export default function LogoutBtn() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const { startNavigation } = useNavigation();

    const handleSignOut = async () => {
        try {
            setIsLoading(true);
            // First sign out
            await supabase.auth.signOut();
            
            // Then start the navigation animation
            startNavigation();
            
            // Redirect after a slight delay
            setTimeout(() => {
                router.push('/login');
                router.refresh();
            }, 300);
        } catch (error) {
            console.error("Logout error:", error);
            setIsLoading(false);
        }
    };

    return(
        <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-[#A100FF] hover:bg-[#8c00d9] text-white py-2 px-6 rounded-lg shadow-[4px_4px_8px_0_rgba(161,0,255,0.2)] transition disabled:opacity-70"
            >
                {isLoading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                ) : (
                    'Logout'
                )}
        </button>
    );
}