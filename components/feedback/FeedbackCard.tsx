"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { EnhancedFeedbackItem } from "@/utils/database/client/feedbackSync";
import Image from "next/image";
import { useState } from "react";

// UserAvatar component moved here instead of separate file
interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

function UserAvatar({ name, avatarUrl, size = "md" }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm", 
    lg: "h-10 w-10 text-base"
  };

  const fallbackContent = name?.charAt(0)?.toUpperCase() || "U";

  if (avatarUrl && !imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border border-gray-200 shadow-sm flex-shrink-0`}>
        <Image
          src={avatarUrl}
          alt={`${name} avatar`}
          width={size === "sm" ? 24 : size === "md" ? 32 : 40}
          height={size === "sm" ? 24 : size === "md" ? 32 : 40}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-medium border border-gray-200 shadow-sm flex-shrink-0`}>
      {fallbackContent}
    </div>
  );
}

interface FeedbackCardProps {
  item: EnhancedFeedbackItem;
  formatDate: (dateStr: string) => string;
}

export default function FeedbackCard({ item, formatDate }: FeedbackCardProps) {
  return (
    <motion.div 
      className="h-[180px] p-3 hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group cursor-pointer flex flex-col"
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
    >
      <div className="flex justify-between items-start mb-2 flex-shrink-0">
        <div 
          className="flex items-center"
        >
          <div>
            <UserAvatar 
              name={item.from.name}
              avatarUrl={item.from.avatar}
              size="md"
            />
          </div>
          <div className="ml-2 min-w-0">
            <div className="text-xs font-medium text-gray-900 truncate">{item.from.name}</div>
            <div className="text-[10px] text-gray-500">{formatDate(item.date)}</div>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-100 rounded-md px-1.5 py-0.5 border border-gray-200 shadow-sm flex-shrink-0">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              className={`h-2.5 w-2.5 ${
                i < Math.floor(item.rating) 
                  ? "text-[#F59E0B] fill-[#F59E0B]" 
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-[10px] font-medium ml-1 text-gray-700">
            {item.rating.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-2 flex-shrink-0">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-[#6366F110] text-[#6366F1] border border-[#6366F120] shadow-sm whitespace-nowrap overflow-hidden max-w-full text-ellipsis">
          {item.category}
        </span>
        {item.project && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-[#10B98110] text-[#10B981] border border-[#10B98120] shadow-sm whitespace-nowrap overflow-hidden max-w-full text-ellipsis">
            {item.project}
          </span>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-md p-2 border border-gray-200 shadow-inner relative flex-1 overflow-hidden">
        <p 
          className="text-[10px] text-gray-600 leading-tight"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {item.message}
        </p>
      </div>
    </motion.div>
  );
}
