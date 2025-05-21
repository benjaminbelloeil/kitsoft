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
        
        {/* Content with overlay decorations */}
        <div className="relative px-6 py-8">
          {/* Enhanced decorative circles/bubbles with increased visibility */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#A100FF20] to-transparent rounded-full -mt-32 -mr-32"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-200 to-transparent rounded-full -mb-10 -ml-10"></div>
          
          {/* Existing decorative bubbles with increased visibility */}
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-tr from-[#A100FF15] to-transparent rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-bl from-indigo-100 to-transparent rounded-full opacity-80"></div>
          <div className="absolute top-3/4 left-1/4 w-12 h-12 bg-gradient-to-br from-[#A100FF25] to-transparent rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-gradient-to-tl from-blue-100 to-transparent rounded-full"></div>
          <div className="absolute bottom-1/2 right-[20%] w-10 h-10 bg-gradient-to-br from-purple-100 to-transparent rounded-full"></div>
          
          {/* Additional new bubbles with better visibility */}
          <div className="absolute top-10 left-[15%] w-20 h-20 bg-gradient-to-br from-[#7B68EE30] to-transparent rounded-full"></div>
          <div className="absolute bottom-16 right-16 w-16 h-16 bg-gradient-to-tl from-[#A100FF20] to-transparent rounded-full"></div>
          <div className="absolute top-[40%] right-[10%] w-12 h-12 bg-gradient-to-bl from-[#5D3FD325] to-transparent rounded-full"></div>
          <div className="absolute bottom-[30%] left-[20%] w-14 h-14 bg-gradient-to-tr from-[#9370DB25] to-transparent rounded-full"></div>
          <div className="absolute top-[70%] right-[25%] w-8 h-8 bg-gradient-to-br from-[#483D8B20] to-transparent rounded-full animate-pulse"></div>
          <div className="absolute top-[25%] left-[40%] w-10 h-10 bg-gradient-to-tl from-[#6A5ACD20] to-transparent rounded-full"></div>
          
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
