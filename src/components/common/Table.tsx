import React from 'react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-100 overflow-hidden border border-slate-200 rounded-xl bg-white p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 w-100 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-100 text-center py-12 px-4 border border-slate-200 rounded-xl bg-white">
        <p className="text-slate-500 text-sm font-medium m-0">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-responsive border border-slate-200 rounded-xl bg-white shadow-xs">
      <table className="table table-hover align-middle mb-0 text-slate-800 text-sm">
        <thead className="bg-slate-50 text-uppercase text-[11px] font-bold text-slate-500 border-bottom border-slate-200">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`py-3 px-4 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick && onRowClick(row)}
              className={`${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col, idx) => (
                <td key={idx} className={`py-3.5 px-4 ${col.className || ''}`}>
                  {col.cell
                    ? col.cell(row)
                    : typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : col.accessor
                    ? (row[col.accessor] as React.ReactNode)
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
