export type DocumentCategory =
  | 'Passport'
  | 'Resume'
  | 'ID Proof'
  | 'Certificates'
  | 'Offer Letter'
  | 'Other Documents';

export type DocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REUPLOAD_REQUESTED';

export interface EmployeeDocument {
  id: string;
  employeeId: number;
  employeeName: string;
  name: string;
  category: DocumentCategory;
  fileUrl?: string;
  sizeBytes: number;
  uploadedAt: string;
  status: DocumentStatus;
  rejectionReason?: string;
}

export interface DocumentState {
  documents: EmployeeDocument[];
  userDocuments: EmployeeDocument[];
  pendingDocuments: EmployeeDocument[];
  isLoading: boolean;
  error: string | null;
}
