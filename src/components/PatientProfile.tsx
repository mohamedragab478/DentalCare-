import React, { useState } from 'react';
import { Patient, ToothStatus } from '../types';
import { DentalChart } from './DentalChart';

interface PatientProfileProps {
  patient: Patient;
  onBack: () => void;
  onUpdateTooth: (
    toothId: number,
    status: ToothStatus,
    notes?: string,
    date?: string,
    customProcedureName?: string,
    bridgeSpan?: number[]
  ) => void;
  onBatchUpdateTeeth?: (
    updates: Array<{
      toothId: number;
      status: ToothStatus;
      notes?: string;
      date?: string;
      customProcedureName?: string;
      bridgeSpan?: number[];
    }>
  ) => void;
  onAddVisit?: () => void;
  onDeleteVisit?: (visitId: string) => void;
  onUploadImage?: () => void;
  onEditPatient?: () => void;
  isReadOnly?: boolean;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  onBack,
  onUpdateTooth,
  onBatchUpdateTeeth,
  onAddVisit,
  onDeleteVisit,
  onUploadImage,
  onEditPatient,
  isReadOnly = false
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Dental Chart' | 'Visits' | 'Medical Images'>('Dental Chart');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visitToDelete, setVisitToDelete] = useState<string | null>(null);

  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjPiLDyWepU0CeZ8X8tIln_VVoHrQtBpyU8CiodPf3F7v4BwoQcpHQcQYAzQPGLjtRhljnPUN7UWpWts7Z9cw13fBY7FOdrq2AntU5wzQDzRpOLGsrVmX5g7cIZn-DxUOUuNPZ83xs-iLQObirdHXR0A0t5KUcZiOoTP4BNMOMdEutnr0mgJO-uOU3wJ98k7MRm-dTt8NHMhFnTDXibTruBygcqXVVBZHEzQlUS7eeDlfczpm5v0NK2g';

