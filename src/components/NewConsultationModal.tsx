import React, { useState, useMemo } from 'react';
import { Patient, VisitRecord } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

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
  const { t, isRTL } = useAppThemeLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(preselectedPatientId || patients[0]?.id || '');
  
  const defaultDateStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(defaultDateStr);
  const [procedure, setProcedure] = useState('Comprehensive Oral Exam & Treatment');
  const [notes, setNotes] = useState('Clinical evaluation, diagnosis, and treatment performed as charted.');
  const [clinicRoom, setClinicRoom] = useState('Clinic 1 (Dr. Ahmed)');

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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      {/* Modal Box: ALWAYS WHITE as requested */}
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#006194] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">event_note</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-xl text-slate-900">
                {t('record_consultation')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRTL ? "تسجيل كشف وزيارة سريرية للمريض وتحديث التاريخ الطبي" : "Record clinical consultation and update patient history"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isRTL ? "اختيار المريض" : "Select Patient"}
            </label>
            <div className="relative mb-2">
              <span className={`material-symbols-outlined absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 text-[18px]`}>
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-[#006194]`}
              />
            </div>

            <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`p-2 flex items-center justify-between cursor-pointer transition-colors ${
                      selectedPatientId === p.id 
                        ? 'bg-blue-50 border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#006194]' 
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-[#006194] font-bold text-[10px] flex items-center justify-center">
                        {p.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{p.name}</p>
                        <p className="text-[10px] text-slate-500">{p.phone}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      #{p.id}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">
                  {t('no_matching_patients')}
                </div>
              )}
            </div>

            {activePatient && (
              <div className="mt-2 p-2.5 bg-blue-50/80 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <span className="text-slate-700">
                  {isRTL ? "المريض المحدد:" : "Selected:"} <strong className="text-[#006194]">{activePatient.name}</strong>
                </span>
                <span className="text-slate-500 font-mono">#{activePatient.id}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('date')} *
              </label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-[#006194]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('clinic')}
              </label>
              <select
                value={clinicRoom}
                onChange={(e) => setClinicRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-[#006194]"
              >
                <option value="Clinic 1 (Dr. Ahmed)">{isRTL ? "عيادة 1 (د. أحمد)" : "Clinic 1 (Dr. Ahmed)"}</option>
                <option value="Clinic 2 (Dr. Mohamed)">{isRTL ? "عيادة 2 (د. محمد)" : "Clinic 2 (Dr. Mohamed)"}</option>
                <option value="Clinic 3 (Dr. Mahmoud)">{isRTL ? "عيادة 3 (د. محمود)" : "Clinic 3 (Dr. Mahmoud)"}</option>
                <option value="Clinic 4 (General Operatory)">{isRTL ? "عيادة 4 (كشف عام وأشعة)" : "Clinic 4 (General Operatory)"}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('visit_type')} *
            </label>
            <input
              type="text"
              required
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              placeholder={isRTL ? "مثال: حشو كمبوزيت ضرس 14، تنظيف جير" : "e.g. Composite Restoration #14, Scaling"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-[#006194]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isRTL ? "الملاحظات السريرية وخطة العلاج" : "Clinical Findings & Notes"}
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isRTL ? "التشخيص، نوع البنج المستخدم، حالة المريض..." : "Clinical observation, anesthesia, materials used..."}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-[#006194]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#006194] hover:bg-[#004b73] text-white text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{isRTL ? "حفظ وتثبيت الكشف" : t('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
