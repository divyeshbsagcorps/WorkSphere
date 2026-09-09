import { apiCall } from './client';
import { NotificationItem } from '@/types';
import { INITIAL_NOTIFICATIONS } from '@/utils/mockData';

let notificationsDb: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

export const notificationApi = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    return apiCall(() => [...notificationsDb], 250);
  },

  markAsRead: async (id: string): Promise<string> => {
    return apiCall(() => {
      notificationsDb = notificationsDb.map((n) => (n.id === id ? { ...n, read: true } : n));
      return id;
    }, 200);
  },

  markAllAsRead: async (): Promise<boolean> => {
    return apiCall(() => {
      notificationsDb = notificationsDb.map((n) => ({ ...n, read: true }));
      return true;
    }, 250);
  },
};
