import { useState } from "react";
import { User } from "lucide-react";
import Image from "next/image";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function UserAvatar({ name, avatarUrl, size = 'md', className = '' }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm', 
    lg: 'h-10 w-10 text-base'
  };

  // Get first letter of name for fallback
  const fallbackLetter = name?.charAt(0)?.toUpperCase() || 'U';

  // If we have an avatar URL and no error, show the image
  if (avatarUrl && !imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 border border-gray-200 shadow-sm flex-shrink-0 ${className}`}>
        <Image
          src={avatarUrl}
          alt={`${name} avatar`}
          width={32}
          height={32}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // If we have a name, show initials fallback
  if (name) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#A100FF] to-[#8B00D4] flex items-center justify-center text-white font-medium border border-gray-200 shadow-sm flex-shrink-0 ${className}`}>
        {fallbackLetter}
      </div>
    );
  }

  // Final fallback with User icon
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm flex-shrink-0 ${className}`}>
      <User className="h-4 w-4 text-gray-600" />
    </div>
  );
}
