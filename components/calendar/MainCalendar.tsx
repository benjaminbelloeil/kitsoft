/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getMonthName, getDaysInMonth, getFirstDayOfMonth, colorClasses } from "@/app/lib/data";

interface MainCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  selectDate: (date: Date) => void;
  selectEvent: (event: any, position: { x: number, y: number, width: number }) => void;
  showDayEvents: (date: Date, position: { x: number, y: number, width: number }) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  animationClass: string;
  getEventsForDate: (date: Date) => any[];
  formatTime: (date: Date) => string;
  goToToday: () => void; // Add the new prop
}

export default function MainCalendar({
  currentDate,
  selectedDate,
  selectDate,
  selectEvent,
  showDayEvents,
  prevMonth,
  nextMonth,
  animationClass,
  getEventsForDate,
  formatTime,
  goToToday // Add the parameter
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

  // Function to render multi-project indicators with borders instead of filled backgrounds
  const renderProjectIndicator = (projectColors: Record<string, number>) => {
    const uniqueColors = Object.keys(projectColors);
    const totalProjects = uniqueColors.length;
    
    if (totalProjects === 0) return null;
    
    if (totalProjects === 1) {
      // Single project - show a simple badge with count
      const color = uniqueColors[0];
      const count = projectColors[color];
      return (
        <span 
          className={`inline-flex items-center justify-center ${colorClasses[color].text} text-[9px] sm:text-xs w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 ${colorClasses[color].border} bg-white`}
          title={`${count} events`}
        >
          {count}
        </span>
      );
    } else {
      // Multiple projects - show a split border circle
      return (
        <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-white">
          <div className="absolute inset-0 flex flex-wrap">
            {/* Split the border based on number of projects */}
            {uniqueColors.map((color, index) => {
              const segmentStyle: React.CSSProperties = {};
              const borderWidth = "2px";
              
              if (totalProjects === 2) {
                // Two projects - split in half horizontally
                segmentStyle.width = '100%';
                segmentStyle.height = '50%';
                if (index === 0) {
                  segmentStyle.borderTopLeftRadius = '9999px';
                  segmentStyle.borderTopRightRadius = '9999px';
                  segmentStyle.borderTop = borderWidth + ' solid ' + getBorderColor(color);
                  segmentStyle.borderLeft = borderWidth + ' solid ' + getBorderColor(color);
                  segmentStyle.borderRight = borderWidth + ' solid ' + getBorderColor(color);
                } else {
                  segmentStyle.borderBottomLeftRadius = '9999px';
                  segmentStyle.borderBottomRightRadius = '9999px';
                  segmentStyle.borderBottom = borderWidth + ' solid ' + getBorderColor(color);
                  segmentStyle.borderLeft = borderWidth + ' solid ' + getBorderColor(color);
                  segmentStyle.borderRight = borderWidth + ' solid ' + getBorderColor(color);
                }
              } else if (totalProjects === 3) {
                // Three projects - one top half, two bottom quarters
                if (index === 0) {
                  segmentStyle.width = '100%';
                  segmentStyle.height = '50%';
                  segmentStyle.borderTopLeftRadius = '9999px';
                  segmentStyle.borderTopRightRadius = '9999px';
                  segmentStyle.borderTop = borderWidth + ' solid ' + getBorderColor(color);
                  segmentStyle.borderLeft = borderWidth + ' solid ' + getBorderColor(color);
                  segmentStyle.borderRight = borderWidth + ' solid ' + getBorderColor(color);
                } else {
                  segmentStyle.width = '50%';
                  segmentStyle.height = '50%';
                  if (index === 1) {
                    segmentStyle.borderBottomLeftRadius = '9999px';
                    segmentStyle.borderBottom = borderWidth + ' solid ' + getBorderColor(color);
                    segmentStyle.borderLeft = borderWidth + ' solid ' + getBorderColor(color);
                  } else {
                    segmentStyle.borderBottomRightRadius = '9999px';
                    segmentStyle.borderBottom = borderWidth + ' solid ' + getBorderColor(color);
                    segmentStyle.borderRight = borderWidth + ' solid ' + getBorderColor(color);
                  }
                }
              } else {
                // Four or more projects - split in quarters
                segmentStyle.width = '50%';
                segmentStyle.height = '50%';
                if (index === 0) {
                  segmentStyle.borderTopLeftRadius = '9999px';
                  segmentStyle.borderTop = borderWidth + ' solid ' + getBorderColor(color);
                  segmentStyle.borderLeft = borderWidth + ' solid ' + getBorderColor(color);
                } else if (index === 1) {
                  segmentStyle.borderTopRightRadius = '9999px';
                  segmentStyle.borderTop = borderWidth + ' solid ' + getBorderColor(color);
                  segmentStyle.borderRight = borderWidth + ' solid ' + getBorderColor(color);
                } else if (index === 2) {
                  segmentStyle.borderBottomLeftRadius = '9999px';
                  segmentStyle.borderBottom = borderWidth + ' solid ' + getBorderColor(color);
                  segmentStyle.borderLeft = borderWidth + ' solid ' + getBorderColor(color);
                } else if (index === 3) {
                  segmentStyle.borderBottomRightRadius = '9999px';
                  segmentStyle.borderBottom = borderWidth + ' solid ' + getBorderColor(color);
                  segmentStyle.borderRight = borderWidth + ' solid ' + getBorderColor(color);
                }
              }
              
              return (
                <div 
                  key={index}
                  style={segmentStyle}
                  className="bg-white"
                />
              );
            })}
          </div>
          {/* Total event count */}
          <span className="relative z-10 text-[9px] sm:text-xs font-semibold text-gray-800">
            {Object.values(projectColors).reduce((sum, count) => sum + count, 0)}
          </span>
        </div>
      );
    }
  };

  // Get border color for a project type
  const getBorderColor = (color: string) => {
    switch(color) {
      case 'emerald': return '#10B981';
      case 'blue': return '#3B82F6';
      case 'purple': return '#8B5CF6';
      case 'accenture': return '#A100FF';
      default: return '#9CA3AF';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300 flex flex-col h-full w-full overflow-hidden" ref={calendarRef}>
      {/* Calendar header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2 sm:mb-4 flex-shrink-0">
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
            onClick={goToToday} /* Changed to use goToToday */
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
      <div className="hidden sm:grid sm:grid-cols-7 gap-1 mb-1 flex-shrink-0">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, i) => (
          <div key={i} className="text-center py-2 font-medium text-gray-600 border-b border-gray-100">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid - visible on small screens */}
      <div className="grid grid-cols-7 sm:hidden gap-1 mb-1 flex-shrink-0">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
          <div key={i} className="text-center py-1 font-medium text-xs text-gray-600 border-b border-gray-100">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days grid container */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className={`grid grid-cols-7 gap-0.5 sm:gap-1 grid-rows-6 h-full ${animationClass}`}>
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
            
            // Handle day click to show event list - modified to only show for 3+ events
            const handleDayClick = (e: React.MouseEvent) => {
              if (events.length > 2) {
                e.stopPropagation(); // Prevent the default date selection
                const rect = e.currentTarget.getBoundingClientRect();
                showDayEvents(day.date, {
                  x: rect.left,
                  y: rect.bottom,
                  width: rect.width
                });
              } else {
                selectDate(day.date);
              }
            };
            
            return (
              <div 
                key={i}
                onClick={handleDayClick}
                className={`border rounded-md p-0.5 sm:p-1 transition-all cursor-pointer flex flex-col w-full h-full
                  ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'hover:bg-[#A100FF05]'}
                  ${isSelected ? 'border-[#A100FF] shadow-sm' : 'border-transparent hover:border-[#A100FF40]'}
                  ${isToday ? 'bg-[#A100FF08]' : ''}`}
              >
                <div className="flex justify-between items-center mb-0.5 sm:mb-1 flex-shrink-0">
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full text-xs sm:text-sm
                      ${isToday ? 'bg-[#A100FF] text-white font-medium' : ''}`}
                  >
                    {day.date.getDate()}
                  </div>
                  {events.length > 0 && (
                    <div className="flex justify-center">
                      {renderProjectIndicator(projectColors)}
                    </div>
                  )}
                </div>
                
                <div className="overflow-hidden flex-1 min-h-0">
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
                        className={`p-0.5 sm:p-1 rounded text-[10px] sm:text-xs truncate mb-0.5
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
