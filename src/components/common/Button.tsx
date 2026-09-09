import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const bsBtnSize = size === 'sm' ? 'px-3 py-1 text-xs' : size === 'lg' ? 'px-5 py-2.5 text-base' : 'px-4 py-1.5 text-sm';

  const variantStyles = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600 shadow-sm',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 shadow-sm',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 shadow-sm',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-0',
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${bsBtnSize} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 me-2 animate-spin shrink-0" />
      ) : icon ? (
        <span className="me-2 shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
