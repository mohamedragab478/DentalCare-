import React from 'react';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';
import { ClinicRoom, DoctorProfile } from '../types';

interface SelectClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorProfile?: DoctorProfile;
  clinics?: ClinicRoom[];
  onSelectClinic: (clinicName: string) => void;
}

export const SelectClinicModal: React.FC<SelectClinicModalProps> = ({
  isOpen,
  doctorProfile,
  clinics = [],
  onSelectClinic
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  if (!isOpen) return null;

  const doctorName = doctorProfile?.name || 'Dr. Ahmed';

  const defaultClinics = [
    { id: 1, name: 'Clinic 1', label: isRTL ? 'العيادة 1' : 'Clinic 1', desc: isRTL ? 'عيادة التركيبات والزراعة' : 'Prosthodontics Suite' },
    { id: 2, name: 'Clinic 2', label: isRTL ? 'العيادة 2' : 'Clinic 2', desc: isRTL ? 'عيادة التقويم والأطفال' : 'Orthodontics Suite' },
    { id: 3, name: 'Clinic 3', label: isRTL ? 'العيادة 3' : 'Clinic 3', desc: isRTL ? 'عيادة الجذور واللثة' : 'Endodontics Suite' },
    { id: 4, name: 'Clinic 4', label: isRTL ? 'العيادة 4' : 'Clinic 4', desc: isRTL ? 'عيادة الكشف العام والتجميل' : 'General Care Suite' }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      {/* Overlay modal container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white animate-in fade-in zoom-in-95 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950 text-[#006194] dark:text-[#00a3e0] rounded-2xl mx-auto flex items-center justify-center border border-blue-200 dark:border-blue-800">
            <span className="material-symbols-outlined text-3xl">medical_services</span>
          </div>

          <h2 className="font-headline font-bold text-2xl text-slate-900 dark:text-white">
            {isRTL ? `أهلاً بك، ${doctorName}` : `Welcome, ${doctorName}`}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isRTL ? "يرجى تحديد عيادة الكشف والعمل التي ستعمل بها اليوم لتخصيص طابور المرضى:" : "Please select your active clinical suite for today to load your room schedule:"}
          </p>
        </div>

        {/* Clinic Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {defaultClinics.map((c) => {
            const roomData = clinics.find((r) => r.id === c.id || r.name.toLowerCase() === c.name.toLowerCase());
            const isOccupied = roomData?.status === 'occupied' && roomData.doctorName && roomData.doctorName !== doctorName;

            return (
              <button
                key={c.id}
                type="button"
                disabled={isOccupied}
                onClick={() => onSelectClinic(c.name)}
                className={`p-4 rounded-2xl border transition-all text-start flex flex-col justify-between gap-3 cursor-pointer ${
                  isOccupied
                    ? 'opacity-50 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-not-allowed'
                    : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950 border-slate-200 dark:border-slate-700 hover:border-[#006194] dark:hover:border-[#00a3e0] active:scale-98'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-headline font-bold text-sm text-slate-900 dark:text-white">
                    {c.label}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#006194] dark:text-[#00a3e0]">
                    meeting_room
                  </span>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {c.desc}
                  </p>
                  {isOccupied && (
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block mt-1">
                      {isRTL ? `مشغولة بواسطة: ${roomData.doctorName}` : `Occupied by: ${roomData.doctorName}`}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onSelectClinic('Clinic 1')}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium cursor-pointer"
          >
            {isRTL ? "متابعة كطبيب متجول (بدون عيادة محددة)" : "Continue as roaming specialist"}
          </button>
        </div>
      </div>
    </div>
  );
};
