import React, { useState } from 'react';
import { ClinicRoom } from '../types';

interface ClinicStatusViewProps {
  clinics: ClinicRoom[];
  onToggleStatus: (roomId: number) => void;
}

export const ClinicStatusView: React.FC<ClinicStatusViewProps> = ({
  clinics,
  onToggleStatus
}) => {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl text-slate-900">Clinic Status</h1>
          <p className="text-slate-500 text-sm mt-1">Live overview of dental operatory rooms, assigned doctors, and patient occupancy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clinics.map((room) => (
          <div
            key={room.id}
            className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
              room.status === 'occupied'
                ? 'border-[#006194]/40 ring-1 ring-[#006194]/20'
                : 'border-slate-200'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="font-headline font-bold text-xl text-slate-900">{room.name}</span>
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
                  {room.status === 'occupied' ? 'Occupied' : 'Available'}
                </span>
              </div>

              {/* Doctor details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Assigned Attending
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
                      {room.doctorName || 'Unassigned'}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {room.doctorSpecialty || 'General Suite'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Patient */}
              {room.currentPatient && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs mb-4">
                  <span className="text-slate-500 font-medium">In Chair: </span>
                  <span className="font-bold text-[#006194]">{room.currentPatient}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => onToggleStatus(room.id)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors border ${
                room.status === 'occupied'
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-[#006194] hover:bg-[#004b73] text-white border-[#006194]'
              }`}
            >
              {room.status === 'occupied' ? 'Mark Available' : 'Assign to Dr. Ahmed'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
