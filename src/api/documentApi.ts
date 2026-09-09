import { apiCall } from './client';
import { EmployeeDocument, DocumentStatus } from '@/types';
import { INITIAL_DOCUMENTS } from '@/utils/mockData';

let documentsDb: EmployeeDocument[] = [...INITIAL_DOCUMENTS];

export const documentApi = {
  getDocuments: async (): Promise<EmployeeDocument[]> => {
    return apiCall(() => [...documentsDb], 300);
  },

  uploadDocument: async (
    data: Omit<EmployeeDocument, 'id' | 'uploadedAt' | 'status'>
  ): Promise<EmployeeDocument> => {
    return apiCall(() => {
      const newDoc: EmployeeDocument = {
        ...data,
        id: `DOC-${Math.floor(500 + Math.random() * 500)}`,
        uploadedAt: new Date().toISOString(),
        status: 'PENDING',
      };
      documentsDb = [newDoc, ...documentsDb];
      return newDoc;
    }, 600);
  },

  updateDocumentStatus: async (
    id: string,
    status: DocumentStatus,
    rejectionReason?: string
  ): Promise<EmployeeDocument> => {
    return apiCall(() => {
      const index = documentsDb.findIndex((d) => d.id === id);
      if (index === -1) throw new Error(`Document ${id} not found.`);
      const updated = {
        ...documentsDb[index],
        status,
        rejectionReason: status === 'REJECTED' || status === 'REUPLOAD_REQUESTED' ? rejectionReason : undefined,
      };
      documentsDb[index] = updated;
      return updated;
    }, 350);
  },

  deleteDocument: async (id: string): Promise<{ id: string }> => {
    return apiCall(() => {
      documentsDb = documentsDb.filter((d) => d.id !== id);
      return { id };
    }, 300);
  },
};
