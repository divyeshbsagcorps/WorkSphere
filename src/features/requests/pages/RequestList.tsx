import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchRequestsRequest, createRequestAction } from '@/features/requests/requestSlice';
import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';
import { Table, Column } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { ApprovalRequest, RequestCategory } from '@/types';
import { Plus } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const RequestList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const newModal = useModal();
  const [selectedReq, setSelectedReq] = useState<ApprovalRequest | null>(null);

  const { requests, isLoading } = useSelector((state: RootState) => state.requests);

  useEffect(() => {
    dispatch(fetchRequestsRequest());
  }, [dispatch]);

  const myRequests = requests.filter((r) => r.employeeId === user?.id || user?.role === 'HR_ADMIN');

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
      newModal.closeModal();
    },
  });

  const columns: Column<ApprovalRequest>[] = [
    { header: 'ID', accessor: 'id', cell: (r) => <span className="font-bold text-indigo-600">{r.id}</span> },
    { header: 'Title', accessor: 'title' },
    { header: 'Category', accessor: 'category' },
    { header: 'Employee', accessor: 'employeeName' },
    {
      header: 'Workflow State',
      cell: (r) => <Badge variant={r.status.toLowerCase() as any}>{r.status}</Badge>,
    },
    {
      header: 'Submitted On',
      cell: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">Request Operations</h2>
          <p className="text-xs text-slate-500 mt-1 m-0">
            Submit leave, hardware, and expense requests into the multi-stage approval state machine
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={newModal.openModal}>
          Submit New Request
        </Button>
      </div>

      {/* Requests Table */}
      <div className="saas-card overflow-hidden">
        <Table
          columns={columns}
          data={myRequests}
          keyExtractor={(r) => r.id}
          isLoading={isLoading}
          emptyMessage="No requests submitted yet."
          onRowClick={(req) => setSelectedReq(req)}
        />
      </div>

      {/* Submit Request Modal */}
      <Modal isOpen={newModal.isOpen} onClose={newModal.closeModal} title="Submit Operations Request" subtitle="Initiates Manager -> HR Approval Workflow">
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description & Justification</label>
            <textarea
              name="description"
              rows={3}
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              placeholder="Provide details for manager review..."
              value={formik.values.description}
              onChange={formik.handleChange}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-xs text-rose-600 mt-1 font-medium m-0">{formik.errors.description}</p>
            )}
          </div>

          {formik.values.category === 'Leave' || formik.values.category === 'Remote Work' ? (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" name="startDate" type="date" value={formik.values.startDate} onChange={formik.handleChange} />
              <Input label="End Date" name="endDate" type="date" value={formik.values.endDate} onChange={formik.handleChange} />
            </div>
          ) : (
            <Input label="Estimated Amount ($)" name="amount" type="number" value={formik.values.amount} onChange={formik.handleChange} />
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={newModal.closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* State Machine Timeline Modal */}
      {selectedReq && (
        <Modal
          isOpen={!!selectedReq}
          onClose={() => setSelectedReq(null)}
          title={`Approval Workflow State: ${selectedReq.id}`}
          subtitle={`${selectedReq.category} • Submitted by ${selectedReq.employeeName}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 m-0">{selectedReq.title}</h4>
                <Badge variant={selectedReq.status.toLowerCase() as any}>{selectedReq.status}</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-2 m-0">{selectedReq.description}</p>
              {selectedReq.rejectionReason && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                  <strong>Rejection Note:</strong> {selectedReq.rejectionReason}
                </div>
              )}
            </div>

            {/* Visual State Machine Timeline */}
            <div>
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 m-0">Workflow Execution State</h5>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedReq.timeline.map((step, idx) => (
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
                      {step.actionBy && <p className="text-[11px] text-slate-500 mt-0.5 m-0">Actor: {step.actionBy}</p>}
                      {step.comment && <p className="text-[11px] text-indigo-700 mt-1 italic m-0">"{step.comment}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedReq(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
