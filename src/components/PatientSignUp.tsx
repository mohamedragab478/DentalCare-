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
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Male');
  const [age, setAge] = useState<string>('28');
  const [phone, setPhone] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  const receptionImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZoqMgIOkE4Sf3l_Cm61qM0gcqafhyt0fXCeYneDdS-j0DJIBrJdB24DVWx3ZdF6wKBGrengis_lUoIYcH-n1B_xfE9lPYn7iuxmUSZwWtvk6e7BbvYkRrciVJ38g9kIhDn3pTq4-8WytqOkA3gmu8PjfqWea5dtp5qz49_50y7tbU-7ciKeQkFwxQhwuf6jP5ewgxca0a9_i3YESSCRF_6zXJXlUL1MG4dLGyTqHK9rGXWUImgQXMuw';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const randomId = `#DC-${Math.floor(10000 + Math.random() * 90000)}`;
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newPatient: Patient = {
      id: randomId,
      name,
      initials: initials || 'PT',
      age: parseInt(age, 10) || 30,
      gender,
      phone,
      lastVisit: 'Today (New Patient)',
      medicalNotes,
      teeth: {},
      visits: [],
      images: []
    };

    onSignUpSuccess(newPatient);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc]">
      {/* Left side: Reception banner image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img
          src={receptionImg}
          alt="DentalCare Pro Reception"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#004b73]/90 via-[#006194]/40 to-transparent flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl">dentistry</span>
            <span className="font-headline font-bold text-2xl">DentalCare Pro</span>
          </div>

          <div className="space-y-3">
            <blockquote className="text-xl font-medium leading-relaxed">
              "Experience gentle, world-class dental care with clear visual treatment plans and real-time appointment tracking."
            </blockquote>
            <p className="text-xs text-blue-200 uppercase tracking-widest font-semibold">
              Advanced Clinical Diagnostics & Patient Portal
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#e2e8f0] p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="font-headline font-bold text-2xl text-slate-900">Create Patient Account</h1>
            <p className="text-xs text-slate-500 mt-1">Register to view charts, x-rays, and book clinic visits</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Medical History & Known Allergies
              </label>
              <textarea
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                rows={3}
                placeholder="Penicillin allergy, dental anxiety, bleeding disorders..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 text-sm focus:outline-none focus:border-[#006194] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-[#006194] hover:bg-[#004b73] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-xs active:scale-98 cursor-pointer"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already registered?{' '}
              <button
                onClick={onGoToLogin}
                className="text-[#006194] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
