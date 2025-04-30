// File: pages/progress-circle-viewer.tsx
import React from 'react';
import type { NextPage } from 'next';

// Aux types
type Color = 'emerald' | 'blue' | 'purple' | 'red';
type Size = 'small' | 'medium' | 'large';

// Props for ProgressCircle (base visual component)
type ProgressCircleProps = {
  percentage: number;
  color?: Color;
  size?: Size;
};

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  color = 'emerald',
  size = 'medium',
}) => {
  const sizeMap: Record<Size, { container: number; circle: number; textSize: string }> = {
    small: { container: 80, circle: 30, textSize: 'text-lg' },
    medium: { container: 120, circle: 40, textSize: 'text-2xl' },
    large: { container: 160, circle: 50, textSize: 'text-3xl' },
  };

  const { container, circle, textSize } = sizeMap[size];
  const radius = circle;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const strokeClasses: Record<Color, string> = {
    emerald: 'stroke-emerald-500',
    blue: 'stroke-blue-500',
    purple: 'stroke-purple-500',
    red: 'stroke-red-500',
  };

  const bgClasses: Record<Color, string> = {
    emerald: 'bg-emerald-50',
    blue: 'bg-blue-50',
    purple: 'bg-purple-50',
    red: 'bg-red-50',
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-full ${bgClasses[color]} p-2`}
      style={{ width: container, height: container }}
    >
      <svg width={container} height={container} className="absolute transform -rotate-90">
        <circle
          cx={container / 2}
          cy={container / 2}
          r={radius}
          fill="transparent"
          stroke="#e6e6e6"
          strokeWidth={10}
        />
        <circle
          cx={container / 2}
          cy={container / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={10}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${strokeClasses[color]} drop-shadow-sm`}
          strokeLinecap="round"
        />
      </svg>
      <span className={`font-bold ${textSize}`}>{percentage}%</span>
    </div>
  );
};

// Props for CircularProgress with customizable ranges
export type ColorRange = { threshold: number; color: Color };
type CircularProgressProps = {
  value: number;
  size?: Size;
  colorRanges?: ColorRange[];
};

// Default threshold-to-color mapping
const defaultRanges: ColorRange[] = [
  { threshold: 80, color: 'emerald' },
  { threshold: 50, color: 'blue' },
  { threshold: 30, color: 'purple' },
  { threshold: 0, color: 'red' },
];

// Component: CircularProgress picks color based on provided ranges
event;
const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 'medium',
  colorRanges = defaultRanges,
}) => {
  // Ensure descending order by threshold
  const ranges = [...colorRanges].sort((a, b) => b.threshold - a.threshold);
  const match = ranges.find(r => value >= r.threshold);
  const color = match ? match.color : ranges[ranges.length - 1].color;

  return <ProgressCircle percentage={value} color={color} size={size} />;
};

// Demo page
const ProgressCircleViewer: NextPage = () => {
  // Example custom ranges for different scenarios
  const courseRanges: ColorRange[] = [
    { threshold: 90, color: 'blue' },
    { threshold: 70, color: 'emerald' },
    { threshold: 40, color: 'purple' },
    { threshold: 0, color: 'red' },
  ];

  const projectRanges: ColorRange[] = [
    { threshold: 75, color: 'emerald' },
    { threshold: 50, color: 'blue' },
    { threshold: 25, color: 'purple' },
    { threshold: 0, color: 'red' },
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Default CircularProgress</h2>
      <div className="flex items-center gap-6">
        <CircularProgress value={85} size="small" />
        <CircularProgress value={65} size="medium" />
        <CircularProgress value={45} size="large" />
        <CircularProgress value={15} size="medium" />
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Course Progress (custom ranges)</h2>
      <div className="flex items-center gap-6">
        <CircularProgress value={92} size="small" colorRanges={courseRanges} />
        <CircularProgress value={80} size="medium" colorRanges={courseRanges} />
        <CircularProgress value={55} size="large" colorRanges={courseRanges} />
        <CircularProgress value={30} size="medium" colorRanges={courseRanges} />
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Project Progress (custom ranges)</h2>
      <div className="flex items-center gap-6">
        <CircularProgress value={80} size="small" colorRanges={projectRanges} />
        <CircularProgress value={60} size="medium" colorRanges={projectRanges} />
        <CircularProgress value={25} size="large" colorRanges={projectRanges} />
        <CircularProgress value={10} size="medium" colorRanges={projectRanges} />
      </div>
    </div>
  );
};

export { ProgressCircle, CircularProgress };
export default ProgressCircleViewer;
