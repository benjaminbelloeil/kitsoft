/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { calendarEvents, userData, colorClasses } from "@/app/lib/data";
import MiniCalendar from "@/components/calendar/MiniCalendar";
import ProjectFilter from "@/components/calendar/ProjectFilter";
import MainCalendar from "@/components/calendar/MainCalendar";
import EventPreview from "@/components/calendar/EventPreview";
import DayEventsList from "@/components/calendar/DayEventsList";
import { SkeletonCalendar } from "@/components/calendar/SkeletonCalendar";
import { FiCalendar, FiSearch } from "react-icons/fi";
import NotificationBadge from "@/components/calendar/NotificationBadge";

// Sample additional events to show multiple projects in a day
const additionalEvents = [
  {
    id: "e8",
    projectId: "p1",
    title: "Nova Team Brainstorming",
    start: new Date(), // Today
    end: new Date(new Date().setHours(new Date().getHours() + 2)),
    allDay: false,
    description: "Sesión de brainstorming para nuevas características",
    location: "Sala 3B, Madrid Office",
    color: "emerald"
  },
  {
    id: "e9",
    projectId: "p2",
    title: "Cloud First Training",
    start: new Date(), // Today
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
    allDay: false,
    description: "Formación en nuevas tecnologías cloud",
    location: "Online",
    color: "blue"
  },
  {
    id: "e10",
    projectId: "p3",
    title: "Digital Strategy Review",
    start: new Date(), // Today
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    allDay: false,
    description: "Revisión de estrategia digital",
    location: "Client Office",
    color: "purple"
  },
  // Add events to other dates
  {
    id: "e11",
    projectId: "p1",
    title: "Project Nova Retrospective",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    allDay: true,
    description: "Revisión del sprint anterior",
    location: "Sala 2A, Madrid Office",
    color: "emerald"
  },
  {
    id: "e12",
    projectId: "p3",
    title: "Digital Transformation Planning",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    allDay: false,
    description: "Planificación del próximo trimestre",
    location: "Office",
    color: "purple"
  }
];

