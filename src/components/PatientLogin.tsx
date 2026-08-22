import React, { useState } from 'react';

interface PatientLoginProps {
  onLoginSuccess: (patientId?: string) => void;
  onGoToSignUp?: () => void;
  onGoToDoctorLogin: () => void;
}

export const PatientLogin: React.FC<PatientLoginProps> = ({
  onLoginSuccess,
  onGoToDoctorLogin
}) => {
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 019-2830');
  const [patientId, setPatientId] = useState('849201');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(patientId);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#e2e8f0] p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
      {/* Header with Tooth Logo */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-[#006194] text-white rounded-2xl mx-auto flex items-center justify-center shadow-md mb-4">
          <span className="material-symbols-outlined text-3xl">dentistry</span>
        </div>
        <h1 className="font-headline font-bold text-2xl text-slate-900">Patient Portal Login</h1>
        <p className="text-xs text-slate-500 mt-1">Access your anatomical dental records, x-rays & appointments</p>
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
              Numeric Patient ID
            </label>
            <span className="text-[11px] text-slate-400 font-mono">6 digits</span>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              tag
            </span>
            <input
              type="text"
              pattern="[0-9]*"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value.replace(/\D/g, ''))}
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 font-mono text-sm tracking-wider focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194]"
              placeholder="e.g. 849201"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-[#006194] hover:bg-[#004b73] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Login to Patient Portal</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </form>

      {/* Doctor Authorization Note */}
      <div className="mt-6 bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 text-center space-y-1.5">
        <div className="flex items-center justify-center gap-1.5 text-slate-700 font-bold text-xs">
          <span className="material-symbols-outlined text-[#006194] text-[17px]">verified_user</span>
          <span>Doctor-Authorized Accounts Only</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          يتم إنشاء وتفعيل حسابات المرضى حصرياً من قِبل الطبيب المعالج داخل العيادة لتأمين السجلات الطبية.
        </p>
      </div>

      {/* Footer actions */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2 text-center text-xs">
        <p className="text-slate-400">
          Clinic Doctor or Staff?{' '}
          <button
            onClick={onGoToDoctorLogin}
            className="text-slate-700 hover:text-[#006194] font-bold hover:underline cursor-pointer"
          >
            Doctor / Staff Login Portal
          </button>
        </p>
      </div>
    </div>
  );
};
