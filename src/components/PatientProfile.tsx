import React, { useState } from 'react';
import { Patient, ToothStatus } from '../types';
import { DentalChart } from './DentalChart';
import { getAppointmentCountdown, formatDateArabic } from '../utils/dateUtils';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface PatientProfileProps {
  patient: Patient;
  onBack: () => void;
  onUpdatePatient?: (updatedPatient: Patient) => void;
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
  onScheduleVisit?: (patient?: Patient) => void;
  onDeleteVisit?: (visitId: string) => void;
  onUploadImage?: () => void;
  onEditPatient?: () => void;
  isReadOnly?: boolean;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  onBack,
  onUpdatePatient,
  onUpdateTooth,
  onBatchUpdateTeeth,
  onAddVisit,
  onScheduleVisit,
  onDeleteVisit,
  onUploadImage,
  onEditPatient,
  isReadOnly = false
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  const [activeTab, setActiveTab] = useState<'Overview' | 'Dental Chart' | 'Visits' | 'Medical Images'>('Dental Chart');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visitToDelete, setVisitToDelete] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && onUpdatePatient) {
        onUpdatePatient({
          ...patient,
          avatar: event.target.result as string
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    if (onUpdatePatient) {
      onUpdatePatient({
        ...patient,
        avatar: undefined
      });
    }
  };

  const countdown = getAppointmentCountdown(patient.nextVisit, patient.nextVisitTime);

  return (
    <div className="max-w-7xl mx-auto w-full pb-16 transition-colors">
      {/* Breadcrumb / Back button */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#006194] dark:hover:text-[#00a3e0] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">{isRTL ? 'arrow_forward' : 'arrow_back'}</span>
          <span>{isReadOnly ? t('back_to_dashboard') : t('back_to_patients')}</span>
        </button>

        {/* Confirmed next visit pill badge */}
        {patient.nextVisit && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              {t('confirmed_appointment')}:
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border shadow-2xs ${
                countdown.isToday
                  ? 'bg-emerald-500 text-white border-emerald-400 font-extrabold animate-pulse'
                  : countdown.isPast
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                  : 'bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-800'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">event</span>
              <span>{patient.nextVisit}</span>
              <span className="text-[11px] opacity-90 font-mono">
                ({isRTL ? countdown.badgeArabic : countdown.badgeEnglish})
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Hidden Avatar File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
        id="profile-avatar-upload"
      />

      {/* Patient Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-5 md:p-6 mb-6 shadow-xs flex flex-wrap justify-between items-start md:items-center gap-4">
        <div className="flex gap-5 items-center">
          <div className="relative group">
            {patient.avatar ? (
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-18 h-18 md:w-20 md:h-20 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800"
              />
            ) : (
              <div className="w-18 h-18 md:w-20 md:h-20 rounded-full bg-slate-100 dark:bg-slate-800 text-[#006194] dark:text-[#00a3e0] font-bold text-xl md:text-2xl flex items-center justify-center border-2 border-slate-200 dark:border-slate-700">
                {patient.initials || 'PT'}
              </div>
            )}

            {!isReadOnly && onUpdatePatient && (
              <div className="absolute inset-0 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title={isRTL ? "تغيير أو رفع صورة" : "Upload / Change photo"}
                  className="p-1 hover:bg-white/20 rounded-full text-xs cursor-pointer flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>
                {patient.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    title={isRTL ? "حذف الصورة والرجوع للحروف" : "Remove photo"}
                    className="p-1 hover:bg-red-500/80 rounded-full text-xs cursor-pointer text-red-300 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h1 className="font-headline font-bold text-2xl md:text-3xl text-slate-900 dark:text-white">{patient.name}</h1>
              <span className="bg-[#f1f4fa] dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border border-slate-200 dark:border-slate-700">
                #{patient.id}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  {patient.gender === 'Female' ? 'female' : 'male'}
                </span>
                {patient.gender === 'Female' ? (isRTL ? 'أنثى' : 'Female') : (isRTL ? 'ذكر' : 'Male')}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">cake</span>
                {patient.age} {t('age')}
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
            {onScheduleVisit && (
              <button
                onClick={() => onScheduleVisit(patient)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                <span>{t('schedule_next_visit')}</span>
              </button>
            )}

            {onEditPatient && (
              <button
                onClick={onEditPatient}
                className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                <span>{t('edit_patient')}</span>
              </button>
            )}
            {onAddVisit && (
              <button
                onClick={onAddVisit}
                className="px-4 py-2 bg-[#006194] text-white rounded-xl hover:bg-[#004b73] transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">event</span>
                <span>{t('record_consultation')}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Profile Tabs */}
      <div className="border-b border-[#e2e8f0] dark:border-slate-800 mb-6 flex gap-6 md:gap-8 overflow-x-auto text-sm font-semibold">
        {(['Overview', 'Dental Chart', 'Visits', 'Medical Images'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'border-[#006194] dark:border-[#00a3e0] text-[#006194] dark:text-[#00a3e0] font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab === 'Overview' && t('overview')}
            {tab === 'Dental Chart' && t('dental_chart')}
            {tab === 'Visits' && t('visits_and_schedule')}
            {tab === 'Medical Images' && t('medical_images_xrays')}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'Dental Chart' && (
        <div className="space-y-6">
          <DentalChart 
            teeth={patient.teeth} 
            visits={patient.visits}
            onUpdateTooth={onUpdateTooth}
            onBatchUpdateTeeth={onBatchUpdateTeeth}
            isReadOnly={isReadOnly}
          />

          {/* Medical Images Section */}
          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs">
            <div className="border-b border-[#e2e8f0] dark:border-slate-800 pb-4 mb-5 flex justify-between items-center">
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white">
                  {t('medical_images_xrays')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isRTL ? "أشعة البانوراما والصور السريرية" : "Intraoral photographs and digital panoramic films"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {patient.images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className="group relative rounded-2xl overflow-hidden border border-[#e2e8f0] dark:border-slate-800 bg-slate-950 aspect-square cursor-pointer shadow-xs hover:border-[#006194] transition-all"
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
                  className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-800/40 aspect-square cursor-pointer hover:bg-blue-50/50 dark:hover:bg-slate-800 hover:border-[#006194] transition-all flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#006194] gap-2 p-4"
                >
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-2xs">
                    <span className="material-symbols-outlined text-xl">add</span>
                  </div>
                  <span className="text-xs font-bold">{isRTL ? "إضافة أشعة جديدة" : "Upload New Scan"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              {isRTL ? "السجل الطبي والصحي للمريض" : "Patient Medical Background"}
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {t('medical_notes')}
              </label>
              <div className="bg-[#f8fafc] dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {patient.medicalNotes || (isRTL ? 'لا توجد حساسيات دوائية مسجلة. صحة الفم العامة جيدة ومستقرة.' : 'No specific clinical allergies recorded. General oral health is stable.')}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50/60 dark:bg-blue-950/40 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  {isRTL ? "إجمالي الكشوفات" : "Total Past Visits"}
                </span>
                <span className="font-headline font-bold text-xl text-[#006194] dark:text-[#00a3e0]">{patient.visits.length}</span>
              </div>
              <div className="bg-amber-50/60 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-100 dark:border-amber-900">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  {isRTL ? "العلاج الأساسي" : "Primary Treatment"}
                </span>
                <span className="font-headline font-bold text-base text-amber-800 dark:text-amber-300">{patient.treatmentType || (isRTL ? 'كشف عام' : 'General Care')}</span>
              </div>
              <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-100 dark:border-emerald-900">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  {t('status')}
                </span>
                <span className="font-headline font-bold text-base text-emerald-700 dark:text-emerald-300">
                  {isRTL ? "مريض نشط" : "Active Patient"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              {t('confirmed_appointment')}
            </h3>
            {patient.nextVisit ? (
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-[#006194] dark:text-[#00a3e0] font-bold text-sm">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    <span>{patient.nextVisit}</span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      countdown.isToday
                        ? 'bg-emerald-500 text-white border-emerald-400 font-extrabold'
                        : countdown.isPast
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                    }`}
                  >
                    {isRTL ? countdown.badgeArabic : countdown.badgeEnglish}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p>
                    <span className="font-semibold text-slate-800 dark:text-white">{isRTL ? 'الوقت:' : 'Time:'}</span> {patient.nextVisitTime || '10:30 AM'}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800 dark:text-white">{t('doctor')}:</span> {patient.attendingDoctor || 'Dr. Ahmed'} • {isRTL ? (patient.attendingClinic || 'Clinic 1').replace(/Clinic\s*(\d+)/i, 'العيادة $1') : (patient.attendingClinic || 'Clinic 1')}
                  </p>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900">
                  <p className="font-bold text-[#006194] dark:text-[#00a3e0] mb-0.5">
                    {isRTL ? countdown.descriptionArabic : countdown.descriptionEnglish}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isRTL ? countdown.descriptionEnglish : countdown.descriptionArabic}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                {isRTL ? "لا توجد مواعيد قادمة مجدولة للمريض." : "No upcoming appointments scheduled."}
              </p>
            )}

            {!isReadOnly && onScheduleVisit && (
              <button
                onClick={() => onScheduleVisit(patient)}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                <span>{t('schedule_next_visit')}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Visits' && (
        <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div>
              <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0]">history</span>
                <span>{t('visits_and_schedule')}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isRTL ? "الكشوفات السابقة والعلاجات المسجلة والمواعيد القادمة" : "Historical consultations, recorded dental treatments, and upcoming visits"}
              </p>
            </div>
            {!isReadOnly && onScheduleVisit && (
              <button
                onClick={() => onScheduleVisit(patient)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                <span>{t('schedule_next_visit')}</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {patient.visits.map((v) => (
              <div
                key={v.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-[#006194] dark:text-[#00a3e0] shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[22px]">medical_services</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{v.procedure}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        v.status === 'completed' 
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                          : 'bg-blue-50 dark:bg-blue-950 text-[#006194] dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      }`}>
                        {v.status === 'completed' ? (isRTL ? 'مكتملة' : 'Completed') : (isRTL ? 'مجدولة' : 'Scheduled')}
                      </span>
                      {v.clinicRoom && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {v.clinicRoom}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-1.5 leading-relaxed">
                      {v.notes || (isRTL ? 'كشف دوري ومتابعة سريرية.' : 'Routine consultation and dental evaluation.')}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">person</span>
                        {t('doctor')}: {v.doctorName || 'Dr. Ahmed'}
                      </span>
                      {v.cost && (
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {isRTL ? 'التكلفة:' : 'Fee:'} ${v.cost}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-left md:text-right">
                    <span className="font-mono font-bold text-xs text-[#006194] dark:text-[#00a3e0] block">{v.date}</span>
                    <span className="text-[10px] text-slate-400">{isRTL ? "تاريخ الكشف" : "Visit Date"}</span>
                  </div>

                  {!isReadOnly && onDeleteVisit && (
                    <button
                      onClick={() => setVisitToDelete(v.id)}
                      title={isRTL ? "حذف الزيارة" : "Delete visit"}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                      <span className="hidden sm:inline">{t('delete')}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {patient.visits.length === 0 && (
              <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">event_busy</span>
                <p className="font-headline font-bold text-sm text-slate-700 dark:text-slate-300">
                  {isRTL ? "لا توجد زيارات مسجلة للمريض" : "No visits recorded"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isRTL ? "لم يتم تسجيل أي كشوفات أو جلسات علاج بعد." : "There are no consultations or treatment sessions recorded for this patient."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Medical Images' && (
        <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div>
              <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white">
                {t('medical_images_xrays')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isRTL ? "سجل الأشعة عالية الدقة والصور السريرية" : "High resolution X-rays and imaging history"}
              </p>
            </div>
            {!isReadOnly && onUploadImage && (
              <button
                onClick={onUploadImage}
                className="px-3.5 py-1.5 bg-[#006194] text-white rounded-xl text-xs font-semibold hover:bg-[#004b73] flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                <span>{isRTL ? "إضافة أشعة جديدة" : "Add New Scan"}</span>
              </button>
            )}
          </div>

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
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                    <span className="material-symbols-outlined text-2xl">zoom_in</span>
                    <span className="text-xs font-semibold">{isRTL ? "تكبير الصورة" : "Inspect Fullscreen"}</span>
                  </div>
                </div>
                <div className="p-3.5">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#006194] dark:group-hover:text-[#00a3e0] transition-colors">{img.title}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200/80 dark:bg-slate-700 px-2 py-0.5 rounded">
                      {img.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{img.date}</p>
                </div>
              </div>
            ))}

            {!isReadOnly && onUploadImage && (
              <div
                onClick={onUploadImage}
                className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 min-h-[160px] cursor-pointer hover:bg-blue-50/50 dark:hover:bg-slate-800 hover:border-[#006194] transition-all flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#006194] gap-2 p-4"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-2xs">
                  <span className="material-symbols-outlined text-xl">add</span>
                </div>
                <span className="text-xs font-bold">{isRTL ? "إضافة أشعة جديدة" : "Add New Scan"}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Visit Confirmation Modal */}
      {visitToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 mx-auto border border-red-100">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-slate-900 text-center mb-1">
              {t('delete_visit_title')}
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6 leading-relaxed">
              {isRTL 
                ? "هل أنت متأكد من رغبتك في حذف هذا الكشف الطبي نهائياً؟ لا يمكن التراجع عن هذا الإجراء."
                : "Are you sure you want to permanently delete this visit record from the patient's history? This action cannot be undone."}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVisitToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {t('cancel')}
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
                <span>{t('delete')}</span>
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
              {isRTL ? "إغلاق" : "Close"}
            </button>
            <img
              src={selectedImage}
              alt="Scan Fullview"
              className="max-w-full max-h-[80vh] object-contain rounded-xl border border-white/20 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
