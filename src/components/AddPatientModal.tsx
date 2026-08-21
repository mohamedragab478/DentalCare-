import React, { useState, useEffect } from 'react';
import { Patient } from '../types';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: Patient) => void;
  initialPatient?: Patient | null;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
  initialPatient
}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [age, setAge] = useState<string>('30');
  const [phone, setPhone] = useState('(555) 000-0000');
  const [treatmentType, setTreatmentType] = useState('Cleaning');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const isEditMode = Boolean(initialPatient);

  // Populate data when modal opens or initialPatient changes
  useEffect(() => {
    if (initialPatient) {
      setName(initialPatient.name || '');
      setGender(initialPatient.gender || 'Male');
      setAge(initialPatient.age?.toString() || '30');
      setPhone(initialPatient.phone || '');
      setTreatmentType(initialPatient.treatmentType || 'Cleaning');
      setMedicalNotes(initialPatient.medicalNotes || '');
      setBirthDate(initialPatient.birthDate || '');
    } else {
      setName('');
      setGender('Male');
      setAge('30');
      setPhone('+1 (555) ');
      setTreatmentType('Cleaning');
      setMedicalNotes('');
      setBirthDate('');
    }
  }, [initialPatient, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    if (isEditMode && initialPatient) {
      // Update existing patient while preserving clinical history, teeth, visits, images
      const updatedPatient: Patient = {
        ...initialPatient,
        name,
        initials: initials || initialPatient.initials,
        age: parseInt(age, 10) || initialPatient.age,
        gender,
        phone,
        birthDate: birthDate || initialPatient.birthDate,
        treatmentType,
        medicalNotes
      };
      onAddPatient(updatedPatient);
    } else {
      // Generate pure 6-digit numeric ID without letters or symbols
      const randomNumericId = Math.floor(100000 + Math.random() * 900000).toString();

      const newPatient: Patient = {
        id: randomNumericId,
        name,
        initials: initials || 'PT',
        age: parseInt(age, 10) || 30,
        gender,
        phone,
        birthDate: birthDate || undefined,
        lastVisit: today,
        treatmentType,
        medicalNotes,
        teeth: {},
        visits: [],
        images: []
      };
      onAddPatient(newPatient);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006194] text-2xl">
              {isEditMode ? 'manage_accounts' : 'person_add'}
            </span>
            <div>
              <h2 className="font-headline font-bold text-xl text-slate-900">
                {isEditMode ? `Edit Patient (${initialPatient?.id})` : 'Add New Patient'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditMode ? 'Modify patient profile details' : 'Register a new patient into clinical database'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
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
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
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
              placeholder="+1 (555) 019-2830"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Date of Birth (Optional)
            </label>
            <input
              type="text"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
              placeholder="e.g. 12 May 1992"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Primary Treatment Category
            </label>
            <select
              value={treatmentType}
              onChange={(e) => setTreatmentType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
            >
              <option value="Cleaning">Cleaning / Prophylaxis</option>
              <option value="Filling">Filling / Restoration</option>
              <option value="Extraction">Extraction / Oral Surgery</option>
              <option value="Root Canal">Root Canal / Endodontics</option>
              <option value="Crown">Crown / Prosthodontics</option>
              <option value="Implant">Implant / Periodontics</option>
              <option value="Orthodontics">Orthodontics / Braces</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Medical Allergies & Clinical Notes
            </label>
            <textarea
              rows={3}
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              placeholder="e.g. Penicillin allergy, high BP, mild anxiety..."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#006194] hover:bg-[#004b73] text-white text-sm font-bold shadow-xs cursor-pointer"
            >
              {isEditMode ? 'Save Changes' : 'Create Patient Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
