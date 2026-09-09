import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { documentApi } from '@/api/documentApi';
import {
  fetchDocumentsRequest,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
  uploadDocumentRequest,
  uploadDocumentSuccess,
  updateDocumentStatusRequest,
  updateDocumentStatusSuccess,
  deleteDocumentRequest,
  deleteDocumentSuccess,
} from './documentSlice';
import { EmployeeDocument, DocumentStatus } from '@/types';

function* handleFetchDocuments(): Generator {
  try {
    const list = (yield call(documentApi.getDocuments)) as EmployeeDocument[];
    yield put(fetchDocumentsSuccess(list));
  } catch (err: any) {
    yield put(fetchDocumentsFailure(err.message || 'Failed to fetch documents'));
  }
}

function* handleUploadDocument(
  action: PayloadAction<Omit<EmployeeDocument, 'id' | 'uploadedAt' | 'status'>>
): Generator {
  try {
    const newDoc = (yield call(documentApi.uploadDocument, action.payload)) as EmployeeDocument;
    yield put(uploadDocumentSuccess(newDoc));
  } catch (err: any) {
    yield put(fetchDocumentsFailure(err.message || 'Failed to upload document'));
  }
}

function* handleUpdateDocumentStatus(
  action: PayloadAction<{ id: string; status: DocumentStatus; rejectionReason?: string }>
): Generator {
  try {
    const { id, status, rejectionReason } = action.payload;
    const updated = (yield call(documentApi.updateDocumentStatus, id, status, rejectionReason)) as EmployeeDocument;
    yield put(updateDocumentStatusSuccess(updated));
  } catch (err: any) {
    yield put(fetchDocumentsFailure(err.message || 'Failed to update document status'));
  }
}

function* handleDeleteDocument(action: PayloadAction<string>): Generator {
  try {
    const res = (yield call(documentApi.deleteDocument, action.payload)) as { id: string };
    yield put(deleteDocumentSuccess(res.id));
  } catch (err: any) {
    yield put(fetchDocumentsFailure(err.message || 'Failed to delete document'));
  }
}

export function* documentSaga() {
  yield takeLatest(fetchDocumentsRequest.type, handleFetchDocuments);
  yield takeLatest(uploadDocumentRequest.type, handleUploadDocument);
  yield takeLatest(updateDocumentStatusRequest.type, handleUpdateDocumentStatus);
  yield takeLatest(deleteDocumentRequest.type, handleDeleteDocument);
}
