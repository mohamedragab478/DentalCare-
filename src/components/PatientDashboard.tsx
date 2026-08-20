import React from 'react';
import { Patient, ClinicRoom } from '../types';

interface PatientDashboardProps {
  patient: Patient;
  clinics: ClinicRoom[];
  onNavigate: (view: any) => void;
  onBookAppointment: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patient,
  clinics,
  onNavigate,
  onBookAppointment
}) => {
  const patientPhoto = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcBfu0lQbF55ZlpF-oOUmfhzBpnALzuFKsbJpfhIQoVJEWk8cFegj9Pd1kxt2IjbvN61DObHNayvEDObTWPm1VSTTYFpveirbwOKQA51kr3d2aYWdsbIXufxAxUmWnOq4ePwc0SWucyAzwcNec59KGSGKvFzaDJ7sW9hTOWyjT6rBVevkHwfMeG3CSpNaWwaMRAh7FIU0WSqOLAm-XtB302wa5nZ5HoVPyajlHrjIrHd21t-eWEyLG9Q';

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      {/* Top Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl text-slate-900">Good morning, {patient.name.split(' ')[0]}</h1>
          <p className="text-slate-500 text-sm mt-1">Here is your treatment progress and upcoming dental appointments.</p>
        </div>

        <button
          onClick={onBookAppointment}
          className="bg-[#006194] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#004b73] transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">event_available</span>
          Book Appointment
        </button>
      </div>

      {/* Main Grid: Profile Card + Next Appointment */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Card (4 cols) matching mockup */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src={patient.avatar || patientPhoto}
              alt={patient.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#10b981] border-2 border-white rounded-full"></span>
          </div>

          <h2 className="font-headline font-bold text-xl text-slate-900">{patient.name}</h2>
          <span className="bg-[#f1f4fa] text-slate-600 px-3 py-0.5 rounded-full text-xs font-bold mt-1 mb-5 border border-slate-200">
            {patient.id}
          </span>

          <div className="w-full space-y-3 text-left text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Gender</span>
              <span className="font-bold text-slate-800">{patient.gender}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Age</span>
              <span className="font-bold text-slate-800">{patient.age} years</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Phone</span>
              <span className="font-bold text-slate-800">{patient.phone}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('patient-profile')}
            className="w-full mt-5 bg-slate-50 hover:bg-slate-100 text-[#006194] border border-slate-200 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            View Full Dental History
          </button>
        </div>

        {/* Next Appointment Hero Card (8 cols) */}
        <div className="md:col-span-8 bg-linear-to-br from-[#006194] to-[#004b73] text-white rounded-2xl p-6 md:p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Confirmed Appointment
              </span>
            </div>

            <h3 className="font-headline font-bold text-2xl md:text-3xl text-white mb-2">
              {patient.nextVisit || '01 Sep 2026'} at {patient.nextVisitTime || '10:30 AM'}
            </h3>
            <p className="text-blue-100 text-sm max-w-lg">
              Follow-up consultation & crown evaluation with {patient.attendingDoctor || 'Dr. Ahmed'} at {patient.attendingClinic || 'Clinic 3'}.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[22px]">location_on</span>
              </div>
              <div>
                <p className="text-xs text-blue-200">Location</p>
                <p className="text-sm font-bold text-white">DentalCare Pro Main Clinic • Room 3</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => alert("Appointment downloaded to your calendar.")}
                className="bg-white text-[#006194] hover:bg-blue-50 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Add to Calendar
              </button>
              <button 
                onClick={onBookAppointment}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Visit History (6 cols) & Clinic Status (6 cols) matching mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visit History Timeline matching mockup */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
            <h3 className="font-headline font-bold text-lg text-slate-900">Visit History</h3>
            <span className="text-xs text-slate-500 font-medium">Recent 3 Consultations</span>
          </div>

          <div className="space-y-4">
            {patient.visits.map((visit) => (
              <div
                key={visit.id}
                className="p-4 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-blue-50/30 transition-all"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-xs font-bold text-[#006194] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                    {visit.date}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">{visit.doctorName}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-800">{visit.procedure}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{visit.notes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Clinic Status Cards matching mockup */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
            <h3 className="font-headline font-bold text-lg text-slate-900">Clinic Status</h3>
            <span className="text-xs text-[#10b981] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span> Live Roster
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clinics.map((room) => (
              <div
                key={room.id}
                className="p-4 rounded-xl border border-slate-200 bg-[#f8fafc] flex flex-col justify-between gap-3"
              >
                <div className="flex justify-between items-start">
                  <span className="font-headline font-bold text-sm text-slate-900">{room.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      room.status === 'occupied'
                        ? 'bg-[#d1fae5] text-[#047857]'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {room.status === 'occupied' ? 'Open' : 'Available'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {room.doctorAvatar ? (
                    <img
                      src={room.doctorAvatar}
                      alt={room.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-[18px]">person_off</span>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {room.doctorName || 'No doctor assigned'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {room.doctorSpecialty || 'General Dentistry'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
