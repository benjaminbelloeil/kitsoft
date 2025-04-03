/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";
import { FiCalendar, FiX } from "react-icons/fi";
import { colorClasses } from "@/app/lib/data";

interface DayEventsListProps {
  date: Date | null;
  events: any[];
  position: { x: number; y: number; width: number } | null;
  closeList: () => void;
  formatTime: (date: Date) => string;
  selectEvent: (event: any, position: { x: number; y: number; width: number }) => void;
}

export default function DayEventsList({
  date,
  events,
  position,
  closeList,
  formatTime,
  selectEvent,
}: DayEventsListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Calculate optimal position for the popup
  useEffect(() => {
    if (!position || !listRef.current) return;
    
    const listEl = listRef.current;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const listHeight = listEl.offsetHeight;
    const listWidth = listEl.offsetWidth;
    
    // Calculate optimal position
    let top = position.y + 10; // Position below the day cell with some margin
    let left = position.x;
    
    // Adjust if going off the bottom of the viewport
    if (top + listHeight > viewportHeight - 20) {
      top = Math.max(20, position.y - listHeight - 10); // Position above the day cell
    }
    
    // Adjust if going off the right side of the viewport
    if (left + listWidth > viewportWidth - 20) {
      left = Math.max(20, viewportWidth - listWidth - 20);
    }
    
    // Apply the calculated position
    listEl.style.top = `${top}px`;
    listEl.style.left = `${left}px`;
  }, [position]);

  // Handle clicks outside to close the preview
  useEffect(() => {
    if (!position) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        closeList();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [position, closeList]);

  if (!date || !position || events.length === 0) return null;
  
  return (
    <div 
      ref={listRef}
      className="fixed shadow-xl border border-gray-200 rounded-xl bg-white w-[300px] z-50"
      style={{ 
        maxHeight: 'calc(100vh - 40px)',
        maxWidth: 'calc(100vw - 40px)',
      }}
    >
      {/* Header */}
      <div className="p-4 relative border-b border-gray-100">
        <button 
          onClick={closeList}
          className="absolute top-2 right-2 bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 fast-transition"
        >
          <FiX size={16} className="text-gray-600" />
        </button>
        <div className="flex items-center text-gray-800">
          <FiCalendar size={16} className="mr-2" />
          <h3 className="font-bold text-lg mr-6">
            {date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
        </div>
      </div>
      
      {/* Events list */}
      <div className="p-2 max-h-[400px] overflow-y-auto">
        {events.map((event, i) => (
          <div 
            key={i}
            onClick={() => {
              // Use the original day cell position for the event preview
              // This ensures the preview appears where the day list was
              selectEvent(event, position);
              closeList(); // Close the day list when selecting a specific event
            }}
            className={`p-3 my-1 rounded-md border-l-4 ${colorClasses[event.color].border} shadow-sm hover:shadow-md fast-transition cursor-pointer`}
          >
            <h3 className="font-medium">{event.title}</h3>
            <div className="flex flex-wrap gap-1 mt-1 text-sm text-gray-500">
              <div className={`flex items-center ${colorClasses[event.color].text}`}>
                {event.allDay ? 'Todo el día' : `${formatTime(event.start)} - ${formatTime(event.end)}`}
              </div>
              {event.location && (
                <div className="flex items-center">
                  • {event.location}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
