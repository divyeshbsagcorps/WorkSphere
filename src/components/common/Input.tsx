import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-100">
      {label && (
        <label htmlFor={inputId} className="form-label text-slate-700 font-semibold text-xs mb-1.5 d-block">
          {label}
        </label>
      )}
      <div className="position-relative">
        {icon && (
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-slate-400 pointer-events-none d-flex align-items-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`form-control bg-white text-slate-900 border-slate-300 rounded-3 text-sm py-2 ${
            icon ? 'ps-5' : 'px-3.5'
          } ${error ? 'is-invalid border-rose-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <div className="invalid-feedback d-block text-rose-600 font-medium text-xs mt-1">{error}</div>
      ) : helperText ? (
        <div className="form-text text-slate-500 text-xs mt-1">{helperText}</div>
      ) : null}
    </div>
  );
};
