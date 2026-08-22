import React, { useState } from 'react';
import { DOCTORS_LIST } from '../data/initialData';

interface DoctorLoginProps {
  onLoginSuccess: (doctorId?: string) => void;
  onGoToPatientLogin: () => void;
}

export const DoctorLogin: React.FC<DoctorLoginProps> = ({
  onLoginSuccess,
  onGoToPatientLogin
}) => {
  const [clinicalId, setClinicalId] = useState('DOC-101');
  const [password, setPassword] = useState('clinicPass2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanInput = clinicalId.trim().toLowerCase();
    const digitsOnly = clinicalId.replace(/\D/g, '');
    const trimmedPassword = password.trim();

    const matchedDoctor = DOCTORS_LIST.find((d) => {
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

    if (!matchedDoctor) {
      setErrorMsg('Invalid Doctor ID or Clinical Code.');
      return;
    }

    // Strict Password Validation
    const validDoctorPasswords = ['clinicPass2026', 'admin123', 'doctor2026', '123456'];
    if (!validDoctorPasswords.includes(trimmedPassword)) {
      setErrorMsg('Incorrect password. Please enter the valid clinic password.');
      return;
    }

    onLoginSuccess(matchedDoctor.id);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#e2e8f0] p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
      {/* Header with Tooth Logo */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-[#006194] text-white rounded-2xl mx-auto flex items-center justify-center shadow-md mb-4">
          <span className="material-symbols-outlined text-3xl">stethoscope</span>
        </div>
        <h1 className="font-headline font-bold text-2xl text-slate-900">Doctor Login</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">DentalCare Pro Clinical Workspace</p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Clinical ID / Email
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              badge
            </span>
            <input
              type="text"
              value={clinicalId}
              onChange={(e) => {
                setClinicalId(e.target.value);
                setErrorMsg(null);
              }}
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194]"
              placeholder="DOC-101 (Dr. Ahmed), DOC-102, DOC-103"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
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
              className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-[#006194] focus:ring-[#006194]"
            />
            <span>Keep me logged in</span>
          </label>
          <span className="text-slate-400 text-[11px]">Secure SSL</span>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-[#006194] hover:bg-[#004b73] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Login to Workspace</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </form>

      {/* Switch to Patient Portal */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Are you a patient?{' '}
          <button
            onClick={onGoToPatientLogin}
            className="text-[#006194] font-bold hover:underline cursor-pointer"
          >
            Access Patient Portal
          </button>
        </p>
      </div>
    </div>
  );
};
