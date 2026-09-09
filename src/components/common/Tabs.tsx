import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <ul className="nav nav-pills gap-2 border-bottom border-slate-800 pb-3">
      {tabs.map((t) => {
        const isActive = t.id === activeTab;
        return (
          <li key={t.id} className="nav-item">
            <button
              onClick={() => onChange(t.id)}
              className={`nav-link text-sm font-medium d-flex align-items-center gap-2 rounded-3 px-3 py-2 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t.icon && <span className="shrink-0">{t.icon}</span>}
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span
                  className={`badge rounded-pill ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
