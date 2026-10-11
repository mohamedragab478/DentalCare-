import React, { useState } from 'react';
import { AppView, DoctorProfile, Patient, UserRole } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';
import { Avatar } from './ui/Primitives';

interface UnifiedHeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  userRole: UserRole;
  doctorProfile?: DoctorProfile;
  activePatient?: Patient | null;
  activeClinic?: string;
  onUpdateActiveClinic?: (clinic: string) => void;
  onLogout: () => void;
  onOpenSearch?: () => void;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  currentView,
  onNavigate,
  userRole,
  doctorProfile,
  activePatient,
  onLogout,
  onOpenSearch,
}) => {
  const { lang, theme, toggleLanguage, toggleTheme, t, isRTL } = useAppThemeLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isDoctor = userRole === 'doctor';
  const doctorName = doctorProfile?.name || 'Dr. Ahmed Al-Sayed';
  const doctorSpecialty = doctorProfile?.specialty || (isRTL ? 'استشاري التركيبات' : 'Prosthodontist');

  const patientName = activePatient?.name || 'Mohamed Ali';

  const doctorNavItems = [
    { id: 'doctor-dashboard' as AppView, label: isRTL ? 'الطابور' : 'Queue', icon: 'dashboard', activeOn: ['doctor-dashboard'] as AppView[] },
    { id: 'doctor-patients' as AppView, label: isRTL ? 'المرضى' : 'Patients', icon: 'groups', activeOn: ['doctor-patients', 'doctor-patient-profile'] as AppView[] },
    { id: 'doctor-visits' as AppView, label: isRTL ? 'المواعيد' : 'Visits', icon: 'calendar_today', activeOn: ['doctor-visits'] as AppView[] },
    { id: 'doctor-clinics' as AppView, label: isRTL ? 'العيادات' : 'Clinics', icon: 'meeting_room', activeOn: ['doctor-clinics'] as AppView[] },
    { id: 'doctor-settings' as AppView, label: isRTL ? 'الإعدادات' : 'Settings', icon: 'settings', activeOn: ['doctor-settings'] as AppView[] },
  ];

  const patientNavItems = [
    { id: 'patient-dashboard' as AppView, label: isRTL ? 'الرئيسية' : 'Home', icon: 'home', activeOn: ['patient-dashboard'] as AppView[] },
    { id: 'patient-chart' as AppView, label: isRTL ? 'الأسنان' : 'Teeth', icon: 'dentistry', activeOn: ['patient-chart'] as AppView[] },
    { id: 'patient-visits' as AppView, label: isRTL ? 'زياراتي' : 'Visits', icon: 'calendar_today', activeOn: ['patient-visits'] as AppView[] },
    { id: 'patient-profile' as AppView, label: isRTL ? 'الملف' : 'Profile', icon: 'person', activeOn: ['patient-profile'] as AppView[] },
  ];

  const activeMobileNavItems = isDoctor ? doctorNavItems : patientNavItems;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-full flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Identity */}
          <div
            onClick={() => onNavigate(isDoctor ? 'doctor-dashboard' : 'patient-dashboard')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[#006194] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <span className="material-symbols-outlined text-[20px]">dentistry</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">
                DentalCare
              </span>
              <span className="text-[10px] font-semibold text-[#006194] dark:text-[#00a3e0] bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/60 hidden xs:inline-block sm:inline-block">
                {isDoctor ? (isRTL ? 'عيادتي' : 'Pro') : (isRTL ? 'المريض' : 'Portal')}
              </span>
            </div>
          </div>

          {/* Patient Top Desktop Navigation */}
          {!isDoctor && (
            <nav className="hidden md:flex items-center gap-1">
              {patientNavItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/80 text-[#006194] dark:text-[#00a3e0]'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Utilities */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Global Search Button for Doctor */}
            {isDoctor && onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px]"
                title={isRTL ? 'بحث في المرضى (Cmd+K)' : 'Search patients (Cmd+K)'}
                aria-label={isRTL ? 'بحث' : 'Search'}
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span className="hidden sm:inline">{isRTL ? 'بحث' : 'Search'}</span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] min-w-[36px]"
              title={lang === 'ar' ? 'English' : 'عربي'}
              aria-label={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title={theme === 'dark' ? t('light_mode') : t('dark_mode')}
              aria-label="Toggle Theme"
            >
              <span className="material-symbols-outlined text-[18px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative min-h-[36px] min-w-[36px] flex items-center justify-center"
                title={t('notifications')}
                aria-label={t('notifications')}
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 ltr:right-1.5 rtl:left-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
              </button>

              {showNotifications && (
                <div
                  className={`absolute ${
                    isRTL ? 'left-0' : 'right-0'
                  } mt-2 w-72 max-w-[calc(100vw-24px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-4 z-50 animate-fade-slide`}
                >
                  <h6 className="text-xs font-semibold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                    {t('notifications')}
                  </h6>
                  <div className="py-3 text-xs text-slate-600 dark:text-slate-400">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {isDoctor
                        ? isRTL
                          ? 'تحديث العيادة: المرضى في انتظار الكشف'
                          : 'Clinic update: Patients waiting in queue'
                        : isRTL
                        ? 'تأكيد الموعد: تذكير بزيارتك القادمة'
                        : 'Appointment confirmed: Reminder for your visit'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {isRTL ? 'منذ 10 دقائق' : '10 minutes ago'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 sm:gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[36px]"
                aria-label="User Menu"
              >
                <Avatar
                  name={isDoctor ? doctorName : patientName}
                  src={isDoctor ? doctorProfile?.avatar : activePatient?.avatar}
                  size="sm"
                />
                <span className="material-symbols-outlined text-slate-400 text-[18px]">expand_more</span>
              </button>

              {showUserMenu && (
                <div
                  className={`absolute ${
                    isRTL ? 'left-0' : 'right-0'
                  } mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 z-50 animate-fade-slide`}
                >
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {isDoctor ? doctorName : patientName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {isDoctor ? doctorSpecialty : isRTL ? 'مريض مسجل' : 'Registered Patient'}
                    </p>
                  </div>

                  {isDoctor && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('doctor-settings');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-start"
                    >
                      <span className="material-symbols-outlined text-[18px]">settings</span>
                      <span>{t('settings')}</span>
                    </button>
                  )}

                  {!isDoctor && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('patient-profile');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-start"
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      <span>{isRTL ? 'الملف الشخصي' : 'My profile'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors text-start"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar for Doctors & Patients with Safe Area insets */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 h-16 pb-safe flex items-center justify-around px-1 shadow-lg">
        {activeMobileNavItems.map((item) => {
          const isActive = item.activeOn ? item.activeOn.includes(currentView) : currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all cursor-pointer flex-1 relative active:scale-95 ${
                isActive
                  ? 'text-[#006194] dark:text-[#00a3e0]'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-7 rounded-lg transition-colors ${
                isActive ? 'bg-blue-50 dark:bg-blue-950/80' : 'bg-transparent'
              }`}>
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill-1' : ''}`}>
                  {item.icon}
                </span>
              </div>
              <span className={`text-[10px] tracking-tight leading-tight mt-0.5 truncate max-w-[62px] ${
                isActive ? 'font-bold' : 'font-medium'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
