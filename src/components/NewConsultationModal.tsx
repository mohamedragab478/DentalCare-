import React, { useState } from 'react';
import { Patient, VisitRecord } from '../types';

interface NewConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onAddConsultation: (patientId: string, visit: VisitRecord) => void;
}

export const NewConsultationModal: React.FC<NewConsultationModalProps> = ({
  isOpen,
  onClose,
  patients,
  onAddConsultation
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [procedure, setProcedure] = useState('Comprehensive Oral Exam & Cleaning');
  const [notes, setNotes] = useState('Patient presented for checkup. Examined soft tissue and periodontal charting.');
  const [clinicRoom, setClinicRoom] = useState('Clinic 3');
  const [cost, setCost] = useState('150');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newVisit: VisitRecord = {
      id: `v-${Date.now()}`,
      date: today,
      doctorName: 'Dr. Ahmed',
      procedure,
      notes,
      clinicRoom,
      cost: parseFloat(cost) || 120,
      status: 'completed'
    };

    onAddConsultation(selectedPatientId, newVisit);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006194] text-2xl">clinical_notes</span>
            <h2 className="font-headline font-bold text-xl text-slate-900">New Clinical Consultation</h2>
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
              Select Patient
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) - {p.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Procedure Name
            </label>
            <input
              type="text"
              required
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
              placeholder="e.g. Tooth 26 Composite Restoration"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Operatory Room
              </label>
              <select
                value={clinicRoom}
                onChange={(e) => setClinicRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
              >
                <option value="Clinic 1">Clinic 1</option>
                <option value="Clinic 2">Clinic 2</option>
                <option value="Clinic 3">Clinic 3</option>
                <option value="Clinic 4">Clinic 4</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Treatment Fee ($)
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Clinical Findings & Progress Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#006194] hover:bg-[#004b73] text-white text-sm font-bold shadow-xs cursor-pointer"
            >
              Record Consultation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
