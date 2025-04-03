/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getMonthName, getDaysInMonth, getFirstDayOfMonth, colorClasses } from "@/app/lib/data";

interface MainCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  selectDate: (date: Date) => void;
  selectEvent: (event: any, position: { x: number, y: number, width: number }) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  animationClass: string;
  getEventsForDate: (date: Date) => any[];
  formatTime: (date: Date) => string;
}

export default function MainCalendar({
  currentDate,
  selectedDate,
  selectDate,
  selectEvent,
  prevMonth,
  nextMonth,
  animationClass,
  getEventsForDate,
  formatTime
}: MainCalendarProps) {
  // Reference to the calendar container for positioning calculations
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Get days array for the current month view
  const daysInCalendar = React.useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfWeek = getFirstDayOfMonth(month, year);
    
    // Previous month days to fill the first week
    const prevMonthDays = [];
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevMonthYear);
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      const day = daysInPrevMonth - firstDayOfWeek + i + 1;
      prevMonthDays.push({
        date: new Date(prevMonthYear, prevMonth, day),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Next month days to fill remaining cells
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonthDays = [];
    const totalCells = 42; // 6 rows * 7 days
    const remainingCells = totalCells - prevMonthDays.length - currentMonthDays.length;
    
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push({
        date: new Date(nextMonthYear, nextMonth, i),
        isCurrentMonth: false
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [currentDate]);

  return (
    <div className="flex-1 bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300 overflow-hidden" ref={calendarRef}>
      {/* Calendar header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center justify-between sm:justify-end space-x-2">
          <button 
            onClick={prevMonth}
            className="p-1.5 sm:p-2 rounded-md hover:bg-[#A100FF10] fast-transition text-gray-600"
            aria-label="Previous month"
          >
            <FiChevronLeft size={18} />
          </button>
          <button 
            onClick={() => selectDate(new Date())}
            className="px-3 py-1 sm:px-4 sm:py-1.5 bg-[#A100FF20] text-[#A100FF] rounded-md text-xs sm:text-sm hover:bg-[#A100FF30] fast-transition"
          >
            Hoy
          </button>
          <button 
            onClick={nextMonth}
            className="p-1.5 sm:p-2 rounded-md hover:bg-[#A100FF10] fast-transition text-gray-600"
            aria-label="Next month"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar grid - visible on medium screens and up */}
      <div className="hidden sm:grid sm:grid-cols-7 gap-1 mb-1">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, i) => (
          <div key={i} className="text-center py-2 font-medium text-gray-600 border-b border-gray-100">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid - visible on small screens */}
      <div className="grid grid-cols-7 sm:hidden gap-1 mb-1">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
          <div key={i} className="text-center py-1 font-medium text-xs text-gray-600 border-b border-gray-100">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className={`grid grid-cols-7 gap-0.5 sm:gap-1 flex-1 ${animationClass}`}>
        {daysInCalendar.map((day, i) => {
          const events = getEventsForDate(day.date);
          const isSelected = day.date.getDate() === selectedDate.getDate() && 
                            day.date.getMonth() === selectedDate.getMonth() && 
                            day.date.getFullYear() === selectedDate.getFullYear();
          const isToday = day.date.getDate() === new Date().getDate() &&
                          day.date.getMonth() === new Date().getMonth() &&
                          day.date.getFullYear() === new Date().getFullYear();
          
          // Group events by project color to count
          const projectColors = events.reduce((acc: {[key: string]: number}, event) => {
            acc[event.color] = (acc[event.color] || 0) + 1;
            return acc;
          }, {});
          
          return (
            <div 
              key={i}
              onClick={() => selectDate(day.date)}
              className={`min-h-[60px] sm:min-h-[80px] md:min-h-[100px] border rounded-md p-0.5 sm:p-1 transition-all cursor-pointer
                ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'hover:bg-[#A100FF05]'}
                ${isSelected ? 'border-[#A100FF] shadow-sm' : 'border-transparent hover:border-[#A100FF40]'}
                ${isToday ? 'bg-[#A100FF08]' : ''}`}
            >
              <div className="flex justify-between items-center mb-0.5 sm:mb-1">
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full text-xs sm:text-sm
                    ${isToday ? 'bg-[#A100FF] text-white font-medium' : ''}`}
                >
                  {day.date.getDate()}
                </div>
                {events.length > 0 && (
                  <div className="flex gap-0.5">
                    {Object.entries(projectColors).map(([color, count], index) => (
                      <span 
                        key={index} 
                        className={`inline-flex items-center justify-center ${colorClasses[color].text} text-[9px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full border ${colorClasses[color].border}`}
                        title={`${count} events`}
                      >
                        {count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-0.5 sm:space-y-1 overflow-hidden max-h-[40px] sm:max-h-[70px]">
                {events.slice(0, 2).map((event, j) => {
                  // Event click handler with position tracking
                  const handleEventClick = (e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    selectEvent(event, {
                      x: rect.left,
                      y: rect.bottom,
                      width: rect.width
                    });
                  };
                  
                  return (
                    <div 
                      key={j}
                      onClick={handleEventClick}
                      className={`p-0.5 sm:p-1 rounded text-[10px] sm:text-xs truncate 
                        bg-white border-l-2 ${colorClasses[event.color].border} ${colorClasses[event.color].light}
                        hover:shadow fast-transition cursor-pointer flex items-center`}
                    >
                      <div className="flex-1 truncate">
                        {!event.allDay && (
                          <span className={`font-medium hidden sm:inline mr-1 ${colorClasses[event.color].text}`}>
                            {formatTime(event.start)}
                          </span>
                        )}
                        <span className="text-gray-800">{event.title}</span>
                      </div>
                    </div>
                  );
                })}
                {events.length > 2 && (
                  <div className="text-[10px] sm:text-xs text-gray-500 pl-0.5 sm:pl-1">
                    + {events.length - 2} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
