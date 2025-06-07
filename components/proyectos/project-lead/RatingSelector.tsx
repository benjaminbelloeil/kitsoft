'use client';

import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface RatingSelectorProps {
  rating: number;
  setRating: (rating: number) => void;
  hoverRating: number;
  setHoverRating: (rating: number) => void;
}

export default function RatingSelector({ 
  rating, 
  setRating, 
  hoverRating, 
  setHoverRating 
}: RatingSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
    >
      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <span className="h-2 w-2 bg-[#F59E0B] mr-2 rounded-full"></span>
        Valoración:
      </label>
      <div className="flex flex-col h-[80px] p-4 bg-white rounded-md border border-gray-200 shadow-inner">
        <div className="flex justify-center items-center flex-grow">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.div key={star} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <Star
                className={`h-6 w-6 mx-1.5 cursor-pointer transition-all ${
                  (hoverRating || rating) >= star 
                    ? "text-[#F59E0B] fill-[#F59E0B] scale-110" 
                    : "text-gray-300"
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            </motion.div>
          ))}
        </div>
        <div className="text-center text-sm font-medium text-gray-700 pt-1">
          {rating > 0 
            ? `${rating}/5 - ${rating > 3 ? 'Excelente' : rating > 2 ? 'Bueno' : 'Regular'}`
            : 'Selecciona una valoración'}
        </div>
      </div>
    </motion.div>
  );
}
