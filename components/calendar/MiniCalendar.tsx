/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import { getMonthName, getDaysInMonth, getFirstDayOfMonth } from "@/app/lib/data";

interface MiniCalendarProps {
  miniCalendarDate: Date;
  selectedDate: Date;
  setMiniCalendarDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  getEventsForDate: (date: Date) => any[];
}

export default function MiniCalendar({
  miniCalendarDate,
  selectedDate,
  setMiniCalendarDate,
  setSelectedDate,
  getEventsForDate,
}: MiniCalendarProps) {
  // Handle mini calendar navigation
  const prevMonthMini = () => {
    const newDate = new Date(miniCalendarDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setMiniCalendarDate(newDate);
  };

  const nextMonthMini = () => {
    const newDate = new Date(miniCalendarDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setMiniCalendarDate(newDate);
  };

  // Calculate days for the mini calendar
  const miniCalendarDays = React.useMemo(() => {
    const year = miniCalendarDate.getFullYear();
    const month = miniCalendarDate.getMonth();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfWeek = getFirstDayOfMonth(month, year);
    
    const days = [];
    
    // Previous month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevMonthYear);
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      const day = daysInPrevMonth - firstDayOfWeek + i + 1;
      days.push({
        date: new Date(prevMonthYear, prevMonth, day),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Next month days
    const remainingCells = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(nextMonthYear, nextMonth, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  }, [miniCalendarDate]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-gray-800">
          {getMonthName(miniCalendarDate.getMonth())} {miniCalendarDate.getFullYear()}
        </h2>
        <div className="flex space-x-1">
          <button 
            onClick={prevMonthMini}
            className="p-1 rounded hover:bg-[#A100FF10] fast-transition text-gray-600"
          >
            <FiChevronLeft size={14} />
          </button>
          <button 
            onClick={nextMonthMini}
            className="p-1 rounded hover:bg-[#A100FF10] fast-transition text-gray-600"
          >
            <FiChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
          <div key={i} className="text-center text-xs text-gray-500 font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {miniCalendarDays.map((day, i) => {
          const events = getEventsForDate(day.date);
          const isSelected = day.date.getDate() === selectedDate.getDate() && 
                            day.date.getMonth() === selectedDate.getMonth() && 
                            day.date.getFullYear() === selectedDate.getFullYear();
          const isToday = day.date.getDate() === new Date().getDate() &&
                        day.date.getMonth() === new Date().getMonth() &&
                        day.date.getFullYear() === new Date().getFullYear();
          
          // Get unique project colors for this day
          const uniqueColors = [...new Set(events.map(event => event.color))];
                        
          return (
            <button 
              key={i}
              className={`text-center p-1 rounded-full text-xs relative transition-all h-7 w-7 flex items-center justify-center
                ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-800'}
                ${isSelected ? 'bg-[#A100FF]' : isToday ? 'border-[#A100FF] border' : ''}
                hover:bg-[#A100FF20] fast-transition`}
              onClick={() => setSelectedDate(day.date)}
            >
              <span className={`${isSelected ? 'text-white font-semibold' : isToday ? 'font-medium' : ''}`}>
                {day.date.getDate()}
              </span>
              
              {/* Show dots for each unique project color inside the circle */}
              {uniqueColors.length > 0 && (
                <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5 ${isSelected ? 'opacity-80' : ''}`}>
                  {uniqueColors.slice(0, 3).map((color, idx) => (
                    <span 
                      key={idx} 
                      className={`inline-block w-1 h-1 rounded-full ${isSelected ? 'bg-white' : color === 'accenture' ? 'bg-[#A100FF]' : `bg-${color}-500`}`}
                    ></span>
                  ))}
                  {uniqueColors.length > 3 && (
                    <span className={`inline-block w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-gray-400'}`}></span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <button 
        onClick={() => setSelectedDate(new Date())}
        className="mt-2 sm:mt-3 w-full px-3 py-1 sm:py-1.5 bg-[#A100FF20] text-[#A100FF] rounded-md text-xs font-medium hover:bg-[#A100FF30] fast-transition flex items-center justify-center gap-1"
      >
        <FiCalendar size={14} />
        <span>Hoy</span>
      </button>
    </div>
  );
}
