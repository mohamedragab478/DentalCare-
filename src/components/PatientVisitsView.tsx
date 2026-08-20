import React, { useState } from 'react';
import { Patient } from '../types';

interface PatientVisitsViewProps {
  patient: Patient;
  onBookAppointment: () => void;
}

export const PatientVisitsView: React.FC<PatientVisitsViewProps> = ({
  patient,
  onBookAppointment
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'scheduled'>('all');

  const filteredVisits = patient.visits.filter((v) => {
    if (filter === 'completed') return v.status === 'completed';
    if (filter === 'scheduled') return v.status === 'scheduled';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#006194] text-2xl">event_note</span>
            <h1 className="font-headline font-bold text-2xl text-slate-900">My Appointments & History</h1>
          </div>
          <p className="text-slate-500 text-sm">
            Keep track of your scheduled consultations, procedure receipts, and past dental clinical records.
          </p>
        </div>

        <button
          onClick={onBookAppointment}
          className="bg-[#006194] hover:bg-[#004b73] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Book New Visit</span>
        </button>
      </div>

      {/* Visits List */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Consultations ({filteredVisits.length})
          </span>
          <div className="flex gap-2 text-xs">
            {(['all', 'completed', 'scheduled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                  filter === tab
                    ? 'bg-[#006194] text-white shadow-2xs font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredVisits.length > 0 ? (
            filteredVisits.map((visit) => (
              <div
                key={visit.id}
                className="p-6 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#006194] flex flex-col items-center justify-center shrink-0 border border-blue-100">
                    <span className="material-symbols-outlined text-[22px]">stethoscope</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-headline font-bold text-base text-slate-900">{visit.procedure}</span>
                      <span className="text-xs font-semibold text-[#006194] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                        {visit.date}
                      </span>
                      {visit.clinicRoom && (
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {visit.clinicRoom}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Attending: {visit.doctorName}</p>
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {visit.notes}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                  {visit.cost && (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Fee</span>
                      <span className="font-bold text-slate-900 text-sm">${visit.cost}</span>
                    </div>
                  )}
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      visit.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-[#006194] border border-blue-200'
                    }`}
                  >
                    {visit.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">calendar_today</span>
              <p className="text-sm font-medium">No visits found under this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
