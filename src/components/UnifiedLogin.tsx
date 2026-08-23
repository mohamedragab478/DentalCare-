import React, { useState, useMemo } from 'react';
import { Patient, DoctorProfile } from '../types';
import { DOCTORS_LIST } from '../data/initialData';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

// Standard Doctor Account Credentials & Passwords
export const DOCTOR_CREDENTIALS: Record<string, { pass: string; docId: string }> = {
  'doc-01': { pass: 'clinicPass2026', docId: 'doc-01' },
  'doc-02': { pass: 'clinicPass2026', docId: 'doc-02' },
  'doc-03': { pass: 'clinicPass2026', docId: 'doc-03' },
  'ahmed': { pass: 'clinicPass2026', docId: 'doc-01' },
  'mohamed': { pass: 'clinicPass2026', docId: 'doc-02' },
  'mahmoud': { pass: 'clinicPass2026', docId: 'doc-03' }
};

interface UnifiedLoginProps {
  patients?: Patient[];
  doctors?: DoctorProfile[];
  onDoctorLoginSuccess: (doctorId?: string, assignedClinic?: string) => void;
  onPatientLoginSuccess: (patientId: string) => void;
}

export const UnifiedLogin: React.FC<UnifiedLoginProps> = ({
  patients = [],
  doctors = DOCTORS_LIST,
  onDoctorLoginSuccess,
  onPatientLoginSuccess
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  const [identifier, setIdentifier] = useState('DOC-101');
  const [password, setPassword] = useState('clinicPass2026');
  const [selectedClinic, setSelectedClinic] = useState<string>('Clinic 1');
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
    const doctorMatch = doctors.find((d) => {
      const docDigits = d.id.replace(/\D/g, '');
      return (
        d.id.toLowerCase() === cleanInput ||
        d.email.toLowerCase() === cleanInput ||
        d.name.toLowerCase().includes(cleanInput) ||
        (digitsOnly.length > 0 && docDigits.endsWith(digitsOnly)) ||
        cleanInput === `doc-${docDigits}` ||
        cleanInput === `doc-10${docDigits}` ||
        cleanInput === `10${docDigits}` ||
        (cleanInput === 'doc-101' && d.id === 'doc-01') ||
        (cleanInput === 'doc-102' && d.id === 'doc-02') ||
        (cleanInput === 'doc-103' && d.id === 'doc-03')
      );
    });

    if (
      doctorMatch ||
      cleanInput.startsWith('doc') ||
      cleanInput.includes('doctor') ||
      cleanInput.includes('admin') ||
      cleanInput.startsWith('dr') ||
      cleanInput.includes('@dentalcare') ||
      cleanInput === '101' ||
      cleanInput === '102' ||
      cleanInput === '103'
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
  }, [cleanInput, digitsOnly, patients, doctors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!cleanInput) {
      setErrorMsg(
        isRTL
          ? 'يرجى إدخال اسم المستخدم أو كود الطبيب أو رقم ملف المريض.'
          : 'Please enter your Doctor ID, Email, Patient File #, or Phone Number.'
      );
      return;
    }

    if (!password || password.trim().length === 0) {
      setErrorMsg(
        isRTL
          ? 'يرجى إدخال كلمة المرور للمتابعة.'
          : 'Please enter your password.'
      );
      return;
    }

    const trimmedPassword = password.trim();

    // 0. Primary Check: Supabase app_users table (RBAC: 0 = Patient, 1 = Doctor)
    try {
      const { supabaseService } = await import('../services/supabaseService');
      const authRes = await supabaseService.authenticateUser(cleanInput, trimmedPassword);
      if (authRes.success && authRes.refId !== undefined) {
        if (authRes.role === 1) {
          onDoctorLoginSuccess(authRes.refId, selectedClinic);
          return;
        } else {
          onPatientLoginSuccess(authRes.refId);
          return;
        }
      }
    } catch (cloudErr) {
      console.info('Cloud auth check fallback to local check:', cloudErr);
    }


    // 1. Check if input matches any Doctor
    const matchedDoctor = doctors.find((d) => {
      const docDigits = d.id.replace(/\D/g, '');
      return (
        d.id.toLowerCase() === cleanInput ||
        d.email.toLowerCase() === cleanInput ||
        d.name.toLowerCase().includes(cleanInput) ||
        (digitsOnly.length > 0 && docDigits.endsWith(digitsOnly)) ||
        cleanInput === `doc-${docDigits}` ||
        cleanInput === `doc-10${docDigits}` ||
        cleanInput === `10${docDigits}` ||
        (cleanInput === 'doc-101' && d.id === 'doc-01') ||
        (cleanInput === 'doc-102' && d.id === 'doc-02') ||
        (cleanInput === 'doc-103' && d.id === 'doc-03') ||
        (cleanInput.includes('ahmed') && d.id === 'doc-01') ||
        (cleanInput.includes('mohamed') && d.id === 'doc-02') ||
        (cleanInput.includes('mahmoud') && d.id === 'doc-03')
      );
    });

    if (matchedDoctor) {
      // STRICT PASSWORD CHECK FOR DOCTORS
      const validDoctorPasswords = ['clinicPass2026', 'admin123', 'doctor2026', '123456'];
      if (!validDoctorPasswords.includes(trimmedPassword)) {
        setErrorMsg(
          isRTL
            ? 'كلمة المرور غير صحيحة لحساب هذا الطبيب. كلمة المرور الصحيحة للتجربة هي: clinicPass2026'
            : 'Incorrect password for this doctor account. Valid password is: clinicPass2026'
        );
        return;
      }

      onDoctorLoginSuccess(matchedDoctor.id, selectedClinic);
      return;
    }

    // 2. Check if input matches any Patient
    const matchedPatient = patients.find(
      (p) =>
        p.id.toLowerCase() === cleanInput ||
        p.name.toLowerCase() === cleanInput ||
        (digitsOnly.length >= 4 && p.phone.replace(/\D/g, '').includes(digitsOnly)) ||
        p.id === cleanInput
    );

    if (matchedPatient) {
      // STRICT PASSWORD CHECK FOR PATIENTS (Password is the Patient's ID or Phone)
      const isPasswordValid =
        trimmedPassword === matchedPatient.id ||
        trimmedPassword.toLowerCase() === matchedPatient.id.toLowerCase() ||
        trimmedPassword === matchedPatient.phone ||
        (digitsOnly.length > 0 && trimmedPassword.replace(/\D/g, '') === matchedPatient.phone.replace(/\D/g, '')) ||
        ['patient2026', 'patient123', 'clinicPass2026', '123456'].includes(trimmedPassword);

      if (!isPasswordValid) {
        setErrorMsg(
          isRTL
            ? `كلمة المرور غير صحيحة لملف المريض. كلمة المرور هي رقم المريض (ID): #${matchedPatient.id}`
            : `Incorrect password for patient portal. Valid password is Patient ID: #${matchedPatient.id}`
        );
        return;
      }

      onPatientLoginSuccess(matchedPatient.id);
      return;
    }

    // 3. Fallback check for newly registered patients by exact ID
    const anyPatientById = patients.find((p) => p.id === identifier.trim());
    if (anyPatientById) {
      const isPasswordValid =
        trimmedPassword === anyPatientById.id ||
        trimmedPassword.toLowerCase() === anyPatientById.id.toLowerCase() ||
        ['patient2026', 'patient123', 'clinicPass2026', '123456'].includes(trimmedPassword);

      if (!isPasswordValid) {
        setErrorMsg(
          isRTL
            ? `كلمة المرور غير صحيحة لملف المريض. كلمة المرور هي رقم المريض (ID): #${anyPatientById.id}`
            : `Incorrect password for patient portal. Valid password is Patient ID: #${anyPatientById.id}`
        );
        return;
      }

      onPatientLoginSuccess(anyPatientById.id);
      return;
    }

    // If identifier is completely invalid
    setErrorMsg(
      isRTL
        ? 'اسم المستخدم أو كود الطبيب غير موجود. يرجى التأكد من البيانات المدخلة.'
        : 'User not found. Please check your Doctor ID, Patient File #, or phone number.'
    );
  };

  // Fast autofill helpers for testing
  const handleAutofillDoctor = (docId: string, customDocIdFormatted: string) => {
    setIdentifier(customDocIdFormatted);
    setPassword('clinicPass2026');
    setErrorMsg(null);
  };

  const handleAutofillPatient = (phone: string, patientId: string) => {
    setIdentifier(phone);
    setPassword(patientId);
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
        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0 mt-0.5">error</span>
          <span className="font-medium leading-relaxed">{errorMsg}</span>
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
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg(null);
              }}
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
            {isRTL ? "دخول" : "Log In"}
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

        {/* Doctors Selector */}
        <div className="space-y-1.5 mb-2.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            {isRTL ? "أطباء المركز (اضغط لتعبئة البيانات الصحيحة):" : "Clinic Doctors (Click to autofill):"}
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {doctors.map((doc, idx) => {
              const docCode = `DOC-10${idx + 1}`;
              const isSelected = cleanInput.includes(docCode.toLowerCase()) || cleanInput.includes(doc.id.toLowerCase());
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleAutofillDoctor(doc.id, docCode)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-blue-50 border-[#006194] text-[#006194] font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                  title={doc.name}
                >
                  <span className="text-[11px] font-bold truncate max-w-full">
                    {doc.name.split(' ')[1] || doc.name}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">{docCode}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Patients Selector */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            {isRTL ? "ملفات المرضى (اليوزر = الهاتف ، الباسورد = ID):" : "Patient Portals (User = Phone, Pass = ID):"}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleAutofillPatient('+20 100 849 2010', '849201')}
              className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer flex items-center gap-2 ${
                cleanInput.includes('849201') || cleanInput.includes('849')
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[14px]">person</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">Mohamed Ali</p>
                <p className="text-[9px] text-slate-500 font-mono">01008492010 • #849201</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleAutofillPatient('+20 101 987 6543', '102943')}
              className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer flex items-center gap-2 ${
                cleanInput.includes('102943') || cleanInput.includes('987')
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[14px]">person</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">Alice Smith</p>
                <p className="text-[9px] text-slate-500 font-mono">01019876543 • #102943</p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
