import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationState, NotificationItem } from '@/types';

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fetchNotificationsRequest: (state) => {
      state.isLoading = true;
    },
    fetchNotificationsSuccess: (state, action: PayloadAction<NotificationItem[]>) => {
      state.isLoading = false;
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    markAsReadRequest: (_state, _action: PayloadAction<string>) => {
      // Optimistic update
    },
    markAsReadSuccess: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.map((n) => (n.id === action.payload ? { ...n, read: true } : n));
      state.unreadCount = state.notifications.filter((n) => !n.read).length;
    },
    markAllAsReadSuccess: (state) => {
      state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
  },
});

export const {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  markAsReadRequest,
  markAsReadSuccess,
  markAllAsReadSuccess,
} = notificationSlice.actions;

export default notificationSlice.reducer;
