import React from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ApprovalRequest } from '@/types';
import { MessageSquare } from 'lucide-react';

interface ApprovalDecisionModalProps {
  request: ApprovalRequest | null;
  actionType: 'APPROVE' | 'REJECT' | null;
  comment: string;
  onCommentChange: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const ApprovalDecisionModal: React.FC<ApprovalDecisionModalProps> = ({
  request,
  actionType,
  comment,
  onCommentChange,
  onClose,
  onConfirm,
}) => {
  if (!request || !actionType) return null;

  return (
    <Modal
      isOpen={!!request}
      onClose={onClose}
      title={`${actionType === 'APPROVE' ? 'Approve' : 'Reject'} Request ${request.id}`}
      subtitle={`Applicant: ${request.employeeName} (${request.department})`}
    >
      <div className="space-y-4">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
          <p className="font-bold text-slate-900 mb-1 m-0">{request.title}</p>
          <p className="m-0">{request.description}</p>
        </div>

        <Input
          label={actionType === 'APPROVE' ? 'Approval Comments (Optional)' : 'Rejection Reason (Required)'}
          placeholder={actionType === 'APPROVE' ? 'e.g. Approved. Leave coverage verified.' : 'e.g. Budget limit exceeded.'}
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          icon={<MessageSquare className="w-4 h-4" />}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={actionType === 'APPROVE' ? 'success' : 'danger'}
            size="sm"
            onClick={onConfirm}
          >
            Confirm {actionType === 'APPROVE' ? 'Approval' : 'Rejection'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
