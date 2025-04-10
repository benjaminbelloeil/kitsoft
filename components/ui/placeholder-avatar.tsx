"use client";

import { IoPersonSharp } from "react-icons/io5";

interface PlaceholderAvatarProps {
  className?: string;
  size?: number;
  color?: string;
  bgColor?: string;
}

export default function PlaceholderAvatar({ 
  className = "", 
  size = 60,
  color = "#A100FF",
  bgColor = "#F4EBFF"
}: PlaceholderAvatarProps) {
  return (
    <div 
      className={`flex items-center justify-center rounded-full overflow-hidden ${className}`}
      style={{ 
        backgroundColor: bgColor,
        width: size,
        height: size
      }}
    >
      <IoPersonSharp 
        size={size * 0.9} 
        color={color} 
        style={{ 
          opacity: 0.85,
          transform: 'translateY(12%)', // Move it down a bit for better visual centering
        }}
        aria-hidden="true"
      />
    </div>
  );
}