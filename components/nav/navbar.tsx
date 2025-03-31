/* eslint-disable @next/next/no-img-element */
import NavLink from "@/components/nav/navlink"
import LogoutBtn from "@/components/nav/logout-btn"

export default function Navbar() {
    return (
        <div className="flex flex-col h-full w-[280px] bg-white border-r border-gray-100 shadow-sm">
            <div className="flex h-full flex-col py-8 px-[12px]">
                <div className="flex justify-center items-center mb-8 pt-2">
                    <img 
                        src="/accentureLogo.png" 
                        alt="Accenture Logo" 
                        className="h-10 max-w-[180px] object-contain"
                    />
                </div>
                
                <NavLink />
                
                <div className="mt-auto mb-4">
                    <LogoutBtn />
                </div>
            </div>
        </div>
    )
}