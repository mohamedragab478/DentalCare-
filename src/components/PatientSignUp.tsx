import React, { useState } from 'react';
import { Patient } from '../types';

interface PatientSignUpProps {
  onSignUpSuccess: (newPatient: Patient) => void;
  onGoToLogin: () => void;
}

export const PatientSignUp: React.FC<PatientSignUpProps> = ({
  onSignUpSuccess,
  onGoToLogin
}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [age, setAge] = useState<string>('28');
  const [phone, setPhone] = useState('+1 (555) 019-2830');
  const [medicalNotes, setMedicalNotes] = useState('');
  
  // State for newly registered patient success modal with large numeric ID
  const [createdPatient, setCreatedPatient] = useState<Patient | null>(null);
  const [copied, setCopied] = useState(false);

  const receptionImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZoqMgIOkE4Sf3l_Cm61qM0gcqafhyt0fXCeYneDdS-j0DJIBrJdB24DVWx3ZdF6wKBGrengis_lUoIYcH-n1B_xfE9lPYn7iuxmUSZwWtvk6e7BbvYkRrciVJ38g9kIhDn3pTq4-8WytqOkA3gmu8PjfqWea5dtp5qz49_50y7tbU-7ciKeQkFwxQhwuf6jP5ewgxca0a9_i3YESSCRF_6zXJXlUL1MG4dLGyTqHK9rGXWUImgQXMuw';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    // Purely numeric ID - 6 digits
    const numericId = Math.floor(100000 + Math.random() * 900000).toString();
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newPatient: Patient = {
      id: numericId,
      name,
      initials: initials || 'PT',
      age: parseInt(age, 10) || 28,
      gender,
      phone,
      lastVisit: 'Today (New Patient)',
      medicalNotes,
      teeth: {},
      visits: [],
      images: []
    };

    setCreatedPatient(newPatient);
  };

  const handleCopyId = () => {
    if (createdPatient) {
      navigator.clipboard.writeText(createdPatient.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleProceedToPortal = () => {
    if (createdPatient) {
      onSignUpSuccess(createdPatient);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#e2e8f0] p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#006194] text-white rounded-2xl mx-auto flex items-center justify-center shadow-md mb-3">
          <span className="material-symbols-outlined text-2xl">person_add</span>
        </div>
        <h1 className="font-headline font-bold text-2xl text-slate-900">Create Patient Account</h1>
        <p className="text-xs text-slate-500 mt-1">Register to view your anatomical dental charts, x-rays, and visit history</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              person
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194]"
            >
              <option value="Male">Male (ذكر)</option>
              <option value="Female">Female (أنثى)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Age
            </label>
            <input
              type="number"
              min={1}
              max={120}
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Phone Number
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              call
            </span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Medical History / Known Allergies
          </label>
          <textarea
            value={medicalNotes}
            onChange={(e) => setMedicalNotes(e.target.value)}
            rows={2}
            placeholder="Penicillin allergy, dental anxiety, bleeding disorders..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-xs focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194] resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-[#006194] hover:bg-[#004b73] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Complete Registration</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Already registered?{' '}
          <button
            onClick={onGoToLogin}
            className="text-[#006194] font-bold hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>

      {/* Big Numeric ID Success Modal (User explicit requirement) */}
      {createdPatient && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xs">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>

            <h3 className="font-headline font-bold text-2xl text-slate-900 mb-1">
              Account Created!
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              تم إنشاء ملف المريض بنجاح. يرجى حفظ رقم المريض الخاص بك لتسجيل الدخول:
            </p>

            {/* Giant Numeric ID Box */}
            <div className="bg-[#f0f9ff] border-2 border-dashed border-[#006194] rounded-2xl p-6 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#006194] block mb-1">
                Your Patient File ID (رقم المريض)
              </span>
              <div className="font-headline font-black text-5xl tracking-widest text-[#006194] font-mono select-all">
                {createdPatient.id}
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                (Pure 6-digit numeric identification)
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCopyId}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copied ? 'done' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Patient ID'}</span>
              </button>

              <button
                onClick={handleProceedToPortal}
                className="w-full py-3.5 rounded-xl bg-[#006194] hover:bg-[#004b73] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Enter Patient Portal</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
