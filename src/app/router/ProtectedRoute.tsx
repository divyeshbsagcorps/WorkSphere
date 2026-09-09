import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-2xl my-8 shadow-xs">
          <ShieldAlert className="w-12 h-12 text-rose-600 mb-3" />
          <h3 className="text-xl font-bold text-slate-900 m-0">403 Access Denied</h3>
          <p className="text-xs text-slate-600 max-w-md mt-1 mb-6">
            Your current role (<strong className="text-slate-900">{role}</strong>) does not have authorization to view this protected enterprise page. Use the recruiter role switcher header to switch roles.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
