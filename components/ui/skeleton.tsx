/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { cn } from "@/app/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  width,
  height,
  ...props
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-100/70 dark:bg-gray-700/40", 
        className
      )}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
      {...props}
    />
  );
}

interface SkeletonCardProps {
  className?: string;
  imageHeight?: number;
  rows?: number;
  rowHeight?: number;
  variant?: "default" | "profile" | "card" | "list-item";
}

export function SkeletonCard({
  className,
  imageHeight = 200,
  rows = 3,
  rowHeight = 12,
  variant = "default",
  ...props
}: SkeletonCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const renderRows = () => {
    return Array(rows)
      .fill(0)
      .map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "w-full mb-2",
            i === 0 ? "w-3/4" : i === rows - 1 ? "w-1/2" : "w-full"
          )}
          height={rowHeight} 
        />
      ));
  };

  if (variant === "profile") {
    return (
      <div 
        className={cn(
          "flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100",
          className
        )} 
        {...props}
      >
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }
  
  if (variant === "list-item") {
    return (
      <div 
        className={cn(
          "flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-100",
          className
        )} 
        {...props}
      >
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "space-y-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100",
        className
      )} 
      {...props}
    >
      {variant === "card" && <Skeleton className="h-40 w-full rounded-md" />}
      {renderRows()}
    </div>
  );
}

export function SkeletonContainer({ 
  children, 
  isLoading = true,
  fallback,
  className 
}: { 
  children: React.ReactNode, 
  isLoading?: boolean,
  fallback?: React.ReactNode,
  className?: string
}) {
  if (!isLoading) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  return (
    <div className={cn("w-full animate-pulse space-y-4", className)}>
      <SkeletonCard />
      <SkeletonCard rows={2} />
    </div>
  );
}

export function SkeletonGrid({ 
  count = 4,
  columns = 2, 
  variant = "card", 
  className 
}: { 
  count?: number, 
  columns?: number,
  variant?: "default" | "profile" | "card" | "list-item",
  className?: string
}) {
  return (
    <div className={cn(
      "grid gap-4",
      columns === 1 ? "grid-cols-1" : 
      columns === 2 ? "grid-cols-1 md:grid-cols-2" : 
      columns === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : 
      columns === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" :
      "grid-cols-1 md:grid-cols-2",
      className
    )}>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <SkeletonCard key={i} variant={variant} />
        ))}
    </div>
  );
}