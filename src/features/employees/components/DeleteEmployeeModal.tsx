import React from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Employee } from '@/types';

interface DeleteEmployeeModalProps {
  employee: Employee | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteEmployeeModal: React.FC<DeleteEmployeeModalProps> = ({
  employee,
  onClose,
  onConfirm,
}) => {
  if (!employee) return null;

  return (
    <Modal
      isOpen={!!employee}
      onClose={onClose}
      title="Delete Employee Record"
      subtitle="This action cannot be undone"
      maxWidth="sm"
    >
      <div className="space-y-4 text-xs text-slate-600">
        <p className="m-0">
          Are you sure you want to permanently delete{' '}
          <strong className="text-slate-900">{employee.name}</strong> ({employee.email})?
        </p>
        <div className="flex justify-end space-x-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
