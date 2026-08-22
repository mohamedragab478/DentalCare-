import React, { useState, useMemo } from 'react';
import { Patient } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';
import { getAppointmentCountdown } from '../utils/dateUtils';

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: () => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onSelectPatient,
  onAddPatient
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [treatmentFilter, setTreatmentFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTreatment = treatmentFilter === '' || p.treatmentType?.toLowerCase() === treatmentFilter.toLowerCase();
      
      return matchSearch && matchTreatment;
    });
  }, [patients, searchTerm, treatmentFilter]);

  const displayedPatients = filteredPatients.slice((page - 1) * pageSize, page * pageSize);

  const getAvatarBg = (initials: string) => {
    switch (initials) {
      case 'JD':
        return 'bg-[#dae2fd] text-[#5c647a] dark:bg-blue-950 dark:text-blue-300';
      case 'AS':
        return 'bg-[#ffdcc0] text-[#2d1600] dark:bg-amber-950 dark:text-amber-300';
      case 'MJ':
        return 'bg-[#ffdad6] text-[#93000a] dark:bg-red-950 dark:text-red-300';
      case 'EW':
        return 'bg-[#dae2fd] text-[#5c647a] dark:bg-blue-950 dark:text-blue-300';
      case 'MA':
        return 'bg-[#cce5ff] text-[#004b73] dark:bg-blue-950 dark:text-blue-300';
      default:
        return 'bg-[#e2e8f0] text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full transition-colors space-y-6 animate-in fade-in duration-200">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0] text-3xl">groups</span>
            <span>{t('all_patients')}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {isRTL ? `سجل العيادة الإلكتروني • ${patients.length} ملف مريض مسجل` : `Complete clinic database • ${patients.length} active registered dossiers`}
          </p>
        </div>

        <button
          onClick={onAddPatient}
          className="bg-[#006194] hover:bg-[#004b73] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          id="add-patient-top-btn"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>{t('new_patient')}</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 p-4 flex flex-col md:flex-row gap-4 items-center shadow-xs">
        <div className="relative flex-grow w-full">
          <span className={`material-symbols-outlined absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 text-[20px]`}>
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search_placeholder')}
            className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-2.5 rounded-xl border border-[#e2e8f0] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#006194] focus:bg-white dark:focus:bg-slate-800 text-xs transition-all`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer`}
            >
              {isRTL ? 'مسح' : 'Clear'}
            </button>
          )}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <select
              value={treatmentFilter}
              onChange={(e) => setTreatmentFilter(e.target.value)}
              className={`w-full md:w-48 px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:border-[#006194] appearance-none ${isRTL ? 'pl-8 pr-3.5' : 'pr-8 pl-3.5'} cursor-pointer`}
            >
              <option value="">{isRTL ? 'نوع العلاج (الكل)' : 'Treatment Type (All)'}</option>
              <option value="cleaning">{t('cleaning')}</option>
              <option value="filling">{t('filling')}</option>
              <option value="extraction">{t('extraction')}</option>
              <option value="root-canal">{t('root_canal_status')}</option>
              <option value="General Care">{isRTL ? 'عناية عامة' : 'General Care'}</option>
            </select>
            <span className={`material-symbols-outlined absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]`}>
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/60">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-start">
                  {t('patient_name')}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-start">
                  {t('patient_id')}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-start">
                  {t('age')}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-start">
                  {t('phone')}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-start">
                  {t('last_visit')}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-start">
                  {t('next_visit')}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-end">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#e2e8f0] dark:divide-slate-800">
              {displayedPatients.map((patient, index) => {
                const isEven = index % 2 === 1;
                const countdown = getAppointmentCountdown(patient.nextVisit, patient.nextVisitTime);

                return (
                  <tr
                    key={patient.id}
                    className={`transition-colors hover:bg-blue-50/40 dark:hover:bg-slate-800/40 ${
                      isEven ? 'bg-[#f8fafc]/70 dark:bg-slate-800/20' : 'bg-white dark:bg-slate-900'
                    }`}
                  >
                    {/* Name & Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {patient.avatar ? (
                          <img
                            src={patient.avatar}
                            alt={patient.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${getAvatarBg(
                              patient.initials
                            )}`}
                          >
                            {patient.initials}
                          </div>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white">{patient.name}</span>
                          {patient.inClinic && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>{t('in_clinic')}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Patient ID */}
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs font-semibold">
                      #{patient.id}
                    </td>

                    {/* Age */}
                    <td className="px-6 py-4 text-slate-800 dark:text-slate-200 text-xs">
                      {patient.age} {t('years_old')} ({patient.gender === 'Female' ? (isRTL ? 'أنثى' : 'Female') : (isRTL ? 'ذكر' : 'Male')})
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-slate-800 dark:text-slate-200 text-xs font-mono">
                      {patient.phone}
                    </td>

                    {/* Last Visit */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs">
                      {patient.lastVisit || (isRTL ? 'لا يوجد' : 'None')}
                    </td>

                    {/* Next Visit with Countdown */}
                    <td className="px-6 py-4">
                      {patient.nextVisit ? (
                        <div className="flex flex-col">
                          <span className="text-[#006194] dark:text-[#00a3e0] font-bold text-xs">
                            {patient.nextVisit}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {isRTL ? countdown.badgeArabic : countdown.badgeEnglish}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>

                    {/* Action button */}
                    <td className="px-6 py-4 text-end">
                      <button
                        onClick={() => onSelectPatient(patient)}
                        className="text-[#006194] dark:text-[#00a3e0] hover:bg-[#dae2fd] dark:hover:bg-blue-950 hover:text-[#004b73] px-3.5 py-1.5 rounded-xl border border-[#006194] dark:border-blue-700 transition-all text-xs font-bold cursor-pointer active:scale-95"
                      >
                        {t('open_chart')}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {displayedPatients.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
                    {t('no_matching_patients')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#e2e8f0] dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400">
          <span>{t('showing')} {displayedPatients.length} {t('of')} {filteredPatients.length}</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
              title="Previous Page"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isRTL ? 'chevron_right' : 'chevron_left'}
              </span>
            </button>
            <span className="px-2 font-semibold text-slate-700 dark:text-slate-300">
              {t('page')} {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * pageSize >= filteredPatients.length}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-[#006194] dark:text-[#00a3e0] disabled:opacity-40 cursor-pointer"
              title="Next Page"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isRTL ? 'chevron_left' : 'chevron_right'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
