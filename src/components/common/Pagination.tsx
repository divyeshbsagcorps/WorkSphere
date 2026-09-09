import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  if (totalItems === 0 || totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 py-3 px-4 border-top border-slate-200 bg-slate-50/50 rounded-bottom-3 text-xs text-slate-500">
      <div>
        Showing <span className="fw-semibold text-slate-900">{startItem}</span> to{' '}
        <span className="fw-semibold text-slate-900">{endItem}</span> of{' '}
        <span className="fw-semibold text-slate-900">{totalItems}</span> results
      </div>

      <nav aria-label="Table pagination">
        <ul className="pagination pagination-sm m-0 gap-1">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-link bg-white border-slate-200 text-slate-600 rounded-2 p-1.5 cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </li>

          {getPageNumbers().map((p) => (
            <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
              <button
                onClick={() => onPageChange(p)}
                className={`page-link border-slate-200 rounded-2 text-xs font-semibold cursor-pointer ${
                  p === currentPage
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-link bg-white border-slate-200 text-slate-600 rounded-2 p-1.5 cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
