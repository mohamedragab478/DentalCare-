import React, { useState, useMemo, useEffect } from 'react';
import { Patient, VisitRecord, ClinicRoom } from '../types';
import { 
  getUpcomingWeekdays, 
  WeekdayOption, 
  formatDateDisplay, 
  formatDateISO, 
  getAppointmentCountdown 
} from '../utils/dateUtils';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  clinics?: ClinicRoom[];
  selectedPatient?: Patient | null;
  onSchedule?: (
    patientId: string,
    visitDate: string,
    visitTime: string,
    procedure: string,
    clinicRoom: string,
    notes?: string
  ) => void;
  onScheduleVisit?: (
    patientId: string,
    visitDate: string,
    visitTime: string,
    procedure: string,
    clinicRoom: string,
    notes?: string
  ) => void;
  preselectedPatientId?: string;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  isOpen,
  onClose,
  patients,
  clinics = [],
  selectedPatient,
  onSchedule,
  onScheduleVisit,
  preselectedPatientId
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(
    selectedPatient?.id || preselectedPatientId || patients[0]?.id || ''
  );
  
  // Week offset: 0 = nearest upcoming days (this week), 1 = next week (+7 days)
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Calculate dynamic days of the week relative to today
  const weekdayOptions = useMemo(() => getUpcomingWeekdays(weekOffset), [weekOffset]);

  // Default to tomorrow or today's date
  const [selectedDateISO, setSelectedDateISO] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return formatDateISO(d);
  });

  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [procedure, setProcedure] = useState('Follow-up Consultation & Crown Evaluation');

  // Dynamic default clinic
  const defaultClinicName = useMemo(() => {
    if (clinics && clinics.length > 0) {
      const occupied = clinics.find((c) => c.status === 'occupied' && c.doctorName);
      if (occupied) return occupied.name;
      return clinics[0].name;
    }
    return 'Clinic 1';
  }, [clinics]);

  const [clinicRoom, setClinicRoom] = useState(defaultClinicName);
  const [notes, setNotes] = useState('Check healing progress, seat final prosthesis, and oral hygiene check.');

  useEffect(() => {
    if (selectedPatient?.id) {
      setSelectedPatientId(selectedPatient.id);
    } else if (preselectedPatientId) {
      setSelectedPatientId(preselectedPatientId);
    } else if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [selectedPatient, preselectedPatientId, patients]);

  useEffect(() => {
    if (defaultClinicName && (!clinicRoom || clinicRoom === 'Clinic 1 (Dr. Ahmed)')) {
      setClinicRoom(defaultClinicName);
    }
  }, [defaultClinicName]);

  const activePatient = patients.find((p) => p.id === selectedPatientId) || selectedPatient || patients[0];

  // Convert selectedDateISO into display date
  const displayFormattedDate = useMemo(() => {
    try {
      const parts = selectedDateISO.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return formatDateDisplay(d);
      }
    } catch {}
    return selectedDateISO;
  }, [selectedDateISO]);

  // Live countdown preview
  const previewCountdown = useMemo(() => {
    return getAppointmentCountdown(displayFormattedDate, selectedTime);
  }, [displayFormattedDate, selectedTime]);

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

  if (!isOpen) return null;

  const handleSelectWeekday = (wd: WeekdayOption) => {
    setSelectedDateISO(wd.isoStr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    const scheduleCallback = onSchedule || onScheduleVisit;
    if (scheduleCallback) {
      scheduleCallback(
        selectedPatientId,
        displayFormattedDate,
        selectedTime,
        procedure,
        clinicRoom,
        notes
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      {/* Modal Box: ALWAYS WHITE as requested */}
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-[#006194] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">event_upcoming</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-xl text-slate-900">
                {t('schedule_visit_title')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('schedule_visit_subtitle')}
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Patient Selector */}
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
                placeholder={isRTL ? "ابحث باسم المريض أو رقم الهاتف أو المعرف..." : "Search patient name, phone, or numeric ID..."}
                className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-[#006194]`}
              />
            </div>

            {/* Quick selector box */}
            <div className="max-h-28 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50">
              {filteredPatients.map((p) => (
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
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-[#006194] font-bold text-xs flex items-center justify-center">
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
              ))}
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

          {/* Dynamic Days of Week Selector */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#006194]">calendar_month</span>
                <span>{isRTL ? "تحديد الموعد حسب يوم الأسبوع" : "Select by Day of the Week"}</span>
              </label>

              {/* Week Switcher */}
              <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setWeekOffset(0)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    weekOffset === 0
                      ? 'bg-[#006194] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isRTL ? "الأيام القادمة" : "This Cycle"}
                </button>
                <button
                  type="button"
                  onClick={() => setWeekOffset(1)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    weekOffset === 1
                      ? 'bg-[#006194] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isRTL ? "الأسبوع القادم (+7d)" : "Next Week (+7d)"}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              {isRTL 
                ? "اختر يوم الأسبوع المطلوب وسيتم حساب وتثبيت التاريخ تلقائياً حسب اليوم الحالي:" 
                : "Choose a weekday; the exact date will be calculated automatically based on today:"}
            </p>

            {/* 7 Weekday Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
              {weekdayOptions.map((wd) => {
                const isSelected = selectedDateISO === wd.isoStr;
                return (
                  <button
                    key={wd.dayIndex}
                    type="button"
                    onClick={() => handleSelectWeekday(wd)}
                    className={`p-2 rounded-xl text-center transition-all border cursor-pointer flex flex-col items-center justify-between gap-1 active:scale-95 ${
                      isSelected
                        ? 'bg-[#006194] text-white border-[#006194] ring-2 ring-[#006194]/30 shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
                    }`}
                  >
                    <span className="font-bold text-xs">
                      {isRTL ? wd.nameArabic : wd.nameEnglish}
                    </span>

                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isRTL ? wd.arabicDisplay : wd.displayStr.split(' ').slice(0, 2).join(' ')}
                    </span>

                    {wd.isToday ? (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-emerald-400 text-slate-900' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isRTL ? 'اليوم' : 'Today'}
                      </span>
                    ) : (
                      <span className={`text-[9px] opacity-75 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {isRTL ? `بعد ${wd.diffDays} يوم` : `+${wd.diffDays}d`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isRTL ? "تاريخ الزيارة المحدد" : "Visit Date"}
              </label>
              <input
                type="date"
                required
                value={selectedDateISO}
                onChange={(e) => setSelectedDateISO(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isRTL ? "توقيت الحضور" : "Time Slot"}
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:border-[#006194]"
              >
                <option value="09:00 AM">{isRTL ? "09:00 صباحاً" : "09:00 AM"}</option>
                <option value="10:00 AM">{isRTL ? "10:00 صباحاً" : "10:00 AM"}</option>
                <option value="10:30 AM">{isRTL ? "10:30 صباحاً" : "10:30 AM"}</option>
                <option value="11:30 AM">{isRTL ? "11:30 صباحاً" : "11:30 AM"}</option>
                <option value="01:00 PM">{isRTL ? "01:00 ظهراً" : "01:00 PM"}</option>
                <option value="02:30 PM">{isRTL ? "02:30 عصراً" : "02:30 PM"}</option>
                <option value="04:00 PM">{isRTL ? "04:00 مساءً" : "04:00 PM"}</option>
                <option value="05:30 PM">{isRTL ? "05:30 مساءً" : "05:30 PM"}</option>
                <option value="07:00 PM">{isRTL ? "07:00 مساءً" : "07:00 PM"}</option>
              </select>
            </div>
          </div>

          {/* Live Patient Portal Preview Banner */}
          <div className="p-4 rounded-2xl bg-[#004b73] text-white space-y-1.5 border border-[#003b5c]">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 opacity-90">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>{isRTL ? "معاينة ما سيظهر في صفحة المريض فوراً:" : "Patient Portal Live Preview:"}</span>
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-mono">
                {displayFormattedDate}
              </span>
            </div>
            
            <div className="bg-white/10 p-2.5 rounded-xl text-xs space-y-1 border border-white/15">
              <div className="flex items-center justify-between gap-2">
                <strong className="text-white text-sm">
                  {isRTL ? previewCountdown.badgeArabic : previewCountdown.badgeEnglish}
                </strong>
              </div>
              <p className="text-[11px] text-blue-100 leading-relaxed">
                {isRTL ? previewCountdown.descriptionArabic : previewCountdown.descriptionEnglish}
              </p>
            </div>
          </div>

          {/* Procedure & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isRTL ? "الإجراء المطلوب" : "Procedure / Visit Type"}
              </label>
              <input
                type="text"
                required
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                placeholder={isRTL ? "مثال: تركيب طربوش / متابعة علاج" : "e.g. Crown Fitting / Follow-up"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-[#006194]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isRTL ? "الغرفة والعيادة" : "Clinic Room"}
              </label>
              <select
                value={clinicRoom}
                onChange={(e) => setClinicRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-[#006194]"
              >
                {clinics && clinics.length > 0 ? (
                  clinics.map((c) => {
                    const clinicDisplay = isRTL ? c.name.replace('Clinic', 'عيادة') : c.name;
                    const docDisplay = c.doctorName ? ` - ${c.doctorName}` : '';
                    return (
                      <option key={c.id} value={c.name}>
                        {clinicDisplay}{docDisplay}
                      </option>
                    );
                  })
                ) : (
                  <>
                    <option value="Clinic 1">{isRTL ? "عيادة 1" : "Clinic 1"}</option>
                    <option value="Clinic 2">{isRTL ? "عيادة 2" : "Clinic 2"}</option>
                    <option value="Clinic 3">{isRTL ? "عيادة 3" : "Clinic 3"}</option>
                    <option value="Clinic 4">{isRTL ? "عيادة 4" : "Clinic 4"}</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isRTL ? "تعليمات للمريض ولطاقم التمريض" : "Instructions & Notes"}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isRTL ? "أدخل أي تعليمات خاصة..." : "Enter instructions..."}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-[#006194]"
            />
          </div>

          {/* Action Buttons */}
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
              className="px-6 py-2.5 rounded-xl bg-[#006194] hover:bg-[#004b73] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{isRTL ? "حفظ الموعد وتثبيته" : "Save Appointment"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

