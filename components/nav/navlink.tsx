"use client";
import { navLinks } from "@/app/lib/data";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from "clsx";

export default function NavLink() {
    const pathname = usePathname();
    return (
        <div className="flex flex-col gap-2 justify-center items-center mt-[2vh]">
        {navLinks.map((link)=>{
            return(
                <Link
                key={link.name}
                href={link.href}
                className={clsx("w-full rounded-md py-1 px-2",{
                    'font-bold bg-[#FFE6F180]': pathname === link.href,
                  }
                )}
                >
                    {link.name}
                </Link>

            );
        })}
        </div>
    );
}