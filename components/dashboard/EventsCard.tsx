"use client";

import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

interface EventsCardProps {
  upcomingWeekDates: Date[];
}

export default function EventsCard({ upcomingWeekDates }: EventsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Próximos Eventos
        </h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 w-12 text-center">
              <div className="text-sm font-bold text-gray-900">HOY</div>
              <div className="text-xl font-bold text-indigo-600">{upcomingWeekDates[0].getDate()}</div>
            </div>
            
            <div className="ml-4 flex-1 border-l border-gray-100 pl-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-2">
                <div className="font-medium text-gray-900">Daily Scrum</div>
                <div className="text-sm text-gray-500">10:00 - 10:15</div>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                <div className="font-medium text-gray-900">Reunión de Sprint Review</div>
                <div className="text-sm text-gray-500">15:00 - 16:00</div>
              </div>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-12 text-center">
              <div className="text-sm font-medium text-gray-500">MAÑ</div>
              <div className="text-xl font-bold text-gray-900">{upcomingWeekDates[1].getDate()}</div>
            </div>
            
            <div className="ml-4 flex-1 border-l border-gray-100 pl-4">
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <div className="font-medium text-gray-900">Reunión con cliente</div>
                <div className="text-sm text-gray-500">11:30 - 12:30</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            href="/dashboard/calendario" 
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Ver calendario completo
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
