import React, { useState } from 'react';
import { Patient, ToothRecord } from '../types';
import { DentalChart } from './DentalChart';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface PatientDentalRecordProps {
  patient: Patient;
  onBookConsultation: () => void;
}

export const PatientDentalRecord: React.FC<PatientDentalRecordProps> = ({
  patient,
  onBookConsultation
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  const [selectedToothId, setSelectedToothId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const treatedTeethList = (Object.values(patient.teeth) as ToothRecord[]).filter(
    (t) => t.status && t.status !== 'none'
  );

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-12 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0] text-2xl">dentistry</span>
            <h1 className="font-headline font-bold text-2xl text-slate-900 dark:text-white">
              {t('dental_chart')}
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            {isRTL 
              ? "مخطط الأسنان الدائم، الحشوات والعلاجات المثبتة، والأشعة التشخيصية المرفوعة من الطبيب"
              : "View your permanent teeth map, documented treatments, and diagnostic scans uploaded by your dental team."}
          </p>
        </div>

        <button
          onClick={onBookConsultation}
          className="bg-[#006194] hover:bg-[#004b73] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
          <span>{t('schedule_visit')}</span>
        </button>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
            {isRTL ? "الأسنان المسجلة" : "Documented Teeth"}
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{treatedTeethList.length}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
            {isRTL ? "الحشوات والتركيبات" : "Active Restorations"}
          </span>
          <span className="text-xl font-bold text-[#006194] dark:text-[#00a3e0]">
            {treatedTeethList.filter((t) => t.status === 'filling' || t.status === 'crown').length}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
            {isRTL ? "علاج جذور وزراعة" : "Implants & Root Canals"}
          </span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {treatedTeethList.filter((t) => t.status === 'implant' || t.status === 'root-canal').length}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">
            {isRTL ? "صور وأشعة تشخيصية" : "Diagnostic Scans"}
          </span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{patient.images.length}</span>
        </div>
      </div>

      {/* Dental Chart Container */}
      <div className="space-y-6">
        <DentalChart
          teeth={patient.teeth}
          visits={patient.visits}
          isReadOnly={true}
        />
      </div>

      {/* Diagnostic Medical Scans Gallery */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 p-6 shadow-xs">
        <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white mb-1">
          {t('medical_images_xrays')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          {isRTL ? "أشعة البانوراما والصور السريرية الخاصة بملف المريض" : "High resolution radiographs and intraoral photography associated with your record"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {patient.images.map((img) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img.url)}
              className="group bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer"
            >
              <div className="aspect-video bg-black/90 relative overflow-hidden flex items-center justify-center">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                  <span className="material-symbols-outlined text-2xl">zoom_in</span>
                  <span className="text-xs font-bold">{isRTL ? "تكبير الصورة" : "View Fullscreen"}</span>
                </div>
              </div>
              <div className="p-3.5">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#006194] dark:group-hover:text-[#00a3e0] transition-colors">
                    {img.title}
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-700 px-2 py-0.5 rounded">
                    {img.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{img.date}</p>
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
              className="absolute -top-12 right-0 text-white hover:text-slate-300 flex items-center gap-1 text-sm font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
              {isRTL ? "إغلاق" : "Close"}
            </button>
            <img
              src={selectedImage}
              alt="Scan Fullview"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
