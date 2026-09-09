import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Badge } from '@/components/common/Badge';
import {
  LayoutDashboard,
  Users,
  FileText,
  GitPullRequest,
  ClipboardList,
  CheckCircle2,
  BarChart3,
  Bot,
  LogOut,
  Building2,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { can } = usePermissions();

  const navSections = [
    {
      title: 'CORE WORKFLOWS',
      items: [
        {
          to: '/dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
          show: true,
        },
        {
          to: '/employees',
          label: 'Employees',
          icon: <Users className="w-4 h-4" />,
          show: can('MANAGE_EMPLOYEES') || can('VIEW_TEAM'),
        },
        {
          to: '/requests',
          label: 'My Requests',
          icon: <GitPullRequest className="w-4 h-4" />,
          show: true,
        },
        {
          to: '/approvals',
          label: 'Approval Inbox',
          icon: <CheckCircle2 className="w-4 h-4" />,
          show: can('APPROVE_REQUEST'),
        },
        {
          to: '/documents',
          label: 'Documents',
          icon: <FileText className="w-4 h-4" />,
          show: true,
        },
        {
          to: '/surveys',
          label: 'Surveys',
          icon: <ClipboardList className="w-4 h-4" />,
          show: true,
        },
      ],
    },
    {
      title: 'ANALYTICS & AI',
      items: [
        {
          to: '/analytics',
          label: 'HR Analytics',
          icon: <BarChart3 className="w-4 h-4" />,
          show: can('VIEW_ANALYTICS'),
        },
        {
          to: '/ai-insights',
          label: 'AI Summary Lab',
          icon: <Bot className="w-4 h-4" />,
          show: true,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 shadow-xs">
      <div>
        {/* Crisp Header Logo */}
        <div className="flex items-center space-x-3 px-5 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-sm text-white shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight truncate m-0">WorkSphere</h1>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider m-0">
              Enterprise Platform
            </p>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navSections.map((section, idx) => {
            const visibleItems = section.items.filter((i) => i.show);
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 mb-1">
                  {section.title}
                </p>
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/80 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`
                    }
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate m-0">{user?.name}</p>
              <Badge variant="role" size="sm">
                {user?.role}
              </Badge>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
