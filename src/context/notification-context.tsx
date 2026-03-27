'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User, ItemRequest, InventoryItem } from '@/lib/types';
import { requests, inventoryItems } from '@/lib/data';
import { isEqual } from 'lodash';

interface NotificationContextType {
  notifications: Record<string, boolean>;
  clearNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: {},
  clearNotification: () => {},
});

export const NotificationProvider = ({ user, children }: { user: User; children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});

  const checkNotifications = useCallback(() => {
    const newNotifications: Record<string, boolean> = {};

    // Request notifications
    let hasPendingRequests = false;
    if (user.role === 'superAdmin') {
      hasPendingRequests = requests.some(r => r.status === 'Pending');
    } else if (user.role === 'admin') {
      hasPendingRequests = requests.some(r => 
        r.status === 'Pending' && user.assignedCategories?.includes(r.item.category)
      );
    }
    if (hasPendingRequests) {
      newNotifications.requests = true;
    }

    // Stock change notifications (simple version: any change)
    // A more robust implementation would compare snapshots of the inventory
    // For this prototype, we'll just simulate it.
    // To test, you could add a button that modifies inventoryItems and calls checkNotifications
    
    setNotifications(prev => {
        if (isEqual(prev, newNotifications)) {
            return prev;
        }
        return newNotifications;
    });

  }, [user]);

  useEffect(() => {
    checkNotifications();
    const interval = setInterval(checkNotifications, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [checkNotifications]);

  const clearNotification = (id: string) => {
    setNotifications(prev => {
      if (!prev[id]) return prev;
      const newNotifs = { ...prev };
      delete newNotifs[id];
      return newNotifs;
    });
  };

  return (
    <NotificationContext.Provider value={{ notifications, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => React.useContext(NotificationContext);
