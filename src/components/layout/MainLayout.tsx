import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white overflow-hidden">


      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar (Full Height, Fixed Left) */}
        <Sidebar />

        {/* Main Content Area (Independent Scroll Container) */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
          <Topbar />
          <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};
