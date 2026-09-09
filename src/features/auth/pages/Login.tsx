import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';
import { Building2, UserCheck, Briefcase, ShieldCheck, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: Role) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-8 z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-600 rounded-2xl shadow-sm mb-3 text-white">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight m-0">WorkSphere</h2>
          <p className="text-xs text-slate-500 mt-1 m-0">Enterprise Employee Operations Platform</p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center m-0 mb-2">
            Select a Demo Account Role
          </p>

          <button
            onClick={() => handleRoleSelect('EMPLOYEE')}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-500 transition-all group cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 border border-blue-100">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 m-0">Alex Rivera</p>
                <p className="text-xs text-slate-500 m-0">Employee • Frontend Engineer</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => handleRoleSelect('MANAGER')}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-500 transition-all group cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2.5 bg-violet-50 text-violet-600 rounded-lg group-hover:bg-violet-100 border border-violet-100">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 m-0">Sarah Connor</p>
                <p className="text-xs text-slate-500 m-0">Manager • Engineering Director</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => handleRoleSelect('HR_ADMIN')}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-500 transition-all group cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 m-0">Michael Vance</p>
                <p className="text-xs text-slate-500 m-0">HR Admin • Chief HR Officer</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <div className="mt-8 text-center border-t border-slate-100 pt-4 flex justify-between text-xs text-slate-500">
          <Link to="/forgot-password" className="hover:text-indigo-600 transition-colors">
            Forgot Password?
          </Link>
          <span className="text-slate-400">v1.0.0 Enterprise</span>
        </div>
      </div>
    </div>
  );
};
