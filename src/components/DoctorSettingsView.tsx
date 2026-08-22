import React, { useState, useRef } from 'react';
import { DoctorProfile, ClinicRoom } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface DoctorSettingsViewProps {
  doctorProfile: DoctorProfile;
  onUpdateDoctorProfile: (profile: DoctorProfile) => void;
  clinics: ClinicRoom[];
}

const PRESET_AVATARS = [
  {
    name: 'Clinical Specialist 1 (Default)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxTdB6BFCRDU6qr8N5YlyqcvvBqAlixK076_tUMWhheQjfjcVCtO0UBEY8sL1jYC9cucKVnoLoEgJlDKaSn0Qb5FJkx7v8MdhtOBjzCb8dHppP7IhiJllCOCEHHLwVXSrsa5mcVTHwz5OLt5nCjCSdaOMEjmqz6mQGAz0pZXk-7oBvgitx-9e-JaGvGW1CTaWYwwuVfl_PBgRvo3t6bQ1DMA1TZCepbWvSxDJrfFFqBCZE6ilABoY5eg'
  },
  {
    name: 'Surgical Specialist 2',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZoqMgIOkE4Sf3l_Cm61qM0gcqafhyt0fXCeYneDdS-j0DJIBrJdB24DVWx3ZdF6wKBGrengis_lUoIYcH-n1B_xfE9lPYn7iuxmUSZwWtvk6e7BbvYkRrciVJ38g9kIhDn3pTq4-8WytqOkA3gmu8PjfqWea5dtp5qz49_50y7tbU-7ciKeQkFwxQhwuf6jP5ewgxca0a9_i3YESSCRF_6zXJXlUL1MG4dLGyTqHK9rGXWUImgQXMuw'
  },
  {
    name: 'Endodontist 3',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Orthodontist 4',
    url: 'https://images.unsplash.com/photo-1594824813587-f875080f4f9f?auto=format&fit=crop&q=80&w=400'
  }
];

