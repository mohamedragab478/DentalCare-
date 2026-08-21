import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onNewConsultation?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate
}) => {
  const clinicLogo = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB44Wc_reKFt02f-BdI9PRYxzBZCIcejQgo_rqs2o6qCGn65HRrXMB4R_BKX4QdLZR6fEp-bT50cwNHoLB0DIqcMKLj9zhQedP7O6j4MT51zvoe9HwmIqk_1ZCMA_TkhVytVxKG65N1Jjfh0ZJVUeqE4XwBgRzWqNRizyzxRXvscMP45M0WpZuWynL2hz7O_ahrc85Ck4uXddLah2rxNjJIYqQBM_z0JVawCzNPmxbFhJjnEnmtW-oAAA';

  const navItems = [
    {
      id: 'doctor-dashboard' as AppView,
      label: 'Dashboard',
      icon: 'dashboard'
    },
    {
      id: 'doctor-patients' as AppView,
      label: 'Patients',
      icon: 'groups',
      activeOn: ['doctor-patients', 'doctor-patient-profile'] as AppView[]
    },
    {
      id: 'doctor-visits' as AppView,
      label: 'Visits',
      icon: 'calendar_today'
    },
    {
      id: 'doctor-clinics' as AppView,
      label: 'Clinic Status',
      icon: 'clinical_notes'
    },
    {
      id: 'doctor-settings' as AppView,
      label: 'Settings',
      icon: 'settings'
    }
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex-col py-5 bg-[#f8fafc] border-r border-[#e2e8f0] z-40">
      {/* Branding inside sidebar */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-3">
          <img
            src={clinicLogo}
            alt="Clinic logo"
            className="w-10 h-10 rounded-lg shadow-xs object-cover"
          />
          <div>
            <h2 className="font-headline font-bold text-base text-[#006194]">DentalCare Pro</h2>
            <p className="text-xs text-slate-500 font-medium">Clinical Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex flex-col gap-1.5 px-3 flex-1">
        {navItems.map((item) => {
          const isActive = item.activeOn 
            ? item.activeOn.includes(currentView) 
            : currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all text-left font-medium cursor-pointer ${
                isActive
                  ? 'bg-[#dae2fd] text-[#006194] font-semibold'
                  : 'text-[#3f465c] hover:bg-slate-200/60 hover:text-[#181c20]'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="px-5 pt-4 border-t border-[#e2e8f0] text-[11px] text-slate-400">
        DentalCare Management Suite &copy; 2026
      </div>
    </aside>
  );
};
