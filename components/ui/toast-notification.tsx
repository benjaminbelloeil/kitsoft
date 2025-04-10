"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiX, FiInfo } from 'react-icons/fi';

// Type for notification props
export type NotificationType = 'success' | 'error' | 'info';
export interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export interface ToastNotificationProps {
  notification: NotificationProps;
  onClose: () => void;
}

export const ToastNotification = ({ notification, onClose }: ToastNotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, notification.duration || 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [notification.duration, onClose]);

  // Determine background color based on type
  const getBackgroundColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-100';
      case 'error':
        return 'bg-red-50 border-red-100';
      case 'info':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  // Determine icon and icon color based on type
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <FiAlertCircle className="text-red-500" size={20} />;
      case 'info':
        return <FiInfo className="text-blue-500" size={20} />;
      default:
        return <FiInfo className="text-gray-500" size={20} />;
    }
  };

  const getTextColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`border rounded-lg shadow-lg p-4 mb-3 ${getBackgroundColor(notification.type)}`}
      style={{ minWidth: "280px" }}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {getIcon(notification.type)}
        </div>
        <div className={`ml-3 ${getTextColor(notification.type)} flex-grow`}>
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-transparent text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <FiX size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Global notification context and state management
export interface UseNotification {
  showNotification: (type: NotificationType, message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  clearNotifications: () => void;
  notifications: NotificationProps[];
}

export const useNotificationState = (): UseNotification => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const showNotification = (type: NotificationType, message: string, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message, duration }]);
  };

  const showSuccess = (message: string, duration?: number) => {
    showNotification('success', message, duration);
  };

  const showError = (message: string, duration?: number) => {
    showNotification('error', message, duration);
  };

  const showInfo = (message: string, duration?: number) => {
    showNotification('info', message, duration);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    showNotification,
    showSuccess,
    showError,
    showInfo,
    clearNotifications,
    notifications
  };
};

export const NotificationContainer = ({ notifications, onClose }: { 
  notifications: NotificationProps[], 
  onClose: (id: string) => void 
}) => {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col items-end">
      <AnimatePresence>
        {notifications.map(notification => (
          <ToastNotification 
            key={notification.id} 
            notification={notification} 
            onClose={() => onClose(notification.id)} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};