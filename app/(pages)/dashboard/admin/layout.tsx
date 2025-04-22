"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useNavigation } from "@/context/navigation-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isLoading } = useUser();
  const router = useRouter();
  const { startNavigation } = useNavigation();

  // Redirect non-admin users
  useEffect(() => {
    if (!isLoading && isAdmin === false) {
      console.log("Non-admin access detected, redirecting...");
      startNavigation();
      router.push("/dashboard");
    }
  }, [isAdmin, isLoading, router, startNavigation]);

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-[#A100FF] rounded-full animate-spin"></div>
      </div>
    );
  }

  // If admin, simply render the children (admin content)
  return <>{children}</>;
}
