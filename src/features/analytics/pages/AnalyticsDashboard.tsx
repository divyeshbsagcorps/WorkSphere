import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const deptData = [
    { name: 'Engineering', count: 42, color: '#4f46e5' },
    { name: 'HR', count: 12, color: '#ec4899' },
    { name: 'Finance', count: 18, color: '#f59e0b' },
    { name: 'Design', count: 15, color: '#8b5cf6' },
    { name: 'Product', count: 20, color: '#10b981' },
    { name: 'Marketing', count: 14, color: '#3b82f6' },
  ];

  const requestStatusData = [
    { name: 'Completed', count: 124, fill: '#10b981' },
    { name: 'Pending Review', count: 28, fill: '#f59e0b' },
    { name: 'Manager Approved', count: 16, fill: '#4f46e5' },
    { name: 'Rejected', count: 12, fill: '#f43f5e' },
  ];

  const hiringTrendData = [
    { month: 'Jan', Hires: 8, Departures: 2 },
    { month: 'Feb', Hires: 12, Departures: 1 },
    { month: 'Mar', Hires: 15, Departures: 3 },
    { month: 'Apr', Hires: 10, Departures: 2 },
    { month: 'May', Hires: 18, Departures: 4 },
    { month: 'Jun', Hires: 22, Departures: 2 },
    { month: 'Jul', Hires: 25, Departures: 3 },
    { month: 'Aug', Hires: 19, Departures: 1 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">HR Analytics & Intelligence</h2>
        <p className="text-xs text-slate-500 mt-1 m-0">
          Workforce headcount metrics, department distributions, request velocity, and hiring growth charts
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="saas-card p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider m-0">Total Workforce</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1 m-0">524</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +14.2% YoY Growth
          </span>
        </div>

        <div className="saas-card p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider m-0">Active Duty</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1 m-0">491</p>
          <span className="text-[10px] text-slate-500 mt-1 block">93.7% operational capacity</span>
        </div>

        <div className="saas-card p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider m-0">On Leave</p>
          <p className="text-3xl font-extrabold text-amber-600 mt-1 m-0">18</p>
          <span className="text-[10px] text-slate-500 mt-1 block">3.4% of total headcount</span>
        </div>

        <div className="saas-card p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider m-0">Retention Rate</p>
          <p className="text-3xl font-extrabold text-indigo-600 mt-1 m-0">96.8%</p>
          <span className="text-[10px] text-indigo-600 font-semibold mt-1 block">Industry leading benchmark</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Pie Chart */}
        <div className="saas-card p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 m-0">Employees by Department</h3>
            <p className="text-xs text-slate-500 mt-0.5 m-0">Headcount distribution across company units</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#475569' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests Bar Chart */}
        <div className="saas-card p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 m-0">Requests by Workflow Status</h3>
            <p className="text-xs text-slate-500 mt-0.5 m-0">Distribution of leave, equipment, and training requests</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {requestStatusData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hiring Growth Area Chart */}
      <div className="saas-card p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 m-0">Monthly Talent Growth & Churn</h3>
          <p className="text-xs text-slate-500 mt-0.5 m-0">Comparison of new employee hires vs attrition</p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hiringTrendData}>
              <defs>
                <linearGradient id="hiresGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="departGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#475569' }} />
              <Area type="monotone" dataKey="Hires" stroke="#4f46e5" fillOpacity={1} fill="url(#hiresGrad)" />
              <Area type="monotone" dataKey="Departures" stroke="#f43f5e" fillOpacity={1} fill="url(#departGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
