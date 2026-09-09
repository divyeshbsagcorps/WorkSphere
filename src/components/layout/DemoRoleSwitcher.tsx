import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';
import { ShieldCheck, UserCheck, Briefcase } from 'lucide-react';

export const DemoRoleSwitcher: React.FC = () => {
  const { role, switchRole } = useAuth();

  const roles: { key: Role; label: string; icon: React.ReactNode }[] = [
    {
      key: 'EMPLOYEE',
      label: 'Employee View',
      icon: <UserCheck className="w-3.5 h-3.5" />,
    },
    {
      key: 'MANAGER',
      label: 'Manager View',
      icon: <Briefcase className="w-3.5 h-3.5" />,
    },
    {
      key: 'HR_ADMIN',
      label: 'HR Admin View',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="w-full bg-slate-900 text-slate-200 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between text-xs z-50">
      <div className="flex items-center space-x-2">
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Sandbox Recruiter Mode
        </span>
        <span className="text-slate-400 font-medium hidden md:inline">
          Switch roles to test RBAC & authorization rules
        </span>
      </div>

      <div className="flex items-center space-x-1 mt-1 sm:mt-0">
        {roles.map((r) => {
          const isActive = role === r.key;
          return (
            <button
              key={r.key}
              onClick={() => switchRole(r.key)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              {r.icon}
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
