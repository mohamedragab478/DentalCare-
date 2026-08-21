import React, { useState } from 'react';
import { Patient } from '../types';

interface VisitsViewProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNewConsultation: () => void;
  onDeleteVisit?: (patientId: string, visitId: string) => void;
}

export const VisitsView: React.FC<VisitsViewProps> = ({
  patients,
  onSelectPatient,
  onNewConsultation,
  onDeleteVisit
}) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visitToDelete, setVisitToDelete] = useState<{ patientId: string; visitId: string; patientName: string; procedure: string } | null>(null);

  // Extract all visits across patients
  const allVisits = patients.flatMap((p) =>
    p.visits.map((v) => ({
      ...v,
      patient: p
    }))
  );

  const filteredVisits = allVisits.filter((v) => {
    if (filterStatus === 'Completed' && v.status !== 'completed') return false;
    if (filterStatus === 'Scheduled' && v.status !== 'scheduled') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = v.patient.name.toLowerCase().includes(q);
      const matchId = v.patient.id.includes(q);
      const matchProc = v.procedure.toLowerCase().includes(q);
      const matchDoctor = (v.doctorName || '').toLowerCase().includes(q);
      const matchDate = v.date.toLowerCase().includes(q);
      return matchName || matchId || matchProc || matchDoctor || matchDate;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl text-slate-900 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#006194] text-3xl">calendar_month</span>
            <span>Visits & Clinical History</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse full patient consultations history, inspect details, and manage records
          </p>
        </div>

        <button
          onClick={onNewConsultation}
          className="bg-[#006194] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#004b73] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Schedule New Visit</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-2xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, ID, procedure, date..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#006194] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">Status:</span>
          {['All', 'Completed', 'Scheduled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === tab
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Visits List */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#006194]">history</span>
            <span>Recorded Consultations ({filteredVisits.length})</span>
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredVisits.map((visit) => (
            <div
              key={visit.id}
              className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#dae2fd] text-[#006194] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border border-blue-100">
                  {visit.patient.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-sm text-slate-900">{visit.patient.name}</span>
                    <span className="text-xs text-slate-400 font-mono">({visit.patient.id})</span>
                    <span className="text-xs font-bold text-[#006194] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-lg">
                      {visit.date}
                    </span>
                    {visit.clinicRoom && (
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                        {visit.clinicRoom}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{visit.procedure}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{visit.notes || 'Routine consultation and dental evaluation.'}</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-1.5">
                    <span>Doctor: {visit.doctorName || 'Dr. Ahmed'}</span>
                    {visit.cost && <span className="font-semibold text-slate-600">Fee: ${visit.cost}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    visit.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-blue-50 text-[#006194] border-blue-200'
                  }`}
                >
                  {visit.status === 'completed' ? 'Completed' : 'Scheduled'}
                </span>

                <button
                  onClick={() => onSelectPatient(visit.patient)}
                  className="px-3 py-1.5 border border-[#006194] text-[#006194] hover:bg-blue-50 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  View Chart
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
                    title="Delete this visit / مسح الزيارة"
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredVisits.length === 0 && (
            <div className="text-center py-16 px-4">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">event_busy</span>
              <p className="font-headline font-bold text-slate-700 text-sm">No visits found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>

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
