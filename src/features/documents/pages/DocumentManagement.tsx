import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import {
  fetchDocumentsRequest,
  uploadDocumentRequest,
  updateDocumentStatusRequest,
  deleteDocumentRequest,
} from '@/features/documents/documentSlice';
import { useAuth } from '@/hooks/useAuth';
import { useFileUpload } from '@/hooks/useFileUpload';
import { usePermissions } from '@/hooks/usePermissions';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { EmployeeDocument, DocumentCategory, DocumentStatus } from '@/types';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  XCircle,
  Download,
  Trash2,
  RefreshCw,
  FileCheck,
} from 'lucide-react';

import { DocumentStatusActionModal } from '../components/DocumentStatusActionModal';

export const DocumentManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { can } = usePermissions();

  const [category, setCategory] = useState<DocumentCategory>('Passport');
  const [selectedDoc, setSelectedDoc] = useState<EmployeeDocument | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [actionType, setActionType] = useState<DocumentStatus | null>(null);

  const { documents, isLoading } = useSelector((state: RootState) => state.documents);
  const { file, error: fileError, validateAndSetFile, clearFile } = useFileUpload({
    maxSizeMB: 10,
    allowedTypes: ['pdf', 'png', 'jpg', 'jpeg'],
  });

  useEffect(() => {
    dispatch(fetchDocumentsRequest());
  }, [dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    dispatch(
      uploadDocumentRequest({
        employeeId: user?.id || 101,
        employeeName: user?.name || 'Alex Rivera',
        name: file.name,
        category,
        sizeBytes: file.size,
      })
    );

    clearFile();
  };

  const handleStatusUpdate = (doc: EmployeeDocument, status: DocumentStatus) => {
    if (status === 'REJECTED' || status === 'REUPLOAD_REQUESTED') {
      setSelectedDoc(doc);
      setActionType(status);
      setRejectionNote('');
    } else {
      dispatch(updateDocumentStatusRequest({ id: doc.id, status }));
    }
  };

  const handleConfirmStatusChange = () => {
    if (!selectedDoc || !actionType) return;
    dispatch(
      updateDocumentStatusRequest({
        id: selectedDoc.id,
        status: actionType,
        rejectionReason: rejectionNote,
      })
    );
    setSelectedDoc(null);
    setActionType(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">Document Management</h2>
        <p className="text-xs text-slate-500 mt-1 m-0">
          Upload passports, certificates, and ID credentials. HR verification & status workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Card */}
        <div className="lg:col-span-1">
          <div className="saas-card p-6 space-y-4 sticky top-24">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 m-0">
              <UploadCloud className="w-5 h-5 text-indigo-600" /> Upload New Document
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <Select
                label="Document Category"
                value={category}
                options={['Passport', 'Resume', 'ID Proof', 'Certificates', 'Offer Letter', 'Other Documents']}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              />

              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-6 text-center transition-colors bg-slate-50 cursor-pointer relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileCheck className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800 m-0">
                  {file ? file.name : 'Click or Drag File to Upload'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 m-0">PDF, PNG, JPG up to 10MB</p>
              </div>

              {fileError && <p className="text-xs text-rose-600 font-medium m-0">{fileError}</p>}

              <Button type="submit" variant="primary" className="w-full" disabled={!file} isLoading={isLoading}>
                Submit for Verification
              </Button>
            </form>
          </div>
        </div>

        {/* Document List Repository */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 m-0">Uploaded Documents Repository</h3>
            <span className="text-xs text-slate-500">{documents.length} files total</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {documents.length === 0 ? (
              <div className="p-8 text-center border border-slate-200 rounded-xl bg-white text-xs text-slate-400">
                No uploaded documents in repository.
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="saas-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 border border-indigo-100">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                        <Badge
                          variant={
                            doc.status === 'APPROVED'
                              ? 'approved'
                              : doc.status === 'PENDING'
                              ? 'pending'
                              : 'rejected'
                          }
                        >
                          {doc.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 m-0">
                        Category: {doc.category} • Size: {(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB • Uploaded by{' '}
                        {doc.employeeName} on {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                      {doc.rejectionReason && (
                        <p className="text-[11px] text-rose-700 mt-1.5 font-medium bg-rose-50 p-2 rounded-lg border border-rose-200 m-0">
                          <strong>HR Note:</strong> {doc.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => alert(`Simulated Download for ${doc.name}`)}
                      className="btn btn-sm btn-link text-slate-400 hover:text-slate-800 p-1.5"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {can('MANAGE_DOCUMENTS') && doc.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(doc, 'APPROVED')}
                          className="btn btn-sm btn-link text-emerald-600 hover:text-emerald-700 p-1.5"
                          title="Approve Document"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(doc, 'REUPLOAD_REQUESTED')}
                          className="btn btn-sm btn-link text-amber-600 hover:text-amber-700 p-1.5"
                          title="Request Re-upload"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(doc, 'REJECTED')}
                          className="btn btn-sm btn-link text-rose-600 hover:text-rose-700 p-1.5"
                          title="Reject Document"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => dispatch(deleteDocumentRequest(doc.id))}
                      className="btn btn-sm btn-link text-slate-400 hover:text-rose-600 p-1.5"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* HR Action Modal Component */}
      <DocumentStatusActionModal
        document={selectedDoc}
        actionType={actionType}
        note={rejectionNote}
        onNoteChange={setRejectionNote}
        onClose={() => setSelectedDoc(null)}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
};
