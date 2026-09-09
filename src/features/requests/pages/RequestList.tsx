import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchRequestsRequest } from '@/features/requests/requestSlice';
import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';
import { Table, Column } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ApprovalRequest } from '@/types';
import { Plus } from 'lucide-react';
import { SubmitRequestModal } from '../components/SubmitRequestModal';
import { RequestDetailModal } from '../components/RequestDetailModal';

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

      {/* Submit Request Modal Component */}
      <SubmitRequestModal isOpen={newModal.isOpen} onClose={newModal.closeModal} />

      {/* Request Detail / Timeline Modal Component */}
      <RequestDetailModal request={selectedReq} onClose={() => setSelectedReq(null)} />
    </div>
  );
};

