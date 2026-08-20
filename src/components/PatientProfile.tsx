import React, { useState } from 'react';
import { Patient, ToothStatus } from '../types';
import { DentalChart } from './DentalChart';

interface PatientProfileProps {
  patient: Patient;
  onBack: () => void;
  onUpdateTooth: (toothId: number, status: ToothStatus, notes?: string, date?: string) => void;
  onAddVisit: () => void;
  onUploadImage: () => void;
  onEditPatient: () => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  onBack,
  onUpdateTooth,
  onAddVisit,
  onUploadImage,
  onEditPatient
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Dental Chart' | 'Visits' | 'Medical Images'>('Dental Chart');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjPiLDyWepU0CeZ8X8tIln_VVoHrQtBpyU8CiodPf3F7v4BwoQcpHQcQYAzQPGLjtRhljnPUN7UWpWts7Z9cw13fBY7FOdrq2AntU5wzQDzRpOLGsrVmX5g7cIZn-DxUOUuNPZ83xs-iLQObirdHXR0A0t5KUcZiOoTP4BNMOMdEutnr0mgJO-uOU3wJ98k7MRm-dTt8NHMhFnTDXibTruBygcqXVVBZHEzQlUS7eeDlfczpm5v0NK2g';

  return (
    <div className="max-w-7xl mx-auto w-full pb-16">
      {/* Breadcrumb / Back button */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-[#006194] flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Patients List
        </button>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 md:p-6 mb-6 shadow-xs flex flex-wrap justify-between items-start md:items-center gap-4">
        <div className="flex gap-5 items-center">
          <img
            src={patient.avatar || defaultAvatar}
            alt={patient.name}
            className="w-18 h-18 md:w-20 md:h-20 rounded-full object-cover border-2 border-slate-100 shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h1 className="font-headline font-bold text-2xl md:text-3xl text-slate-900">{patient.name}</h1>
              <span className="bg-[#f1f4fa] text-slate-600 px-2.5 py-0.5 rounded-md text-xs font-semibold border border-slate-200">
                {patient.id}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-xs font-medium">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">cake</span>
                {patient.age} yrs {patient.birthDate ? `(${patient.birthDate})` : ''}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">male</span>
                {patient.gender}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">call</span>
                {patient.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onEditPatient}
            className="px-3.5 py-2 bg-white border border-[#e2e8f0] text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>Edit Patient</span>
          </button>
          <button
            onClick={onUploadImage}
            className="px-3.5 py-2 bg-white border border-[#e2e8f0] text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">upload</span>
            <span>Upload Image</span>
          </button>
          <button
            onClick={onAddVisit}
            className="px-4 py-2 bg-[#006194] text-white rounded-lg hover:bg-[#004b73] transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">event</span>
            <span>Add Visit</span>
          </button>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="border-b border-[#e2e8f0] mb-6 flex gap-6 md:gap-8 overflow-x-auto text-sm font-semibold">
        {(['Overview', 'Dental Chart', 'Visits', 'Medical Images'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'border-[#006194] text-[#006194] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'Dental Chart' && (
        <div className="space-y-6">
          <DentalChart teeth={patient.teeth} onUpdateTooth={onUpdateTooth} />

          {/* Medical Images Section matching mockup bottom bar */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 md:p-6 shadow-xs">
            <div className="border-b border-[#e2e8f0] pb-4 mb-5 flex justify-between items-center">
              <h3 className="font-headline font-bold text-lg text-slate-900">Medical Images</h3>
              <button
                onClick={onUploadImage}
                className="px-3.5 py-1.5 bg-white border border-[#e2e8f0] text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                Upload New
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Image Card 1: Panoramic X-ray */}
              {patient.images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className="group relative rounded-xl overflow-hidden border border-[#e2e8f0] bg-slate-950 aspect-square cursor-pointer shadow-xs hover:border-[#006194] transition-all"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-bold">{img.title}</p>
                    <p className="text-white/80 text-[10px] font-medium">{img.date}</p>
                  </div>
                </div>
              ))}

              {/* Default Mock Bitewing */}
              <div
                onClick={onUploadImage}
                className="group relative rounded-xl overflow-hidden border border-[#e2e8f0] bg-[#f8fafc] aspect-square cursor-pointer hover:border-slate-300 transition-all flex flex-col items-center justify-center text-slate-500 gap-2 p-4 text-center"
              >
                <span className="material-symbols-outlined text-3xl text-slate-400">image</span>
                <span className="text-xs font-semibold text-slate-700">Bite-wing L</span>
                <span className="text-[10px] text-slate-400">Click to upload scan</span>
              </div>

              {/* Placeholder Add Card */}
              <div
                onClick={onUploadImage}
                className="rounded-xl border-2 border-dashed border-slate-200 bg-[#f8fafc] aspect-square cursor-pointer hover:bg-blue-50/50 hover:border-[#006194] transition-all flex flex-col items-center justify-center text-slate-500 hover:text-[#006194] gap-2 p-4"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                  <span className="material-symbols-outlined text-xl">add</span>
                </div>
                <span className="text-xs font-bold">Upload Scan</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-xs space-y-6">
            <h3 className="font-headline font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
              Patient Medical Background
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Clinical Health Notes & Allergies
              </label>
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed">
                {patient.medicalNotes || 'No specific clinical allergies recorded. General health is stable.'}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Total Past Visits</span>
                <span className="font-headline font-bold text-xl text-[#006194]">{patient.visits.length}</span>
              </div>
              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Primary Treatment</span>
                <span className="font-headline font-bold text-base text-amber-800">{patient.treatmentType || 'General Care'}</span>
              </div>
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Status</span>
                <span className="font-headline font-bold text-base text-emerald-700">Active Patient</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-headline font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
              Upcoming Schedule
            </h3>
            {patient.nextVisit ? (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 text-[#006194] font-bold text-sm mb-1">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  {patient.nextVisit}
                </div>
                <p className="text-xs text-slate-600">Time: {patient.nextVisitTime || '10:30 AM'}</p>
                <p className="text-xs text-slate-600 mt-1">Doctor: {patient.attendingDoctor || 'Dr. Ahmed'}</p>
                <p className="text-xs text-slate-600">Room: {patient.attendingClinic || 'Clinic 3'}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No upcoming appointments scheduled.</p>
            )}

            <button
              onClick={onAddVisit}
              className="w-full mt-4 bg-[#006194] text-white py-2.5 rounded-lg text-xs font-semibold hover:bg-[#004b73] transition-colors"
            >
              Schedule New Appointment
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Visits' && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <h3 className="font-headline font-bold text-lg text-slate-900">Visit History</h3>
            <button
              onClick={onAddVisit}
              className="px-3.5 py-1.5 bg-[#006194] text-white rounded-lg text-xs font-semibold hover:bg-[#004b73] flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add Visit
            </button>
          </div>

          <div className="space-y-4">
            {patient.visits.map((visit) => (
              <div
                key={visit.id}
                className="p-4 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-[#006194]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#006194] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {visit.date}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">• {visit.doctorName}</span>
                    {visit.clinicRoom && (
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {visit.clinicRoom}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{visit.procedure}</h4>
                  <p className="text-xs text-slate-600 mt-1">{visit.notes}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      visit.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-[#006194] border border-blue-200'
                    }`}
                  >
                    {visit.status === 'completed' ? 'Completed' : 'Scheduled'}
                  </span>
                  {visit.cost && (
                    <span className="text-sm font-bold text-slate-900 font-mono">${visit.cost}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Medical Images' && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <h3 className="font-headline font-bold text-lg text-slate-900">Medical Imaging Records</h3>
            <button
              onClick={onUploadImage}
              className="px-3.5 py-1.5 bg-[#006194] text-white rounded-lg text-xs font-semibold hover:bg-[#004b73] flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
              Upload Scan
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {patient.images.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className="rounded-xl border border-slate-200 overflow-hidden bg-black cursor-pointer group shadow-sm hover:border-[#006194] transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5 bg-white border-t border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900">{img.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Recorded: {img.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full screen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <img
              src={selectedImage}
              alt="Medical Scan Fullscreen"
              className="max-h-[80vh] w-auto mx-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
