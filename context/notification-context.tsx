'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'project' | 'announcement' | 'reminder' | 'workload_low' | 'workload_overload' | 'no_people_lead' | 'welcome';
}

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Fetch notifications from the API
  const refreshNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        // Ensure dates are properly converted to Date objects
        const processedData: Notification[] = data.map((notification: {
          id: string;
          title: string;
          message: string;
          date: string | Date;
          read: boolean;
          type: 'project' | 'announcement' | 'reminder' | 'workload_low' | 'workload_overload' | 'no_people_lead' | 'welcome';
        }) => ({
          ...notification,
          date: new Date(notification.date)
        }));
        setNotifications(processedData);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load notifications on mount
  useEffect(() => {
    refreshNotifications();
  }, []);
  
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId: id,
          markAsRead: true,
        }),
      });
      
      if (response.ok) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markAllAsRead: true,
        }),
      });
      
      if (response.ok) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({ ...notification, read: true }))
        );
      } else {
        console.error('Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount,
      loading,
      setNotifications, 
      markAsRead, 
      markAllAsRead,
      refreshNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
