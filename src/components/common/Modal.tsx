import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl',
    '2xl': 'modal-xl',
  };

  return (
    <div className="modal fade show d-block z-50 bg-slate-900/40 backdrop-blur-xs" tabIndex={-1} role="dialog">
      <div className={`modal-dialog modal-dialog-centered ${maxWidths[maxWidth]}`}>
        <div className="modal-content bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="modal-header border-bottom border-slate-100 bg-slate-50/80 px-5 py-4">
            <div>
              <h5 className="modal-title font-bold text-slate-900 text-base m-0">{title}</h5>
              {subtitle && <p className="text-xs text-slate-500 m-0 mt-0.5">{subtitle}</p>}
            </div>
            <button
              type="button"
              className="btn-close opacity-50 hover:opacity-100 cursor-pointer"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          {/* Content */}
          <div className="modal-body p-5">{children}</div>
        </div>
      </div>
    </div>
  );
};
