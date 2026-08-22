import React from 'react';
import { AppView } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onNewConsultation?: () => void;
  onAddPatient?: () => void;
  onScheduleVisit?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onAddPatient,
  onScheduleVisit
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  const clinicLogo = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB44Wc_reKFt02f-BdI9PRYxzBZCIcejQgo_rqs2o6qCGn65HRrXMB4R_BKX4QdLZR6fEp-bT50cwNHoLB0DIqcMKLj9zhQedP7O6j4MT51zvoe9HwmIqk_1ZCMA_TkhVytVxKG65N1Jjfh0ZJVUeqE4XwBgRzWqNRizyzxRXvscMP45M0WpZuWynL2hz7O_ahrc85Ck4uXddLah2rxNjJIYqQBM_z0JVawCzNPmxbFhJjnEnmtW-oAAA';

  const navItems = [
    {
      id: 'doctor-dashboard' as AppView,
      label: t('dashboard'),
      icon: 'dashboard'
    },
    {
      id: 'doctor-patients' as AppView,
      label: t('patients'),
      icon: 'groups',
      activeOn: ['doctor-patients', 'doctor-patient-profile'] as AppView[]
    },
    {
      id: 'doctor-visits' as AppView,
      label: t('visits_and_schedule'),
      icon: 'calendar_today'
    },
    {
      id: 'doctor-clinics' as AppView,
      label: t('clinic_status'),
      icon: 'clinical_notes'
    },
    {
      id: 'doctor-settings' as AppView,
      label: t('settings'),
      icon: 'settings'
    }
  ];

  return (
    <aside className={`hidden md:flex fixed ${isRTL ? 'right-0 border-l' : 'left-0 border-r'} top-16 h-[calc(100vh-64px)] w-64 flex-col py-5 bg-[#f8fafc] dark:bg-slate-900 border-[#e2e8f0] dark:border-slate-800 z-40 transition-colors`}>
      {/* Branding inside sidebar */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-3">
          <img
            src={clinicLogo}
            alt="Clinic logo"
            className="w-10 h-10 rounded-xl shadow-xs object-cover border border-slate-200 dark:border-slate-700"
          />
          <div>
            <h2 className="font-headline font-bold text-base text-[#006194] dark:text-[#00a3e0]">
              {t('app_title')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Clinical Workspace</p>
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-start font-medium cursor-pointer ${
                isActive
                  ? 'bg-[#dae2fd] dark:bg-blue-950 text-[#006194] dark:text-blue-300 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
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

      {/* Quick Action Buttons */}
      <div className="px-3 mb-2 space-y-2">
        {onScheduleVisit && (
          <button
            onClick={onScheduleVisit}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
            <span>{t('schedule_next_visit')}</span>
          </button>
        )}

        {onAddPatient && (
          <button
            onClick={onAddPatient}
            className="w-full bg-[#006194] hover:bg-[#004b73] text-white py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>{t('new_patient')}</span>
          </button>
        )}
      </div>
    </aside>
  );
};
