import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestState, ApprovalRequest } from '@/types';

const initialState: RequestState = {
  requests: [],
  userRequests: [],
  pendingApprovals: [],
  selectedRequest: null,
  isLoading: false,
  error: null,
};

export const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    fetchRequestsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchRequestsSuccess: (state, action: PayloadAction<ApprovalRequest[]>) => {
      state.isLoading = false;
      state.requests = action.payload;
    },
    fetchRequestsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createRequestAction: (
      state,
      _action: PayloadAction<Omit<ApprovalRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'timeline'>>
    ) => {
      state.isLoading = true;
    },
    createRequestSuccess: (state, action: PayloadAction<ApprovalRequest>) => {
      state.isLoading = false;
      state.requests.unshift(action.payload);
    },
    updateRequestStatusAction: (
      state,
      _action: PayloadAction<{
        id: string;
        action: 'APPROVE' | 'REJECT';
        actorRole: 'MANAGER' | 'HR_ADMIN';
        actorName: string;
        comment?: string;
      }>
    ) => {
      state.isLoading = true;
    },
    updateRequestStatusSuccess: (state, action: PayloadAction<ApprovalRequest>) => {
      state.isLoading = false;
      state.requests = state.requests.map((r) => (r.id === action.payload.id ? action.payload : r));
    },
  },
});

export const {
  fetchRequestsRequest,
  fetchRequestsSuccess,
  fetchRequestsFailure,
  createRequestAction,
  createRequestSuccess,
  updateRequestStatusAction,
  updateRequestStatusSuccess,
} = requestSlice.actions;

export default requestSlice.reducer;
