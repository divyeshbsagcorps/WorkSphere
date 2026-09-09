import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { useAuth } from '@/hooks/useAuth';
import { fetchEmployeesRequest } from '@/features/employees/employeeSlice';
import { fetchRequestsRequest, updateRequestStatusAction } from '@/features/requests/requestSlice';
import { fetchDocumentsRequest } from '@/features/documents/documentSlice';
import { fetchSurveysRequest } from '@/features/surveys/surveySlice';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GitPullRequest,
  FileCheck,
  ClipboardList,
  CheckCircle2,
  Clock,
  Sparkles,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Zap,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, role } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { employees, total: totalEmployees } = useSelector((state: RootState) => state.employees);
  const { requests } = useSelector((state: RootState) => state.requests);
  const { documents } = useSelector((state: RootState) => state.documents);
  const { surveys } = useSelector((state: RootState) => state.surveys);

  useEffect(() => {
    dispatch(fetchEmployeesRequest({ page: 1, limit: 10 }));
    dispatch(fetchRequestsRequest());
    dispatch(fetchDocumentsRequest());
    dispatch(fetchSurveysRequest());
  }, [dispatch]);

  const pendingApprovals = requests.filter((r) => {
    if (role === 'MANAGER') return r.status === 'PENDING';
    if (role === 'HR_ADMIN') return r.status === 'MANAGER_APPROVED' || r.status === 'PENDING';
    return false;
  });

  const myRequests = requests.filter((r) => r.employeeId === user?.id);
  const pendingDocs = documents.filter((d) => d.status === 'PENDING' || d.status === 'REUPLOAD_REQUESTED');

  const handleQuickApprove = (id: string) => {
    dispatch(
      updateRequestStatusAction({
        id,
        action: 'APPROVE',
        actorRole: role as 'MANAGER' | 'HR_ADMIN',
        actorName: user?.name || 'Approver',
        comment: 'Quick approved from Dashboard',
      })
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Light Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Operations Center
            </span>
            <Badge variant="role">{role}</Badge>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight m-0">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1 m-0">
            {role === 'EMPLOYEE' && 'Overview of your requests, document verification statuses, and assigned surveys.'}
            {role === 'MANAGER' && 'Overview of your team size, pending approval requests, and open department tasks.'}
            {role === 'HR_ADMIN' && 'Overview of total workforce, pending approval queues, and organization compliance.'}
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {role === 'HR_ADMIN' && (
            <Button
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => navigate('/employees')}
            >
              Manage Employees
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            icon={<Sparkles className="w-4 h-4 text-amber-500" />}
            onClick={() => navigate('/ai-insights')}
          >
            AI Insights Lab
          </Button>
        </div>
      </div>

      {/* Light Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {role === 'EMPLOYEE' && (
          <>
            <div className="saas-card saas-card-hover p-5">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">My Active Requests</span>
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <GitPullRequest className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 m-0">{myRequests.length}</p>
              <span className="text-[10px] text-slate-500 mt-1 block">Live workflow state</span>
            </div>

            <div className="saas-card saas-card-hover p-5">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Pending Documents</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 m-0">
                {documents.filter((d) => d.employeeId === user?.id && d.status === 'PENDING').length}
              </p>
              <span className="text-[10px] text-slate-500 mt-1 block">Awaiting HR Approval</span>
            </div>

            <div className="saas-card saas-card-hover p-5">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Surveys</span>
                <div className="p-2 rounded-lg bg-violet-50 text-violet-600 border border-violet-100">
                  <ClipboardList className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 m-0">{surveys.length}</p>
              <span className="text-[10px] text-slate-500 mt-1 block">Q3 Culture Feedback</span>
            </div>

            <div className="saas-card saas-card-hover p-5">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Leave Balance</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 m-0">14 Days</p>
              <span className="text-[10px] text-slate-500 mt-1 block">Accrued through Q3</span>
            </div>
          </>
        )}

        {(role === 'MANAGER' || role === 'HR_ADMIN') && (
          <>
            <div className="saas-card saas-card-hover p-5">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Workforce</span>
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 m-0">{totalEmployees || employees.length}</p>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +14.2% YoY Growth
              </span>
            </div>

            <div className="saas-card saas-card-hover p-5">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Pending Approvals</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 m-0">{pendingApprovals.length}</p>
              <span className="text-[10px] text-amber-700 font-medium mt-1 block">Action required</span>
            </div>

            <div className="saas-card saas-card-hover p-5">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Document Queue</span>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 m-0">{pendingDocs.length}</p>
              <span className="text-[10px] text-slate-500 mt-1 block">Verification pending</span>
            </div>

            <div className="saas-card saas-card-hover p-5">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Survey Response Rate</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <ClipboardList className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 m-0">87.4%</p>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">High engagement</span>
            </div>
          </>
        )}
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requests Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="saas-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 m-0">
                  {role === 'EMPLOYEE' ? 'My Submitted Requests' : 'Pending Approval Queue'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 m-0">
                  {role === 'EMPLOYEE'
                    ? 'Track leave and reimbursement request status'
                    : 'Workflows waiting for your authorization'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate(role === 'EMPLOYEE' ? '/requests' : '/approvals')}>
                View All <ArrowRight className="w-3.5 h-3.5 ms-1" />
              </Button>
            </div>

            <div className="space-y-2.5">
              {(role === 'EMPLOYEE' ? myRequests : pendingApprovals).length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6 m-0">No pending requests right now.</p>
              ) : (
                (role === 'EMPLOYEE' ? myRequests : pendingApprovals).slice(0, 4).map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-indigo-600">{req.id}</span>
                        <Badge variant={req.status.toLowerCase() as any}>{req.status}</Badge>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 mt-1 m-0">{req.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 m-0">
                        {req.employeeName} • {req.department} • {req.category}
                      </p>
                    </div>

                    {role !== 'EMPLOYEE' && (
                      <div className="flex items-center space-x-2 shrink-0">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleQuickApprove(req.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Operations Sidebar Card */}
        <div className="space-y-4">
          <div className="saas-card p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 m-0 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/requests')}
                className="w-full text-left p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="text-xs font-medium text-slate-800 group-hover:text-indigo-600 m-0">Submit New Request</p>
                  <p className="text-[11px] text-slate-500 m-0">Leave, equipment, or training</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button
                onClick={() => navigate('/surveys')}
                className="w-full text-left p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="text-xs font-medium text-slate-800 group-hover:text-indigo-600 m-0">Quarterly Survey</p>
                  <p className="text-[11px] text-slate-500 m-0">Fill dynamic multi-step Formik survey</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button
                onClick={() => navigate('/documents')}
                className="w-full text-left p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="text-xs font-medium text-slate-800 group-hover:text-indigo-600 m-0">Upload Documents</p>
                  <p className="text-[11px] text-slate-500 m-0">Passport, certificates, ID proofs</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
