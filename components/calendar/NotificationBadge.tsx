import React, { useState } from 'react';
import { FiBell, FiX } from 'react-icons/fi';
import { useNotifications } from '@/context/notification-context';

export default function NotificationBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  // Format relative time for notifications
  const formatRelativeTime = (date: Date) => {
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
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <div className="w-2 h-2 rounded-full bg-emerald-500"></div>;
      case 'announcement':
        return <div className="w-2 h-2 rounded-full bg-blue-500"></div>;
      case 'reminder':
        return <div className="w-2 h-2 rounded-full bg-amber-500"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-500"></div>;
    }
  };
  
  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button 
        className="relative p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-100"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <FiBell size={18} className="text-gray-600" />
        
        {/* Notification Count Badge - removed animate-pulse */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">{unreadCount}</span>
          </div>
        )}
      </button>
      
      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-[500px] flex flex-col rounded-lg shadow-lg bg-white border border-gray-100 z-50">
          <div className="p-3 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
            <h3 className="text-sm font-semibold">Notificaciones</h3>
            <button 
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close notifications"
            >
              <FiX size={16} className="text-gray-500" />
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
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(notification.date)}
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
                    setIsOpen(false);
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
  );
}
