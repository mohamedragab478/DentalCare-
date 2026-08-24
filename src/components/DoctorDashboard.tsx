import React, { useState, useMemo } from 'react';
import { Patient, ClinicRoom, DoctorProfile } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';
import { getAppointmentCountdown, formatDateArabic, parseAppointmentDate } from '../utils/dateUtils';

interface DoctorDashboardProps {
  patients: Patient[];
  clinics: ClinicRoom[];
  doctorProfile?: DoctorProfile;
  activeClinic?: string;
  onUpdateActiveClinic?: (clinic: string) => void;
  completedPatientIds?: string[];
  onTogglePatientCompleted?: (patientId: string) => void;
  onToggleInClinic?: (patientId: string) => void;
  onReorderPatients?: (newOrder: Patient[]) => void;
  onDeleteVisit?: (patientId: string, visitId: string) => void;
  onSelectPatient: (patient: Patient) => void;
  onNavigate: (view: any) => void;
  onAddPatient?: () => void;
  onScheduleVisit?: (patient?: Patient, preselectedDate?: Date | string) => void;
  onAssignDoctor?: (roomId: number) => void;
  onVacateDoctor?: (roomId: number) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  patients,
  clinics,
  doctorProfile,
  activeClinic,
  onUpdateActiveClinic,
  completedPatientIds = [],
  onTogglePatientCompleted,
  onToggleInClinic,
  onReorderPatients,
  onDeleteVisit,
  onSelectPatient,
  onNavigate,
  onAddPatient,
  onScheduleVisit,
  onAssignDoctor,
  onVacateDoctor
}) => {
  const { t, isRTL, lang } = useAppThemeLanguage();

  const [internalCompletedIds, setInternalCompletedIds] = useState<string[]>(['849202']);
  const [visitFilter, setVisitFilter] = useState<'All' | 'Completed' | 'Scheduled'>('All');
  const [selectedDayKey, setSelectedDayKey] = useState<string>(() => {
    const todayNum = new Date().getDay();
    const dayMap: Record<number, string> = { 6: 'sat', 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri' };
    return dayMap[todayNum] || 'sat';
  });
  const [visitToDelete, setVisitToDelete] = useState<{ patientId: string; visitId: string; patientName: string; procedure: string } | null>(null);

  // 7 Days Weekday Filter Logic (Saturday -> Friday)
  const weekDaysConfig = [
    { key: 'sat', dayNum: 6, arName: 'السبت', enName: 'Saturday' },
    { key: 'sun', dayNum: 0, arName: 'الأحد', enName: 'Sunday' },
    { key: 'mon', dayNum: 1, arName: 'الاثنين', enName: 'Monday' },
    { key: 'tue', dayNum: 2, arName: 'الثلاثاء', enName: 'Tuesday' },
    { key: 'wed', dayNum: 3, arName: 'الأربعاء', enName: 'Wednesday' },
    { key: 'thu', dayNum: 4, arName: 'الخميس', enName: 'Thursday' },
    { key: 'fri', dayNum: 5, arName: 'الجمعة', enName: 'Friday' },
  ];

  const weekDaysWithDates = useMemo(() => {
    const today = new Date();
    const todayDayNum = today.getDay();

    return weekDaysConfig.map((item) => {
      const offset = (item.dayNum - todayDayNum + 7) % 7;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + offset);

      const isToday = offset === 0;
      const dayNumber = targetDate.getDate();
      const monthName = targetDate.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: 'short' });
      const dateDisplay = isToday
        ? (isRTL ? 'اليوم' : 'Today')
        : `${dayNumber} ${monthName}`;

      return {
        ...item,
        targetDate,
        offset,
        isToday,
        dateDisplay
      };
    });
  }, [isRTL]);

  // Helper: check if an ISO or locale date string falls on the target date
  const dateStrMatchesTarget = (dateStr: string, targetDate: Date): boolean => {
    if (!dateStr) return false;
    const parsed = parseAppointmentDate(dateStr) || new Date(dateStr);
    if (parsed && !isNaN(parsed.getTime())) {
      return (
        parsed.getDate() === targetDate.getDate() &&
        parsed.getMonth() === targetDate.getMonth() &&
        parsed.getFullYear() === targetDate.getFullYear()
      );
    }
    return false;
  };

  const isPatientMatchingDate = (patient: Patient, dayObj: { targetDate: Date; arName: string; enName: string }) => {
    const { targetDate, arName, enName } = dayObj;
    const today = new Date();

    const isTodayTarget =
      targetDate.getDate() === today.getDate() &&
      targetDate.getMonth() === today.getMonth() &&
      targetDate.getFullYear() === today.getFullYear();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrowTarget =
      targetDate.getDate() === tomorrow.getDate() &&
      targetDate.getMonth() === tomorrow.getMonth() &&
      targetDate.getFullYear() === tomorrow.getFullYear();

    // 1. Match via visits[] array - any visit dated on targetDate
    if (patient.visits && patient.visits.length > 0) {
      const hasVisitOnDay = patient.visits.some((v) => dateStrMatchesTarget(v.date, targetDate));
      if (hasVisitOnDay) return true;
    }

    // 2. Match via lastVisit (patients currently in queue today)
    if (isTodayTarget && patient.lastVisit) {
      if (dateStrMatchesTarget(patient.lastVisit, targetDate)) return true;
    }

    // 3. Match via nextVisit
    if (!patient.nextVisit) return false;
    const visitStr = patient.nextVisit.trim().toLowerCase();

    // 3a. Keyword check
    if (isTodayTarget && (visitStr === 'today' || visitStr === 'اليوم')) return true;
    if (isTomorrowTarget && (visitStr === 'tomorrow' || visitStr === 'غداً' || visitStr === 'غدا')) return true;

    // 3b. Day name check (e.g., "السبت", "Saturday")
    if (visitStr.includes(arName.toLowerCase()) || visitStr.includes(enName.toLowerCase())) {
      return true;
    }

    // 3c. Direct Date parse check
    if (dateStrMatchesTarget(patient.nextVisit, targetDate)) return true;

    // 3d. Substring day number & month check (e.g. "24 Aug" or "24/08")
    const dayNumStr = targetDate.getDate().toString();
    const padDayStr = dayNumStr.padStart(2, '0');
    if (visitStr.includes(padDayStr) || visitStr.includes(dayNumStr)) {
      const monthNumStr = (targetDate.getMonth() + 1).toString();
      const padMonthStr = monthNumStr.padStart(2, '0');
      const monthShortEn = targetDate.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();

      if (
        visitStr.includes(monthShortEn) ||
        visitStr.includes(`/${monthNumStr}`) ||
        visitStr.includes(`/${padMonthStr}`) ||
        visitStr.includes(`-${padMonthStr}`)
      ) {
        return true;
      }
    }

    return false;
  };

  // Drag and Drop reordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const finishedIds = completedPatientIds.length > 0 ? completedPatientIds : internalCompletedIds;

  const handleToggleFinished = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTogglePatientCompleted) {
      onTogglePatientCompleted(id);
    } else {
      setInternalCompletedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  const handleInClinicToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleInClinic) {
      onToggleInClinic(id);
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex || !onReorderPatients) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const updated = [...patients];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);
    onReorderPatients(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxTdB6BFCRDU6qr8N5YlyqcvvBqAlixK076_tUMWhheQjfjcVCtO0UBEY8sL1jYC9cucKVnoLoEgJlDKaSn0Qb5FJkx7v8MdhtOBjzCb8dHppP7IhiJllCOCEHHLwVXSrsa5mcVTHwz5OLt5nCjCSdaOMEjmqz6mQGAz0pZXk-7oBvgitx-9e-JaGvGW1CTaWYwwuVfl_PBgRvo3t6bQ1DMA1TZCepbWvSxDJrfFFqBCZE6ilABoY5eg';
  const currentAvatar = doctorProfile?.avatar || defaultAvatar;
  const currentDoctorName = doctorProfile?.name || 'Dr. Ahmed';
  const currentSpecialty = doctorProfile?.specialty || (isRTL ? 'استشاري التركيبات وزراعة الأسنان' : 'Prosthodontist & Implant Specialist');
  const effectiveClinic = activeClinic || doctorProfile?.assignedClinic || 'Clinic 1';

  const [isCompletedOpen, setIsCompletedOpen] = useState<boolean>(false);

  // Is the currently selected day button == today?
  const isSelectedDayToday = useMemo(() => {
    const todayObj = weekDaysWithDates.find((d) => d.isToday);
    return todayObj ? selectedDayKey === todayObj.key : false;
  }, [selectedDayKey, weekDaysWithDates]);

  // Helper: Normalize clinic names (Arabic & English) into standard key (e.g. 'clinic 1')
  const normalizeClinicKey = (clinicStr?: string): string => {
    if (!clinicStr) return 'clinic 1';
    const clean = clinicStr.trim().toLowerCase();

    if (clean.includes('1') || clean.includes('١')) return 'clinic 1';
    if (clean.includes('2') || clean.includes('٢')) return 'clinic 2';
    if (clean.includes('3') || clean.includes('٣')) return 'clinic 3';
    if (clean.includes('4') || clean.includes('٤')) return 'clinic 4';

    return clean;
  };

  // Helper: Get strict clinic room for a patient on a specific date
  const getPatientClinicRoomForDate = (patient: Patient, targetDate?: Date): string => {
    // 1. Search patient's visits for a matching visit on targetDate with explicit clinicRoom
    if (targetDate && patient.visits && patient.visits.length > 0) {
      const dateVisit = patient.visits.find((v) => dateStrMatchesTarget(v.date, targetDate) && v.clinicRoom);
      if (dateVisit && dateVisit.clinicRoom) {
        return dateVisit.clinicRoom;
      }
    }

    // 2. Search scheduled visits with explicit clinicRoom
    if (patient.visits && patient.visits.length > 0) {
      const scheduledVisit = patient.visits.find((v) => v.status === 'scheduled' && v.clinicRoom);
      if (scheduledVisit && scheduledVisit.clinicRoom) {
        return scheduledVisit.clinicRoom;
      }
      const latestWithRoom = patient.visits.find((v) => v.clinicRoom);
      if (latestWithRoom && latestWithRoom.clinicRoom) {
        return latestWithRoom.clinicRoom;
      }
    }

    // 3. Fallback to attendingClinic
    if (patient.attendingClinic && patient.attendingClinic.trim()) {
      return patient.attendingClinic;
    }

    return 'Clinic 1';
  };

  // Helper: Check if patient matches BOTH targetClinic AND targetDate strictly
  const isPatientMatchingClinicAndDate = (
    patient: Patient,
    targetClinic: string,
    dayObj: { targetDate: Date; arName: string; enName: string }
  ): boolean => {
    // Step 1: Patient MUST match target date first
    const matchesDate = isPatientMatchingDate(patient, dayObj);
    if (!matchesDate) return false;

    // Step 2: Patient MUST strictly match target clinic for this date
    const patientClinic = getPatientClinicRoomForDate(patient, dayObj.targetDate);
    const patientClinicKey = normalizeClinicKey(patientClinic);
    const targetClinicKey = normalizeClinicKey(targetClinic);

    return patientClinicKey === targetClinicKey;
  };

  const todayDayObj = useMemo(() => {
    return weekDaysWithDates.find((d) => d.isToday) || weekDaysWithDates[0];
  }, [weekDaysWithDates]);

  // Preserve inClinic patients at top, then notInClinic patients
  const displayedQueuePatients = useMemo(() => {
    const filtered = (patients || []).filter((p) => {
      const patientClinicKey = normalizeClinicKey(p.attendingClinic || 'Clinic 1');
      const activeClinicKey = normalizeClinicKey(effectiveClinic);

      if (p.inClinic && patientClinicKey === activeClinicKey) {
        return true;
      }
      return isPatientMatchingClinicAndDate(p, effectiveClinic, todayDayObj);
    });

    const inClinicList = filtered
      .filter((p) => p.inClinic)
      .sort((a, b) => {
        const timeA = a.inClinicTimestamp || 0;
        const timeB = b.inClinicTimestamp || 0;
        if (timeA !== timeB) return timeA - timeB;
        return (a.inClinicOrder || 0) - (b.inClinicOrder || 0);
      });

    const notInClinicList = filtered.filter((p) => !p.inClinic);

    return [...inClinicList, ...notInClinicList];
  }, [patients, effectiveClinic, todayDayObj]);

  const activeQueuePatients = useMemo(() => {
    return displayedQueuePatients.filter((p) => !finishedIds.includes(p.id));
  }, [displayedQueuePatients, finishedIds]);

  const completedQueuePatients = useMemo(() => {
    return displayedQueuePatients.filter((p) => finishedIds.includes(p.id));
  }, [displayedQueuePatients, finishedIds]);

  const selectedDayPatients = useMemo(() => {
    if (selectedDayKey === 'all') return [];

    const selectedDayObj = weekDaysWithDates.find((d) => d.key === selectedDayKey);
    if (!selectedDayObj) return [];

    return patients.filter((p) => isPatientMatchingClinicAndDate(p, effectiveClinic, selectedDayObj));
  }, [patients, effectiveClinic, selectedDayKey, weekDaysWithDates]);

  const dayCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    weekDaysWithDates.forEach((d) => {
      counts[d.key] = patients.filter((p) => isPatientMatchingClinicAndDate(p, effectiveClinic, d)).length;
    });

    return counts;
  }, [patients, effectiveClinic, weekDaysWithDates]);

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200 transition-colors">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t('welcome_back')}, {currentDoctorName}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {t('clinical_overview')} • {currentSpecialty} • <strong className="text-[#006194] dark:text-[#00a3e0]">{effectiveClinic.replace(/Clinic\s*(\d+)/i, 'العيادة $1')}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {onScheduleVisit && (
            <button
              onClick={() => onScheduleVisit()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
              id="dashboard-schedule-visit-btn"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
              <span>{t('schedule_next_visit')}</span>
            </button>
          )}

          {onAddPatient && (
            <button
              onClick={isSelectedDayToday ? onAddPatient : undefined}
              disabled={!isSelectedDayToday}
              title={isSelectedDayToday ? '' : (isRTL ? 'لا يمكن إضافة مريض إلا في اليوم الحالي' : 'Can only add patients for today')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 ${
                isSelectedDayToday
                  ? 'bg-[#006194] hover:bg-[#004b73] text-white cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
              }`}
              id="dashboard-register-patient-btn"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>{t('new_patient')}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Grid: Patient Queue (8 cols) + Clinic Operatories (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Queue & Management (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 p-6 shadow-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0]">format_list_numbered</span>
                    <span>{t('appointment_queue')}</span>
                  </h2>
                  {displayedQueuePatients.filter(p => p.inClinic).length > 0 && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>{displayedQueuePatients.filter(p => p.inClinic).length} {t('in_clinic')}</span>
                    </span>
                  )}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    {finishedIds.filter(id => displayedQueuePatients.some(p => p.id === id)).length}/{displayedQueuePatients.length} {t('finished')}
                  </span>
                </div>
              </div>
            </div>

            {/* 7 Days Weekday Filter Buttons (السبت -> الجمعة) Spanning Full Width */}
            <div className="pt-2">
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 w-full">
                {weekDaysWithDates.map((day) => {
                  const count = dayCounts[day.key] || 0;
                  const isSelected = selectedDayKey === day.key;

                  return (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => setSelectedDayKey(day.key)}
                      className={`px-1 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border cursor-pointer w-full ${isSelected
                        ? 'bg-[#006194] text-white border-[#006194] shadow-xs'
                        : day.isToday
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#006194]'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span>{isRTL ? day.arName : day.enName}</span>
                        {day.isToday && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500 animate-ping'}`} />
                        )}
                      </div>
                      <span className={`text-[9px] sm:text-[10px] font-mono opacity-75`}>
                        {day.dateDisplay}
                      </span>
                      {count > 0 && (
                        <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-1.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-900 text-[#006194] dark:text-blue-200'}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Clinic Queue Header Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#006194] text-white text-xs font-bold shadow-2xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">medical_services</span>
              <span>{isRTL ? `طابور ${effectiveClinic.replace(/Clinic\s*(\d+)/i, 'العيادة $1')}` : `${effectiveClinic} Queue`}</span>
            </span>
          </div>

          <div className="space-y-3">
            {selectedDayKey !== 'all' && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-blue-50/70 dark:bg-blue-950/40 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/50 mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006194] dark:text-blue-400 text-lg">calendar_month</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isRTL
                      ? `مواعيد يوم ${weekDaysWithDates.find(d => d.key === selectedDayKey)?.arName} (${weekDaysWithDates.find(d => d.key === selectedDayKey)?.dateDisplay})`
                      : `Appointments for ${weekDaysWithDates.find(d => d.key === selectedDayKey)?.enName} (${weekDaysWithDates.find(d => d.key === selectedDayKey)?.dateDisplay})`}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#006194] text-white">
                    {selectedDayPatients.length}
                  </span>
                </div>
                {onScheduleVisit && (
                  <button
                    type="button"
                    onClick={() => onScheduleVisit(undefined, weekDaysWithDates.find(d => d.key === selectedDayKey)?.targetDate)}
                    className="inline-flex items-center gap-1.5 bg-[#006194] hover:bg-[#004b73] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs cursor-pointer shadow-2xs transition-all active:scale-95 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                    <span>{isRTL ? "إضافة موعد جديد لهذا اليوم" : "Schedule New Appointment"}</span>
                  </button>
                )}
              </div>
            )}

            {isSelectedDayToday ? (
              /* ─── TODAY: Full live queue with in-clinic toggle, mark done, completed accordion ─── */
              activeQueuePatients.length === 0 && completedQueuePatients.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs space-y-3">
                  <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-500">event_busy</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {isRTL ? 'لا توجد مواعيد لليوم في هذه العيادة.' : 'No appointments for today in this clinic.'}
                  </p>
                </div>
              ) : (
                <>
                  {activeQueuePatients.map((p, idx) => {
                    const countdown = getAppointmentCountdown(p.nextVisit, p.nextVisitTime);

                    return (
                      <div
                        key={p.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col xl:flex-row xl:items-center justify-between gap-4 ${p.inClinic
                          ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-[#006194] dark:hover:border-slate-700'
                          }`}
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          {/* Index Number Badge */}
                          <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 shrink-0">
                            <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                              #{idx + 1}
                            </span>
                          </div>

                          {/* Patient Avatar with In-Clinic Beacon */}
                          <div className="relative shrink-0">
                            {p.avatar ? (
                              <img src={p.avatar} alt={p.name} className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs" />
                            ) : (
                              <div className={`w-11 h-11 rounded-2xl font-bold text-xs flex items-center justify-center shadow-2xs ${p.inClinic
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                : 'bg-[#dae2fd] text-[#006194] dark:bg-blue-950 dark:text-blue-300'
                                }`}>
                                {p.initials}
                              </div>
                            )}
                            {p.inClinic && (
                              <span
                                className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 ring-2 ring-emerald-400/50 flex items-center justify-center"
                                title={t('in_clinic_active')}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                              </span>
                            )}
                          </div>

                          {/* Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-headline font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                {p.name}
                              </span>
                              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">#{p.id}</span>

                              {p.inClinic && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  <span>{t('in_clinic')}</span>
                                  {p.inClinicTime && <span className="text-[10px] font-normal opacity-80">({p.inClinicTime})</span>}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400 mt-1">
                              <span>{p.treatmentType || (isRTL ? 'كشف ومتابعة دورية' : 'Routine Consultation')} • {isRTL ? `العمر ${p.age} سنة` : `Age ${p.age}`}</span>
                              <span className="inline-flex items-center gap-1 font-bold text-[#006194] dark:text-[#00a3e0] bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/50">
                                <span className="material-symbols-outlined text-[13px]">location_on</span>
                                <span>{isRTL ? getPatientClinicRoomForDate(p, todayDayObj.targetDate).replace(/Clinic\s*(\d+)/i, 'العيادة $1') : getPatientClinicRoomForDate(p, todayDayObj.targetDate)}</span>
                                <span className="material-symbols-outlined text-[13px] ms-1">event</span>
                                <span>{p.nextVisit}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions Toolbar */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-start xl:self-center shrink-0 w-full xl:w-auto pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-100 dark:border-slate-800">
                          {/* 1. In Clinic Toggle Button */}
                          <button
                            type="button"
                            onClick={(e) => handleInClinicToggle(p.id, e)}
                            className={`flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 shrink-0 ${p.inClinic
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600'
                              : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700'
                              }`}
                            title={p.inClinic ? t('in_clinic_active') : t('toggle_in_clinic')}
                          >
                            <span className={`material-symbols-outlined text-[16px] ${p.inClinic ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                              {p.inClinic ? 'check_circle' : 'pin_drop'}
                            </span>
                            <span>{p.inClinic ? t('in_clinic') : t('toggle_in_clinic')}</span>
                          </button>

                          {/* 2. Schedule Visit Button */}
                          {onScheduleVisit && (
                            <button
                              type="button"
                              onClick={() => onScheduleVisit(p)}
                              className="flex-1 sm:flex-none px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#006194] dark:text-[#00a3e0] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-blue-100 dark:border-slate-700 active:scale-95 shrink-0"
                              title={t('schedule_visit')}
                            >
                              <span className="material-symbols-outlined text-[15px]">calendar_month</span>
                              <span>{t('schedule_visit')}</span>
                            </button>
                          )}

                          {/* 3. Open Chart Button */}
                          <button
                            type="button"
                            onClick={() => onSelectPatient(p)}
                            className="flex-1 sm:flex-none px-3.5 py-2 bg-[#006194] hover:bg-[#004b73] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                            title={t('open_patient_chart')}
                          >
                            <span className="material-symbols-outlined text-[15px]">folder_shared</span>
                            <span>{t('open_chart')}</span>
                          </button>

                          {/* 4. Mark as Finished Option */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleFinished(p.id, e)}
                            className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
                            title={t('mark_patient_done')}
                          >
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span>{t('mark_patient_done')}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )
            ) : (
              /* Specific Day Filter Mode (Other Days) */
              selectedDayPatients.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs space-y-3">
                  <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-500">event_busy</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {isRTL
                      ? `لا توجد مواعيد مسجلة ليوم (${weekDaysWithDates.find(d => d.key === selectedDayKey)?.arName}) الموافق (${weekDaysWithDates.find(d => d.key === selectedDayKey)?.dateDisplay}).`
                      : `No registered appointments for ${weekDaysWithDates.find(d => d.key === selectedDayKey)?.enName} (${weekDaysWithDates.find(d => d.key === selectedDayKey)?.dateDisplay}).`}
                  </p>
                </div>
              ) : (
                selectedDayPatients.map((p, idx) => {
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-all flex flex-col xl:flex-row xl:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        {/* Index Number Badge */}
                        <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 shrink-0">
                          <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Patient Avatar */}
                        <div className="relative shrink-0">
                          {p.avatar ? (
                            <img src={p.avatar} alt={p.name} className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs" />
                          ) : (
                            <div className="w-11 h-11 rounded-2xl font-bold text-xs flex items-center justify-center shadow-2xs bg-[#dae2fd] text-[#006194] dark:bg-blue-950 dark:text-blue-300">
                              {p.initials}
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-headline font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">#{p.id}</span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span>{p.treatmentType || (isRTL ? 'كشف ومتابعة دورية' : 'Routine Consultation')} • {isRTL ? `العمر ${p.age} سنة` : `Age ${p.age}`}</span>
                            <span className="inline-flex items-center gap-1 font-bold text-[#006194] dark:text-[#00a3e0] bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/50">
                              <span className="material-symbols-outlined text-[13px]">location_on</span>
                              <span>{isRTL ? getPatientClinicRoomForDate(p, weekDaysWithDates.find(d => d.key === selectedDayKey)?.targetDate).replace(/Clinic\s*(\d+)/i, 'العيادة $1') : getPatientClinicRoomForDate(p, weekDaysWithDates.find(d => d.key === selectedDayKey)?.targetDate)}</span>
                              <span className="material-symbols-outlined text-[13px] ms-1">event</span>
                              <span>{p.nextVisit}</span>
                              {p.nextVisitTime && <span>({p.nextVisitTime})</span>}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions Toolbar for Specific Selected Day: ONLY "فتح الملف" and "تحديد ميعاد" */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-start xl:self-center shrink-0 w-full xl:w-auto pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-100 dark:border-slate-800">
                        {/* 1. Schedule Visit Button */}
                        {onScheduleVisit && (
                          <button
                            type="button"
                            onClick={() => onScheduleVisit(p, weekDaysWithDates.find(d => d.key === selectedDayKey)?.targetDate)}
                            className="flex-1 sm:flex-none px-3.5 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#006194] dark:text-[#00a3e0] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-blue-100 dark:border-slate-700 active:scale-95 shrink-0"
                            title={isRTL ? "تحديد موعد جديد" : "Schedule Visit"}
                          >
                            <span className="material-symbols-outlined text-[15px]">calendar_month</span>
                            <span>{isRTL ? "تحديد ميعاد" : "Schedule Visit"}</span>
                          </button>
                        )}

                        {/* 2. Open Chart Button */}
                        <button
                          type="button"
                          onClick={() => onSelectPatient(p)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-[#006194] hover:bg-[#004b73] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                          title={t('open_patient_chart')}
                        >
                          <span className="material-symbols-outlined text-[15px]">folder_shared</span>
                          <span>{t('open_chart')}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            )}

            {/* Collapsible Accordion List for Completed Patients (تم الانتهاء منهم) */}
            {completedQueuePatients.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsCompletedOpen(!isCompletedOpen)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-bold text-xs cursor-pointer hover:bg-emerald-100/60 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400">task_alt</span>
                    <span>{isRTL ? "قائمة المرضى المكتملين (تم الانتهاء)" : "Completed Patients Queue"}</span>
                    <span className="bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold">
                      {completedQueuePatients.length}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[20px] text-emerald-700 dark:text-emerald-400 transition-transform duration-200" style={{ transform: isCompletedOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    expand_more
                  </span>
                </button>

                {isCompletedOpen && (
                  <div className="space-y-3 pt-1">
                    {completedQueuePatients.map((p, idx) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 opacity-90 transition-all flex flex-col xl:flex-row xl:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className="flex flex-col items-center justify-center bg-emerald-100/70 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-xl px-2.5 py-1.5 shrink-0">
                            <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                              #{idx + 1}
                            </span>
                          </div>

                          <div className="relative shrink-0">
                            {p.avatar ? (
                              <img src={p.avatar} alt={p.name} className="w-11 h-11 rounded-2xl object-cover border border-emerald-200 dark:border-emerald-800 shadow-2xs" />
                            ) : (
                              <div className="w-11 h-11 rounded-2xl font-bold text-xs flex items-center justify-center shadow-2xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                {p.initials}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-headline font-bold text-sm sm:text-base text-slate-600 dark:text-slate-400 line-through">
                                {p.name}
                              </span>
                              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">#{p.id}</span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <span className="material-symbols-outlined text-[12px]">done_all</span>
                                <span>{t('finished')}</span>
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {p.treatmentType || (isRTL ? 'كشف ومتابعة دورية' : 'Routine Consultation')} • {isRTL ? `العمر ${p.age} سنة` : `Age ${p.age}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start xl:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => onSelectPatient(p)}
                            className="px-3.5 py-2 bg-[#006194] hover:bg-[#004b73] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[15px]">folder_shared</span>
                            <span>{t('open_chart')}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleToggleFinished(p.id, e)}
                            className="px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[16px]">undo</span>
                            <span>{t('undo')}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Clinic Status Quick View (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white">{t('clinic_status')}</h2>
              <button
                onClick={() => onNavigate('doctor-clinics')}
                className="text-xs text-[#006194] dark:text-[#00a3e0] font-semibold hover:underline cursor-pointer"
              >
                {t('manage')}
              </button>
            </div>

            <div className="space-y-3">
              {clinics.map((room) => {
                const isCurrentDoctorRoom = Boolean(
                  room.status === 'occupied' &&
                  room.doctorName &&
                  (
                    room.doctorName === doctorProfile?.name ||
                    room.doctorName === 'Dr. Ahmed' ||
                    room.doctorName === 'Dr. Ahmed Al-Sayed' ||
                    (doctorProfile?.assignedClinic && room.name.toLowerCase() === doctorProfile.assignedClinic.toLowerCase())
                  )
                );

                const isOccupiedByOther = Boolean(
                  room.status === 'occupied' &&
                  room.doctorName &&
                  !isCurrentDoctorRoom
                );

                return (
                  <div
                    key={room.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${isCurrentDoctorRoom
                      ? 'border-[#006194] dark:border-[#00a3e0] bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-[#006194]/20'
                      : isOccupiedByOther
                        ? 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 opacity-90'
                        : 'border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/60'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {room.doctorAvatar ? (
                        <img src={room.doctorAvatar} alt={room.name} className="w-8 h-8 rounded-full object-cover border dark:border-slate-700 shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                          <span className="material-symbols-outlined text-[16px]">
                            {isOccupiedByOther ? 'person' : 'meeting_room'}
                          </span>
                        </div>
                      )}
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{room.name}</p>
                          {isCurrentDoctorRoom && (
                            <span className="text-[10px] bg-[#006194] text-white px-1.5 py-0.5 rounded-md font-bold shrink-0">
                              {isRTL ? 'عيادتك الحالية' : 'Active'}
                            </span>
                          )}
                          {isOccupiedByOther && (
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-md font-semibold shrink-0">
                              {isRTL ? 'مشغولة' : 'Occupied'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {isCurrentDoctorRoom
                            ? (isRTL ? 'جاهز لاستقبال الكشوفات' : 'Ready for patients')
                            : room.doctorName
                              ? `${room.doctorName}`
                              : (isRTL ? 'متاحة للانتقال' : 'Available for check-in')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isCurrentDoctorRoom ? (
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" title={isRTL ? 'عيادة نشطة' : 'Active'}></span>
                          {onVacateDoctor && (
                            <button
                              type="button"
                              onClick={() => onVacateDoctor(room.id)}
                              className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/70 px-2 py-1 rounded-lg transition-all cursor-pointer active:scale-95 flex items-center gap-1 shadow-2xs"
                              title={isRTL ? `مغادرة ${room.name}` : `Leave ${room.name}`}
                            >
                              <span className="material-symbols-outlined text-[13px]">logout</span>
                              <span>{isRTL ? 'مغادرة' : 'Leave'}</span>
                            </button>
                          )}
                        </div>
                      ) : isOccupiedByOther ? (
                        <div
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 text-[11px] font-medium border border-slate-200 dark:border-slate-700 cursor-not-allowed select-none"
                          title={isRTL ? `مشغولة بواسطة ${room.doctorName} (لا يمكن الانتقال)` : `Occupied by ${room.doctorName} (Cannot move)`}
                        >
                          <span className="material-symbols-outlined text-[14px]">lock</span>
                          <span className="hidden sm:inline">{isRTL ? 'مشغولة' : 'Occupied'}</span>
                        </div>
                      ) : onAssignDoctor ? (
                        <button
                          type="button"
                          onClick={() => onAssignDoctor(room.id)}
                          className="text-[11px] font-bold text-[#006194] dark:text-[#00a3e0] bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-[#006194]/30 dark:border-[#00a3e0]/30 hover:border-[#006194] px-2.5 py-1 rounded-lg transition-colors cursor-pointer active:scale-95 shadow-2xs"
                          title={isRTL ? `الانتقال إلى ${room.name}` : `Move to ${room.name}`}
                        >
                          {isRTL ? 'انتقال هنا' : 'Move Here'}
                        </button>
                      ) : (
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${room.status === 'occupied' ? 'bg-[#10b981]' : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                        ></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <p className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
              <span className="material-symbols-outlined text-[16px] text-[#006194] dark:text-[#00a3e0]">info</span>
              <span>{isRTL ? 'يتم تحديث وحفظ بيانات الطابور بشكل فوري وتلقائي.' : 'Patient queue automatically persists and updates in real-time.'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Visit History Section (سجل الزيارات والكشوفات) */}
      {(() => {
        const allVisits = patients.flatMap((p) =>
          p.visits.map((v) => ({
            ...v,
            patient: p
          }))
        );

        const filteredVisits = allVisits.filter((v) => {
          if (visitFilter === 'Completed') return v.status === 'completed';
          if (visitFilter === 'Scheduled') return v.status === 'scheduled';
          return true;
        });

        return (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <div>
                <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0]">history</span>
                  <span>{t('visits_and_schedule')}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isRTL ? 'مراجعة كشوفات المرضى السابقة، المواعيد المحجوزة، وحذف أي سجل غير مطلوب' : 'Review historical patient treatments, upcoming bookings, or remove unwanted records'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                  {(['All', 'Completed', 'Scheduled'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setVisitFilter(tab)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${visitFilter === tab
                        ? 'bg-white dark:bg-slate-700 text-[#006194] dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      {tab === 'All' ? (isRTL ? 'الكل' : 'All') : tab === 'Completed' ? (isRTL ? 'المكتملة' : 'Completed') : (isRTL ? 'المجدولة' : 'Scheduled')}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate('doctor-visits')}
                  className="text-xs text-[#006194] dark:text-[#00a3e0] font-semibold hover:underline px-2 cursor-pointer flex items-center gap-0.5"
                >
                  <span>{t('view_all')}</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVisits.slice(0, 8).map((visit) => (
                <div
                  key={visit.id}
                  className="py-3.5 px-2 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-2xl transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#dae2fd] dark:bg-blue-950 text-[#006194] dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {visit.patient.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{visit.patient.name}</span>
                        <span className="text-xs font-bold text-[#006194] dark:text-[#00a3e0] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">
                          {visit.date}
                        </span>
                        {visit.clinicRoom && (
                          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {visit.clinicRoom}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${visit.status === 'completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : 'bg-blue-50 dark:bg-blue-950 text-[#006194] dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            }`}
                        >
                          {visit.status === 'completed' ? (isRTL ? 'تمت بنجاح' : 'Completed') : (isRTL ? 'مجدولة' : 'Scheduled')}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{visit.procedure}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {visit.notes || (isRTL ? 'كشف دوري ومتابعة سريرية.' : 'Routine consultation and dental evaluation.')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => onSelectPatient(visit.patient)}
                      className="px-3 py-1.5 border border-[#006194] dark:border-blue-500 text-[#006194] dark:text-[#00a3e0] hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
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
                        title={isRTL ? 'مسح سجل الزيارة' : 'Delete visit'}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredVisits.length === 0 && (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600 mb-1">event_busy</span>
                  <p className="font-bold text-xs text-slate-600 dark:text-slate-400">{t('no_visits_recorded')}</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Delete Confirmation Modal */}
      {visitToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 mx-auto border border-red-100">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-slate-900 text-center mb-1">
              {t('delete_visit_title')}
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4 leading-relaxed">
              {isRTL
                ? `هل أنت متأكد من رغبتك في حذف زيارة المريض ${visitToDelete.patientName} (${visitToDelete.procedure})؟`
                : `Are you sure you want to permanently delete the visit for ${visitToDelete.patientName} (${visitToDelete.procedure})?`}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVisitToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
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
