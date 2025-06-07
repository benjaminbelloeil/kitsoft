"use client";

import { motion } from "framer-motion";
import StatsCard from "./StatsCard";

interface StatsRowProps {
  formattedStats: Array<{
    title: string;
    value: string;
    trend: string;
    icon: React.ReactNode;
  }>;
}

export default function StatsRow({ formattedStats }: StatsRowProps) {
  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {formattedStats.map((stat, index) => (
        <StatsCard key={index} stat={stat} index={index} />
      ))}
    </motion.div>
  );
}
