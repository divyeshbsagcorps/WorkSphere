import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentState, EmployeeDocument, DocumentStatus } from '@/types';

const initialState: DocumentState = {
  documents: [],
  userDocuments: [],
  pendingDocuments: [],
  isLoading: false,
  error: null,
};

export const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    fetchDocumentsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchDocumentsSuccess: (state, action: PayloadAction<EmployeeDocument[]>) => {
      state.isLoading = false;
      state.documents = action.payload;
    },
    fetchDocumentsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    uploadDocumentRequest: (state, _action: PayloadAction<Omit<EmployeeDocument, 'id' | 'uploadedAt' | 'status'>>) => {
      state.isLoading = true;
    },
    uploadDocumentSuccess: (state, action: PayloadAction<EmployeeDocument>) => {
      state.isLoading = false;
      state.documents.unshift(action.payload);
    },
    updateDocumentStatusRequest: (
      state,
      _action: PayloadAction<{ id: string; status: DocumentStatus; rejectionReason?: string }>
    ) => {
      state.isLoading = true;
    },
    updateDocumentStatusSuccess: (state, action: PayloadAction<EmployeeDocument>) => {
      state.isLoading = false;
      state.documents = state.documents.map((d) => (d.id === action.payload.id ? action.payload : d));
    },
    deleteDocumentRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
    },
    deleteDocumentSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.documents = state.documents.filter((d) => d.id !== action.payload);
    },
  },
});

export const {
  fetchDocumentsRequest,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
  uploadDocumentRequest,
  uploadDocumentSuccess,
  updateDocumentStatusRequest,
  updateDocumentStatusSuccess,
  deleteDocumentRequest,
  deleteDocumentSuccess,
} = documentSlice.actions;

export default documentSlice.reducer;
