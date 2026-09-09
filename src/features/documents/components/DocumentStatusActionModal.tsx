import React from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { EmployeeDocument } from '@/types';

interface DocumentStatusActionModalProps {
  document: EmployeeDocument | null;
  actionType: 'VERIFIED' | 'REJECTED' | 'REUPLOAD_REQUESTED' | null;
  note: string;
  onNoteChange: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const DocumentStatusActionModal: React.FC<DocumentStatusActionModalProps> = ({
  document,
  actionType,
  note,
  onNoteChange,
  onClose,
  onConfirm,
}) => {
  if (!document || !actionType) return null;

  return (
    <Modal
      isOpen={!!document}
      onClose={onClose}
      title={`Document Status Action: ${actionType}`}
      subtitle={`Target: ${document.name} (${document.employeeName})`}
    >
      <div className="space-y-4">
        <Input
          label="Reason or Re-upload Note"
          placeholder="e.g. Image scan is blurry. Please upload a clear original PDF."
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
        />
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            Submit Status
          </Button>
        </div>
      </div>
    </Modal>
  );
};
