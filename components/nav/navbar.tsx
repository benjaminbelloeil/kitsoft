import NavLink from "@/components/nav/navlink"
import LogoutBtn from "@/components/nav/logout-btn"
export default function Navbar() {
    return (
        <div className="flex flex-col h-full w-[30vh] p-5 pt-[5vh] bg-gradient-to-b from-pink-200 via-purple-300 to-purple-400 shadow-[4px_4px_8px_0_rgba(161,0,255,0.2)]">
            <img src="/accentureLogo.png"/>
            
            <NavLink/>
            <LogoutBtn/>
        </div>
    )
}