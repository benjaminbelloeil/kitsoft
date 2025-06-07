"use client";

import Link from "next/link";
import { TrendingUp, ChevronRight } from "lucide-react";
import { FeedbackStats } from "@/utils/database/client/feedbackSync";

interface PerformanceCardProps {
  feedbackStats: FeedbackStats[];
}

export default function PerformanceCard({ feedbackStats }: PerformanceCardProps) {

  // Calculate skill ratings for pentagon chart (always 5 points)
  const mainSkills = [
    "Comunicación",
    "Calidad", 
    "Colaboración",
    "Cumplimiento"
  ];
  
  const skillRatings = mainSkills.map(skillName => {
    const stat = feedbackStats.find(s => s.title === skillName);
    return {
      name: skillName,
      value: stat ? parseFloat(stat.value) : 0
    };
  });

  // Add "General" as the average of the 4 main areas
  const generalAverage = skillRatings.length > 0 
    ? skillRatings.reduce((sum, skill) => sum + skill.value, 0) / skillRatings.length 
    : 0;
  
  skillRatings.push({
    name: "General",
    value: parseFloat(generalAverage.toFixed(1))
  });

  // Calculate average rating from stats
  const avgRating = feedbackStats.length > 0 
    ? parseFloat((feedbackStats.reduce((sum, stat) => sum + parseFloat(stat.value), 0) / feedbackStats.length).toFixed(1))
    : 0;

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

  // Function to get color classes for center score
  const getColorClasses = (average: number) => {
    if (average === 0) {
      return "bg-gray-500";
    } else if (average >= 4.0) {
      return "bg-green-500";
    } else if (average >= 3.0) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  };

  // Fetch feedback stats when component mounts
  // Data is now passed as props from parent dashboard component

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Mi Retroalimentación
        </h2>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        {feedbackStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3 border border-green-100">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-2">Sin retroalimentación</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Aún no tienes evaluaciones. Cuando recibas retroalimentación, aquí verás tu evolución.
            </p>
          </div>
        ) : (
          <>
            {/* Pentagon chart */}
            <div className="flex justify-center mb-6 flex-1">
              <div className="relative h-[260px] w-[260px]">
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
                          r="1.5"
                          fill={competencyColors.pointFill}
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                      </g>
                    );
                  })}
                  
                  {/* Central point */}
                  <circle cx="50" cy="50" r="2" fill={competencyColors.pointFill} />
                </svg>
                
                {/* Skill labels */}
                {skillRatings.map((skill, i) => {
                  const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                  let radius = 50;
                  
                  // Specific adjustments for each skill
                  if (skill.name === 'Comunicación') radius = 47;
                  else if (skill.name === 'Colaboración') radius = 52;
                  else if (skill.name === 'Cumplimiento') radius = 50;
                  else if (skill.name === 'Calidad') radius = 56;
                  else if (skill.name === 'General') radius = 56;
                  
                  const x = 50 + radius * Math.cos(angle);
                  const y = 50 + radius * Math.sin(angle);
                  
                  return (
                    <div
                      key={i}
                      className="absolute text-[10px] font-medium text-gray-700 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 px-2 py-1 rounded border border-gray-100 shadow-sm"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        minWidth: skill.name === 'Comunicación' ? '60px' : '50px',
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
                  <div className={`${getColorClasses(generalAverage)} rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg`}>
                    <div className="text-xl font-bold text-white leading-none">{avgRating}</div>
                    <div className="text-[8px] uppercase tracking-wider text-white opacity-80">Promedio</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="mt-auto text-center">
          <Link 
            href="/dashboard/retroalimentacion" 
            className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
          >
            Ver retroalimentación completa
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
