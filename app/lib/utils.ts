import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function that combines classnames conditionally
 * Uses clsx for conditional classes and twMerge for Tailwind class merging
 * 
 * @example cn("px-2 py-1", condition && "text-red-500", ["flex", "items-center"])
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}