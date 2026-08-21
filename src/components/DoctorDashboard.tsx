import React, { useState } from 'react';
import { Patient, ClinicRoom, DoctorProfile } from '../types';

interface DoctorDashboardProps {
  patients: Patient[];
  clinics: ClinicRoom[];
  doctorProfile?: DoctorProfile;
  completedPatientIds?: string[];
  onTogglePatientCompleted?: (patientId: string) => void;
  onReorderPatients?: (newOrder: Patient[]) => void;
  onDeleteVisit?: (patientId: string, visitId: string) => void;
  onSelectPatient: (patient: Patient) => void;
  onNavigate: (view: any) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  patients,
  clinics,
  doctorProfile,
  completedPatientIds = [],
  onTogglePatientCompleted,
  onReorderPatients,
  onDeleteVisit,
  onSelectPatient,
  onNavigate
}) => {
  const [internalCompletedIds, setInternalCompletedIds] = useState<string[]>(['849202']);
  const [visitFilter, setVisitFilter] = useState<'All' | 'Completed' | 'Scheduled'>('All');
  const [visitToDelete, setVisitToDelete] = useState<{ patientId: string; visitId: string; patientName: string; procedure: string } | null>(null);
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

  const handleMovePatient = (currentIndex: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onReorderPatients) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= patients.length) return;

    const updated = [...patients];
    const temp = updated[currentIndex];
    updated[currentIndex] = updated[targetIndex];
    updated[targetIndex] = temp;
    onReorderPatients(updated);
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
              Queue Total
            </span>
          </div>
          <h3 className="text-xs font-medium text-slate-500 mb-1">Queue Total (إجمالي الطابور)</h3>
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
          <h3 className="text-xs font-medium text-slate-500 mb-1">Completed (تم الإنتهاء)</h3>
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
          <h3 className="text-xs font-medium text-slate-500 mb-1">Patient Directory</h3>
          <p className="font-headline font-bold text-2xl text-slate-900 group-hover:text-[#006194] transition-colors">{patients.length} Active</p>
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

      {/* Today's Queue & Clinic Rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Queue with Reordering (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-5 gap-2">
            <div>
              <h2 className="font-headline font-bold text-lg text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006194]">format_list_numbered</span>
                <span>Today's Appointment Queue (طابور المواعيد)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {finishedIds.length}/{patients.length} Finished
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Patients are queued in order. Use ⬆ / ⬇ to reorder patient priority.
              </p>
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
            {patients.map((p, idx) => {
              const isFinished = finishedIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isFinished
                      ? 'border-emerald-200 bg-emerald-50/40 opacity-90'
                      : 'border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-[#006194]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Queue Position Reorder Controls */}
                    <div className="flex flex-col items-center justify-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
                      <button
                        onClick={(e) => handleMovePatient(idx, 'up', e)}
                        disabled={idx === 0}
                        title="Move Up in Queue / تقديم المريض"
                        className={`w-6 h-5 flex items-center justify-center rounded transition-colors ${
                          idx === 0
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-600 hover:bg-blue-50 hover:text-[#006194] cursor-pointer'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">expand_less</span>
                      </button>
                      <span className="text-[11px] font-mono font-bold text-slate-700 px-1">
                        #{idx + 1}
                      </span>
                      <button
                        onClick={(e) => handleMovePatient(idx, 'down', e)}
                        disabled={idx === patients.length - 1}
                        title="Move Down in Queue / تأخير المريض"
                        className={`w-6 h-5 flex items-center justify-center rounded transition-colors ${
                          idx === patients.length - 1
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-600 hover:bg-blue-50 hover:text-[#006194] cursor-pointer'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">expand_more</span>
                      </button>
                    </div>

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
                      <div className="flex items-center gap-2 flex-wrap">
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
                        {p.treatmentType || 'Routine Consultation'} • Age {p.age} ({p.gender}) • {p.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                      isFinished 
                        ? 'bg-emerald-100/70 text-emerald-800' 
                        : idx === 0 ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-blue-50 text-[#006194]'
                    }`}>
                      {isFinished ? 'Completed' : idx === 0 ? 'In Chair (حالياً)' : `Queue Pos #${idx + 1}`}
                    </span>

                    {/* Mark as Finished Option */}
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
              <h2 className="font-headline font-bold text-lg text-slate-900">Clinic Suites</h2>
              <button
                onClick={() => onNavigate('doctor-clinics')}
                className="text-xs text-[#006194] font-semibold hover:underline cursor-pointer"
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

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <p className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="material-symbols-outlined text-[16px] text-[#006194]">info</span>
              <span>Patient queue automatically persists and updates in real-time.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* Visit History Section (سجل الزيارات والكشوفات)         */}
      {/* ==================================================== */}
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
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4 mb-5">
              <div>
                <h2 className="font-headline font-bold text-lg text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006194]">history</span>
                  <span>Visit History (سجل الزيارات والكشوفات)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review historical patient treatments, upcoming bookings, or remove unwanted records
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs">
                  {(['All', 'Completed', 'Scheduled'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setVisitFilter(tab)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        visitFilter === tab
                          ? 'bg-white text-[#006194] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate('doctor-visits')}
                  className="text-xs text-[#006194] font-semibold hover:underline px-2 cursor-pointer flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredVisits.slice(0, 8).map((visit) => (
                <div
                  key={visit.id}
                  className="py-3.5 px-2 hover:bg-slate-50/80 rounded-xl transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#dae2fd] text-[#006194] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {visit.patient.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-bold text-sm text-slate-900">{visit.patient.name}</span>
                        <span className="text-xs font-bold text-[#006194] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {visit.date}
                        </span>
                        {visit.clinicRoom && (
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {visit.clinicRoom}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            visit.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-blue-50 text-[#006194] border-blue-200'
                          }`}
                        >
                          {visit.status === 'completed' ? 'Completed' : 'Scheduled'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">{visit.procedure}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{visit.notes || 'Routine consultation and dental evaluation.'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => onSelectPatient(visit.patient)}
                      className="px-3 py-1.5 border border-[#006194] text-[#006194] hover:bg-blue-50 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Open Chart
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
                        title="Delete visit / مسح الزيارة"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredVisits.length === 0 && (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-3xl text-slate-300 mb-1">event_busy</span>
                  <p className="font-bold text-xs text-slate-600">No visits recorded</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Delete Confirmation Modal */}
      {visitToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 mx-auto border border-red-100">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-slate-900 text-center mb-1">
              Delete Visit Record?
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4 leading-relaxed">
              Are you sure you want to permanently delete the visit for <span className="font-bold text-slate-800">{visitToDelete.patientName}</span> ({visitToDelete.procedure})?
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVisitToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel (إلغاء)
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
                <span>Yes, Delete (مسح)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