  return (
    <div className="max-w-7xl mx-auto w-full pb-16">
      {/* Breadcrumb / Back button */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-[#006194] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>{isReadOnly ? 'Back to Dashboard' : 'Back to Patients List'}</span>
        </button>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 md:p-6 mb-6 shadow-xs flex flex-wrap justify-between items-start md:items-center gap-4">
        <div className="flex gap-5 items-center">
          <img
            src={patient.avatar || defaultAvatar}
            alt={patient.name}
            className="w-18 h-18 md:w-20 md:h-20 rounded-full object-cover border-2 border-slate-100 shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h1 className="font-headline font-bold text-2xl md:text-3xl text-slate-900">{patient.name}</h1>
              <span className="bg-[#f1f4fa] text-slate-700 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border border-slate-200">
                #{patient.id}
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

        {/* Header Actions - Doctors only for clinical edits */}
        {!isReadOnly && (
          <div className="flex flex-wrap gap-2.5">
            {onEditPatient && (
              <button
                onClick={onEditPatient}
                className="px-3.5 py-2 bg-white border border-[#e2e8f0] text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                <span>Edit Patient</span>
              </button>
            )}
            {onUploadImage && (
              <button
                onClick={onUploadImage}
                className="px-3.5 py-2 bg-white border border-[#e2e8f0] text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">upload</span>
                <span>Upload Image</span>
              </button>
            )}
            {onAddVisit && (
              <button
                onClick={onAddVisit}
                className="px-4 py-2 bg-[#006194] text-white rounded-xl hover:bg-[#004b73] transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">event</span>
                <span>Add Visit / Consultation</span>
              </button>
            )}
          </div>
        )}
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
          <DentalChart 
            teeth={patient.teeth} 
            onUpdateTooth={onUpdateTooth}
            onBatchUpdateTeeth={onBatchUpdateTeeth}
            isReadOnly={isReadOnly}
          />

          {/* Medical Images Section */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 md:p-6 shadow-xs">
            <div className="border-b border-[#e2e8f0] pb-4 mb-5 flex justify-between items-center">
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900">Radiography & Diagnostic Scans</h3>
                <p className="text-xs text-slate-500">Intraoral photographs and digital panoramic films</p>
              </div>
              {!isReadOnly && onUploadImage && (
                <button
                  onClick={onUploadImage}
                  className="px-3.5 py-1.5 bg-white border border-[#e2e8f0] text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                  <span>Upload Scan</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-bold">{img.title}</p>
                    <p className="text-white/80 text-[10px] font-medium">{img.date}</p>
                  </div>
                </div>
              ))}

              {!isReadOnly && onUploadImage && (
                <div
                  onClick={onUploadImage}
                  className="rounded-xl border-2 border-dashed border-slate-200 bg-[#f8fafc] aspect-square cursor-pointer hover:bg-blue-50/50 hover:border-[#006194] transition-all flex flex-col items-center justify-center text-slate-500 hover:text-[#006194] gap-2 p-4"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    <span className="material-symbols-outlined text-xl">add</span>
                  </div>
                  <span className="text-xs font-bold">Upload New Scan</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-headline font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
              Patient Medical Background
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Clinical Health Notes & Allergies
              </label>
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed">
                {patient.medicalNotes || 'No specific clinical allergies recorded. General oral health is stable.'}
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

          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-headline font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
              Upcoming Schedule
            </h3>
            {patient.nextVisit ? (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 text-[#006194] font-bold text-sm mb-1">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  <span>{patient.nextVisit}</span>
                </div>
                <p className="text-xs text-slate-600">Time: {patient.nextVisitTime || '10:30 AM'}</p>
                <p className="text-xs text-slate-600 mt-1">Doctor: {patient.attendingDoctor || 'Dr. Ahmed'}</p>
                <p className="text-xs text-slate-600">Room: {patient.attendingClinic || 'Clinic 1'}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No upcoming appointments scheduled.</p>
            )}

            {!isReadOnly && onAddVisit && (
              <button
                onClick={onAddVisit}
                className="w-full mt-4 bg-[#006194] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#004b73] transition-colors cursor-pointer"
              >
                Schedule New Appointment
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Visits' && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <div>
              <h3 className="font-headline font-bold text-lg text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006194]">history</span>
                <span>Clinical Visit Records (سجل الزيارات والكشوفات)</span>
              </h3>
              <p className="text-xs text-slate-500">Historical consultations, recorded dental treatments, and upcoming visits</p>
            </div>
            {!isReadOnly && onAddVisit && (
              <button
                onClick={onAddVisit}
                className="px-3.5 py-1.5 bg-[#006194] text-white rounded-xl text-xs font-semibold hover:bg-[#004b73] flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Visit</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {patient.visits.map((v) => (
              <div
                key={v.id}
                className="p-5 rounded-2xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#006194] shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[22px]">medical_services</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm text-slate-900">{v.procedure}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        v.status === 'completed' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-blue-50 text-[#006194] border-blue-200'
                      }`}>
                        {v.status === 'completed' ? 'Completed' : 'Scheduled'}
                      </span>
                      {v.clinicRoom && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {v.clinicRoom}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">{v.notes || 'Routine consultation and dental evaluation.'}</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">person</span>
                        Doctor: {v.doctorName || 'Dr. Ahmed'}
                      </span>
                      {v.cost && (
                        <span className="font-semibold text-slate-700">
                          Fee: ${v.cost}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60">
                  <div className="text-left md:text-right">
                    <span className="font-mono font-bold text-xs text-[#006194] block">{v.date}</span>
                    <span className="text-[10px] text-slate-400">Visit Date</span>
                  </div>

                  {!isReadOnly && onDeleteVisit && (
                    <button
                      onClick={() => setVisitToDelete(v.id)}
                      title="Delete this visit / مسح هذه الزيارة"
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {patient.visits.length === 0 && (
              <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">event_busy</span>
                <p className="font-headline font-bold text-sm text-slate-700">No visits recorded</p>
                <p className="text-xs text-slate-500 mt-0.5">There are no consultations or treatment sessions recorded for this patient.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Medical Images' && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <div>
              <h3 className="font-headline font-bold text-lg text-slate-900">All Diagnostic Radiography</h3>
              <p className="text-xs text-slate-500">High resolution X-rays and imaging history</p>
            </div>
            {!isReadOnly && onUploadImage && (
              <button
                onClick={onUploadImage}
                className="px-3.5 py-1.5 bg-[#006194] text-white rounded-xl text-xs font-semibold hover:bg-[#004b73] flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                <span>Upload Scan</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {patient.images.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer"
              >
                <div className="aspect-video bg-black/90 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                    <span className="material-symbols-outlined text-2xl">zoom_in</span>
                    <span className="text-xs font-semibold">Inspect Fullscreen</span>
                  </div>
                </div>
                <div className="p-3.5">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#006194] transition-colors">{img.title}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded">
                      {img.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{img.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Visit Confirmation Modal */}
      {visitToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 mx-auto border border-red-100">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-slate-900 text-center mb-1">
              Delete Visit Record?
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6 leading-relaxed">
              Are you sure you want to permanently delete this visit record from the patient's history? This action cannot be undone.
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
                    onDeleteVisit(visitToDelete);
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

      {/* Fullscreen Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 flex items-center gap-1 text-sm font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
              Close
            </button>
            <img
              src={selectedImage}
              alt="Scan Fullview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg border border-white/20 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
