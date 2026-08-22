import React from 'react';
import { ClinicRoom } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface ClinicStatusViewProps {
  clinics: ClinicRoom[];
  onAssignDoctor: (roomId: number) => void;
  onVacateDoctor: (roomId: number) => void;
  currentDoctorName?: string;
}

export const ClinicStatusView: React.FC<ClinicStatusViewProps> = ({
  clinics,
  onAssignDoctor,
  onVacateDoctor,
  currentDoctorName = 'Dr. Ahmed'
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-12 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0] text-3xl">clinical_notes</span>
            <span>{t('clinic_status')}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {isRTL ? "متابعة وتسكين غرف وعيادات الأطباء الحالية والتواجد اللحظي" : "Real-time management of operatory suites. Attending doctors are assigned to only one clinic at a time."}
          </p>
        </div>

        {/* Current Doctor Active Room Badge */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 px-4 py-2 rounded-2xl flex items-center gap-2.5 text-xs shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#006194] dark:bg-[#00a3e0] animate-pulse"></span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {isRTL ? "المستخدم الحالي:" : "Logged in as:"} <strong className="text-[#006194] dark:text-[#00a3e0]">{currentDoctorName}</strong>
          </span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-slate-600 dark:text-slate-300">
            {isRTL ? "العيادة المسجلة:" : "Current Room:"} <strong className="text-slate-900 dark:text-white">{clinics.find(c => c.doctorName === currentDoctorName)?.name || (isRTL ? 'غير مسكن بغرفة' : 'None (Roaming)')}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clinics.map((room) => {
          const isMyRoom = room.doctorName === currentDoctorName;
          const isOtherDoctorRoom = room.status === 'occupied' && !isMyRoom;
          const isAvailable = room.status === 'available';

          return (
            <div
              key={room.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                isMyRoom
                  ? 'border-[#006194] dark:border-blue-500 ring-2 ring-[#006194]/20 shadow-md'
                  : isOtherDoctorRoom
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40'
                  : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-headline font-bold text-xl text-slate-900 dark:text-white block">{room.name}</span>
                    {isMyRoom && (
                      <span className="text-[10px] font-bold text-[#006194] dark:text-[#00a3e0] uppercase tracking-wider">
                        {isRTL ? "عيادتك المسجلة حالياً" : "Your Assigned Operatory"}
                      </span>
                    )}
                  </div>

                  <span
                    className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                      room.status === 'occupied'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        room.status === 'occupied' ? 'bg-[#10b981] animate-pulse' : 'bg-slate-400'
                      }`}
                    ></span>
                    {room.status === 'occupied' ? (isRTL ? 'مشغولة / نشطة' : 'In Use / Active') : (isRTL ? 'متاحة' : 'Available')}
                  </span>
                </div>

                {/* Doctor details */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    {isRTL ? "الطبيب المعالج" : "Attending Specialist"}
                  </span>
                  <div className="flex items-center gap-3">
                    {room.doctorAvatar ? (
                      <img
                        src={room.doctorAvatar}
                        alt={room.name}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">person_off</span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {room.doctorName || (isRTL ? 'متاح لتسكين طبيب' : 'Available for Check-in')}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {room.doctorSpecialty || (isRTL ? 'غرفة عمليات كشف' : 'Open Operatory Suite')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Patient */}
                {room.currentPatient && (
                  <div className="p-3 bg-blue-50/60 dark:bg-blue-950/60 rounded-2xl border border-blue-100 dark:border-blue-800 text-xs mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-medium block text-[10px] uppercase">
                        {isRTL ? "المريض الحالي:" : "Current Patient"}
                      </span>
                      <span className="font-bold text-[#006194] dark:text-[#00a3e0]">{room.currentPatient}</span>
                    </div>
                    <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0] text-[18px]">airline_seat_recline_extra</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isMyRoom && (
                  <button
                    onClick={() => onVacateDoctor(room.id)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs transition-all bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>{isRTL ? "مغادرة الغرفة وجعلها متاحة" : "Vacate & Mark Available"}</span>
                  </button>
                )}

                {isAvailable && (
                  <button
                    onClick={() => onAssignDoctor(room.id)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs transition-all bg-[#006194] hover:bg-[#004b73] text-white border border-[#006194] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                    <span>{isRTL ? `تسجيل حضور (${currentDoctorName})` : `Check-In (${currentDoctorName})`}</span>
                  </button>
                )}

                {isOtherDoctorRoom && (
                  <div className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-center text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>{isRTL ? `مشغولة بواسطة ${room.doctorName}` : `Occupied by ${room.doctorName}`}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
