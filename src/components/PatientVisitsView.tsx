import React, { useState } from 'react';
import { Patient } from '../types';
import { getAppointmentCountdown } from '../utils/dateUtils';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface PatientVisitsViewProps {
  patient: Patient;
  onBookAppointment: () => void;
}

export const PatientVisitsView: React.FC<PatientVisitsViewProps> = ({
  patient,
  onBookAppointment
}) => {
  const { t, isRTL } = useAppThemeLanguage();
  const [filter, setFilter] = useState<'all' | 'completed' | 'scheduled'>('all');

  const filteredVisits = patient.visits.filter((v) => {
    if (filter === 'completed') return v.status === 'completed';
    if (filter === 'scheduled') return v.status === 'scheduled';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-12 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0] text-2xl">event_note</span>
            <h1 className="font-headline font-bold text-2xl text-slate-900 dark:text-white">
              {t('visits_and_schedule')}
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            {isRTL 
              ? "متابعة سجل المواعيد السابقة والحالية والمستقبلية وتفاصيل العلاجات السريرية"
              : "Keep track of your scheduled consultations, procedure receipts, and past dental clinical records."}
          </p>
        </div>

        <button
          onClick={onBookAppointment}
          className="bg-[#006194] hover:bg-[#004b73] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>{t('schedule_visit')}</span>
        </button>
      </div>

      {/* Visits List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            {isRTL ? `الكشوفات (${filteredVisits.length})` : `Consultations (${filteredVisits.length})`}
          </span>
          <div className="flex gap-2 text-xs">
            {[
              { id: 'all', label: isRTL ? 'الكل' : 'All' },
              { id: 'completed', label: isRTL ? 'مكتملة' : 'Completed' },
              { id: 'scheduled', label: isRTL ? 'مجدولة' : 'Scheduled' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#006194] dark:bg-[#00a3e0] text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredVisits.length > 0 ? (
            filteredVisits.map((visit) => (
              <div
                key={visit.id}
                className="p-6 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#006194] dark:text-[#00a3e0] flex flex-col items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900">
                    <span className="material-symbols-outlined text-[22px]">stethoscope</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-headline font-bold text-base text-slate-900 dark:text-white">{visit.procedure}</span>
                      <span className="text-xs font-semibold text-[#006194] dark:text-[#00a3e0] bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900 font-mono">
                        {visit.date}
                      </span>
                      {visit.clinicRoom && (
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                          {visit.clinicRoom}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {t('doctor')}: {visit.doctorName || 'Dr. Ahmed'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      {visit.notes || (isRTL ? 'كشف دوري ومتابعة سريرية.' : 'Routine consultation and clinical exam.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                  {visit.cost && (
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{isRTL ? 'التكلفة' : 'Fee'}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">${visit.cost}</span>
                    </div>
                  )}
                  {(() => {
                    if (visit.status === 'completed') {
                      return (
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {isRTL ? 'مكتملة بنجاح' : 'Completed'}
                        </span>
                      );
                    }
                    const cd = getAppointmentCountdown(visit.date);
                    return (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#006194] dark:text-[#00a3e0] border border-blue-200 dark:border-blue-800">
                          {isRTL ? 'زيارة قادمة' : 'Upcoming Visit'}
                        </span>
                        {cd.status !== 'none' && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              cd.isToday
                                ? 'bg-emerald-500 text-white border-emerald-400'
                                : cd.isPast
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {isRTL ? cd.badgeArabic : cd.badgeEnglish}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 text-slate-300 dark:text-slate-600">calendar_today</span>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                {isRTL ? "لا توجد زيارات مسجلة" : "No consultations found in this view"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
