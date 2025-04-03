'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'project' | 'announcement' | 'reminder';
}

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

// Sample notifications data
const initialNotifications = [
  {
    id: "n1",
    title: "Nuevo proyecto asignado",
    message: "Has sido asignado al proyecto Digital Transformation",
    date: new Date(new Date().setHours(new Date().getHours() - 1)),
    read: false,
    type: 'project' as const,
  },
  {
    id: "n2",
    title: "Reunión de planificación",
    message: "No olvides la reunión de Sprint Planning mañana a las 10:00",
    date: new Date(new Date().setHours(new Date().getHours() - 3)),
    read: false,
    type: 'reminder' as const,
  },
  {
    id: "n3",
    title: "Actualización importante",
    message: "Hay una nueva versión de la plataforma disponible",
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    read: true,
    type: 'announcement' as const,
  },
  {
    id: "n4",
    title: "Feedback recibido",
    message: "Has recibido feedback en el proyecto Nova",
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    read: true,
    type: 'project' as const,
  }
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount,
      setNotifications, 
      markAsRead, 
      markAllAsRead 
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
