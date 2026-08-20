import React, { useState } from 'react';
import { Patient, ClinicRoom, DoctorProfile } from '../types';

interface DoctorDashboardProps {
  patients: Patient[];
  clinics: ClinicRoom[];
  doctorProfile?: DoctorProfile;
  completedPatientIds?: string[];
  onTogglePatientCompleted?: (patientId: string) => void;
  onSelectPatient: (patient: Patient) => void;
  onNavigate: (view: any) => void;
  onNewConsultation: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  patients,
  clinics,
  doctorProfile,
  completedPatientIds = [],
  onTogglePatientCompleted,
  onSelectPatient,
  onNavigate,
  onNewConsultation
}) => {
  const [internalCompletedIds, setInternalCompletedIds] = useState<string[]>(['849202']);
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

  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxTdB6BFCRDU6qr8N5YlyqcvvBqAlixK076_tUMWhheQjfjcVCtO0UBEY8sL1jYC9cucKVnoLoEgJlDKaSn0Qb5FJkx7v8MdhtOBjzCb8dHppP7IhiJllCOCEHHLwVXSrsa5mcVTHwz5OLt5nCjCSdaOMEjmqz6mQGAz0pZXk-7oBvgitx-9e-JaGvGW1CTaWYwwuVfl_PBgRvo3t6bQ1DMA1TZCepbWvSxDJrfFFqBCZE6ilABoY5eg';
  const currentAvatar = doctorProfile?.avatar || defaultAvatar;
  const currentDoctorName = doctorProfile?.name || 'Dr. Ahmed';
  const currentSpecialty = doctorProfile?.specialty || 'Prosthodontist & Implant Specialist';
  const currentClinicName = doctorProfile?.assignedClinic || 'Clinic 1';

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl text-slate-900">
            Good morning, {currentDoctorName}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Clinical Overview • {currentSpecialty} • {currentClinicName}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => onNavigate('doctor-settings')}
            className="w-10 h-10 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center text-slate-600 hover:text-[#006194] hover:border-[#006194] transition-colors relative shadow-2xs cursor-pointer"
            title="Clinic Settings"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>

          <div 
            onClick={() => onNavigate('doctor-settings')}
            className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#e2e8f0] shadow-2xs hover:border-[#006194] cursor-pointer transition-all"
          >
            <img
              src={currentAvatar}
              alt={currentDoctorName}
              className="w-8 h-8 rounded-full object-cover border border-[#e2e8f0]"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">{currentDoctorName}</span>
              <span className="text-[11px] text-slate-500 font-medium">{currentSpecialty}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Patients */}
        <div 
          onClick={() => onNavigate('doctor-patients')}
          className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-2xs hover:border-[#006194]/40 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#006194]">
              <span className="material-symbols-outlined text-[22px]">groups</span>
            </div>
            <span className="text-[#047857] bg-[#d1fae5] px-2 py-0.5 rounded-md text-[11px] font-bold">
              +2 New
            </span>
          </div>
          <h3 className="text-xs font-medium text-slate-500 mb-1">Today's Patients</h3>
          <p className="font-headline font-bold text-2xl text-slate-900 group-hover:text-[#006194] transition-colors">{patients.length}</p>
        </div>

        {/* Card 2: Completed Today */}
        <div 
          className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-2xs hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
            </div>
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px] font-bold">
              Queue Status
            </span>
          </div>
          <h3 className="text-xs font-medium text-slate-500 mb-1">Completed Today (تم الإنتهاء)</h3>
          <p className="font-headline font-bold text-2xl text-emerald-700">{finishedIds.length}</p>
        </div>

        {/* Card 3: Total Patients */}
        <div 
          onClick={() => onNavigate('doctor-patients')}
          className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-2xs hover:border-[#006194]/40 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-[#f1f4fa] flex items-center justify-center text-[#565e74]">
              <span className="material-symbols-outlined text-[22px]">medical_information</span>
            </div>
          </div>
          <h3 className="text-xs font-medium text-slate-500 mb-1">Total Patients</h3>
          <p className="font-headline font-bold text-2xl text-slate-900 group-hover:text-[#006194] transition-colors">1,420</p>
        </div>

        {/* Card 4: Current Clinic */}
        <div 
          onClick={() => onNavigate('doctor-clinics')}
          className="bg-white p-5 rounded-2xl border-2 border-[#006194] shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-[#007bb9] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[22px]">location_on</span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#10b981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span> On Duty
            </span>
          </div>
          <h3 className="text-xs font-medium text-slate-500 mb-1">Assigned Suite</h3>
          <p className="font-headline font-bold text-2xl text-[#006194]">{currentClinicName}</p>
        </div>
      </div>

      {/* Today's Queue & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Queue (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-5 gap-2">
            <div>
              <h2 className="font-headline font-bold text-lg text-slate-900 flex items-center gap-2">
                <span>Today's Appointment Queue</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {finishedIds.length}/{patients.slice(0, 5).length} Finished
                </span>
              </h2>
              <p className="text-xs text-slate-500">Scheduled consultations and procedures for {currentDoctorName}</p>
            </div>
            <button
              onClick={() => onNavigate('doctor-patients')}
              className="text-xs text-[#006194] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              View Full Directory
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="space-y-3">
            {patients.slice(0, 5).map((p, idx) => {
              const isFinished = finishedIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isFinished
                      ? 'border-emerald-200 bg-emerald-50/40 opacity-90'
                      : 'border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-[#006194]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover border" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center ${
                        isFinished ? 'bg-emerald-100 text-emerald-700' : 'bg-[#dae2fd] text-[#006194]'
                      }`}>
                        {p.initials}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${isFinished ? 'text-slate-700 line-through' : 'text-slate-900'}`}>
                          {p.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">#{p.id}</span>
                        {isFinished && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="material-symbols-outlined text-[12px]">done_all</span>
                            Finished (تم الإنتهاء)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.treatmentType || 'Routine Checkup'} • Age {p.age} • {p.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                      isFinished 
                        ? 'bg-emerald-100/70 text-emerald-800' 
                        : idx === 0 ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-blue-50 text-[#006194]'
                    }`}>
                      {isFinished ? 'Completed' : idx === 0 ? 'In Chair' : idx === 1 ? '11:00 AM' : idx === 2 ? '02:30 PM' : '04:15 PM'}
                    </span>

                    {/* Mark as Finished Option (User explicit request: "ف ال Today's Appointment Queue عايز اضيف اوبشن انى خلصت البيشنت دا") */}
                    <button
                      onClick={(e) => handleToggleFinished(p.id, e)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                        isFinished
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                      }`}
                      title={isFinished ? 'Reopen patient appointment' : 'Mark consultation as finished'}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isFinished ? 'undo' : 'check_circle'}
                      </span>
                      <span>{isFinished ? 'Undo' : 'خلصت البيشنت دا'}</span>
                    </button>

                    <button
                      onClick={() => onSelectPatient(p)}
                      className="px-3 py-1.5 bg-[#006194] text-white hover:bg-[#004b73] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Open Chart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinic Status Quick View (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <h2 className="font-headline font-bold text-lg text-slate-900">Clinic Rooms</h2>
              <button
                onClick={() => onNavigate('doctor-clinics')}
                className="text-xs text-[#006194] font-semibold hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {clinics.map((room) => (
                <div
                  key={room.id}
                  className="p-3 rounded-xl border border-slate-200 bg-[#f8fafc] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    {room.doctorAvatar ? (
                      <img src={room.doctorAvatar} alt={room.name} className="w-8 h-8 rounded-full object-cover border" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-[16px]">person_off</span>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-900">{room.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {room.doctorName ? `${room.doctorName}` : 'Available'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      room.status === 'occupied' ? 'bg-[#10b981]' : 'bg-slate-300'
                    }`}
                  ></span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onNewConsultation}
              className="w-full bg-[#006194] hover:bg-[#004b73] text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Start New Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
