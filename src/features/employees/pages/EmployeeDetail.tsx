import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchEmployeeByIdRequest } from '@/features/employees/employeeSlice';
import { fetchRequestsRequest } from '@/features/requests/requestSlice';
import { fetchDocumentsRequest } from '@/features/documents/documentSlice';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Tabs } from '@/components/common/Tabs';
import { Table, Column } from '@/components/common/Table';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  FileText,
  GitPullRequest,
  Clock,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { ApprovalRequest, EmployeeDocument } from '@/types';

export const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id) || 101;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'requests' | 'leave'>('profile');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { selectedEmployee, isLoading } = useSelector((state: RootState) => state.employees);
  const { requests } = useSelector((state: RootState) => state.requests);
  const { documents } = useSelector((state: RootState) => state.documents);

  useEffect(() => {
    dispatch(fetchEmployeeByIdRequest(numericId));
    dispatch(fetchRequestsRequest());
    dispatch(fetchDocumentsRequest());
  }, [dispatch, numericId]);

  const empRequests = requests.filter((r) => r.employeeId === numericId);
  const empDocuments = documents.filter((d) => d.employeeId === numericId);

  const handleGenerateAiSummary = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      if (selectedEmployee) {
        setAiSummary(
          `${selectedEmployee.name} is a high-performing ${selectedEmployee.title} in ${selectedEmployee.department} with ${selectedEmployee.experienceYears} years of experience. Key technical competencies include ${selectedEmployee.skills.join(', ')}. Currently maintaining an active employment status with high engagement across company projects.`
        );
      }
      setIsAiLoading(false);
    }, 800);
  };

  if (isLoading || !selectedEmployee) {
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse">
        Loading employee profile data...
      </div>
    );
  }

  const docColumns: Column<EmployeeDocument>[] = [
    { header: 'Document Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Uploaded Date',
      cell: (doc) => new Date(doc.uploadedAt).toLocaleDateString(),
    },
    {
      header: 'Status',
      cell: (doc) => (
        <Badge variant={doc.status === 'APPROVED' ? 'approved' : doc.status === 'PENDING' ? 'pending' : 'rejected'}>
          {doc.status}
        </Badge>
      ),
    },
  ];

  const reqColumns: Column<ApprovalRequest>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Title', accessor: 'title' },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Status',
      cell: (req) => <Badge variant={req.status.toLowerCase() as any}>{req.status}</Badge>,
    },
    { header: 'Date', cell: (req) => new Date(req.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => navigate('/employees')}
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 space-x-1.5 transition-colors border-0 bg-transparent cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Employee List</span>
      </button>

      {/* Top Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center space-x-5">
          <img
            src={selectedEmployee.avatar}
            alt={selectedEmployee.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/20 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold text-slate-900 m-0">{selectedEmployee.name}</h1>
              <Badge variant={selectedEmployee.status === 'Active' ? 'active' : 'leave'}>
                {selectedEmployee.status}
              </Badge>
            </div>
            <p className="text-sm font-semibold text-slate-600 mt-1 m-0">{selectedEmployee.title}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-600" /> {selectedEmployee.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {selectedEmployee.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Joined {selectedEmployee.startDate}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Sparkles className="w-4 h-4 text-amber-500" />}
          isLoading={isAiLoading}
          onClick={handleGenerateAiSummary}
        >
          Generate AI Summary
        </Button>
      </div>

      {/* AI Summary Banner */}
      {aiSummary && (
        <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-5 text-xs text-indigo-950 animate-fadeIn">
          <div className="flex items-center space-x-2 text-indigo-700 font-bold mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Executive Profile Summary</span>
          </div>
          <p className="leading-relaxed m-0">{aiSummary}</p>
        </div>
      )}

      {/* Navigation Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
        tabs={[
          { id: 'profile', label: 'Personal & Contact Info', icon: <User className="w-4 h-4" /> },
          { id: 'documents', label: 'Documents', count: empDocuments.length, icon: <FileText className="w-4 h-4" /> },
          { id: 'requests', label: 'Requests', count: empRequests.length, icon: <GitPullRequest className="w-4 h-4" /> },
          { id: 'leave', label: 'Leave History', icon: <Clock className="w-4 h-4" /> },
        ]}
      />

      {/* Tab Contents */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider m-0">
              Contact Information
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" /> Work Email
                </span>
                <span className="text-slate-900 font-semibold">{selectedEmployee.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-600" /> Phone
                </span>
                <span className="text-slate-900 font-semibold">{selectedEmployee.phone}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" /> Location
                </span>
                <span className="text-slate-900 font-semibold">{selectedEmployee.location}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider m-0">
              Employment Details & Skills
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">System Role</span>
                <Badge variant="role">{selectedEmployee.role}</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Reporting Manager</span>
                <span className="text-slate-900 font-semibold">{selectedEmployee.managerName || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Experience</span>
                <span className="text-slate-900 font-semibold">{selectedEmployee.experienceYears} Years</span>
              </div>
              <div className="py-2">
                <span className="text-slate-500 block mb-2 font-medium">Technical Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEmployee.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <Table columns={docColumns} data={empDocuments} keyExtractor={(d) => d.id} emptyMessage="No uploaded documents for this employee." />
      )}

      {activeTab === 'requests' && (
        <Table columns={reqColumns} data={empRequests} keyExtractor={(r) => r.id} emptyMessage="No requests submitted by this employee." />
      )}

      {activeTab === 'leave' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 m-0">Leave Balance Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <p className="text-xs text-slate-500 m-0">Annual Paid Leave</p>
              <p className="text-xl font-bold text-emerald-700 mt-1 m-0">14 Days Left</p>
              <span className="text-[10px] text-slate-400">Out of 20 days total</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <p className="text-xs text-slate-500 m-0">Sick Leave Balance</p>
              <p className="text-xl font-bold text-indigo-700 mt-1 m-0">7 Days Left</p>
              <span className="text-[10px] text-slate-400">Out of 10 days total</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <p className="text-xs text-slate-500 m-0">Casual Leave</p>
              <p className="text-xl font-bold text-amber-700 mt-1 m-0">3 Days Left</p>
              <span className="text-[10px] text-slate-400">Out of 5 days total</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
