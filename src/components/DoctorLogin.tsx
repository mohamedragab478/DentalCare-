import React, { useState } from 'react';

interface DoctorLoginProps {
  onLoginSuccess: () => void;
  onGoToPatientLogin: () => void;
}

export const DoctorLogin: React.FC<DoctorLoginProps> = ({
  onLoginSuccess,
  onGoToPatientLogin
}) => {
  const [clinicalId, setClinicalId] = useState('DOC-101');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const bgImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC21kFRx_5ktBeCwtdIqlXj2Irk3hdlAatenkJ_OLad6viNnIr-9f8ZMQqNsZmzFbDi-NgBce-oLRALpVn2saWVWLskqkF87-0A68_132Anub0x00PVWxQonHuJmljF-Vw02kxweA5CLdy7Y7VgHGDCMQER8SJ5o7ErTc7J9U2Ggrwb1x9cu0tDtJEAIyUqK7QPVKrQ1z6tQC3qFVZU9hEP7X-eqc3SahcM13GiDkMGP0ICEVwTA1Nqg';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 relative bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark tint backdrop overlay */}
      <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-xs"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40 p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Tooth Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#006194] text-white rounded-2xl mx-auto flex items-center justify-center shadow-md mb-4">
            <span className="material-symbols-outlined text-3xl">dentistry</span>
          </div>
          <h1 className="font-headline font-bold text-2xl text-slate-900">Doctor Login</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">DentalCare Pro Clinical Workspace</p>
        </div>

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
                onChange={(e) => setClinicalId(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194]"
                placeholder="DOC-101"
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
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to registered clinic email."); }} className="text-[#006194] hover:underline font-semibold">
              Forgot password?
            </a>
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
              className="text-[#006194] font-bold hover:underline"
            >
              Access Patient Portal
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
