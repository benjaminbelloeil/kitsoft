// Project utility functions

export const getProjectColor = (color: string) => {
  switch(color) {
    case 'emerald': return 'bg-emerald-500';
    case 'blue': return 'bg-blue-500';
    case 'purple': return 'bg-purple-500';
    case 'accenture':
    default: return 'bg-[#A100FF]';
  }
};
