import React, { useState, useRef } from 'react';
import { DoctorProfile, ClinicRoom } from '../types';

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
  const [formData, setFormData] = useState<DoctorProfile>({ ...doctorProfile });
  const [customUrl, setCustomUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size should be less than 5MB.');
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
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
        <div>
          <h1 className="font-headline font-bold text-2xl text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006194]">settings_account_box</span>
            <span>Clinic & Doctor Profile Settings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your attending specialist credentials, profile photo, and operatory suite allocation
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl animate-in fade-in slide-in-from-top-1">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Changes Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Doctor Profile Picture Upload Section (User explicit requirement) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2e8f0] shadow-xs">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="font-headline font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194] text-[22px]">account_circle</span>
              <span>Attending Doctor Profile Picture</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your official clinical portrait or select a verified specialist avatar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Current Avatar Preview */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
              <div className="relative group">
                <img
                  src={formData.avatar || PRESET_AVATARS[0].url}
                  alt={formData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-90 transition-all"
                  onError={(e) => {
                    (e.target as HTMLElement).setAttribute('src', PRESET_AVATARS[0].url);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#006194] hover:bg-[#004b73] text-white flex items-center justify-center shadow-md border-2 border-white transition-all cursor-pointer"
                  title="Upload new photo"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>
              </div>

              <h4 className="font-bold text-sm text-slate-900 mt-3">{formData.name}</h4>
              <p className="text-xs text-[#006194] font-medium">{formData.specialty}</p>
              <span className="mt-2 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100/80 text-[#006194]">
                {formData.assignedClinic}
              </span>
            </div>

            {/* Upload Controls & Presets */}
            <div className="md:col-span-8 space-y-4">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="doctor-photo-upload-input"
              />

              {/* Upload Button & Reset */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Upload From Computer
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-[#006194] text-white hover:bg-[#004b73] rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    <span>Upload Image File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset(PRESET_AVATARS[0].url)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    <span>Reset Default Photo</span>
                  </button>
                </div>
                {photoError && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium">{photoError}</p>
                )}
              </div>

              {/* Direct Image URL Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Or Paste Photo Web URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/doctor-portrait.jpg"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-[#f8fafc] text-xs text-slate-800 focus:outline-none focus:border-[#006194]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    disabled={!customUrl.trim()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Apply URL
                  </button>
                </div>
              </div>

              {/* Specialist Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Select Specialist Preset Avatar
                </label>
                <div className="flex flex-wrap gap-3">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`relative rounded-full p-0.5 transition-all cursor-pointer ${
                        formData.avatar === preset.url
                          ? 'ring-3 ring-[#006194] shadow-md scale-105'
                          : 'hover:ring-2 hover:ring-slate-300 opacity-80 hover:opacity-100'
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Doctor Practitioner Info */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e2e8f0] shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <h2 className="font-headline font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194] text-[22px]">badge</span>
              <span>Practitioner Clinical Details</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Personal credentials and specialty shown across consultation sheets and queue records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Practitioner Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-sm text-slate-800 focus:outline-none focus:border-[#006194]"
                placeholder="e.g. Dr. Ahmed Al-Sayed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Clinical Specialty / Field
              </label>
              <input
                type="text"
                required
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-sm text-slate-800 focus:outline-none focus:border-[#006194]"
                placeholder="e.g. Prosthodontics & Implantology"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Assigned Operatory Suite (عيادة الطبيب)
              </label>
              <select
                value={formData.assignedClinic}
                onChange={(e) => setFormData({ ...formData, assignedClinic: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-sm text-slate-800 focus:outline-none focus:border-[#006194]"
              >
                {clinics.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} {c.id === 1 ? '(Primary Prosthodontics)' : c.id === 2 ? '(Oral Surgery)' : c.id === 3 ? '(Endodontics)' : '(Pediatric & Ortho)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Consultation Fee ($ USD)
              </label>
              <input
                type="number"
                min={0}
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-sm text-slate-800 focus:outline-none focus:border-[#006194]"
                placeholder="150"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Clinic Contact Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-sm text-slate-800 focus:outline-none focus:border-[#006194]"
                placeholder="+1 (555) 234-5678"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Clinic Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-sm text-slate-800 focus:outline-none focus:border-[#006194]"
                placeholder="dr.ahmed@dentalcarepro.clinic"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Doctor Bio & Clinical Focus
            </label>
            <textarea
              rows={3}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-sm text-slate-800 focus:outline-none focus:border-[#006194] resize-none"
              placeholder="Specializing in complex restorative prosthodontics, digital smile design, and guided implant surgery with over 12 years of clinical excellence."
            />
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3 bg-[#006194] hover:bg-[#004b73] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Save Profile & Clinic Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
