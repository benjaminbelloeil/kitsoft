import React from "react";

// Definición de tipos para el componente ProgressCircle
interface ProgressCircleProps {
  percentage: number;
  color?: string;
  size?: "small" | "medium" | "large";
}

// Progress circle component for cargabilidad
export const ProgressCircle: React.FC<ProgressCircleProps> = ({ 
  percentage, 
  color = "emerald", 
  size = "medium" 
}) => {
  // Define sizes for different options
  const sizes = {
    small: { container: 80, circle: 30, textSize: "text-lg" },
    medium: { container: 120, circle: 40, textSize: "text-2xl" },
    large: { container: 160, circle: 50, textSize: "text-3xl" },
  };
  
  const { container, circle, textSize } = sizes[size];
  
  const circumference = 2 * Math.PI * circle;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const colorClasses: Record<string, string> = {
    emerald: "stroke-emerald-500",
    blue: "stroke-blue-500",
    purple: "stroke-purple-500",
    red: "stroke-red-500"
  };
  
  const bgColorClasses: Record<string, string> = {
    emerald: "bg-emerald-50",
    blue: "bg-blue-50",
    purple: "bg-purple-50",
    red: "bg-red-50"
  };
  
  return (
    <div 
      className={`
        relative flex items-center justify-center rounded-full 
        ${bgColorClasses[color] || "bg-emerald-50"} p-2
      `}
      style={{ 
        width: `${container}px`, 
        height: `${container}px` 
      }}
    >
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle
          cx={container / 2}
          cy={container / 2}
          r={circle}
          fill="transparent"
          stroke="#e6e6e6"
          strokeWidth="10"
        />
        <circle
          cx={container / 2}
          cy={container / 2}
          r={circle}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${colorClasses[color] || "stroke-emerald-500"} drop-shadow-sm`}
          strokeLinecap="round"
        />
      </svg>
      <span className={`font-bold ${textSize}`}>{percentage}%</span>
    </div>
  );
};

// Definición de tipos para el componente CircularProgress
interface CircularProgressProps {
  value: number;
  size?: "small" | "medium" | "large";
}

// Componente para usar en EmployeeSummary
export const CircularProgress: React.FC<CircularProgressProps> = ({ 
  value, 
  size = "medium" 
}) => {
  // Determinar el color según el valor
  let color = "emerald";
  if (value < 80) color = "blue";
  if (value < 50) color = "purple";
  if (value < 30) color = "red";
  
  return <ProgressCircle percentage={value} color={color} size={size} />;
};