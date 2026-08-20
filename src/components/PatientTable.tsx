import React, { useState, useMemo } from 'react';
import { Patient } from '../types';

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: () => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onSelectPatient,
  onAddPatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [lastVisitFilter, setLastVisitFilter] = useState('');
  const [treatmentFilter, setTreatmentFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTreatment = treatmentFilter === '' || p.treatmentType?.toLowerCase() === treatmentFilter.toLowerCase();
      
      return matchSearch && matchTreatment;
    });
  }, [patients, searchTerm, treatmentFilter]);

  const totalPatientsCount = 124; // Visual parity with mockup
  const displayedPatients = filteredPatients.slice((page - 1) * pageSize, page * pageSize);

  // Avatar background colors based on initials
  const getAvatarBg = (initials: string) => {
    switch (initials) {
      case 'JD':
        return 'bg-[#dae2fd] text-[#5c647a]';
      case 'AS':
        return 'bg-[#ffdcc0] text-[#2d1600]';
      case 'MJ':
        return 'bg-[#ffdad6] text-[#93000a]';
      case 'EW':
        return 'bg-[#dae2fd] text-[#5c647a]';
      case 'MA':
        return 'bg-[#cce5ff] text-[#004b73]';
      default:
        return 'bg-[#e2e8f0] text-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="font-headline font-bold text-3xl text-slate-900">Patients</h1>
        <button
          onClick={onAddPatient}
          className="bg-[#006194] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#004b73] transition-colors flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          id="add-patient-top-btn"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          <span>Add Patient</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 mb-4 flex flex-col md:flex-row gap-4 items-center shadow-xs">
        <div className="relative flex-grow w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, or patient ID"
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-[#e2e8f0] bg-white text-slate-800 focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194] text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <select
              value={lastVisitFilter}
              onChange={(e) => setLastVisitFilter(e.target.value)}
              className="w-full md:w-44 px-3.5 py-2.5 rounded-lg border border-[#e2e8f0] bg-white text-slate-700 text-sm focus:outline-none focus:border-[#006194] appearance-none pr-8 cursor-pointer"
            >
              <option value="">Last Visit (Any)</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 3 Months</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>

          <div className="relative w-full md:w-auto">
            <select
              value={treatmentFilter}
              onChange={(e) => setTreatmentFilter(e.target.value)}
              className="w-full md:w-48 px-3.5 py-2.5 rounded-lg border border-[#e2e8f0] bg-white text-slate-700 text-sm focus:outline-none focus:border-[#006194] appearance-none pr-8 cursor-pointer"
            >
              <option value="">Treatment Type (All)</option>
              <option value="cleaning">Cleaning</option>
              <option value="filling">Filling</option>
              <option value="extraction">Extraction</option>
              <option value="root-canal">Root Canal</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  NAME
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  PATIENT ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  AGE
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  PHONE
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  LAST VISIT
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  NEXT VISIT
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#e2e8f0]">
              {displayedPatients.map((patient, index) => {
                const isEven = index % 2 === 1;
                return (
                  <tr
                    key={patient.id}
                    className={`transition-colors hover:bg-blue-50/40 ${
                      isEven ? 'bg-[#f8fafc]/70' : 'bg-white'
                    }`}
                  >
                    {/* Name & Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {patient.avatar ? (
                          <img
                            src={patient.avatar}
                            alt={patient.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${getAvatarBg(
                              patient.initials
                            )}`}
                          >
                            {patient.initials}
                          </div>
                        )}
                        <span className="font-bold text-slate-900">{patient.name}</span>
                      </div>
                    </td>

                    {/* Patient ID */}
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {patient.id}
                    </td>

                    {/* Age */}
                    <td className="px-6 py-4 text-slate-800">
                      {patient.age}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-slate-800">
                      {patient.phone}
                    </td>

                    {/* Last Visit */}
                    <td className="px-6 py-4 text-slate-800">
                      {patient.lastVisit}
                    </td>

                    {/* Next Visit */}
                    <td className="px-6 py-4">
                      {patient.nextVisit ? (
                        <span className="text-[#006194] font-bold">
                          {patient.nextVisit}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Action button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onSelectPatient(patient)}
                        className="text-[#006194] hover:bg-[#dae2fd] hover:text-[#004b73] px-3.5 py-1.5 rounded-lg border border-[#006194] transition-all text-xs font-semibold cursor-pointer active:scale-95"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })}

              {displayedPatients.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No patients match the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#e2e8f0] flex justify-between items-center bg-white text-xs text-slate-500">
          <span>Showing 1 to {displayedPatients.length} of {totalPatientsCount} patients</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent"
              title="Previous Page"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="px-2 font-semibold text-slate-700">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-[#006194]"
              title="Next Page"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
