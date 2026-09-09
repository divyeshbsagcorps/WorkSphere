import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchRequestsRequest, updateRequestStatusAction } from '@/features/requests/requestSlice';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { ApprovalRequest } from '@/types';
import { CheckCircle2, XCircle, MessageSquare } from 'lucide-react';

export const ApprovalInbox: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, role } = useAuth();
  const [activeReq, setActiveReq] = useState<ApprovalRequest | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [comment, setComment] = useState('');

  const { requests } = useSelector((state: RootState) => state.requests);

  useEffect(() => {
    dispatch(fetchRequestsRequest());
  }, [dispatch]);

  const pendingApprovals = requests.filter((r) => {
    if (role === 'MANAGER') return r.status === 'PENDING';
    if (role === 'HR_ADMIN') return r.status === 'MANAGER_APPROVED' || r.status === 'PENDING';
    return false;
  });

  const handleActionClick = (req: ApprovalRequest, type: 'APPROVE' | 'REJECT') => {
    setActiveReq(req);
    setActionType(type);
    setComment('');
  };

  const handleConfirmAction = () => {
    if (!activeReq) return;

    dispatch(
      updateRequestStatusAction({
        id: activeReq.id,
        action: actionType,
        actorRole: (role as 'MANAGER' | 'HR_ADMIN') || 'MANAGER',
        actorName: user?.name || 'Approver',
        comment,
      })
    );

    setActiveReq(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">Approval Inbox</h2>
          <Badge variant="role">{role}</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1 m-0">
          Review employee leave, equipment, and expense requests. Execute state machine transitions.
        </p>
      </div>

      {/* Pending Approval List Cards */}
      {pendingApprovals.length === 0 ? (
        <div className="p-12 text-center border border-slate-200 rounded-xl bg-white">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3 opacity-80" />
          <h3 className="text-base font-bold text-slate-900 m-0">Inbox Clean!</h3>
          <p className="text-xs text-slate-500 mt-1 m-0">There are no pending requests requiring your review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingApprovals.map((req) => (
            <div
              key={req.id}
              className="saas-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-indigo-600">{req.id}</span>
                  <Badge variant={req.status.toLowerCase() as any}>{req.status}</Badge>
                  <span className="text-xs text-slate-400">• {new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 m-0">{req.title}</h3>
                <p className="text-xs text-slate-600 max-w-2xl m-0">{req.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>
                    Applicant: <strong className="text-slate-900">{req.employeeName}</strong>
                  </span>
                  <span>
                    Department: <strong className="text-slate-900">{req.department}</strong>
                  </span>
                  <span>
                    Category: <strong className="text-slate-900">{req.category}</strong>
                  </span>
                  {req.amount && (
                    <span>
                      Amount: <strong className="text-emerald-700">${req.amount}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <Button
                  variant="danger"
                  size="sm"
                  icon={<XCircle className="w-4 h-4" />}
                  onClick={() => handleActionClick(req, 'REJECT')}
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={() => handleActionClick(req, 'APPROVE')}
                >
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal with Comment */}
      {activeReq && (
        <Modal
          isOpen={!!activeReq}
          onClose={() => setActiveReq(null)}
          title={`${actionType === 'APPROVE' ? 'Approve' : 'Reject'} Request ${activeReq.id}`}
          subtitle={`Applicant: ${activeReq.employeeName} (${activeReq.department})`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
              <p className="font-bold text-slate-900 mb-1 m-0">{activeReq.title}</p>
              <p className="m-0">{activeReq.description}</p>
            </div>

            <Input
              label={actionType === 'APPROVE' ? 'Approval Comments (Optional)' : 'Rejection Reason (Required)'}
              placeholder={actionType === 'APPROVE' ? 'e.g. Approved. Leave coverage verified.' : 'e.g. Budget limit exceeded.'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              icon={<MessageSquare className="w-4 h-4" />}
            />

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setActiveReq(null)}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'APPROVE' ? 'success' : 'danger'}
                size="sm"
                onClick={handleConfirmAction}
              >
                Confirm {actionType === 'APPROVE' ? 'Approval' : 'Rejection'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
