"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  stat: {
    title: string;
    value: string;
    trend: string;
    icon: React.ReactNode;
  };
  index: number;
}

export default function StatsCard({ stat, index }: StatsCardProps) {
  // Create a varied color scheme
  let bgColor;
  switch(index) {
    case 0: bgColor = "bg-[#3B82F6]"; break;
    case 1: bgColor = "bg-[#10B981]"; break;
    case 2: bgColor = "bg-[#F59E0B]"; break;
    case 3: bgColor = "bg-[#6366F1]"; break;
    default: bgColor = "bg-gray-500";
  }
  
  return (
    <motion.div 
      className="bg-white rounded-lg p-3.5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -2, scale: 1.02, boxShadow: "0 8px 12px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
    >
      <div className="flex justify-between items-center mb-1.5">
        <div className={`${bgColor} p-2 rounded-md shadow-sm`}>
          {stat.icon}
        </div>
        <div className="flex items-center">
          {parseFloat(stat.trend) > 0 ? (
            <TrendingUp className="h-3.5 w-3.5 text-green-600 mr-1" />
          ) : parseFloat(stat.trend) < 0 ? (
            <TrendingDown className="h-3.5 w-3.5 text-red-600 mr-1" />
          ) : null}
          <span className={parseFloat(stat.trend) > 0 
            ? "text-xs font-medium text-green-600" 
            : parseFloat(stat.trend) < 0 
              ? "text-xs font-medium text-red-600" 
              : "text-xs font-medium text-gray-500"
          }>
            {stat.trend !== "0.0" ? stat.trend : "="}
          </span>
        </div>
      </div>
      <div className="text-xl font-bold text-gray-800">{stat.value}</div>
      <div className="text-xs text-gray-600 truncate">{stat.title}</div>
    </motion.div>
  );
}
