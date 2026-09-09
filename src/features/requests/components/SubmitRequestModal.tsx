import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { createRequestAction } from '@/features/requests/requestSlice';
import { useAuth } from '@/hooks/useAuth';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { RequestCategory } from '@/types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface SubmitRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitRequestModal: React.FC<SubmitRequestModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      category: 'Leave' as RequestCategory,
      title: '',
      description: '',
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date(Date.now() + 86400000 * 3).toISOString().substring(0, 10),
      amount: 0,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: (values) => {
      dispatch(
        createRequestAction({
          employeeId: user?.id || 101,
          employeeName: user?.name || 'Alex Rivera',
          department: user?.department || 'Engineering',
          category: values.category,
          title: values.title,
          description: values.description,
          startDate: values.startDate,
          endDate: values.endDate,
          amount: values.amount > 0 ? Number(values.amount) : undefined,
        })
      );
      formik.resetForm();
      onClose();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Operations Request"
      subtitle="Initiates Manager -> HR Approval Workflow"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <Select
          label="Request Category"
          name="category"
          value={formik.values.category}
          options={['Leave', 'Equipment', 'Training', 'Expense', 'Remote Work']}
          onChange={formik.handleChange}
        />

        <Input
          label="Request Title"
          name="title"
          placeholder="e.g. Annual Vacation Leave"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Description & Justification
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            placeholder="Provide details for manager review..."
            value={formik.values.description}
            onChange={formik.handleChange}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-xs text-rose-600 mt-1 font-medium m-0">
              {formik.errors.description}
            </p>
          )}
        </div>

        {formik.values.category === 'Leave' || formik.values.category === 'Remote Work' ? (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formik.values.startDate}
              onChange={formik.handleChange}
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formik.values.endDate}
              onChange={formik.handleChange}
            />
          </div>
        ) : (
          <Input
            label="Estimated Amount ($)"
            name="amount"
            type="number"
            value={formik.values.amount}
            onChange={formik.handleChange}
          />
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
