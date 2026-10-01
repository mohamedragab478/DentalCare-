import React from 'react';
import { AppView, DoctorProfile } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';
import { Avatar } from './ui/Primitives';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  doctorProfile?: DoctorProfile;
  onOpenSearch?: () => void;
  onAddPatient?: () => void;
  onScheduleVisit?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  doctorProfile,
  onOpenSearch,
  onAddPatient,
  onScheduleVisit,
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  const clinicLogo = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB44Wc_reKFt02f-BdI9PRYxzBZCIcejQgo_rqs2o6qCGn65HRrXMB4R_BKX4QdLZR6fEp-bT50cwNHoLB0DIqcMKLj9zhQedP7O6j4MT51zvoe9HwmIqk_1ZCMA_TkhVytVxKG65N1Jjfh0ZJVUeqE4XwBgRzWqNRizyzxRXvscMP45M0WpZuWynL2hz7O_ahrc85Ck4uXddLah2rxNjJIYqQBM_z0JVawCzNPmxbFhJjnEnmtW-oAAA';

  const navItems = [
    {
      id: 'doctor-dashboard' as AppView,
      label: t('dashboard'),
      icon: 'dashboard',
    },
    {
      id: 'doctor-patients' as AppView,
      label: t('patients'),
      icon: 'groups',
      activeOn: ['doctor-patients', 'doctor-patient-profile'] as AppView[],
    },
    {
      id: 'doctor-visits' as AppView,
      label: t('visits_and_schedule'),
      icon: 'calendar_today',
    },
    {
      id: 'doctor-clinics' as AppView,
      label: t('clinic_status'),
      icon: 'clinical_notes',
    },
    {
      id: 'doctor-settings' as AppView,
      label: t('settings'),
      icon: 'settings',
    },
  ];

  const doctorName = doctorProfile?.name || 'Dr. Ahmed Al-Sayed';
  const doctorSpecialty = doctorProfile?.specialty || (isRTL ? 'استشاري التركيبات' : 'Prosthodontist');

  return (
    <aside
      className={`hidden md:flex fixed ${
        isRTL ? 'right-0 border-l' : 'left-0 border-r'
      } top-16 h-[calc(100vh-64px)] w-20 lg:w-64 flex-col py-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 z-40 transition-all`}
    >
      {/* Search trigger button */}
      {onOpenSearch && (
        <div className="px-3 mb-4 hidden lg:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/60 hover:border-[#0F4C5C] hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span>{isRTL ? 'بحث في المرضى...' : 'Search patients...'}</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Navigation items */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {navItems.map((item) => {
          const isActive = item.activeOn ? item.activeOn.includes(currentView) : currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={item.label}
              className={`flex items-center gap-3 px-3 lg:px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-start cursor-pointer justify-center lg:justify-start ${
                isActive
                  ? 'bg-[#E8F4F1] dark:bg-[#0F2930] text-[#0F4C5C] dark:text-[#9FE3D4] font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              <span className="hidden lg:inline text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Doctor Identity Card at Bottom */}
      <div className="px-3 pt-3 mt-auto border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 justify-center lg:justify-start">
          <Avatar name={doctorName} src={doctorProfile?.avatar} size="sm" status="online" />
          <div className="hidden lg:block overflow-hidden min-w-0">
            <h6 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{doctorName}</h6>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{doctorSpecialty}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
