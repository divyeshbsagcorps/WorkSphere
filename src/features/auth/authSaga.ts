import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@/api/authApi';
import { loginRequest, loginSuccess, loginFailure } from './authSlice';
import { Role, User } from '@/types';

function* handleLogin(action: PayloadAction<Role>): Generator {
  try {
    const response = (yield call(authApi.login, action.payload)) as { user: User; token: string };
    yield put(loginSuccess(response));
  } catch (err: any) {
    yield put(loginFailure(err.message || 'Login failed'));
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}
