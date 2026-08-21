import React, { useState, useMemo } from 'react';
import { Patient, VisitRecord } from '../types';

interface NewConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onAddConsultation: (patientId: string, visit: VisitRecord, isScheduledFuture?: boolean, scheduledTime?: string) => void;
  preselectedPatientId?: string;
}

export const NewConsultationModal: React.FC<NewConsultationModalProps> = ({
  isOpen,
  onClose,
  patients,
  onAddConsultation,
  preselectedPatientId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(preselectedPatientId || patients[0]?.id || '');
  
  // Format current date YYYY-MM-DD for date input
  const defaultDateStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(defaultDateStr);
  const [procedure, setProcedure] = useState('Comprehensive Oral Exam & Treatment');
  const [notes, setNotes] = useState('Clinical evaluation, diagnosis, and treatment performed as charted.');
  const [clinicRoom, setClinicRoom] = useState('Clinic 1 (Dr. Ahmed)');

  // Filter patients by name, ID, or phone
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const q = searchQuery.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q)
    );
  }, [patients, searchQuery]);

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    // Convert YYYY-MM-DD to DD Mon YYYY
    let formattedDate = selectedDate;
    try {
      const d = new Date(selectedDate);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    } catch {
      // keep original
    }

    const newVisit: VisitRecord = {
      id: `v-${Date.now()}`,
      date: formattedDate,
      doctorName: 'Dr. Ahmed',
      procedure,
      notes,
      clinicRoom,
      status: 'completed'
    };

    onAddConsultation(selectedPatientId, newVisit, false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006194] text-2xl">event_note</span>
            <div>
              <h2 className="font-headline font-bold text-xl text-slate-900">
                Record Clinical Consultation
              </h2>
              <p className="text-xs text-slate-500">
                تسجيل كشف وزيارة سريرية للمريض وتحديث التاريخ الطبي
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
          {/* Patient Search & Autocomplete Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Patient / المريض
            </label>
            <div className="relative mb-2">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name, phone, or numeric ID..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-[#f8fafc] text-xs text-slate-900 focus:outline-none focus:border-[#006194]"
              />
            </div>

            {/* Filtered Patient List Box */}
            <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-[#f8fafc]">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`p-2 flex items-center justify-between cursor-pointer transition-colors ${
                      selectedPatientId === p.id ? 'bg-blue-50/80 border-l-4 border-[#006194]' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-[#006194] font-bold text-[10px] flex items-center justify-center">
                        {p.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{p.name}</p>
                        <p className="text-[10px] text-slate-500">{p.phone}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      #{p.id}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">
                  No patient found
                </div>
              )}
            </div>

            {activePatient && (
              <div className="mt-2 p-2 bg-blue-50/60 rounded-lg border border-blue-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">Selected: <strong className="text-[#006194]">{activePatient.name}</strong></span>
                <span className="text-slate-500 font-mono">ID: #{activePatient.id}</span>
              </div>
            )}
          </div>

          {/* Date & Operatory Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Visit Date / تاريخ الزيارة
              </label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Clinic Room / العيادة
              </label>
              <select
                value={clinicRoom}
                onChange={(e) => setClinicRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
              >
                <option value="Clinic 1 (Dr. Ahmed)">Clinic 1 (Dr. Ahmed)</option>
                <option value="Clinic 2 (Dr. Mohamed)">Clinic 2 (Dr. Mohamed)</option>
                <option value="Clinic 3 (Dr. Mahmoud)">Clinic 3 (Dr. Mahmoud)</option>
                <option value="Clinic 4 (General Operatory)">Clinic 4 (General Operatory)</option>
              </select>
            </div>
          </div>

          {/* Procedure */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Procedure / الإجراء الطبي والعلاجي
            </label>
            <input
              type="text"
              required
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
              placeholder="e.g. Tooth #26 Bridge & Crown Restoration"
            />
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Clinical Findings & Progress Notes / ملاحظات الطبيب
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
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#006194] hover:bg-[#004b73] text-white text-sm font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>Save Clinical Visit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

