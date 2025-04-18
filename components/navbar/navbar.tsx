"use client";
/* eslint-disable @next/next/no-img-element */
import NavLink from "@/components/navbar/navlink"
import LogoutBtn from "@/components/navbar/logout-btn"

export default function Navbar() {
    return (
        <div className="flex flex-col h-full w-[320px] bg-white border-r border-gray-100 shadow-sm">
            <div className="flex h-full flex-col py-4">
                <div className="flex justify-center py-3 mb-4 w-full ">
                    <img 
                        src="/accentureLogo.png" 
                        alt="Accenture Logo" 
                        className="h-12 max-w-[180px] object-contain"
                    />
                </div>
                
                <NavLink />
                
                <div className="mt-auto mb-4 px-4">
                    <LogoutBtn />
                </div>
            </div>
        </div>
    )
}