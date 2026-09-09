import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from '@/features/auth/authSlice';
import employeeReducer from '@/features/employees/employeeSlice';
import requestReducer from '@/features/requests/requestSlice';
import surveyReducer from '@/features/surveys/surveySlice';
import documentReducer from '@/features/documents/documentSlice';
import notificationReducer from '@/features/notifications/notificationSlice';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    requests: requestReducer,
    surveys: surveyReducer,
    documents: documentReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