export const DoctorSettingsView: React.FC<DoctorSettingsViewProps> = ({
  doctorProfile,
  onUpdateDoctorProfile,
  clinics
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  const [formData, setFormData] = useState<DoctorProfile>({ ...doctorProfile });
  const [customUrl, setCustomUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError(isRTL ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP).' : 'Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError(isRTL ? 'يجب أن يكون حجم الصورة أقل من 5 ميجابايت.' : 'Image size should be less than 5MB.');
      return;
    }

    setPhotoError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData((prev) => ({ ...prev, avatar: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setFormData((prev) => ({ ...prev, avatar: customUrl.trim() }));
    setCustomUrl('');
    setPhotoError('');
  };

  const handleSelectPreset = (url: string) => {
    setFormData((prev) => ({ ...prev, avatar: url }));
    setPhotoError('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDoctorProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200 transition-colors">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="font-headline font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0]">settings_account_box</span>
            <span>{t('settings')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isRTL ? "إدارة بيانات الطبيب المعالج، الصورة الشخصية، وتخصيص الغرفة والعيادة" : "Manage your attending specialist credentials, profile photo, and operatory suite allocation"}
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl animate-in fade-in slide-in-from-top-1">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{isRTL ? "تم حفظ التعديلات بنجاح!" : "Changes Saved Successfully!"}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Doctor Profile Picture Upload Section */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 shadow-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0] text-[22px]">account_circle</span>
              <span>{isRTL ? "الصورة الشخصية للطبيب" : "Attending Doctor Profile Picture"}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isRTL ? "ارفع صورتك السريرية الرسمية أو اختر من الصور النموذجية المعتمدة." : "Upload your official clinical portrait or select a verified specialist avatar."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Current Avatar Preview */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200/80 dark:border-slate-700 text-center">
              <div className="relative group">
                <img
                  src={formData.avatar || PRESET_AVATARS[0].url}
                  alt={formData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg group-hover:opacity-90 transition-all"
                  onError={(e) => {
                    (e.target as HTMLElement).setAttribute('src', PRESET_AVATARS[0].url);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`absolute bottom-1 ${isRTL ? 'left-1' : 'right-1'} w-9 h-9 rounded-full bg-[#006194] hover:bg-[#004b73] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800 transition-all cursor-pointer`}
                  title="Upload new photo"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>
              </div>

              <span className="font-bold text-sm text-slate-900 dark:text-white mt-3">{formData.name}</span>
              <span className="text-xs text-[#006194] dark:text-[#00a3e0] font-medium">{formData.specialty}</span>
            </div>

            {/* Upload & Presets Actions */}
            <div className="md:col-span-8 space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-[#006194] hover:bg-[#004b73] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                  <span>{isRTL ? "رفع صورة من جهازك" : "Upload Local Photo"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, avatar: PRESET_AVATARS[0].url }))}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                >
                  {isRTL ? "استعادة الصورة الافتراضية" : "Reset to Default"}
                </button>
              </div>

              {photoError && (
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{photoError}</p>
              )}

              {/* Direct URL Input */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  {isRTL ? "أو أدخل رابط صورة مباشرة (URL)" : "Or Paste Direct Image Web URL"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/doctor-photo.jpg"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#006194]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-4 py-2 rounded-xl border border-[#006194] text-[#006194] dark:text-[#00a3e0] hover:bg-blue-50 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
                  >
                    {isRTL ? "تطبيق الرابط" : "Apply URL"}
                  </button>
                </div>
              </div>

              {/* Presets Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {isRTL ? "نماذج صور معتمدة" : "Select from Verified Specialist Avatars"}
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`cursor-pointer rounded-2xl p-1 border-2 transition-all overflow-hidden ${
                        formData.avatar === preset.url
                          ? 'border-[#006194] ring-2 ring-[#006194]/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Doctor Information Fields */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0] text-[22px]">badge</span>
              <span>{isRTL ? "بيانات الاعتماد والتخصص" : "Specialist Profile & Credentials"}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {isRTL ? "اسم الطبيب" : "Full Name"} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#006194]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {isRTL ? "التخصص السريري" : "Clinical Specialty"} *
              </label>
              <input
                type="text"
                required
                value={formData.specialty}
                onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#006194]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {isRTL ? "رقم الهاتف" : "Phone Number"} *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-[#006194]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {isRTL ? "البريد الإلكتروني" : "Email Address"} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#006194]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {isRTL ? "العيادة والغرفة المخصصة" : "Assigned Clinic Suite"}
              </label>
              <select
                value={formData.assignedClinic}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedClinic: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#006194]"
              >
                {clinics.map((c) => {
                  const isOccupiedByOther = Boolean(c.doctorName && c.doctorName !== doctorProfile.name && c.status === 'occupied');
                  return (
                    <option key={c.id} value={c.name} disabled={isOccupiedByOther}>
                      {c.name} {isOccupiedByOther ? (isRTL ? `(مشغولة: ${c.doctorName})` : `(Occupied: ${c.doctorName})`) : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {isRTL ? "رقم ترخيص مزاولة المهنة" : "License Number"}
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-[#006194]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {isRTL ? "النبذة المهنية والمؤهلات" : "Professional Bio & Qualifications"}
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#006194]"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#006194] hover:bg-[#004b73] text-white text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>{t('save')}</span>
            </button>
          </div>
        </div>

        {/* 3. Supabase Cloud Database Sync Card */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div>
              <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0] text-[22px]">cloud_sync</span>
                <span>{isRTL ? "مزامنة قاعدة بيانات Supabase السحابية" : "Supabase Cloud Database & Data Sync"}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isRTL 
                  ? "رفع ومزامنة بيانات الـ 3 دكاترة والـ 3 مرضى وجميع السجلات الطبية مباشرة إلى السحابة." 
                  : "Sync the 3 attending doctors, 3 primary patients, and all clinical records directly to your Supabase project."}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>vergecufkruhmpygvmwa.supabase.co</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">medical_services</span>
                <span>{isRTL ? "3 أطباء: د. أحمد السيد، د. محمد حسن، د. محمود إبراهيم" : "3 Doctors: Dr. Ahmed, Dr. Mohamed, Dr. Mahmoud"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[18px]">personal_injury</span>
                <span>{isRTL ? "3 مرضى: محمد علي، أليس سميث، إميلي ويليامز" : "3 Patients: Mohamed Ali, Alice Smith, Emily Williams"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isRTL 
                ? "تم تجهيز كود SQL في ملف supabase-schema.sql مع أمر INSERT للـ 3 دكاترة والـ 3 مرضى." 
                : "Full schema and seed SQL are prepared in supabase-schema.sql for one-click execution."}
            </p>

            <button
              type="button"
              onClick={async () => {
                const res = await (await import('../services/supabaseService')).supabaseService.seedAllInitialData();
                if (res.success) {
                  alert(isRTL ? "تم بنجاح رفع ومزامنة بيانات الـ 3 دكاترة والـ 3 مرضى إلى قاعدة بيانات Supabase!" : res.message);
                } else {
                  alert(isRTL ? "تأكد من تشغيل ملف supabase-schema.sql في Supabase SQL Editor أولاً: " + res.message : res.message);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>{isRTL ? "رفع البيانات الآن للسحابة" : "Sync Data to Supabase Now"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
