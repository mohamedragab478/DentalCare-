import React, { useState } from 'react';

interface PatientLoginProps {
  onLoginSuccess: () => void;
  onGoToSignUp: () => void;
  onGoToDoctorLogin: () => void;
}

export const PatientLogin: React.FC<PatientLoginProps> = ({
  onLoginSuccess,
  onGoToSignUp,
  onGoToDoctorLogin
}) => {
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 019-283');
  const [patientId, setPatientId] = useState('#DC-84920');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8fafc]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Tooth Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#006194] text-white rounded-2xl mx-auto flex items-center justify-center shadow-md mb-4">
            <span className="material-symbols-outlined text-3xl">dentistry</span>
          </div>
          <h1 className="font-headline font-bold text-2xl text-slate-900">Patient Login</h1>
          <p className="text-xs text-slate-500 mt-1">Access your dental history, x-rays & upcoming appointments</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                call
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194]"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Patient ID
              </label>
              <a
                href="#forgot-id"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Your Patient ID is on your appointment confirmation card or SMS. For demo, use #DC-84920");
                }}
                className="text-xs text-[#006194] hover:underline font-semibold"
              >
                Forgot ID?
              </a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                tag
              </span>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194]"
                placeholder="#DC-84920"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-[#006194] hover:bg-[#004b73] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Login to Portal</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        {/* Footer actions */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3 text-center text-xs">
          <p className="text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={onGoToSignUp}
              className="text-[#006194] font-bold hover:underline"
            >
              Sign Up for Free
            </button>
          </p>

          <p className="text-slate-400">
            Clinical staff?{' '}
            <button
              onClick={onGoToDoctorLogin}
              className="text-slate-600 hover:text-[#006194] font-semibold hover:underline"
            >
              Doctor / Staff Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
