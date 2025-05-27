/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { navLinks, NavItem } from "@/components/navbar/navigation-data";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from "clsx";
import { 
    FiHome, 
    FiFolder, 
    FiCalendar, 
    FiUser, 
    FiChevronDown,
    FiSettings,
    FiBarChart2,
    FiFileText,
    FiList,
    FiAward
} from "react-icons/fi";
import { useUser } from "@/context/user-context";

export default function NavLink() {
    const pathname = usePathname();
    const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
    const { isAdmin, isProjectLead, isPeopleLead, isProjectManager } = useUser();
    
    // Filter navigation links based on user role
    const filteredNavLinks = navLinks.filter(link => 
        (!link.requiresAdmin || (link.requiresAdmin && isAdmin)) &&
        (!link.requiresProjectLead || (link.requiresProjectLead && isProjectLead)) &&
        (!link.requiresPeopleLead || (link.requiresPeopleLead && isPeopleLead)) &&
        (!link.requiresProjectManager || (link.requiresProjectManager && isProjectManager))
    );
    
    // Toggle dropdown state
    const toggleDropdown = (name: string) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };
    
    // Function to get icon by name
    const getIcon = (iconName: string) => {
        switch(iconName) {
            case "dashboard":
                return <FiHome className="size-5 shrink-0" />;
            case "projects":
                return <FiFolder className="size-5 shrink-0" />;
            case "calendar":
                return <FiCalendar className="size-5 shrink-0" />;
            case "profile":
                return <FiUser className="size-5 shrink-0" />;
            case "settings":
                return <FiSettings className="size-5 shrink-0" />;
            case "reports":
                return <FiFileText className="size-5 shrink-0" />;
            case "analytics":
                return <FiBarChart2 className="size-5 shrink-0" />;
            case "certificates":
                return <FiAward className="size-5 shrink-0" />;
            default:
                return <FiList className="size-5 shrink-0" />;
        }
    };

    // Check if the current path matches this link or any of its dropdown items
    const isActiveLink = (link: NavItem): boolean => {
        if (pathname === link.href) return true;
        if (link.hasDropdown && link.dropdownItems) {
            return link.dropdownItems.some((item) => pathname === item.href);
        }
        return false;
    };

    // Check if dropdown should be open by default (when a child is active)
    const isDropdownOpenByDefault = (link: NavItem): boolean => {
        if (!link.hasDropdown || !link.dropdownItems) return false;
        return link.dropdownItems.some((item) => pathname === item.href);
    };

    // Initialize dropdowns that should be open - fixed with useEffect
    useEffect(() => {
        const initialDropdowns: {[key: string]: boolean} = {};
        filteredNavLinks.forEach(link => {
            if (isDropdownOpenByDefault(link)) {
                initialDropdowns[link.name] = true;
            }
        });
        setOpenDropdowns(initialDropdowns);
    }, [pathname]); // Add pathname as dependency since active state depends on it

    return (
        <div className="custom-scrollbar flex-1 overflow-y-auto pt-2 nav-container">
            <nav role="navigation" className="px-4 nav-tabs">
                <ul className="space-y-1.5">
                    {filteredNavLinks.map((link) => (
                        <li key={link.name} className="overflow-hidden">
                            {link.hasDropdown ? (
                                <div className="w-full">
                                    <button
                                        aria-expanded={openDropdowns[link.name] || false}
                                        onClick={() => toggleDropdown(link.name)}
                                        className={clsx(
                                            "nav-tab-btn rounded-lg px-4 font-medium flex w-full items-center gap-2.5 py-2.5 relative",
                                            "outline-none focus:outline-none focus-visible:outline-none active:outline-none",
                                            {
                                                "bg-[#A100FF20] text-[#A100FF] font-medium": isActiveLink(link),
                                                "text-gray-700 hover:bg-gray-50 hover:text-[#A100FF]": !isActiveLink(link)
                                            }
                                        )}
                                        style={{ WebkitTapHighlightColor: 'transparent' }}
                                    >
                                        {getIcon(link.icon)}
                                        <span className="text-sm">{link.name}</span>
                                        
                                        <div className="ml-auto flex items-center">
                                            <FiChevronDown 
                                                className={clsx(
                                                    "transition-transform",
                                                    {"rotate-0": !openDropdowns[link.name], "rotate-180": openDropdowns[link.name]}
                                                )}
                                                size={14} 
                                            />
                                        </div>
                                    </button>
                                    
                                    {openDropdowns[link.name] && link.dropdownItems && (
                                        <div className="mt-1 ml-6 pl-2.5 border-l border-gray-200 space-y-1 animate-fadeIn">
                                            {link.dropdownItems.filter(item => 
                                                (!item.requiresAdmin || (item.requiresAdmin && isAdmin)) &&
                                                (!item.requiresProjectLead || (item.requiresProjectLead && isProjectLead)) &&
                                                (!item.requiresPeopleLead || (item.requiresPeopleLead && isPeopleLead)) &&
                                                (!item.requiresProjectManager || (item.requiresProjectManager && isProjectManager))
                                            ).map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={clsx(
                                                        "nav-tab-link rounded-md py-1.5 px-4 text-xs flex items-center w-full",
                                                        "outline-none focus:outline-none focus-visible:outline-none active:outline-none",
                                                        {
                                                            "text-[#A100FF] font-medium bg-[#A100FF10]": pathname === item.href,
                                                            "text-gray-600 hover:text-[#A100FF] hover:bg-gray-50": pathname !== item.href
                                                        }
                                                    )}
                                                    style={{ WebkitTapHighlightColor: 'transparent' }}
                                                >
                                                    {pathname === item.href && (
                                                        <span className="mr-1.5 w-1 h-1 rounded-full bg-[#A100FF]"></span>
                                                    )}
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={link.href}
                                    className={clsx(
                                        "nav-tab-link rounded-lg px-4 font-medium flex items-center gap-2.5 py-2.5 w-full relative",
                                        "outline-none focus:outline-none focus-visible:outline-none active:outline-none",
                                        {
                                            "bg-[#A100FF20] text-[#A100FF] font-medium": pathname === link.href,
                                            "text-gray-700 hover:bg-gray-50 hover:text-[#A100FF]": pathname !== link.href
                                        }
                                    )}
                                    style={{ WebkitTapHighlightColor: 'transparent' }}
                                >
                                    {getIcon(link.icon)}
                                    <span className="text-sm">{link.name}</span>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}