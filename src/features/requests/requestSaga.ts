import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { requestApi } from '@/api/requestApi';
import {
  fetchRequestsRequest,
  fetchRequestsSuccess,
  fetchRequestsFailure,
  createRequestAction,
  createRequestSuccess,
  updateRequestStatusAction,
  updateRequestStatusSuccess,
} from './requestSlice';
import { ApprovalRequest } from '@/types';

function* handleFetchRequests(): Generator {
  try {
    const list = (yield call(requestApi.getRequests)) as ApprovalRequest[];
    yield put(fetchRequestsSuccess(list));
  } catch (err: any) {
    yield put(fetchRequestsFailure(err.message || 'Failed to fetch requests'));
  }
}

function* handleCreateRequest(
  action: PayloadAction<Omit<ApprovalRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'timeline'>>
): Generator {
  try {
    const newReq = (yield call(requestApi.createRequest, action.payload)) as ApprovalRequest;
    yield put(createRequestSuccess(newReq));
  } catch (err: any) {
    yield put(fetchRequestsFailure(err.message || 'Failed to create request'));
  }
}

function* handleUpdateRequestStatus(
  action: PayloadAction<{
    id: string;
    action: 'APPROVE' | 'REJECT';
    actorRole: 'MANAGER' | 'HR_ADMIN';
    actorName: string;
    comment?: string;
  }>
): Generator {
  try {
    const { id, action: act, actorRole, actorName, comment } = action.payload;
    const updated = (yield call(requestApi.updateRequestStatus, id, act, actorRole, actorName, comment)) as ApprovalRequest;
    yield put(updateRequestStatusSuccess(updated));
  } catch (err: any) {
    yield put(fetchRequestsFailure(err.message || 'Failed to update request status'));
  }
}

export function* requestSaga() {
  yield takeLatest(fetchRequestsRequest.type, handleFetchRequests);
  yield takeLatest(createRequestAction.type, handleCreateRequest);
  yield takeLatest(updateRequestStatusAction.type, handleUpdateRequestStatus);
}
