import React from 'react';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ApprovalRequest } from '@/types';

interface RequestDetailModalProps {
  request: ApprovalRequest | null;
  onClose: () => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <Modal
      isOpen={!!request}
      onClose={onClose}
      title={`Approval Workflow State: ${request.id}`}
      subtitle={`${request.category} • Submitted by ${request.employeeName}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 m-0">{request.title}</h4>
            <Badge variant={request.status.toLowerCase() as any}>{request.status}</Badge>
          </div>
          <p className="text-xs text-slate-600 mt-2 m-0">{request.description}</p>
          {request.rejectionReason && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              <strong>Rejection Note:</strong> {request.rejectionReason}
            </div>
          )}
        </div>

        {/* Visual State Machine Timeline */}
        <div>
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 m-0">
            Workflow Execution State
          </h5>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {request.timeline.map((step, idx) => (
              <div key={idx} className="relative flex items-start space-x-3">
                <div
                  className={`absolute -left-6 top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                    step.status === 'COMPLETED'
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : step.status === 'REJECTED'
                      ? 'bg-rose-600 border-rose-500 text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {step.status === 'COMPLETED' ? '✓' : step.status === 'REJECTED' ? '✕' : idx + 1}
                </div>

                <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{step.stage}</span>
                    <span className="text-[10px] text-slate-400">{step.actionDate || 'Pending'}</span>
                  </div>
                  {step.actionBy && (
                    <p className="text-[11px] text-slate-500 mt-0.5 m-0">Actor: {step.actionBy}</p>
                  )}
                  {step.comment && (
                    <p className="text-[11px] text-indigo-700 mt-1 italic m-0">"{step.comment}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
