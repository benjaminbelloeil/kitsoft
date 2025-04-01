"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "@/context/navigation-context";

export function PageTransition() {
  const { isNavigating, endNavigation } = useNavigation();
  
  // End navigation after animation completes
  useEffect(() => {
    if (isNavigating) {
      // Auto-hide after a delay
      const timer = setTimeout(() => {
        endNavigation();
      }, 1500); // longer delay for better visibility
      
      return () => clearTimeout(timer);
    }
  }, [isNavigating, endNavigation]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#A100FF]"
        >
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-4 border-white border-opacity-50"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear",
                  repeatType: "loop" 
                }}
                className="absolute inset-2 rounded-full border-r-4 border-white"
              />
              <div className="absolute inset-4 rounded-full bg-[#A100FF]" />
            </div>
            <p className="mt-4 text-lg font-medium text-white">Loading...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
