import React, { useState } from 'react';
import { AppView, DoctorProfile, Patient, UserRole } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface UnifiedHeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  userRole: UserRole;
  doctorProfile?: DoctorProfile;
  activePatient?: Patient | null;
  activeClinic?: string;
  onUpdateActiveClinic?: (clinic: string) => void;
  onLogout: () => void;
  onAddPatient?: () => void;
  onScheduleVisit?: () => void;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  currentView,
  onNavigate,
  userRole,
  doctorProfile,
  activePatient,
  activeClinic,
  onUpdateActiveClinic,
  onLogout,
  onAddPatient,
  onScheduleVisit
}) => {
  const { lang, theme, toggleLanguage, toggleTheme, t, isRTL } = useAppThemeLanguage();
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showClinicMenu, setShowClinicMenu] = useState(false);

  const clinicLogo = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB44Wc_reKFt02f-BdI9PRYxzBZCIcejQgo_rqs2o6qCGn65HRrXMB4R_BKX4QdLZR6fEp-bT50cwNHoLB0DIqcMKLj9zhQedP7O6j4MT51zvoe9HwmIqk_1ZCMA_TkhVytVxKG65N1Jjfh0ZJVUeqE4XwBgRzWqNRizyzxRXvscMP45M0WpZuWynL2hz7O_ahrc85Ck4uXddLah2rxNjJIYqQBM_z0JVawCzNPmxbFhJjnEnmtW-oAAA';
  const defaultDoctorAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxTdB6BFCRDU6qr8N5YlyqcvvBqAlixK076_tUMWhheQjfjcVCtO0UBEY8sL1jYC9cucKVnoLoEgJlDKaSn0Qb5FJkx7v8MdhtOBjzCb8dHppP7IhiJllCOCEHHLwVXSrsa5mcVTHwz5OLt5nCjCSdaOMEjmqz6mQGAz0pZXk-7oBvgitx-9e-JaGvGW1CTaWYwwuVfl_PBgRvo3t6bQ1DMA1TZCepbWvSxDJrfFFqBCZE6ilABoY5eg';

  const isDoctor = userRole === 'doctor';
  const doctorName = doctorProfile?.name || 'Dr. Ahmed Al-Sayed';
  const doctorAvatar = doctorProfile?.avatar || defaultDoctorAvatar;
  const doctorSpecialty = doctorProfile?.specialty || (isRTL ? 'استشاري التركيبات والزراعة' : 'Prosthodontist & Implant Specialist');
  const doctorClinic = doctorProfile?.assignedClinic
    ? (isRTL ? doctorProfile.assignedClinic.replace(/Clinic\s*(\d+)/i, 'العيادة $1') : doctorProfile.assignedClinic)
    : (isRTL ? 'خارج العيادة' : 'Off-duty');

  const patientName = activePatient?.name || 'Mohamed Ali';
  const patientAvatar = activePatient?.avatar;
  const patientInitials = activePatient?.initials || 'PT';

  const doctorNavItems = [
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
    }
  ];

  const patientNavItems = [
    {
      id: 'patient-dashboard' as AppView,
      label: t('dashboard'),
      icon: 'dashboard'
    },
    {
      id: 'patient-chart' as AppView,
      label: t('dental_chart'),
      icon: 'dentistry'
    },
    {
      id: 'patient-visits' as AppView,
      label: t('my_appointments'),
      icon: 'calendar_today'
    },
    {
      id: 'patient-profile' as AppView,
      label: t('health_profile'),
      icon: 'person'
    }
  ];

  const navItems = isDoctor ? doctorNavItems : patientNavItems;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-[#e2e8f0] dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* 1. Brand Logo */}
          <div
            onClick={() => onNavigate(isDoctor ? 'doctor-dashboard' : 'patient-dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <img
              src={clinicLogo}
              alt="DentalCare"
              className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  DentalCare
                </span>
                <span className="text-[10px] font-semibold text-[#006194] dark:text-[#00a3e0] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  {isDoctor ? (isRTL ? "منظومة الطبيب" : "Clinical Portal") : (isRTL ? "بوابة المريض" : "Patient Portal")}
                </span>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* 2. Action Buttons & Quick Utilities */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors cursor-pointer"
              title="Switch Language / تغيير اللغة"
              id="header-lang-toggle"
            >
              <span className="material-symbols-outlined text-[16px] text-[#006194] dark:text-[#00a3e0]">language</span>
              <span className="hidden sm:inline">{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title={theme === 'dark' ? t('light_mode') : t('dark_mode')}
              id="header-theme-toggle"
            >
              <span className="material-symbols-outlined text-[18px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationToast(!showNotificationToast)}
                className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors cursor-pointer relative"
                title={t('notifications')}
              >
                <span className="material-symbols-outlined text-[18px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotificationToast && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-in fade-in text-start`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                    <span className="font-headline font-bold text-xs text-slate-800 dark:text-white">{t('notifications')}</span>
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-950 text-[#006194] dark:text-blue-300 font-semibold px-2 py-0.5 rounded-full">
                      {isRTL ? "مباشر" : "Live"}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {isDoctor ? (isRTL ? "تحديث جدول العيادة" : "Clinic Queue Updated") : (isRTL ? "تم تأكيد موعدك" : "Appointment Confirmed")}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                        {isDoctor 
                          ? (isRTL ? "جاهزية ملفات الكشف للمرضى في قائمة الانتظار." : "Patient records ready for active consultations.")
                          : (isRTL ? "موعد المتابعة القادم مسجل في النظام." : "Follow-up visit confirmed in clinical calendar.")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile & User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer transition-colors"
                id="header-user-menu-btn"
              >
                {isDoctor ? (
                  <img
                    src={doctorAvatar}
                    alt={doctorName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                ) : patientAvatar ? (
                  <img
                    src={patientAvatar}
                    alt={patientName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-[#006194] dark:text-[#00a3e0] text-xs font-bold flex items-center justify-center">
                    {patientInitials}
                  </div>
                )}
                <span className="hidden lg:inline text-xs font-bold text-slate-800 dark:text-white max-w-[120px] truncate">
                  {isDoctor ? doctorName : patientName}
                </span>
                <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
              </button>

              {showUserMenu && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in text-start`}>
                  <div className="p-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                    <p className="font-bold text-xs text-slate-800 dark:text-white">{isDoctor ? doctorName : patientName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isDoctor ? `${doctorSpecialty} • ${doctorClinic}` : (isRTL ? "مريض مسجل" : "Registered Patient")}
                    </p>
                  </div>

                  {isDoctor && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('doctor-settings');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                      <span>{t('settings')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
