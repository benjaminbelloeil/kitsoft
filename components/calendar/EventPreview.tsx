/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiX } from "react-icons/fi";
import { colorClasses } from "@/app/lib/data";

interface EventPreviewProps {
  event: any;
  position: { x: number, y: number, width: number } | null;
  closePreview: () => void;
  formatTime: (date: Date) => string;
  findProject: (id: string) => any;
}

export default function EventPreview({ 
  event, 
  position,
  closePreview, 
  formatTime,
  findProject 
}: EventPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  // Calculate optimal position for the popup
  useEffect(() => {
    if (!position || !previewRef.current) return;
    
    const previewEl = previewRef.current;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const previewHeight = previewEl.offsetHeight;
    const previewWidth = previewEl.offsetWidth;
    
    // Calculate optimal position
    let top = position.y + 10; // Position below the event with some margin
    let left = position.x;
    
    // Adjust if going off the bottom of the viewport
    if (top + previewHeight > viewportHeight - 20) {
      top = Math.max(20, position.y - previewHeight - 10); // Position above the event
    }
    
    // Adjust if going off the right side of the viewport
    if (left + previewWidth > viewportWidth - 20) {
      left = Math.max(20, viewportWidth - previewWidth - 20);
    }
    
    // Apply the calculated position
    previewEl.style.top = `${top}px`;
    previewEl.style.left = `${left}px`;
  }, [position]);

  // Handle clicks outside to close the preview
  useEffect(() => {
    if (!position) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (previewRef.current && !previewRef.current.contains(e.target as Node)) {
        closePreview();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [position, closePreview]);
  
  if (!event || !position) return null;
  
  const project = findProject(event.projectId);
  
  // Get the color for the event border
  const getBorderColor = () => {
    switch(event.color) {
      case 'emerald': return '#10B981';
      case 'blue': return '#3B82F6';
      case 'purple': return '#8B5CF6';
      default: return '#A100FF';
    }
  };

  return (
    <div 
      ref={previewRef}
      className="fixed shadow-xl border border-gray-200 rounded-xl bg-white w-[320px] z-50 event-preview-popup"
      style={{ 
        maxHeight: 'calc(100vh - 40px)',
        maxWidth: 'calc(100vw - 40px)',
      }}
    >
      {/* Event header */}
      <div className="p-4 relative border-t-4" style={{
        borderTopColor: getBorderColor()
      }}>
        <button 
          onClick={closePreview}
          className="absolute top-2 right-2 bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 fast-transition"
        >
          <FiX size={16} className="text-gray-600" />
        </button>
        <h3 className="font-bold text-gray-800 text-lg mr-6">{event.title}</h3>
        <div className="flex items-center text-gray-600 mt-1">
          <FiCalendar size={14} className="mr-1 flex-shrink-0" />
          <span className="text-sm text-gray-600">
            {event.start.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        {!event.allDay && (
          <div className="flex items-center text-gray-600 mt-1">
            <FiClock size={14} className="mr-1 flex-shrink-0" />
            <span className="text-sm text-gray-600">
              {formatTime(event.start)} - {formatTime(event.end)}
            </span>
          </div>
        )}
      </div>
      
      {/* Project information */}
      <div className="px-4 pt-2">
        <div className="flex items-center p-2 rounded-md bg-gray-50 border border-gray-100">
          <div className={`w-3 h-3 rounded-full ${colorClasses[event.color]?.bg || "bg-gray-500"} mr-2 flex-shrink-0`} />
          <span className="text-sm font-medium text-gray-800">{project?.name || "Proyecto sin asignar"}</span>
        </div>
      </div>
      
      {/* Event details */}
      <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: '300px' }}>
        {event.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Descripción</h4>
            <p className="text-sm text-gray-700">{event.description}</p>
          </div>
        )}
        
        {event.location && (
          <div className="flex items-start">
            <FiMapPin size={16} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-gray-500">Ubicación</h4>
              <p className="text-sm text-gray-700">{event.location}</p>
            </div>
          </div>
        )}
        
        {event.attendees && event.attendees.length > 0 && (
          <div className="flex items-start">
            <FiUsers size={16} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-500">Participantes</h4>
              <div className="space-y-1 mt-1">
                {event.attendees.map((attendee: string, i: number) => (
                  <div key={i} className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 overflow-hidden flex-shrink-0">
                      {/* Avatar placeholder */}
                      <div className="h-full w-full flex items-center justify-center text-xs text-gray-500 font-medium">
                        {attendee.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <span className="text-sm truncate text-gray-700">{attendee}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Action buttons removed as requested */}
      </div>
      
      {/* Debug information - will help identify issues */}
      {process.env.NODE_ENV === 'development' && !project && (
        <div className="p-2 bg-red-100 text-red-700 text-xs">
          Debug: Project not found for ID: {event.projectId || 'undefined'}
        </div>
      )}
    </div>
  );
}
