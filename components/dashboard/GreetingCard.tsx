/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar } from "lucide-react";
import { JSX } from "react";

interface GreetingCardProps {
  greetingState: {
    text: string;
    icon: JSX.Element;
    class: string;
  };
  userData: any;
  currentDate: Date;
  timeString: string;
}

export default function GreetingCard({
  greetingState,
  userData,
  currentDate,
  timeString
}: GreetingCardProps) {
  // Get the full name from userData
  // If name is available use it, otherwise use Nombre (first name) and Apellido (last name) if available
  const userName = userData.name || 
                 ((userData.Nombre || userData.nombre) ? 
                  `${userData.Nombre || userData.nombre} ${userData.Apellido || userData.apellido || ''}`.trim() : 
                  'Usuario');

  return (
    <div className="max-w-[1920px] mx-auto mb-10 px-4">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        
        {/* Content with fewer, larger decorative elements */}
        <div className="relative px-6 py-8">
          {/* Reduced number of bubbles but made them larger and more impactful */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#A100FF15] to-transparent rounded-full -mt-48 -mr-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#A100FF10] to-transparent rounded-full -mb-40 -ml-40"></div>
          
          {/* One medium sized bubble in a contrasting position */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-[#7B68EE15] to-transparent rounded-full"></div>
          
          <div className="relative z-10">
            {/* Animated greeting with better icon styling */}
            <div className={`flex items-center mb-3 ${greetingState.class}`}>
              <span className="mr-3 relative">
                <div className="p-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm">
                  {greetingState.icon}
                </div>
                <span className="absolute top-0 right-0 h-2 w-2 bg-indigo-300 rounded-full animate-ping opacity-70"></span>
              </span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {greetingState.text}, <span className="text-black">{userName}</span>
                </h1>
                <p className="text-gray-500 mt-1">¡Bienvenido de nuevo! Aquí tienes un resumen de tu actividad.</p>
              </div>
            </div>
            
            {/* Enhanced date and time display */}
            <div className="flex flex-wrap items-center text-gray-600 mt-4 gap-2">
              <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                <Calendar className="h-4 w-4 text-[#000000] mr-2" />
                <span className="font-medium">
                  {currentDate.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="mx-2 text-gray-400 hidden sm:block">•</div>
              <div className="bg-gray-50 px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                <span className="font-medium text-gray-700">{timeString}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
