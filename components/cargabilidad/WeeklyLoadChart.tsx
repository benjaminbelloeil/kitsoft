'use client';

interface Props {
  data: number[];
}

export const WeeklyLoadChart = ({ data }: Props) => {
  const max = Math.max(...data);
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const getColor = (value: number) => {
    if (value < 50) return "#10B981";
    if (value < 80) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="flex items-end h-32 gap-1 w-full pt-4">
      {data.map((value, index) => {
        const height = (value / max) * 100;

        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full rounded-t-sm transition-all duration-300"
              style={{
                height: `${height}%`,
                backgroundColor: getColor(value),
                minHeight: '4px'
              }}
            />
            <span className="text-xs text-gray-500 mt-1">{days[index]}</span>
          </div>
        );
      })}
    </div>
  );
};
