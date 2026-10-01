import React, { useState } from 'react';
import { Patient, ClinicRoom } from '../types';
import { CLINIC_ROOMS, INITIAL_PATIENTS } from '../data/initialData';
import { UnifiedLogin } from './UnifiedLogin';
import { PatientSignUp } from './PatientSignUp';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface AuthGatewayProps {
  patients?: Patient[];
  clinics?: ClinicRoom[];
  onDoctorLoginSuccess: (doctorId?: string) => void;
  onPatientLoginSuccess: (patientId?: string) => void;
  onPatientSignUpSuccess?: (patient: Patient) => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  patients = INITIAL_PATIENTS,
  clinics = CLINIC_ROOMS,
  onDoctorLoginSuccess,
  onPatientLoginSuccess,
  onPatientSignUpSuccess
}) => {
  const { theme, toggleTheme, lang, toggleLanguage, t, isRTL } = useAppThemeLanguage();

  // Mode: 'login' | 'signup'
  const [viewMode, setViewMode] = useState<'login' | 'signup'>('login');

  // Status strip expanded state
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);

  // Count active/available clinics
  const availableCount = clinics.filter((c) => c.status === 'occupied' || c.doctorName).length || clinics.length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Main Split Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* ========================================================================= */}
        {/* LEFT PANEL (~45% Desktop): BRAND PANEL                                    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 bg-[#0F4C5C] text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden select-none">
          {/* Subtle Organic SVG Graphic Waves Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
            <svg
              className="w-full h-full"
              viewBox="0 0 500 500"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="450" cy="100" r="300" stroke="white" strokeWidth="2" />
              <circle cx="450" cy="100" r="220" stroke="white" strokeWidth="1.5" />
              <path
                d="M -100 350 C 100 200, 300 450, 600 300"
                stroke="white"
                strokeWidth="2.5"
              />
              <path
                d="M -50 420 C 150 280, 250 500, 550 380"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Top Brand Bar */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            {/* Clean Logo Mark + Wordmark */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-teal-200 border border-white/20 flex items-center justify-center shadow-sm">
                <svg
                  className="w-6 h-6 fill-current text-white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C8.5 2 6 4.5 6 8c0 3 1.5 6 3 9.5 1 2.3 2 4.5 3 4.5s2-2.2 3-4.5c1.5-3.5 3-6.5 3-9.5 0-3.5-2.5-6-6-6zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif-display">
                DentalCare
              </span>
            </div>

            {/* Language & Theme controls for header/mobile */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleLanguage}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
                title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
              >
                <span className="material-symbols-outlined text-[16px]">language</span>
                <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="w-8.5 h-8.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer"
                title={theme === 'dark' ? t('light_mode') : t('dark_mode')}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            </div>
          </div>

          {/* Middle Brand Welcome Hero Section */}
          <div className="relative z-10 py-10 lg:py-16 space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-teal-100 font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse"></span>
              <span>{t('brand_tagline')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-serif-display text-white">
              {isRTL ? 'رعاية أسنان هادئة وموثوقة' : 'Calm, trustworthy dental care.'}
            </h1>

            <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed font-normal">
              {isRTL
                ? 'تجربة حجز وتنظيم المواعيد، والسجلات الطبية الشاملة بكل سهولة ووضوح.'
                : 'Streamlined appointment scheduling and comprehensive dental records.'}
            </p>
          </div>

          {/* Bottom Brand Footer */}
          <div className="relative z-10 text-xs text-teal-200/70 pt-6 border-t border-white/10 flex items-center justify-between">
            <span>DentalCare Pro © 2026</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>{isRTL ? 'معتمد' : 'Verified'}</span>
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL (~55% Desktop): FORM CONTAINER & SLIM STATUS STRIP            */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 bg-[#FAF7F2] dark:bg-[#0F172A] p-6 sm:p-12 lg:p-16 flex flex-col justify-between items-center transition-colors">
          
          {/* Main Form Box (No card-in-card background) */}
          <div className="w-full max-w-md my-auto">
            {viewMode === 'login' ? (
              <UnifiedLogin
                patients={patients}
                onDoctorLoginSuccess={onDoctorLoginSuccess}
                onPatientLoginSuccess={onPatientLoginSuccess}
                onGoToSignUp={() => setViewMode('signup')}
              />
            ) : (
              <div className="animate-fade-slide">
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => setViewMode('login')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C5C] dark:text-teal-400 hover:underline cursor-pointer mb-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isRTL ? 'arrow_forward' : 'arrow_back'}
                    </span>
                    <span>{isRTL ? 'العودة لتسجيل الدخول' : 'Back to sign in'}</span>
                  </button>
                </div>
                <PatientSignUp
                  onSignUpSuccess={(newPatient) => {
                    if (onPatientSignUpSuccess) {
                      onPatientSignUpSuccess(newPatient);
                    }
                    onPatientLoginSuccess(newPatient.id);
                  }}
                  onGoToLogin={() => setViewMode('login')}
                />
              </div>
            )}
          </div>

          {/* Slim, Unobtrusive Status Strip below form */}
          <div className="w-full max-w-md mt-10 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsStatusExpanded(!isStatusExpanded)}
              className="w-full py-2 px-3 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{t('doctors_available_today')}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <span>{t('view_clinic_availability')}</span>
                <span className="material-symbols-outlined text-[16px]">
                  {isStatusExpanded ? 'expand_less' : 'expand_more'}
                </span>
              </div>
            </button>

            {/* Expandable Clinic Room Details */}
            {isStatusExpanded && (
              <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 animate-fade-slide text-xs">
                {clinics.map((room) => {
                  const isOccupied = room.status === 'occupied';
                  return (
                    <div
                      key={room.id}
                      className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isOccupied ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {isRTL ? room.name.replace('Clinic', 'عيادة') : room.name}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          ({room.doctorName || (isRTL ? 'طبيب مناوب' : 'On-duty dentist')})
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isOccupied
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {isOccupied ? t('in_session') : t('ready_suite')}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
