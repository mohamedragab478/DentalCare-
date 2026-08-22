import React from 'react';
import { Patient, ClinicRoom, DoctorProfile } from '../types';
import { getAppointmentCountdown, formatDateArabic } from '../utils/dateUtils';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface PatientDashboardProps {
  patient: Patient;
  clinics: ClinicRoom[];
  doctorProfile?: DoctorProfile;
  onNavigate: (view: any) => void;
  onBookAppointment: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patient,
  clinics,
  doctorProfile,
  onNavigate,
  onBookAppointment
}) => {
  const { t, isRTL, lang } = useAppThemeLanguage();

  const patientPhoto = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcBfu0lQbF55ZlpF-oOUmfhzBpnALzuFKsbJpfhIQoVJEWk8cFegj9Pd1kxt2IjbvN61DObHNayvEDObTWPm1VSTTYFpveirbwOKQA51kr3d2aYWdsbIXufxAxUmWnOq4ePwc0SWucyAzwcNec59KGSGKvFzaDJ7sW9hTOWyjT6rBVevkHwfMeG3CSpNaWwaMRAh7FIU0WSqOLAm-XtB302wa5nZ5HoVPyajlHrjIrHd21t-eWEyLG9Q';

  const appointmentCountdown = getAppointmentCountdown(patient.nextVisit, patient.nextVisitTime);
  const nextVisitArabic = formatDateArabic(patient.nextVisit);

  const attendingDoctorName =
    doctorProfile?.name ||
    patient.attendingDoctor ||
    'Dr. Ahmed Al-Sayed';

  // Find the doctor's actual active room from clinics live roster or doctorProfile
  const doctorAssignedRoom = clinics.find(
    (c) =>
      (doctorProfile?.name && c.doctorName === doctorProfile.name) ||
      (attendingDoctorName && c.doctorName === attendingDoctorName)
  );

  const isDoctorInClinic = Boolean(doctorAssignedRoom?.name || doctorProfile?.assignedClinic);

  const attendingClinicName =
    doctorAssignedRoom?.name ||
    doctorProfile?.assignedClinic ||
    patient.attendingClinic ||
    (isRTL ? 'العيادة 1' : 'Clinic 1');

  const attendingClinicDisplay = isDoctorInClinic
    ? (isRTL ? attendingClinicName.replace(/Clinic\s*(\d+)/i, 'العيادة $1') : attendingClinicName)
    : (isRTL ? 'في انتظار تسكين العيادة (الطبيب في استراحة)' : 'Awaiting operatory (Doctor on break)');

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12 transition-colors">
      {/* Top Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            {t('welcome_back')}, {patient.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {t('patient_overview_subtitle')}
          </p>
        </div>

        <button
          onClick={onBookAppointment}
          className="bg-[#006194] hover:bg-[#004b73] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">event_available</span>
          <span>{t('my_appointments')}</span>
        </button>
      </div>

      {/* Main Grid: Profile Card + Next Appointment */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Card (4 cols) */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 p-6 shadow-xs flex flex-col items-center text-center">
          <div className="relative mb-4">
            {patient.avatar ? (
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 text-[#006194] dark:text-[#00a3e0] font-bold text-2xl flex items-center justify-center border-4 border-slate-50 dark:border-slate-800">
                {patient.initials || 'PT'}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#10b981] border-2 border-white dark:border-slate-900 rounded-full"></span>
          </div>

          <h2 className="font-headline font-bold text-xl text-slate-900 dark:text-white">{patient.name}</h2>
          <span className="bg-[#f1f4fa] dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-0.5 rounded-full text-xs font-mono font-bold mt-1 mb-5 border border-slate-200 dark:border-slate-700">
            #{patient.id}
          </span>

          <div className="w-full space-y-3 text-start text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{t('gender')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{patient.gender}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{t('age')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{patient.age} years</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{t('phone')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{patient.phone}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('patient-profile')}
            className="w-full mt-5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#006194] dark:text-[#00a3e0] border border-slate-200 dark:border-slate-700 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>{t('health_profile')}</span>
          </button>
        </div>

        {/* Next Appointment Hero Card (8 cols) with Live Countdown */}
        <div className="md:col-span-8 bg-linear-to-br from-[#006194] to-[#004b73] text-white rounded-3xl p-6 md:p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">event_available</span>
                  <span>{t('confirmed_appointment')}</span>
                </span>

                {/* Relative Days Countdown Pill Badge */}
                {appointmentCountdown.status !== 'none' && (
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs border ${
                      appointmentCountdown.isToday
                        ? 'bg-emerald-400 text-slate-900 border-emerald-300 font-extrabold animate-pulse'
                        : appointmentCountdown.isPast
                        ? 'bg-amber-400/90 text-amber-950 border-amber-300 font-extrabold'
                        : 'bg-white/25 text-white border-white/30 font-bold'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {appointmentCountdown.isToday
                        ? 'notifications_active'
                        : appointmentCountdown.isPast
                        ? 'history'
                        : 'hourglass_top'}
                    </span>
                    <span>{appointmentCountdown.badgeArabic}</span>
                    <span className="text-[10px] opacity-85 font-mono">({appointmentCountdown.badgeEnglish})</span>
                  </span>
                )}
              </div>

              {/* Quick status pill for remaining days */}
              {appointmentCountdown.status !== 'none' && (
                <span className="text-[11px] font-bold text-white bg-black/25 px-3 py-1 rounded-xl border border-white/15">
                  {appointmentCountdown.diffDays > 0 && `⏳ فاضل ${appointmentCountdown.diffDays} أيام على الموعد`}
                  {appointmentCountdown.diffDays === 0 && `🔔 موعدك اليوم!`}
                  {appointmentCountdown.diffDays < 0 && `⚠️ فات موعد الزيارة منذ ${Math.abs(appointmentCountdown.diffDays)} يوم`}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs text-blue-200 font-semibold block uppercase tracking-wider">
                {t('next_visit')}
              </span>
              <h3 className="font-headline font-bold text-2xl md:text-3xl text-white">
                {lang === 'ar' && nextVisitArabic ? nextVisitArabic : (patient.nextVisit || '28 Aug 2026')} 
                <span className="text-xl md:text-2xl font-normal opacity-90 mx-2">
                  {isRTL ? "في تمام" : "at"} {patient.nextVisitTime || '10:30 AM'}
                </span>
              </h3>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 text-blue-50 text-xs space-y-1.5 mt-4 max-w-xl">
              <p className="font-bold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-300">info</span>
                <span>{appointmentCountdown.descriptionArabic}</span>
              </p>
              <p className="text-[11px] text-blue-200 leading-relaxed">
                {isDoctorInClinic
                  ? (isRTL 
                      ? `كشف واستشارة ومتابعة مع ${attendingDoctorName} في ${attendingClinicDisplay}.`
                      : `Follow-up consultation & evaluation with ${attendingDoctorName} at ${attendingClinicName}.`)
                  : (isRTL
                      ? `طبيبك ${attendingDoctorName} في استراحة حالياً، وسيتم توجيهك لعيادته فور تسجيل دخوله.`
                      : `Your doctor ${attendingDoctorName} is currently on break, clinic room will be assigned shortly.`)}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[22px]">location_on</span>
              </div>
              <div>
                <p className="text-xs text-blue-200">{t('clinic')}</p>
                <p className="text-sm font-bold text-white">DentalCare Pro • {attendingClinicDisplay}</p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => alert(`Appointment on ${patient.nextVisit || '28 Aug 2026'} at ${patient.nextVisitTime || '10:30 AM'} added to your calendar.`)}
                className="bg-white text-[#006194] hover:bg-blue-50 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                {t('add_to_calendar')}
              </button>
              <button 
                onClick={onBookAppointment}
                className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 border border-white/20"
              >
                {t('reschedule')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Visit History (6 cols) & Clinic Status (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visit History Timeline */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 p-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
            <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white">{t('recent_visits')}</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Recent Records</span>
          </div>

          <div className="space-y-3">
            {patient.visits.map((visit) => (
              <div
                key={visit.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/60 hover:bg-blue-50/30 dark:hover:bg-slate-800 transition-all"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-xs font-bold text-[#006194] dark:text-[#00a3e0] bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">
                    {visit.date}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{visit.doctorName}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{visit.procedure}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{visit.notes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Clinic Status Cards */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 p-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
            <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white">{t('clinic_status')}</h3>
            <span className="text-xs text-[#10b981] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span> {isRTL ? "العيادات النشطة الآن" : "Live Roster"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clinics.map((room) => {
              const isOccupied = room.status === 'occupied';
              const roomNameDisplay = isRTL ? room.name.replace('Clinic', 'عيادة') : room.name;

              return (
                <div
                  key={room.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/60 flex flex-col justify-between gap-3 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-headline font-bold text-sm text-slate-900 dark:text-white">
                      {roomNameDisplay}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOccupied
                          ? 'bg-[#d1fae5] text-[#047857] dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isOccupied ? (isRTL ? 'في الخدمة' : 'In Session') : (isRTL ? 'متاحة' : 'Available')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {room.doctorAvatar ? (
                      <img
                        src={room.doctorAvatar}
                        alt={room.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                        <span className="material-symbols-outlined text-[18px]">meeting_room</span>
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {room.doctorName || (isRTL ? 'لا يوجد طبيب حالياً' : 'No doctor assigned')}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {room.doctorSpecialty || (isRTL ? 'كشف عام وطب أسنان' : 'General Dentistry')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
