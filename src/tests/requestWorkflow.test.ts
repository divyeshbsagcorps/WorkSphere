import { describe, it, expect } from 'vitest';
import requestReducer, {
  createRequestSuccess,
  updateRequestStatusSuccess,
} from '@/features/requests/requestSlice';
import { ApprovalRequest } from '@/types';

describe('Approval Workflow State Machine', () => {
  const initialReq: ApprovalRequest = {
    id: 'REQ-TEST',
    employeeId: 101,
    employeeName: 'Alex Rivera',
    department: 'Engineering',
    category: 'Leave',
    title: 'Vacation Leave',
    description: 'Family trip',
    status: 'PENDING',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
    timeline: [],
  };

  it('should transition state from PENDING -> MANAGER_APPROVED upon Manager approval', () => {
    const stateWithReq = requestReducer(undefined, createRequestSuccess(initialReq));

    const managerApprovedReq: ApprovalRequest = {
      ...initialReq,
      status: 'MANAGER_APPROVED',
    };

    const nextState = requestReducer(stateWithReq, updateRequestStatusSuccess(managerApprovedReq));

    const updated = nextState.requests.find((r) => r.id === 'REQ-TEST');
    expect(updated?.status).toBe('MANAGER_APPROVED');
  });

  it('should transition state from MANAGER_APPROVED -> COMPLETED upon HR approval', () => {
    const stateWithReq = requestReducer(undefined, createRequestSuccess(initialReq));

    const completedReq: ApprovalRequest = {
      ...initialReq,
      status: 'COMPLETED',
    };

    const nextState = requestReducer(stateWithReq, updateRequestStatusSuccess(completedReq));

    const updated = nextState.requests.find((r) => r.id === 'REQ-TEST');
    expect(updated?.status).toBe('COMPLETED');
  });
});
