import React, { useState } from 'react';
import { Patient } from '../types';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: Patient) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient
}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Male');
  const [age, setAge] = useState<string>('30');
  const [phone, setPhone] = useState('(555) 000-0000');
  const [treatmentType, setTreatmentType] = useState('Cleaning');
  const [medicalNotes, setMedicalNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const randomId = `PT-${Math.floor(10000 + Math.random() * 90000)}`;
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newPatient: Patient = {
      id: randomId,
      name,
      initials: initials || 'PT',
      age: parseInt(age, 10) || 30,
      gender,
      phone,
      lastVisit: today,
      treatmentType,
      medicalNotes,
      teeth: {},
      visits: [],
      images: []
    };

    onAddPatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006194] text-2xl">person_add</span>
            <h2 className="font-headline font-bold text-xl text-slate-900">Add New Patient</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Patient Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
              placeholder="e.g. David Miller"
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
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
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Initial Treatment Type
            </label>
            <select
              value={treatmentType}
              onChange={(e) => setTreatmentType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
            >
              <option value="Cleaning">Cleaning</option>
              <option value="Filling">Filling</option>
              <option value="Extraction">Extraction</option>
              <option value="Root Canal">Root Canal</option>
              <option value="Crown">Crown</option>
              <option value="Implant">Implant</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Medical Allergies & Notes
            </label>
            <textarea
              rows={2}
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              placeholder="e.g. Penicillin allergy, high BP..."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#006194] hover:bg-[#004b73] text-white text-sm font-bold shadow-xs cursor-pointer"
            >
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
