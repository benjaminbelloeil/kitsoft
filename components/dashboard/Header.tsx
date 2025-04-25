/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { 
  SearchIcon, 
  MessageSquare, 
  HelpCircle, 
  Bell,
  X as CloseIcon
} from "lucide-react";
import { useNotifications } from '@/context/notification-context';
import { useState } from 'react';

export default function Header({ userData }: { userData: any }) {
  // Access notifications from context
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  // Handle notification bell click
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Format notification time
  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="sticky top-0 z-30 w-full mb-6">
      <div className="bg-white shadow-md border-b border-gray-100">
        <div className="flex h-16 items-center px-4 md:px-6 max-w-[1920px] mx-auto">
          {/* App logo and title with animation */}
          <div className="flex items-center mr-4 transition-all duration-300 hover:scale-105">
            <div className="hidden md:flex items-center">
              <h1 className="text-xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-[#A100FF] to-purple-700 bg-clip-text text-transparent">Accenture</span>
              </h1>
            </div>
          </div>
          
          {/* Search bar with enhanced styling */}
          <div className="flex-1 ml-auto md:mr-auto max-w-md relative">
            <div className="relative group">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-[#A100FF] transition-colors" />
              <input
                type="search"
                placeholder="Buscar..."
                className="w-full py-1.5 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A100FF20] focus:border-[#A100FF80] transition-colors"
              />
            </div>
          </div>
          
          {/* Navigation controls with improved hover effects */}
          <div className="flex items-center space-x-3">
            {/* Message icon */}
            <button className="p-2 text-gray-500 hover:text-[#A100FF] hover:bg-[#A100FF10] rounded-lg transition-colors">
              <MessageSquare className="h-5 w-5" />
            </button>
            
            {/* Help icon */}
            <button className="p-2 text-gray-500 hover:text-[#A100FF] hover:bg-[#A100FF10] rounded-lg transition-colors">
              <HelpCircle className="h-5 w-5" />
            </button>
            
            {/* Enhanced Notification Bell */}
            <div className="relative">
              <button 
                onClick={toggleNotifications}
                className="relative p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-gray-600 hover:text-[#A100FF]"
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <Bell className={`h-5 w-5 ${showNotifications ? 'text-[#A100FF]' : ''}`} />
                
                {/* Notification Count Badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{unreadCount}</span>
                  </span>
                )}
              </button>
              
              {/* Notification Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 max-h-[500px] flex flex-col rounded-lg shadow-lg bg-white border border-gray-100 z-50">
                  <div className="p-3 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-sm font-semibold">Notificaciones</h3>
                    <button 
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={() => setShowNotifications(false)}
                      aria-label="Close notifications"
                    >
                      <CloseIcon size={16} className="text-gray-500" />
                    </button>
                  </div>
                  
                  {/* Scrollable notification area */}
                  <div className="overflow-y-auto flex-1">
                    {notifications.length > 0 ? (
                      <div>
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3
                              ${!notification.read ? 'bg-[#A100FF08]' : ''}`}
                            onClick={() => {
                              if (!notification.read) markAsRead(notification.id);
                            }}
                          >
                            <div className="mt-1">
                              {notification.type === 'project' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                              {notification.type === 'announcement' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                              {notification.type === 'reminder' && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                                  {notification.title}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {formatNotificationTime(notification.date)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-[#A100FF] mt-1"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm italic">
                        No hay notificaciones
                      </div>
                    )}
                  </div>
                  
                  {/* Mark all as read button - only visible when there are notifications */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-100 text-center flex-shrink-0">
                      <button 
                        className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors
                          ${unreadCount > 0 
                            ? 'bg-[#A100FF20] text-[#A100FF] hover:bg-[#A100FF30]' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        onClick={() => {
                          if (unreadCount > 0) {
                            markAllAsRead();
                            setShowNotifications(false);
                          }
                        }}
                        disabled={unreadCount === 0}
                      >
                        {unreadCount > 0 
                          ? 'Marcar todo como leído' 
                          : 'Todo leído'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* User profile with enhanced styling */}
            <div className="border-l pl-3 ml-2">
              <Link href="/dashboard/perfil" className="flex items-center group">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#A100FF] to-indigo-600 flex items-center justify-center text-white font-medium text-sm shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                  {userData.name.substring(0, 1)}
                </div>
                <div className="ml-2 hidden md:block">
                  <div className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors">{userData.name}</div>
                  <div className="text-xs text-gray-500">{userData.title}</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
