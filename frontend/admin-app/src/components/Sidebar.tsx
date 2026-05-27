import React from 'react';

interface SidebarProps {
  activeTab: 'dashboard' | 'visits' | 'patients';
  onTabChange: (tab: 'dashboard' | 'visits' | 'patients') => void;
  onLogout: () => void;
  userRole: { name: string; title: string };
}

export default function Sidebar({ activeTab, onTabChange, onLogout, userRole }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-primary shadow-lg flex flex-col py-6 z-50">
      {/* Brand Header */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[28px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_hospital
            </span>
          </div>
          <div>
            <h1 className="font-sans text-xl font-bold text-white tracking-wide leading-none">SIMRSUD</h1>
            <p className="text-[10px] text-white/70 uppercase tracking-widest mt-1">Hospital Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1 px-2">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`w-full flex items-center gap-4 rounded-xl p-3 text-left transition-all duration-200 cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-primary-container text-white shadow-md'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'dashboard' ? "'FILL' 1" : "'FILL' 0" }}>
            dashboard
          </span>
          <span className="text-sm font-medium">Dashboard</span>
        </button>

        <button
          onClick={() => onTabChange('visits')}
          className={`w-full flex items-center gap-4 rounded-xl p-3 text-left transition-all duration-200 cursor-pointer ${
            activeTab === 'visits'
              ? 'bg-primary-container text-white shadow-md'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'visits' ? "'FILL' 1" : "'FILL' 0" }}>
            calendar_today
          </span>
          <span className="text-sm font-medium">Kunjungan Harian</span>
        </button>

        <button
          onClick={() => onTabChange('patients')}
          className={`w-full flex items-center gap-4 rounded-xl p-3 text-left transition-all duration-200 cursor-pointer ${
            activeTab === 'patients'
              ? 'bg-primary-container text-white shadow-md'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'patients' ? "'FILL' 1" : "'FILL' 0" }}>
            groups
          </span>
          <span className="text-sm font-medium">Data Pasien</span>
        </button>
      </nav>

      {/* Logout Footer Section */}
      <div className="mt-auto px-4 pt-4 border-t border-white/10">
        <div className="mb-4 px-2 hidden lg:block">
          <p className="text-xs text-white/50">Masuk sebagai:</p>
          <p className="text-sm font-semibold text-white/90 truncate">{userRole.name}</p>
          <p className="text-[11px] text-white/60">{userRole.title}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 text-white/80 hover:bg-error/30 hover:text-white rounded-xl p-3 transition-colors duration-200 cursor-pointer text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-medium">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
