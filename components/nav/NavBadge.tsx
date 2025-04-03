"use client";

import { useNotifications } from "@/context/notification-context";

// This component will be used in the navbar to show notification count
export default function NavBadge({ navItemName }: { navItemName: string }) {
  const { unreadCount } = useNotifications();

  // Only display badge on Calendar nav item
  if (navItemName !== "Calendario" || unreadCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center w-4 h-4 bg-red-500 rounded-full">
      <span className="text-white text-[9px] font-medium">{unreadCount}</span>
    </div>
  );
}
