"use client";
import { useState, useEffect } from "react";
import { navLinks, NavItem } from "@/app/lib/data";
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
    FiList
} from "react-icons/fi";

export default function NavLink() {
    const pathname = usePathname();
    const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
    
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
                return <FiHome className="size-6 shrink-0" />;
            case "projects":
                return <FiFolder className="size-6 shrink-0" />;
            case "calendar":
                return <FiCalendar className="size-6 shrink-0" />;
            case "profile":
                return <FiUser className="size-6 shrink-0" />;
            case "settings":
                return <FiSettings className="size-6 shrink-0" />;
            case "reports":
                return <FiFileText className="size-6 shrink-0" />;
            case "analytics":
                return <FiBarChart2 className="size-6 shrink-0" />;
            default:
                return <FiList className="size-6 shrink-0" />;
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
        navLinks.forEach(link => {
            if (isDropdownOpenByDefault(link)) {
                initialDropdowns[link.name] = true;
            }
        });
        setOpenDropdowns(initialDropdowns);
    }, [pathname]); // Add pathname as dependency since active state depends on it

    return (
        <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3">
            <nav role="navigation">
                <ul className="space-y-2">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            {link.hasDropdown ? (
                                <div>
                                    <button
                                        aria-expanded={openDropdowns[link.name] || false}
                                        onClick={() => toggleDropdown(link.name)}
                                        className={clsx(
                                            "rounded-lg px-3.5 font-medium fast-transition flex w-full items-center gap-3 py-3",
                                            {
                                                "bg-[#A100FF20] text-[#A100FF] font-medium": isActiveLink(link),
                                                "text-gray-700 hover:bg-gray-100 hover:text-[#A100FF]": !isActiveLink(link)
                                            }
                                        )}
                                    >
                                        {getIcon(link.icon)}
                                        <span>{link.name}</span>
                                        <FiChevronDown 
                                            className={clsx(
                                                "ml-auto fast-transition",
                                                {"rotate-0": !openDropdowns[link.name], "rotate-180": openDropdowns[link.name]}
                                            )}
                                            size={16} 
                                        />
                                    </button>
                                    
                                    {openDropdowns[link.name] && link.dropdownItems && (
                                        <div className="mt-1 ml-6 pl-3 border-l border-gray-200 space-y-1 animate-fadeIn">
                                            {link.dropdownItems.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={clsx(
                                                        "rounded-md py-2 px-4 text-sm block fast-transition",
                                                        {
                                                            "text-[#A100FF] font-medium bg-[#A100FF10]": pathname === item.href,
                                                            "text-gray-600 hover:text-[#A100FF] hover:bg-gray-50": pathname !== item.href
                                                        }
                                                    )}
                                                >
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
                                        "rounded-lg px-3.5 font-medium fast-transition relative flex items-center gap-3 py-3",
                                        {
                                            "bg-[#A100FF20] text-[#A100FF] font-medium": pathname === link.href,
                                            "text-gray-700 hover:bg-gray-100 hover:text-[#A100FF]": pathname !== link.href
                                        }
                                    )}
                                >
                                    {getIcon(link.icon)}
                                    <span>{link.name}</span>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}