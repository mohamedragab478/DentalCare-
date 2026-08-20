import React, { useState } from 'react';
import { Patient, ToothRecord } from '../types';
import { DentalChart } from './DentalChart';

interface PatientDentalRecordProps {
  patient: Patient;
  onBookConsultation: () => void;
}

export const PatientDentalRecord: React.FC<PatientDentalRecordProps> = ({
  patient,
  onBookConsultation
}) => {
  const [selectedToothId, setSelectedToothId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const selectedTooth: ToothRecord | undefined = selectedToothId
    ? patient.teeth[selectedToothId]
    : undefined;

  // Counts of patient's treated teeth
  const treatedTeethList = (Object.values(patient.teeth) as ToothRecord[]).filter(
    (t) => t.status && t.status !== 'none'
  );

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#006194] text-2xl">dentistry</span>
            <h1 className="font-headline font-bold text-2xl text-slate-900">My Dental Chart & Imaging</h1>
          </div>
          <p className="text-slate-500 text-sm">
            View your permanent teeth map, documented treatments, and diagnostic scans uploaded by your dental team.
          </p>
        </div>

        <button
          onClick={onBookConsultation}
          className="bg-[#006194] hover:bg-[#004b73] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
          <span>Request Treatment</span>
        </button>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-medium block mb-1">Documented Teeth</span>
          <span className="text-xl font-bold text-slate-900">{treatedTeethList.length} teeth</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-medium block mb-1">Active Restorations</span>
          <span className="text-xl font-bold text-[#006194]">
            {treatedTeethList.filter((t) => t.status === 'filling' || t.status === 'crown').length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-medium block mb-1">Implants & Root Canals</span>
          <span className="text-xl font-bold text-amber-600">
            {treatedTeethList.filter((t) => t.status === 'implant' || t.status === 'root-canal').length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-medium block mb-1">Diagnostic Scans</span>
          <span className="text-xl font-bold text-emerald-600">{patient.images.length} files</span>
        </div>
      </div>

      {/* Dental Chart Container */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div>
            <h2 className="font-headline font-bold text-lg text-slate-900">Adult Maxillary & Mandibular Chart</h2>
            <p className="text-xs text-slate-500 mt-0.5">Click any tooth to inspect recorded treatments and clinical notes</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1.5 bg-blue-50 text-[#006194] px-2.5 py-1 rounded-full font-semibold border border-blue-100">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006194]"></span>
              Filling
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-semibold border border-emerald-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Crown
            </span>
            <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-semibold border border-purple-100">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              Implant
            </span>
            <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-semibold border border-amber-100">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Root Canal
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chart Display */}
          <div className="lg:col-span-8 flex justify-center bg-slate-50/60 p-6 rounded-2xl border border-slate-100">
            <DentalChart
              teeth={patient.teeth}
              onSelectTooth={(id) => setSelectedToothId(id)}
              selectedToothId={selectedToothId}
            />
          </div>

          {/* Tooth Details Card */}
          <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <h3 className="font-headline font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194] text-[20px]">info</span>
              <span>Tooth Information</span>
            </h3>

            {selectedToothId ? (
              <div className="space-y-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-500">Tooth Number</span>
                    <span className="font-mono font-bold text-base text-[#006194]">#{selectedToothId}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-500">Current Status</span>
                    <span className="font-bold capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {selectedTooth?.status && selectedTooth.status !== 'none'
                        ? selectedTooth.status.replace('-', ' ')
                        : 'Healthy / Natural'}
                    </span>
                  </div>
                  {selectedTooth?.lastTreatmentDate && (
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-500">Last Treated</span>
                      <span className="font-medium text-slate-700">{selectedTooth.lastTreatmentDate}</span>
                    </div>
                  )}
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-600 block mb-1.5">Doctor Notes</span>
                  <p className="text-slate-600 leading-relaxed italic">
                    {selectedTooth?.notes || 'No specific clinical findings recorded for this tooth.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 px-4 text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">touch_app</span>
                <p className="text-xs">Click any tooth in the dental arch above to view recorded procedures and health condition.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Diagnostic Medical Scans Gallery */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs">
        <h2 className="font-headline font-bold text-lg text-slate-900 mb-1">Diagnostic Scans & X-Rays</h2>
        <p className="text-xs text-slate-500 mb-6">High resolution radiographs and intraoral photography associated with your record</p>

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
                  <span className="text-xs font-semibold">View Fullscreen</span>
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

      {/* Fullscreen Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 flex items-center gap-1 text-sm font-semibold"
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
