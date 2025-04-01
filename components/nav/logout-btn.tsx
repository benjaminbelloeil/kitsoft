"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LogoutBtn() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        try {
            setIsLoading(true);
            await supabase.auth.signOut();
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
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
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                ) : (
                    'Logout'
                )}
        </button>
    );
}