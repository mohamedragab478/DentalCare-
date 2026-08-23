import React from 'react';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface LoginLoadingOverlayProps {
  userName?: string;
  userRole?: 'doctor' | 'patient' | 'system';
  stepIndex: number; // 0, 1, 2
  progressPercent: number; // 0 to 100
}

export const LoginLoadingOverlay: React.FC<LoginLoadingOverlayProps> = ({
  userName,
  userRole = 'doctor',
  stepIndex,
  progressPercent
}) => {
  const { isRTL } = useAppThemeLanguage();

  const stepsArabic = [
    'التحقق من بيانات الاعتماد والتشفير...',
    'تجهيز بيانات العيادة والسجلات الطبية...',
    'تم التحقق بنجاح! جاري فتح النظام...'
  ];

  const stepsEnglish = [
    'Verifying credentials & encryption...',
    'Loading clinic records & medical data...',
    'Verified! Opening clinical workspace...'
  ];

  const currentStepText = isRTL
    ? stepsArabic[Math.min(stepIndex, stepsArabic.length - 1)]
    : stepsEnglish[Math.min(stepIndex, stepsEnglish.length - 1)];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 p-4"
      id="login-loading-overlay"
    >
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 text-center shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Animated Clinical Spinner */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-3 border-slate-200 dark:border-slate-800 border-t-[#006194] dark:border-t-[#00a3e0] animate-spin"></div>
          
          {/* Inner pulse circle */}
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-[#006194] dark:text-[#00a3e0] animate-pulse">
              {userRole === 'doctor' ? 'medical_services' : 'dentistry'}
            </span>
          </div>
        </div>

        {/* Title & User Greeting */}
        <div>
          <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white">
            {isRTL ? 'جاري تسجيل الدخول' : 'Signing into Portal'}
          </h3>
          {userName && (
            <p className="text-xs font-semibold text-[#006194] dark:text-[#00a3e0] mt-1 truncate">
              {userName}
            </p>
          )}
        </div>

        {/* Step description */}
        <div className="min-h-[22px] flex items-center justify-center">
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium transition-all">
            {currentStepText}
          </p>
        </div>

        {/* Clinical Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
            <div
              className="h-full bg-[#006194] dark:bg-[#00a3e0] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(8, progressPercent))}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            <span>{isRTL ? 'اتصال آمن' : 'SSL Encrypted'}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
