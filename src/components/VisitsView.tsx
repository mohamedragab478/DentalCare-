import React, { useState } from 'react';
import { Patient } from '../types';
import { getAppointmentCountdown } from '../utils/dateUtils';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface VisitsViewProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNewConsultation: () => void;
  onDeleteVisit?: (patientId: string, visitId: string) => void;
}

export const VisitsView: React.FC<VisitsViewProps> = ({
  patients,
  onSelectPatient,
  onNewConsultation,
  onDeleteVisit
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visitToDelete, setVisitToDelete] = useState<{ patientId: string; visitId: string; patientName: string; procedure: string } | null>(null);

  // Extract all visits across patients
  const allVisits = patients.flatMap((p) =>
    p.visits.map((v) => ({
      ...v,
      patient: p
    }))
  );

  const filteredVisits = allVisits.filter((v) => {
    if (filterStatus === 'Completed' && v.status !== 'completed') return false;
    if (filterStatus === 'Scheduled' && v.status !== 'scheduled') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = v.patient.name.toLowerCase().includes(q);
      const matchId = v.patient.id.includes(q);
      const matchProc = v.procedure.toLowerCase().includes(q);
      const matchDoctor = (v.doctorName || '').toLowerCase().includes(q);
      const matchDate = v.date.toLowerCase().includes(q);
      return matchName || matchId || matchProc || matchDoctor || matchDate;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0] text-3xl">calendar_month</span>
            <span>{t('visits_and_schedule')}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {isRTL ? "مراجعة كشوفات واستشارات المرضى السابقة والمواعيد القادمة" : "Browse full patient consultations history, inspect details, and manage records"}
          </p>
        </div>

        <button
          onClick={onNewConsultation}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
          <span>{t('schedule_next_visit')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 p-4 shadow-2xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative flex-1">
          <span className={`material-symbols-outlined absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 text-[20px]`}>
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#006194] focus:bg-white dark:focus:bg-slate-800 transition-all`}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">{t('status')}:</span>
          {[
            { key: 'All', label: isRTL ? 'الكل' : 'All' },
            { key: 'Completed', label: isRTL ? 'المكتملة' : 'Completed' },
            { key: 'Scheduled', label: isRTL ? 'المجدولة' : 'Scheduled' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === tab.key
                  ? 'bg-[#006194] dark:bg-[#00a3e0] text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visits List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredVisits.map((visit) => {
            const countdown = getAppointmentCountdown(visit.date);

            return (
              <div
                key={visit.id}
                className="p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 text-[#006194] dark:text-[#00a3e0] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">
                      {visit.status === 'completed' ? 'check_circle' : 'calendar_clock'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap mb-1">
                      <button
                        onClick={() => onSelectPatient(visit.patient)}
                        className="font-bold text-sm text-slate-900 dark:text-white hover:text-[#006194] dark:hover:text-[#00a3e0] transition-colors cursor-pointer"
                      >
                        {visit.patient.name}
                      </button>
                      <span className="text-xs font-mono text-slate-400">#{visit.patient.id}</span>
                      
                      <span className="text-xs font-bold text-[#006194] dark:text-[#00a3e0] bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-900 font-mono">
                        {visit.date}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          visit.status === 'completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : 'bg-blue-50 dark:bg-blue-950 text-[#006194] dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {visit.status === 'completed' ? (isRTL ? 'تمت بنجاح' : 'Completed') : (isRTL ? 'مجدولة' : 'Scheduled')}
                      </span>

                      {/* Relative countdown pill for scheduled appointments */}
                      {visit.status === 'scheduled' && countdown.status !== 'none' && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          countdown.isToday 
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : countdown.isPast
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border-blue-300'
                        }`}>
                          {isRTL ? countdown.badgeArabic : countdown.badgeEnglish}
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 mb-1">{visit.procedure}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                      {visit.notes || (isRTL ? 'كشف دوري ومتابعة سريرية.' : 'Routine consultation and dental evaluation.')}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">person</span>
                        {t('doctor')}: {visit.doctorName || 'Dr. Ahmed'}
                      </span>
                      {visit.clinicRoom && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">meeting_room</span>
                          {visit.clinicRoom}
                        </span>
                      )}
                      {visit.cost && (
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {isRTL ? 'التكلفة:' : 'Fee:'} ${visit.cost}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onSelectPatient(visit.patient)}
                    className="px-3.5 py-1.5 border border-[#006194] dark:border-blue-500 text-[#006194] dark:text-[#00a3e0] hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {t('open_chart')}
                  </button>

                  {onDeleteVisit && (
                    <button
                      onClick={() =>
                        setVisitToDelete({
                          patientId: visit.patient.id,
                          visitId: visit.id,
                          patientName: visit.patient.name,
                          procedure: visit.procedure
                        })
                      }
                      title={isRTL ? "مسح الزيارة" : "Delete visit"}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredVisits.length === 0 && (
            <div className="text-center py-16 px-4">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">event_busy</span>
              <p className="font-headline font-bold text-base text-slate-700 dark:text-slate-300">
                {isRTL ? "لا توجد زيارات مسجلة" : "No visits found"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isRTL ? "جرّب تغيير كلمة البحث أو فلتر الحالة." : "Try adjusting your search query or status filter."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {visitToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 mx-auto border border-red-100 dark:border-red-800">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white text-center mb-1">
              {t('delete_visit_title')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-4 leading-relaxed">
              {isRTL 
                ? `هل أنت متأكد من رغبتك في حذف زيارة المريض ${visitToDelete.patientName} (${visitToDelete.procedure})؟`
                : `Are you sure you want to permanently delete the visit for ${visitToDelete.patientName} (${visitToDelete.procedure})?`}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVisitToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteVisit && visitToDelete) {
                    onDeleteVisit(visitToDelete.patientId, visitToDelete.visitId);
                  }
                  setVisitToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>{t('delete')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
