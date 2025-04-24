'use client';

interface Props {
  value: number;
  label: string;
}

export const LinearProgress = ({ value, label }: Props) => {
  const getColor = (value: number) => {
    if (value < 50) return "#10B981";
    if (value < 80) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="w-full bg-gray-50 p-2 rounded-lg mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${value}%`, backgroundColor: getColor(value) }}
        />
      </div>
    </div>
  );
};
