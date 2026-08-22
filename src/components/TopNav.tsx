import React, { useState } from 'react';
import { AppView, Patient, DoctorProfile } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface TopNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  activePatient?: Patient;
  onSelectPatient?: (patient: Patient) => void;
  doctorProfile?: DoctorProfile;
  userRole: 'doctor' | 'patient';
  onLogout: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onNavigate,
  userRole,
  doctorProfile,
  activePatient,
  onLogout
}) => {
  const { theme, toggleTheme, lang, toggleLanguage, t, isRTL } = useAppThemeLanguage();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const isDoctor = userRole === 'doctor';

  const defaultDoctorAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxTdB6BFCRDU6qr8N5YlyqcvvBqAlixK076_tUMWhheQjfjcVCtO0UBEY8sL1jYC9cucKVnoLoEgJlDKaSn0Qb5FJkx7v8MdhtOBjzCb8dHppP7IhiJllCOCEHHLwVXSrsa5mcVTHwz5OLt5nCjCSdaOMEjmqz6mQGAz0pZXk-7oBvgitx-9e-JaGvGW1CTaWYwwuVfl_PBgRvo3t6bQ1DMA1TZCepbWvSxDJrfFFqBCZE6ilABoY5eg';
  const doctorAvatar = doctorProfile?.avatar || defaultDoctorAvatar;
  const doctorName = doctorProfile?.name || 'Dr. Ahmed';
  const doctorSpecialty = doctorProfile?.specialty || 'Prosthodontist';
  const doctorClinic = doctorProfile?.assignedClinic || 'Clinic 1';

  const patientAvatar = activePatient?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCff4LEmqAkU8xYpwAnrA1mCIcr5F4QFgt-xHUZuN1RS46NhxWswGWtb1ife39PcANIhIT6tcMLq5zJbUimAFrNPcjtx_1Zk9TkMinJiwzMu8cgYUFulj42DT502WAC22L9Cmao6p8L0QMz5UTYmsCbcvvrWdcadrEbnJBDBXhK8KdXzuY9W47A2j3zBpMjz8Na33CRIM3VQl15ByJs3EsVwBplDm-F5ziqTnfjusXcrCX9jvMa6NXfUg';
  const patientName = activePatient?.name || 'Mohamed Ali';

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 sm:px-6 h-16 bg-white dark:bg-slate-900 border-b border-[#e2e8f0] dark:border-slate-800 transition-colors">
      {/* Brand & Desktop Links */}
      <div className="flex items-center gap-6 lg:gap-8">
        <div 
          onClick={() => onNavigate(isDoctor ? 'doctor-dashboard' : 'patient-dashboard')}
          className="font-headline font-bold text-xl sm:text-2xl text-[#006194] dark:text-[#00a3e0] cursor-pointer flex items-center gap-2 select-none"
        >
          <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0] fill-1 text-2xl">dentistry</span>
          <span>DentalCare</span>
          {!isDoctor ? (
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
              {t('patient_portal')}
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-[#006194] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full hidden sm:inline-block">
              {t('clinical_specialist')}
            </span>
          )}
        </div>

        <nav className="hidden md:flex gap-5 lg:gap-6 h-16 items-center">
          {isDoctor ? (
            <>
              <button
                onClick={() => onNavigate('doctor-dashboard')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'doctor-dashboard'
                    ? 'text-[#006194] dark:text-[#00a3e0] border-[#006194] dark:border-[#00a3e0] font-bold'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-[#006194] dark:hover:text-white'
                }`}
              >
                {t('dashboard')}
              </button>

              <button
                onClick={() => onNavigate('doctor-patients')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  (currentView === 'doctor-patients' || currentView === 'doctor-patient-profile')
                    ? 'text-[#006194] dark:text-[#00a3e0] border-[#006194] dark:border-[#00a3e0] font-bold'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-[#006194] dark:hover:text-white'
                }`}
              >
                {t('patients')}
              </button>

              <button
                onClick={() => onNavigate('doctor-visits')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'doctor-visits'
                    ? 'text-[#006194] dark:text-[#00a3e0] border-[#006194] dark:border-[#00a3e0] font-bold'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-[#006194] dark:hover:text-white'
                }`}
              >
                {t('visits_and_schedule')}
              </button>

              <button
                onClick={() => onNavigate('doctor-clinics')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'doctor-clinics'
                    ? 'text-[#006194] dark:text-[#00a3e0] border-[#006194] dark:border-[#00a3e0] font-bold'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-[#006194] dark:hover:text-white'
                }`}
              >
                {t('clinic_status')}
              </button>

              <button
                onClick={() => onNavigate('doctor-settings')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'doctor-settings'
                    ? 'text-[#006194] dark:text-[#00a3e0] border-[#006194] dark:border-[#00a3e0] font-bold'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-[#006194] dark:hover:text-white'
                }`}
              >
                {t('settings')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('patient-dashboard')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'patient-dashboard'
                    ? 'text-[#006194] dark:text-[#00a3e0] border-[#006194] dark:border-[#00a3e0] font-bold'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-[#006194] dark:hover:text-white'
                }`}
              >
                {t('dashboard')}
              </button>

              <button
                onClick={() => onNavigate('patient-chart')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'patient-chart'
                    ? 'text-[#006194] dark:text-[#00a3e0] border-[#006194] dark:border-[#00a3e0] font-bold'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-[#006194] dark:hover:text-white'
                }`}
              >
                {t('dental_chart')}
              </button>

              <button
                onClick={() => onNavigate('patient-visits')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'patient-visits'
                    ? 'text-[#006194] dark:text-[#00a3e0] border-[#006194] dark:border-[#00a3e0] font-bold'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-[#006194] dark:hover:text-white'
                }`}
              >
                {t('my_appointments')}
              </button>

              <button
                onClick={() => onNavigate('patient-profile')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'patient-profile'
                    ? 'text-[#006194] dark:text-[#00a3e0] border-[#006194] dark:border-[#00a3e0] font-bold'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-[#006194] dark:hover:text-white'
                }`}
              >
                {t('health_profile')}
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Right Controls: Theme Toggle, Language Toggle, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher Button */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs select-none"
          title="Switch Language / تغيير اللغة"
          id="lang-toggle-button"
        >
          <span className="material-symbols-outlined text-[17px] text-[#006194] dark:text-[#00a3e0]">language</span>
          <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
        </button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
          title={theme === 'dark' ? t('light_mode') : t('dark_mode')}
          id="theme-toggle-button"
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationToast(!showNotificationToast)}
            className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#006194] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotificationToast && (
            <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-in fade-in slide-in-from-top-2 text-start`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                <span className="font-headline font-bold text-sm text-slate-800 dark:text-white">{t('notifications')}</span>
                <span className="text-[11px] bg-blue-50 dark:bg-blue-950 text-[#006194] dark:text-blue-300 font-medium px-2 py-0.5 rounded-full">New</span>
              </div>
              <div className="space-y-2 text-xs">
                {isDoctor ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {isRTL ? "وصول المريض إلى العيادة" : "Patient Arrived in Clinic"}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        {isRTL 
                          ? `${patientName} متواجد حالياً في العيادة للكشف.` 
                          : `${patientName} is in chair for clinical consultation.`}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {isRTL ? "أشعة بانوراما جاهزة" : "Lab X-ray Available"}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        {isRTL ? "تم تجهيز الأشعة البانورامية للمريض." : "Panoramic scan ready for patient review."}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {isRTL ? "تم تثبيت موعدك القادم" : "Upcoming Visit Scheduled"}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        {isRTL 
                          ? `قام ${doctorName} بتسجيل وتأكيد موعد زيارتك القادمة.`
                          : `${doctorName} scheduled your upcoming consultation.`}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {isRTL ? "تحديث السجل الطبي" : "Dental Record Updated"}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        {isRTL ? "تم توثيق فحص وحالة الأسنان بنجاح في ملفك." : "Tooth condition successfully documented in chart."}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Menu */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#006194]/20 transition-all cursor-pointer"
              id="profile-menu-button"
            >
              <img
                src={isDoctor ? doctorAvatar : patientAvatar}
                alt="User avatar"
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
              />
              <span className="hidden xl:block text-xs font-bold text-slate-800 dark:text-slate-200 text-start">
                {isDoctor ? doctorName : patientName}
              </span>
            </button>

            {showProfileMenu && (
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 animate-in fade-in slide-in-from-top-2 text-start`}>
                <div className="p-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {isDoctor ? doctorName : patientName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isDoctor ? doctorSpecialty : `Patient #${activePatient?.id || '849201'}`}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  {isDoctor && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('doctor-settings');
                      }}
                      className="w-full text-start p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                      <span>{t('settings')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-start p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 font-bold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>{t('sign_out')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
