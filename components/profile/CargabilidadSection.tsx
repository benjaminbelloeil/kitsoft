import React from "react";

interface Project {
  name: string;
  cargabilidad: number;
  color: string;
}

interface CargabilidadSectionProps {
  projects: Project[];
}

// Progress circle component for cargabilidad
const ProgressCircle = ({ percentage, color }: { percentage: number, color: string }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const colorClasses: Record<string, string> = {
    emerald: "stroke-emerald-500",
    blue: "stroke-blue-500",
    purple: "stroke-purple-500"
  };

  const bgColorClasses: Record<string, string> = {
    emerald: "bg-emerald-50",
    blue: "bg-blue-50",
    purple: "bg-purple-50"
  };
  
  return (
    <div className={`relative h-[120px] w-[120px] flex items-center justify-center rounded-full ${bgColorClasses[color] || "bg-emerald-50"} p-2`}>
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="transparent"
          stroke="#e6e6e6"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r="40"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${colorClasses[color] || "stroke-emerald-500"} drop-shadow-sm`}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-2xl font-bold">{percentage}%</span>
    </div>
  );
};

export default function CargabilidadSection({ projects }: CargabilidadSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100">
        <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A100FF]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
        </span>
        Cargabilidad actual
      </h2>
      
      <div className="flex flex-wrap gap-6 flex-1">
        {projects.map((project, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg p-5 flex-1 min-w-[200px] text-center border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 hover:border-[#A100FF40] flex flex-col justify-center"
          >
            <h3 className="font-medium text-lg mb-4 text-gray-800">{project.name}</h3>
            <div className="flex justify-center">
              <ProgressCircle percentage={project.cargabilidad} color={project.color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
