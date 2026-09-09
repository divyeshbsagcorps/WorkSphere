import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { notificationApi } from '@/api/notificationApi';
import {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  markAsReadRequest,
  markAsReadSuccess,
} from './notificationSlice';
import { NotificationItem } from '@/types';

function* handleFetchNotifications(): Generator {
  try {
    const list = (yield call(notificationApi.getNotifications)) as NotificationItem[];
    yield put(fetchNotificationsSuccess(list));
  } catch (err) {
    // Silent fallbacks for notifications
  }
}

function* handleMarkAsRead(action: PayloadAction<string>): Generator {
  try {
    const id = (yield call(notificationApi.markAsRead, action.payload)) as string;
    yield put(markAsReadSuccess(id));
  } catch (err) {
    // Silent fallback
  }
}

export function* notificationSaga() {
  yield takeLatest(fetchNotificationsRequest.type, handleFetchNotifications);
  yield takeLatest(markAsReadRequest.type, handleMarkAsRead);
}
