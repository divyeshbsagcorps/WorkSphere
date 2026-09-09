import { apiCall } from './client';
import { ApprovalRequest, RequestStatus } from '@/types';
import { INITIAL_REQUESTS } from '@/utils/mockData';

let requestsDb: ApprovalRequest[] = [...INITIAL_REQUESTS];

export const requestApi = {
  getRequests: async (): Promise<ApprovalRequest[]> => {
    return apiCall(() => [...requestsDb], 300);
  },

  createRequest: async (
    data: Omit<ApprovalRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'timeline'>
  ): Promise<ApprovalRequest> => {
    return apiCall(() => {
      const now = new Date().toISOString();
      const newId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRequest: ApprovalRequest = {
        ...data,
        id: newId,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
        timeline: [
          {
            stage: 'Submitted',
            status: 'COMPLETED',
            actionBy: data.employeeName,
            actionDate: now.substring(0, 16).replace('T', ' '),
          },
          { stage: 'Manager Review', status: 'PENDING', actionBy: 'Manager' },
          { stage: 'HR Review', status: 'PENDING', actionBy: 'HR Admin' },
          { stage: 'Final Completion', status: 'PENDING' },
        ],
      };
      requestsDb = [newRequest, ...requestsDb];
      return newRequest;
    }, 400);
  },

  updateRequestStatus: async (
    id: string,
    action: 'APPROVE' | 'REJECT',
    actorRole: 'MANAGER' | 'HR_ADMIN',
    actorName: string,
    comment?: string
  ): Promise<ApprovalRequest> => {
    return apiCall(() => {
      const req = requestsDb.find((r) => r.id === id);
      if (!req) throw new Error(`Request ${id} not found.`);

      const now = new Date().toISOString().substring(0, 16).replace('T', ' ');
      const newTimeline = [...req.timeline];

      let newStatus: RequestStatus = req.status;

      if (action === 'REJECT') {
        newStatus = 'REJECTED';
        req.rejectionReason = comment || 'Request rejected by authority.';
        if (actorRole === 'MANAGER') {
          newTimeline[1] = { stage: 'Manager Review', status: 'REJECTED', actionBy: actorName, actionDate: now, comment };
          newTimeline[2] = { stage: 'HR Review', status: 'SKIPPED' };
          newTimeline[3] = { stage: 'Final Completion', status: 'REJECTED' };
        } else {
          newTimeline[2] = { stage: 'HR Review', status: 'REJECTED', actionBy: actorName, actionDate: now, comment };
          newTimeline[3] = { stage: 'Final Completion', status: 'REJECTED' };
        }
      } else if (action === 'APPROVE') {
        if (actorRole === 'MANAGER') {
          newStatus = 'MANAGER_APPROVED';
          newTimeline[1] = { stage: 'Manager Review', status: 'COMPLETED', actionBy: actorName, actionDate: now, comment };
          newTimeline[2] = { stage: 'HR Review', status: 'PENDING', actionBy: 'HR Admin' };
        } else if (actorRole === 'HR_ADMIN') {
          newStatus = 'COMPLETED';
          newTimeline[2] = { stage: 'HR Review', status: 'COMPLETED', actionBy: actorName, actionDate: now, comment };
          newTimeline[3] = { stage: 'Final Completion', status: 'COMPLETED', actionBy: 'System', actionDate: now };
        }
      }

      const updatedRequest: ApprovalRequest = {
        ...req,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        timeline: newTimeline,
      };

      requestsDb = requestsDb.map((r) => (r.id === id ? updatedRequest : r));
      return updatedRequest;
    }, 450);
  },
};
