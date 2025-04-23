"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useNavigation } from "@/context/navigation-context";
import AdminDashboardSkeleton from "@/components/admin/AdminDashboardSkeleton";

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

  // Show skeleton loaders instead of the purple spinner
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-8">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="h-5 w-3/4 bg-gray-200 rounded mb-8 animate-pulse"></div>
        
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <AdminDashboardSkeleton />
      </div>
    );
  }

  // If admin, simply render the children (admin content)
  return <>{children}</>;
}
