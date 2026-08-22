import React, { useState, useMemo } from 'react';
import { Patient } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface UnifiedLoginProps {
  patients?: Patient[];
  onDoctorLoginSuccess: () => void;
  onPatientLoginSuccess: (patientId: string) => void;
}

export const UnifiedLogin: React.FC<UnifiedLoginProps> = ({
  patients = [],
  onDoctorLoginSuccess,
  onPatientLoginSuccess
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  const [identifier, setIdentifier] = useState('DOC-101');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Normalize input string for matching
  const cleanInput = identifier.trim().toLowerCase();
  const digitsOnly = identifier.replace(/\D/g, '');

  // Detect role dynamically based on input
  const detectedRole = useMemo<'doctor' | 'patient' | 'unknown'>(() => {
    if (!cleanInput) return 'unknown';

    // Doctor patterns
    if (
      cleanInput.startsWith('doc') ||
      cleanInput.includes('doctor') ||
      cleanInput.includes('admin') ||
      cleanInput.startsWith('dr') ||
      cleanInput.includes('@dentalcare') ||
      cleanInput === '101'
    ) {
      return 'doctor';
    }

    // Patient match in patients list (by ID, Name, or Phone)
    const patientMatch = patients.find(
      (p) =>
        p.id.toLowerCase() === cleanInput ||
        p.name.toLowerCase().includes(cleanInput) ||
        (digitsOnly.length >= 4 && p.phone.replace(/\D/g, '').includes(digitsOnly)) ||
        (digitsOnly.length === 6 && p.id === digitsOnly)
    );

    if (patientMatch) return 'patient';

    // If digits or starts with phone digits, likely patient
    if (/^\d{5,12}$/.test(digitsOnly)) {
      return 'patient';
    }

    return 'unknown';
  }, [cleanInput, digitsOnly, patients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!cleanInput) {
      setErrorMsg(
        isRTL
          ? 'يرجى إدخال الرقم التعريفي للطبيب أو رقم ملف المريض أو رقم الهاتف.'
          : 'Please enter your Doctor ID, Email, Patient ID, or Phone Number.'
      );
      return;
    }

    // 1. Check if Doctor login
    if (
      cleanInput.startsWith('doc') ||
      cleanInput.includes('doctor') ||
      cleanInput.includes('admin') ||
      cleanInput.startsWith('dr') ||
      cleanInput.includes('@dentalcare') ||
      cleanInput === '101'
    ) {
      onDoctorLoginSuccess();
      return;
    }

    // 2. Check if Patient login
    const matchedPatient = patients.find(
      (p) =>
        p.id.toLowerCase() === cleanInput ||
        p.name.toLowerCase() === cleanInput ||
        (digitsOnly.length >= 4 && p.phone.replace(/\D/g, '').includes(digitsOnly)) ||
        p.id === cleanInput
    );

    if (matchedPatient) {
      onPatientLoginSuccess(matchedPatient.id);
      return;
    }

    // Fallback: If 6-digit ID or number was entered but not found in mock list
    if (patients.length > 0 && /^\d{4,10}$/.test(digitsOnly)) {
      onPatientLoginSuccess(patients[0].id);
      return;
    }

    // If ambiguous, check if user wrote something doctor-like
    if (cleanInput.includes('ahmed') || cleanInput.includes('clinic')) {
      onDoctorLoginSuccess();
      return;
    }

    // Default to doctor if standard demo, otherwise first patient
    onDoctorLoginSuccess();
  };

  // Fast autofill helpers for testing
  const handleAutofillDoctor = () => {
    setIdentifier('DOC-101');
    setPassword('clinicPass2026');
    setErrorMsg(null);
  };

  const handleAutofillPatient = (patientId: string) => {
    setIdentifier(patientId);
    setPassword('patient2026');
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-7 sm:p-9 animate-in fade-in zoom-in-95 duration-200 text-slate-900">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-[#006194] text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-[#006194]/20 mb-3">
          <span className="material-symbols-outlined text-3xl">dentistry</span>
        </div>
        <h1 className="font-headline font-bold text-2xl text-slate-900">
          {t('sign_in_title')}
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {t('sign_in_subtitle')}
        </p>

        {/* Dynamic Detected Role Badge */}
        <div className="mt-3 flex items-center justify-center">
          {detectedRole === 'doctor' && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-[#006194] border border-blue-200/80 animate-in fade-in">
              <span className="material-symbols-outlined text-[15px]">stethoscope</span>
              <span>{isRTL ? "تم التعرف على حساب الطبيب" : "Doctor Account Detected"}</span>
            </span>
          )}
          {detectedRole === 'patient' && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 animate-in fade-in">
              <span className="material-symbols-outlined text-[15px]">person</span>
              <span>{isRTL ? "تم التعرف على حساب المريض" : "Patient Account Detected"}</span>
            </span>
          )}
          {detectedRole === 'unknown' && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>{isRTL ? "التحقق الذكي من نوع الحساب" : "Smart Role-Based Authentication"}</span>
            </span>
          )}
        </div>
      </div>

      {/* Error notification */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('login_identifier_label')}
          </label>
          <div className="relative">
            <span className={`material-symbols-outlined absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 text-[20px]`}>
              {detectedRole === 'doctor' ? 'badge' : detectedRole === 'patient' ? 'account_circle' : 'person'}
            </span>
            <input
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setErrorMsg(null);
              }}
              required
              className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all font-medium placeholder:text-slate-400`}
              placeholder={t('login_identifier_placeholder')}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('password_label')}
          </label>
          <div className="relative">
            <span className={`material-symbols-outlined absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 text-[20px]`}>
              lock
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full ${isRTL ? 'pr-11 pl-11' : 'pl-11 pr-11'} py-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/20 transition-all font-medium placeholder:text-slate-400`}
              placeholder={t('password_placeholder')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-[#006194] focus:ring-[#006194]"
            />
            <span>{t('remember_me')}</span>
          </label>
          <span className="text-slate-400 text-[11px]">
            {isRTL ? "دخول آمن ومشفر" : "Encrypted SSL"}
          </span>
        </div>

        <button
          type="submit"
          className="w-full mt-5 bg-[#006194] hover:bg-[#004b73] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          id="unified-login-submit-btn"
        >
          <span>
            {detectedRole === 'doctor'
              ? (isRTL ? "دخول الطبيب إلى العيادة" : "Log in as Doctor")
              : detectedRole === 'patient'
              ? (isRTL ? "دخول المريض للملف الطبي" : "Log in to Patient Portal")
              : t('sign_in_button')}
          </span>
          <span className="material-symbols-outlined text-[18px]">
            {isRTL ? 'arrow_back' : 'arrow_forward'}
          </span>
        </button>
      </form>

      {/* Quick Autofill / Demo Credentials Switcher */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2.5">
          {t('quick_test_accounts')}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAutofillDoctor}
            className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer flex items-center gap-2 ${
              cleanInput === 'doc-101' || cleanInput.includes('doc')
                ? 'bg-blue-50/80 border-[#006194] text-[#006194]'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-[#006194] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[16px]">stethoscope</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{isRTL ? "حساب الطبيب" : "Doctor Login"}</p>
              <p className="text-[10px] text-slate-500 font-mono truncate">DOC-101</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAutofillPatient('849201')}
            className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer flex items-center gap-2 ${
              cleanInput === '849201' || cleanInput.includes('849201')
                ? 'bg-emerald-50/80 border-emerald-600 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[16px]">person</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{isRTL ? "حساب المريض" : "Patient Portal"}</p>
              <p className="text-[10px] text-slate-500 font-mono truncate">#849201</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

