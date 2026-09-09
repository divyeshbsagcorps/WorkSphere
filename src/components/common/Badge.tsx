import React from 'react';

export type BadgeVariant =
  | 'active'
  | 'leave'
  | 'inactive'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'draft'
  | 'info'
  | 'role';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', size = 'sm' }) => {
  const styles: Record<BadgeVariant, string> = {
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    leave: 'bg-amber-50 text-amber-700 border border-amber-200',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    inactive: 'bg-slate-100 text-slate-600 border border-slate-200',
    draft: 'bg-slate-100 text-slate-600 border border-slate-200',
    rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    role: 'bg-slate-100 text-slate-800 border border-slate-200 font-semibold',
  };

  const padStyle = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md ${styles[variant]} ${padStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current me-1.5 opacity-75 shrink-0" />
      {children}
    </span>
  );
};
