"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { FeedbackStats } from "@/utils/database/client/feedbackSync";

interface CompetencyChartProps {
  skillRatings: Array<{ name: string; value: number }>;
  generalAverage: number;
  avgRating: number;
  feedbackItemsLength: number;
  strength: FeedbackStats | null;
  improvement: FeedbackStats | null;
}

export default function CompetencyChart({ 
  skillRatings, 
  generalAverage, 
  avgRating, 
  feedbackItemsLength, 
  strength, 
  improvement 
}: CompetencyChartProps) {
  // Function to determine color based on average score
  const getCompetencyColor = (average: number) => {
    if (average === 0) {
      return {
        fill: "rgba(156, 163, 175, 0.10)", // Gray tint
        stroke: "#9CA3AF", // Gray stroke
        pointFill: "#9CA3AF" // Gray points
      };
    } else if (average >= 4.0) {
      return {
        fill: "rgba(16, 185, 129, 0.10)", // Green tint
        stroke: "#10B981", // Green stroke
        pointFill: "#10B981" // Green points
      };
    } else if (average >= 3.0) {
      return {
        fill: "rgba(245, 158, 11, 0.10)", // Yellow tint
        stroke: "#F59E0B", // Yellow stroke
        pointFill: "#F59E0B" // Yellow points
      };
    } else {
      return {
        fill: "rgba(239, 68, 68, 0.10)", // Red tint
        stroke: "#EF4444", // Red stroke
        pointFill: "#EF4444" // Red points
      };
    }
  };

  const competencyColors = getCompetencyColor(generalAverage);

  // Function to get color classes for text and background based on score
  const getColorClasses = (average: number) => {
    if (average === 0) {
      return {
        text: "text-gray-600",
        bg: "bg-gray-500"
      };
    } else if (average >= 4.0) {
      return {
        text: "text-green-600",
        bg: "bg-green-500"
      };
    } else if (average >= 3.0) {
      return {
        text: "text-yellow-600", 
        bg: "bg-yellow-500"
      };
    } else {
      return {
        text: "text-red-600",
        bg: "bg-red-500"
      };
    }
  };

  return (
    <motion.div 
      className="lg:col-span-5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 h-full overflow-hidden flex flex-col"
        whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#10B98110] to-[#10B98120] rounded-full flex items-center justify-center mr-3 shadow-sm border border-[#10B98110]">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Evolución de competencias
              </h2>
              <p className="text-xs text-gray-500">
                Seguimiento de tu progreso profesional
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-grow flex items-center justify-center p-4 bg-[#10B98102]">
          <div className="relative h-[300px] w-[300px]">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
              {/* Grid pentagons */}
              {[1, 2, 3, 4, 5].map((level) => {
                const pentagonPoints = Array.from({ length: 5 }, (_, i) => {
                  const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
                  const radius = level * 8.5;
                  const x = 50 + radius * Math.cos(angle);
                  const y = 50 + radius * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ');
                
                return (
                  <polygon
                    key={level}
                    points={pentagonPoints}
                    fill="none" 
                    stroke={level === 5 ? '#e5e7eb' : `rgba(243, 244, 246, ${level * 0.15})`}
                    strokeWidth={level === 5 ? 1.5 : 1} 
                    strokeDasharray={level === 5 ? "" : "2,2"} 
                  />
                );
              })}
              
              {/* Axis lines */}
              {skillRatings.map((_, i) => {
                const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                return (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 42.5 * Math.cos(angle)}
                    y2={50 + 42.5 * Math.sin(angle)}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                );
              })}
              
              {/* Data polygon */}
              <polygon
                points={
                  skillRatings.map((skill, i) => {
                    const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                    const radius = (skill.value / 5) * 42.5;
                    return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
                  }).join(' ')
                }
                fill={competencyColors.fill}
                stroke={competencyColors.stroke}
                strokeWidth="1.5"
              />
              
              {/* Data points */}
              {skillRatings.map((skill, i) => {
                const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                const radius = (skill.value / 5) * 42.5;
                return (
                  <g key={i}>
                    <circle
                      cx={50 + radius * Math.cos(angle)}
                      cy={50 + radius * Math.sin(angle)}
                      r="2"
                      fill={competencyColors.pointFill}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    {/* Skill value label */}
                    <text
                      x={50 + (radius + 3) * Math.cos(angle)}
                      y={50 + (radius + 3) * Math.sin(angle)}
                      fontSize="4"
                      fill="#666666"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {skill.value}
                    </text>
                  </g>
                );
              })}
              
              {/* Central point */}
              <circle cx="50" cy="50" r="2.5" fill={competencyColors.pointFill} />
            </svg>
            
            {/* Skill labels */}
            {skillRatings.map((skill, i) => {
              const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
              // Adjust radius based on specific skills for larger pentagon
              let radius = 50; // Default position (increased from 48)
              
              // Specific adjustments for each skill
              if (skill.name === 'Comunicación') radius = 47; // Closer to pentagon (increased from 45)
              else if (skill.name === 'Colaboración') radius = 52; // Slightly more space (increased from 50)
              else if (skill.name === 'Cumplimiento') radius = 50; // Default (increased from 48)
              else if (skill.name === 'Calidad') radius = 56; // Further out (increased from 54)
              else if (skill.name === 'General') radius = 56; // Further out (increased from 54)
              
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);
              
              return (
                <div
                  key={i}
                  className="absolute text-[9px] font-medium text-gray-700 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 px-2 py-0.5 rounded border border-gray-100 shadow-sm"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    minWidth: skill.name === 'Comunicación' ? '70px' : '55px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {skill.name}
                </div>
              );
            })}
            
            {/* Center score */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`${getColorClasses(generalAverage).bg} rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg`}>
                <div className="text-2xl font-bold text-white leading-none mt-0.5">{avgRating}</div>
                <div className="text-[8px] uppercase tracking-wider text-white opacity-80">Promedio</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 p-3 bg-[#10B98105] mt-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-xs text-gray-600 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 bg-[#10B981] rounded-full"></span>
              <span className="font-medium">{feedbackItemsLength}</span> evaluaciones
            </div>
            <div className="flex flex-wrap gap-1.5">
              {strength && (
                <span className="bg-white text-[#10B981] text-xs px-2 py-0.5 rounded-full font-medium border border-[#10B98120]">
                  Fortaleza: {strength.title}
                </span>
              )}
              {improvement && (
                <span className="bg-white text-[#F59E0B] text-xs px-2 py-0.5 rounded-full font-medium border border-[#F59E0B20]">
                  Mejora: {improvement.title}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
