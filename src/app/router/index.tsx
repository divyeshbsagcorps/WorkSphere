import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from '@/features/auth/pages/Login';
import { ForgotPassword } from '@/features/auth/pages/ForgotPassword';

// Lazy loaded feature pages for code splitting & performance optimization
const Dashboard = lazy(() =>
  import('@/features/dashboard/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const EmployeeList = lazy(() =>
  import('@/features/employees/pages/EmployeeList').then((m) => ({ default: m.EmployeeList }))
);
const EmployeeDetail = lazy(() =>
  import('@/features/employees/pages/EmployeeDetail').then((m) => ({ default: m.EmployeeDetail }))
);
const RequestList = lazy(() =>
  import('@/features/requests/pages/RequestList').then((m) => ({ default: m.RequestList }))
);
const ApprovalInbox = lazy(() =>
  import('@/features/approvals/pages/ApprovalInbox').then((m) => ({ default: m.ApprovalInbox }))
);
const DocumentManagement = lazy(() =>
  import('@/features/documents/pages/DocumentManagement').then((m) => ({
    default: m.DocumentManagement,
  }))
);
const SurveyEngine = lazy(() =>
  import('@/features/surveys/pages/SurveyEngine').then((m) => ({ default: m.SurveyEngine }))
);
const AnalyticsDashboard = lazy(() =>
  import('@/features/analytics/pages/AnalyticsDashboard').then((m) => ({
    default: m.AnalyticsDashboard,
  }))
);
const AiSummaryLab = lazy(() =>
  import('@/features/ai/pages/AiSummaryLab').then((m) => ({ default: m.AiSummaryLab }))
);

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] text-xs text-slate-400">
    <div className="animate-pulse flex items-center space-x-2">
      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
      <span>Loading enterprise module...</span>
    </div>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Application Workflows */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/requests" element={<RequestList />} />
            <Route path="/documents" element={<DocumentManagement />} />
            <Route path="/surveys" element={<SurveyEngine />} />
            <Route path="/ai-insights" element={<AiSummaryLab />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
          </Route>

          {/* Manager & HR Protected Workflows */}
          <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'HR_ADMIN']} />}>
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/approvals" element={<ApprovalInbox />} />
          </Route>

          {/* HR Admin Specific Workflows */}
          <Route element={<ProtectedRoute allowedRoles={['HR_ADMIN']} />}>
            <Route path="/analytics" element={<AnalyticsDashboard />} />
          </Route>

          {/* Fallback Redirection */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
