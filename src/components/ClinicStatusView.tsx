import React from 'react';
import { ClinicRoom } from '../types';

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
  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl text-slate-900">Operatory Clinic Status</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time management of operatory suites. Attending doctors are assigned to only one clinic at a time.
          </p>
        </div>

        {/* Current Doctor Active Room Badge */}
        <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl flex items-center gap-2.5 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#006194] animate-pulse"></span>
          <span className="text-slate-600 font-medium">Logged in as: <strong className="text-[#006194]">{currentDoctorName}</strong></span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">
            Current Room: <strong className="text-slate-900">{clinics.find(c => c.doctorName === currentDoctorName)?.name || 'None (Roaming)'}</strong>
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
              className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                isMyRoom
                  ? 'border-[#006194] ring-2 ring-[#006194]/20 shadow-md'
                  : isOtherDoctorRoom
                  ? 'border-slate-200 bg-slate-50/40'
                  : 'border-slate-200 hover:border-blue-200'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-headline font-bold text-xl text-slate-900 block">{room.name}</span>
                    {isMyRoom && (
                      <span className="text-[10px] font-bold text-[#006194] uppercase tracking-wider">
                        Your Assigned Operatory
                      </span>
                    )}
                  </div>

                  <span
                    className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                      room.status === 'occupied'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        room.status === 'occupied' ? 'bg-[#10b981] animate-pulse' : 'bg-slate-400'
                      }`}
                    ></span>
                    {room.status === 'occupied' ? 'In Use / Active' : 'Available'}
                  </span>
                </div>

                {/* Doctor details */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Attending Specialist
                  </span>
                  <div className="flex items-center gap-3">
                    {room.doctorAvatar ? (
                      <img
                        src={room.doctorAvatar}
                        alt={room.name}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">person_off</span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {room.doctorName || 'Available for Check-in'}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {room.doctorSpecialty || 'Open Operatory Suite'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Patient */}
                {room.currentPatient && (
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-medium block text-[10px] uppercase">Current Patient</span>
                      <span className="font-bold text-[#006194]">{room.currentPatient}</span>
                    </div>
                    <span className="material-symbols-outlined text-[#006194] text-[18px]">airline_seat_recline_extra</span>
                  </div>
                )}
              </div>

              {/* Action Button respecting user rules */}
              <div className="pt-2">
                {isMyRoom && (
                  <button
                    onClick={() => onVacateDoctor(room.id)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs transition-all bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Vacate & Mark Available</span>
                  </button>
                )}

                {isAvailable && (
                  <button
                    onClick={() => onAssignDoctor(room.id)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs transition-all bg-[#006194] hover:bg-[#004b73] text-white border border-[#006194] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                    <span>Check-In ({currentDoctorName})</span>
                  </button>
                )}

                {isOtherDoctorRoom && (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl font-bold text-xs transition-colors bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-1.5"
                    title="You cannot transfer or modify an operatory occupied by another doctor"
                  >
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>Occupied by {room.doctorName}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
