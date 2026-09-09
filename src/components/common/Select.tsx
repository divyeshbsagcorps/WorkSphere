import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (string | Option)[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-100">
      {label && (
        <label htmlFor={selectId} className="form-label text-slate-700 font-semibold text-xs mb-1.5 d-block">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`form-select bg-white text-slate-900 border-slate-300 rounded-3 text-sm py-2 px-3.5 ${
          error ? 'is-invalid border-rose-500' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt, idx) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={idx} value={value} className="bg-white text-slate-900">
              {optLabel}
            </option>
          );
        })}
      </select>
      {error && <div className="invalid-feedback d-block text-rose-600 font-medium text-xs mt-1">{error}</div>}
    </div>
  );
};
