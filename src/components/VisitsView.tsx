import React, { useState } from 'react';
import { Patient } from '../types';

interface VisitsViewProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNewConsultation: () => void;
}

export const VisitsView: React.FC<VisitsViewProps> = ({
  patients,
  onSelectPatient,
  onNewConsultation
}) => {
  const [filterDate, setFilterDate] = useState('All');

  // Extract all visits across patients
  const allVisits = patients.flatMap((p) =>
    p.visits.map((v) => ({
      ...v,
      patient: p
    }))
  );

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl text-slate-900">Visits & Schedule</h1>
          <p className="text-slate-500 text-sm mt-1">Manage completed appointments and upcoming consultations</p>
        </div>

        <button
          onClick={onNewConsultation}
          className="bg-[#006194] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#004b73] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Schedule Visit</span>
        </button>
      </div>

      {/* Visits List */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">All Clinic Visits</span>
          <div className="flex gap-2 text-xs">
            {['All', 'Completed', 'Scheduled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterDate(tab)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterDate === tab ? 'bg-[#006194] text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {allVisits
            .filter((v) => {
              if (filterDate === 'Completed') return v.status === 'completed';
              if (filterDate === 'Scheduled') return v.status === 'scheduled';
              return true;
            })
            .map((visit) => (
              <div
                key={visit.id}
                className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#dae2fd] text-[#006194] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {visit.patient.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm text-slate-900">{visit.patient.name}</span>
                      <span className="text-xs text-slate-400 font-mono">({visit.patient.id})</span>
                      <span className="text-xs font-semibold text-[#006194] bg-blue-50 px-2 py-0.5 rounded">
                        {visit.date}
                      </span>
                      {visit.clinicRoom && (
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {visit.clinicRoom}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{visit.procedure}</p>
                    <p className="text-xs text-slate-500 mt-1">{visit.notes}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      visit.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-[#006194] border border-blue-200'
                    }`}
                  >
                    {visit.status === 'completed' ? 'Completed' : 'Scheduled'}
                  </span>
                  <button
                    onClick={() => onSelectPatient(visit.patient)}
                    className="px-3 py-1.5 border border-[#006194] text-[#006194] hover:bg-blue-50 rounded-lg text-xs font-semibold"
                  >
                    View Chart
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
