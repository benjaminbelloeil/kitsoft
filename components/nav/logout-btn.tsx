import Link from "next/link";

export default function LogoutBtn() {
    return(
        <Link
            href="/"
            className="w-full flex items-center justify-center bg-[#A100FF] hover:bg-[#8c00d9] text-white py-2 px-6 rounded-lg shadow-[4px_4px_8px_0_rgba(161,0,255,0.2)] transition"
            >
                Logout
        </Link>
    );
}