// Combined events array
const combinedEvents = [...calendarEvents, ...additionalEvents];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventPosition, setEventPosition] = useState<{ x: number, y: number, width: number } | null>(null);
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [animationClass, setAnimationClass] = useState("");
  const [loading, setLoading] = useState(true);
  
  // New state for day events popup
  const [dayEventsDate, setDayEventsDate] = useState<Date | null>(null);
  const [dayEventsPosition, setDayEventsPosition] = useState<{ x: number, y: number, width: number } | null>(null);

  // Simulate loading
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Toggle filter
  const toggleFilter = (projectId: string) => {
    if (activeFilters.includes(projectId)) {
      setActiveFilters(activeFilters.filter(id => id !== projectId));
    } else {
      setActiveFilters([...activeFilters, projectId]);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setActiveFilters([]);
  };

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    if (activeFilters.length === 0) return combinedEvents;
    return combinedEvents.filter(event => 
      activeFilters.includes(event.projectId)
    );
  }, [activeFilters]);

  // Get events for the selected date
  const eventsForSelectedDate = useMemo(() => {
    return filteredEvents.filter(event => 
      event.start.getDate() === selectedDate.getDate() && 
      event.start.getMonth() === selectedDate.getMonth() &&
      event.start.getFullYear() === selectedDate.getFullYear()
    );
  }, [filteredEvents, selectedDate]);

  // Handle month navigation
  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    setAnimationClass("animate-slideRight");
    setTimeout(() => setAnimationClass(""), 300);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    setAnimationClass("animate-slideLeft");
    setTimeout(() => setAnimationClass(""), 300);
  };

  // Handle date selection
  const selectDate = (date: Date) => {
    setSelectedDate(new Date(date));
    // Close event preview when selecting a new date
    setSelectedEvent(null);
  };

  // Handle event selection with position
  const selectEvent = (event: any, position: { x: number, y: number, width: number }) => {
    setSelectedEvent(event);
    setEventPosition(position);
  };

  // Close event preview
  const closeEventPreview = () => {
    setSelectedEvent(null);
    setEventPosition(null);
  };
  
  // Show day events popup
  const showDayEvents = (date: Date, position: { x: number, y: number, width: number }) => {
    setDayEventsDate(date);
    setDayEventsPosition(position);
    // Close event preview if open
    closeEventPreview();
  };
  
  // Close day events popup
  const closeDayEventsList = () => {
    setDayEventsDate(null);
    setDayEventsPosition(null);
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      event.start.getDate() === date.getDate() && 
      event.start.getMonth() === date.getMonth() &&
      event.start.getFullYear() === date.getFullYear()
    );
  };

  // Find project by ID
  const findProject = (projectId: string) => {
    return userData.projects.find(p => p.id === projectId);
  };

  // Format time from Date object - 24h format
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Get events for the day events popup
  const eventsForDayPopup = useMemo(() => {
    if (!dayEventsDate) return [];
    return filteredEvents.filter(event => 
      event.start.getDate() === dayEventsDate.getDate() && 
      event.start.getMonth() === dayEventsDate.getMonth() &&
      event.start.getFullYear() === dayEventsDate.getFullYear()
    );
  }, [filteredEvents, dayEventsDate]);

  // New function to handle "go to today"
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentDate(today);
    setMiniCalendarDate(today);
    // Using an existing animation class for consistency
    setAnimationClass("animate-slideLeft");
    setTimeout(() => setAnimationClass(""), 300);
  };

  // If loading, show skeleton
  if (loading) {
    return <div className="max-w-[1920px] mx-auto px-4 md:px-6 pt-6"><SkeletonCalendar /></div>;
  }

  return (
    <div className="h-full flex flex-col relative max-w-[1920px] mx-auto px-4 md:px-6 pt-6">
      {/* Simplified header - cleaner with only essential elements */}
      <div className="mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:border-[#A100FF20] transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Title section with enhanced visuals */}
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#A100FF20] to-[#A100FF10] p-3 rounded-lg mr-4 shadow-sm">
                <FiCalendar size={24} className="text-[#A100FF]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-[#A100FF]">
                  Calendario de Proyectos
                </h1>
                <p className="text-gray-500 mt-1">
                  {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            {/* Right side controls - only search and notifications */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search input with animation - updated color */}
              <div className="relative group flex-1 sm:flex-initial sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A100FF] transition-colors" />
                <input
                  type="search"
                  placeholder="Buscar eventos..."
                  className="w-full py-1.5 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A100FF20] focus:border-[#A100FF80] transition-colors"
                />
              </div>
              
              {/* Notification badge */}
              <NotificationBadge />
            </div>
          </div>
        </div>
      </div>

      {/* The rest of the calendar with fixed overflow issues */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
          <div className="flex flex-col gap-4">
            {/* Mini calendar */}
            <div>
              <MiniCalendar 
                miniCalendarDate={miniCalendarDate}
                selectedDate={selectedDate}
                setMiniCalendarDate={setMiniCalendarDate}
                setSelectedDate={selectDate}
                getEventsForDate={getEventsForDate}
              />
            </div>

            {/* Filters */}
            <div>
              <ProjectFilter 
                projects={userData.projects}
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                resetFilters={resetFilters}
              />
            </div>
          </div>
          
          {/* Small screen events for selected date */}
          <div className="lg:hidden bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <h2 className="font-bold mb-3 text-gray-800 border-b pb-2">
              {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h2>
            
            {eventsForSelectedDate.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {eventsForSelectedDate.map((event, i) => (
                  <div 
                    key={i}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      selectEvent(event, {
                        x: rect.left,
                        y: rect.bottom,
                        width: rect.width
                      });
                    }}
                    className={`p-3 rounded-md border-l-4 ${colorClasses[event.color].border} shadow-sm hover:shadow-md fast-transition cursor-pointer bg-white`}
                  >
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
                      <div className="flex items-center">
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
            ) : (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
                No hay eventos para esta fecha
              </div>
            )}
          </div>
        </div>

        {/* Main content area with calendar - prevent horizontal overflow */}
        <div className="flex-1 flex flex-col min-h-[650px] overflow-hidden">
          {/* Main calendar - always uses full width and now prevents overflow */}
          <div className="h-full overflow-hidden">
            <MainCalendar
              currentDate={currentDate}
              selectedDate={selectedDate}
              selectDate={selectDate}
              selectEvent={selectEvent}
              prevMonth={prevMonth}
              nextMonth={nextMonth}
              animationClass={animationClass}
              getEventsForDate={getEventsForDate}
              formatTime={formatTime}
              showDayEvents={showDayEvents}
              goToToday={goToToday}
            />
          </div>
        </div>
      </div>
      
      {/* Event preview popup - positioned relatively based on clicked event */}
      <EventPreview
        event={selectedEvent}
        position={eventPosition}
        closePreview={closeEventPreview}
        formatTime={formatTime}
        findProject={findProject}
      />
      
      {/* Day events list popup */}
      <DayEventsList
        date={dayEventsDate}
        events={eventsForDayPopup}
        position={dayEventsPosition}
        closeList={closeDayEventsList}
        formatTime={formatTime}
        selectEvent={selectEvent}
      />
    </div>
  );
}
