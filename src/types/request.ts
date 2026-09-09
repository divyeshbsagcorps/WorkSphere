export type RequestStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'MANAGER_APPROVED'
  | 'HR_APPROVED'
  | 'REJECTED'
  | 'COMPLETED';

export type RequestCategory = 'Leave' | 'Equipment' | 'Training' | 'Expense' | 'Remote Work';

export interface ApprovalTimelineStep {
  stage: 'Submitted' | 'Manager Review' | 'HR Review' | 'Final Completion';
  status: 'COMPLETED' | 'PENDING' | 'REJECTED' | 'SKIPPED';
  actionBy?: string;
  actionDate?: string;
  comment?: string;
}

export interface ApprovalRequest {
  id: string;
  employeeId: number;
  employeeName: string;
  department: string;
  category: RequestCategory;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  amount?: number;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  timeline: ApprovalTimelineStep[];
  rejectionReason?: string;
}

export interface RequestState {
  requests: ApprovalRequest[];
  userRequests: ApprovalRequest[];
  pendingApprovals: ApprovalRequest[];
  selectedRequest: ApprovalRequest | null;
  isLoading: boolean;
  error: string | null;
}
