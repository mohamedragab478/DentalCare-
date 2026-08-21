import React, { useState, useEffect } from 'react';
import { Patient, ClinicRoom } from '../types';
import { CLINIC_ROOMS } from '../data/initialData';
import { DoctorLogin } from './DoctorLogin';
import { PatientLogin } from './PatientLogin';
import { PatientSignUp } from './PatientSignUp';

interface AuthGatewayProps {
  initialTab?: 'doctor-login' | 'patient-login' | 'patient-signup';
  clinics?: ClinicRoom[];
  onDoctorLoginSuccess: () => void;
  onPatientLoginSuccess: (patientId?: string) => void;
  onPatientSignUpSuccess: (patient: Patient) => void;
}

interface BeforeAfterCase {
  id: string;
  patientName: string;
  title: string;
  arabicTitle: string;
  doctor: string;
  specialty: string;
  duration: string;
  beforeImg: string;
  afterImg: string;
  description: string;
  tags: string[];
}

const BEFORE_AFTER_CASES: BeforeAfterCase[] = [
  {
    id: 'case-1',
    patientName: 'Mohamed Ali',
    title: 'Full Arch Ceramic Bridge & Smile Reconstruction',
    arabicTitle: 'تركيب جسر سيراميك كامل وتجميل الابتسامة',
    doctor: 'Dr. Ahmed Al-Sayed',
    specialty: 'Prosthodontics',
    duration: '3 Weeks (4 Visits)',
    beforeImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZoqMgIOkE4Sf3l_Cm61qM0gcqafhyt0fXCeYneDdS-j0DJIBrJdB24DVWx3ZdF6wKBGrengis_lUoIYcH-n1B_xfE9lPYn7iuxmUSZwWtvk6e7BbvYkRrciVJ38g9kIhDn3pTq4-8WytqOkA3gmu8PjfqWea5dtp5qz49_50y7tbU-7ciKeQkFwxQhwuf6jP5ewgxca0a9_i3YESSCRF_6zXJXlUL1MG4dLGyTqHK9rGXWUImgQXMuw',
    afterImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC21kFRx_5ktBeCwtdIqlXj2Irk3hdlAatenkJ_OLad6viNnIr-9f8ZMQqNsZmzFbDi-NgBce-oLRALpVn2saWVWLskqkF87-0A68_132Anub0x00PVWxQonHuJmljF-Vw02kxweA5CLdy7Y7VgHGDCMQER8SJ5o7ErTc7J9U2Ggrwb1x9cu0tDtJEAIyUqK7QPVKrQ1z6tQC3qFVZU9hEP7X-eqc3SahcM13GiDkMGP0ICEVwTA1Nqg',
    description: 'Correction of severe occlusal wear and missing premolars restored with a 4-unit monolithic Zirconia bridge with natural shade gradation.',
    tags: ['Zirconia Bridge', 'Smile Design', 'Prosthodontics']
  },
  {
    id: 'case-2',
    patientName: 'Sarah Hassan',
    title: 'Porcelain Veneers & Hollywood Smile Makeover',
    arabicTitle: 'عدسات فينيرز تجميلية وابتسامة هوليوود المتناسقة',
    doctor: 'Dr. Mohamed',
    specialty: 'Cosmetic Dentistry',
    duration: '2 Weeks (2 Visits)',
    beforeImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNUJfRvywofbv1G0KsVnD1hWkBS1MArwp6OLKVjZqEJNF28ij4qxEEq9SZGP1DBObE8hVjZPcl7IAqgCw7_x6vB5JBNMrHuBDyckX0ZydrRFcTa9qYfI6OjiDXV3wkLjjaqH7pWOh9LvsTT1rfrhJlWiX0qP97DTBABJhoiMvH06Qel_qGXCgCRDIKylpdsdOfCMkV4cvSP7V_WnVlSS-lhlb4hve4K-iERWoRkPwktmYkGiKOfp_lsg',
    afterImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC21kFRx_5ktBeCwtdIqlXj2Irk3hdlAatenkJ_OLad6viNnIr-9f8ZMQqNsZmzFbDi-NgBce-oLRALpVn2saWVWLskqkF87-0A68_132Anub0x00PVWxQonHuJmljF-Vw02kxweA5CLdy7Y7VgHGDCMQER8SJ5o7ErTc7J9U2Ggrwb1x9cu0tDtJEAIyUqK7QPVKrQ1z6tQC3qFVZU9hEP7X-eqc3SahcM13GiDkMGP0ICEVwTA1Nqg',
    description: 'Custom handcrafted E-max porcelain veneers on upper anterior teeth to close midline diastema and elevate aesthetic symmetry.',
    tags: ['E-max Veneers', 'Hollywood Smile', 'Aesthetics']
  },
  {
    id: 'case-3',
    patientName: 'Karim Mahmoud',
    title: 'Guided Dental Implant & Monolithic Zirconia Crown',
    arabicTitle: 'زراعة سن جراحية موجهة مع طربوش زركونيا',
    doctor: 'Dr. Mahmoud',
    specialty: 'Oral Surgery & Implants',
    duration: '2 Months (Osseointegration)',
    beforeImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZoqMgIOkE4Sf3l_Cm61qM0gcqafhyt0fXCeYneDdS-j0DJIBrJdB24DVWx3ZdF6wKBGrengis_lUoIYcH-n1B_xfE9lPYn7iuxmUSZwWtvk6e7BbvYkRrciVJ38g9kIhDn3pTq4-8WytqOkA3gmu8PjfqWea5dtp5qz49_50y7tbU-7ciKeQkFwxQhwuf6jP5ewgxca0a9_i3YESSCRF_6zXJXlUL1MG4dLGyTqHK9rGXWUImgQXMuw',
    afterImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiZbB6Im6Xu7XRgyfySUQ0rnzkpsVPotlguTz9Lc_4_emwRGMwsUZWk3jCQBBPjON9pZuCcuZfZ0KaU-MkTNwd9E8-kJE4qE1RADCiJB27t36OOZEyT-ZN1pDoXnCmgs2ooji4aVFiB8wTydeRlOVM82YUG3ff7vcdwl0bunNK8c4GwHUUZsSmM2gZ89ZmSwEnEOur8ZdQ9453Rv-Z-PYTDwMmgCtqMDKB-feeN-LgSgmRtgHZDdjoNg',
    description: 'Computer-guided titanium implant placement at site #36 followed by screw-retained ceramic crown with ideal tissue emergence profile.',
    tags: ['Dental Implant', 'Endodontics', 'Surgery']
  },
  {
    id: 'case-4',
    patientName: 'Nourhan Tarek',
    title: 'In-Office Laser Teeth Whitening & Polishing',
    arabicTitle: 'جلسة تبييض الأسنان بالليزر وإزالة التصبغات',
    doctor: 'Dr. Ahmed',
    specialty: 'Aesthetic Dentistry',
    duration: '1 Session (45 Minutes)',
    beforeImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNUJfRvywofbv1G0KsVnD1hWkBS1MArwp6OLKVjZqEJNF28ij4qxEEq9SZGP1DBObE8hVjZPcl7IAqgCw7_x6vB5JBNMrHuBDyckX0ZydrRFcTa9qYfI6OjiDXV3wkLjjaqH7pWOh9LvsTT1rfrhJlWiX0qP97DTBABJhoiMvH06Qel_qGXCgCRDIKylpdsdOfCMkV4cvSP7V_WnVlSS-lhlb4hve4K-iERWoRkPwktmYkGiKOfp_lsg',
    afterImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC21kFRx_5ktBeCwtdIqlXj2Irk3hdlAatenkJ_OLad6viNnIr-9f8ZMQqNsZmzFbDi-NgBce-oLRALpVn2saWVWLskqkF87-0A68_132Anub0x00PVWxQonHuJmljF-Vw02kxweA5CLdy7Y7VgHGDCMQER8SJ5o7ErTc7J9U2Ggrwb1x9cu0tDtJEAIyUqK7QPVKrQ1z6tQC3qFVZU9hEP7X-eqc3SahcM13GiDkMGP0ICEVwTA1Nqg',
    description: 'Photothermal blue light laser activation removing deep tea/coffee staining and restoring 6 shades of brightness with zero tooth sensitivity.',
    tags: ['Laser Whitening', 'Smile Refresh', 'Hygiene']
  },
  {
    id: 'case-5',
    patientName: 'Youssef Ibrahim',
    title: 'Clear Aligner Orthodontic Alignment & Arch Correction',
    arabicTitle: 'تقويم الأسنان الشفاف وتعديل تزاحم الفكين',
    doctor: 'Dr. Mohamed',
    specialty: 'Orthodontics',
    duration: '6 Months (14 Trays)',
    beforeImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZoqMgIOkE4Sf3l_Cm61qM0gcqafhyt0fXCeYneDdS-j0DJIBrJdB24DVWx3ZdF6wKBGrengis_lUoIYcH-n1B_xfE9lPYn7iuxmUSZwWtvk6e7BbvYkRrciVJ38g9kIhDn3pTq4-8WytqOkA3gmu8PjfqWea5dtp5qz49_50y7tbU-7ciKeQkFwxQhwuf6jP5ewgxca0a9_i3YESSCRF_6zXJXlUL1MG4dLGyTqHK9rGXWUImgQXMuw',
    afterImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC21kFRx_5ktBeCwtdIqlXj2Irk3hdlAatenkJ_OLad6viNnIr-9f8ZMQqNsZmzFbDi-NgBce-oLRALpVn2saWVWLskqkF87-0A68_132Anub0x00PVWxQonHuJmljF-Vw02kxweA5CLdy7Y7VgHGDCMQER8SJ5o7ErTc7J9U2Ggrwb1x9cu0tDtJEAIyUqK7QPVKrQ1z6tQC3qFVZU9hEP7X-eqc3SahcM13GiDkMGP0ICEVwTA1Nqg',
    description: 'Digital 3D aligner staging resolving anterior tooth crowding, crossbite alignment, and achieving an expansive smile contour.',
    tags: ['Clear Aligners', 'Orthodontics', 'Invisalign']
  }
];

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  initialTab = 'doctor-login',
  clinics = CLINIC_ROOMS,
  onDoctorLoginSuccess,
  onPatientLoginSuccess,
  onPatientSignUpSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'doctor-login' | 'patient-login' | 'patient-signup'>(initialTab);
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage split for before/after comparison
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play loop slider (slides to next patient every 4.5 seconds)
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const interval = setInterval(() => {
      setSelectedCaseIdx((prev) => (prev + 1) % BEFORE_AFTER_CASES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered]);

  const handleNextCase = () => {
    setSelectedCaseIdx((prev) => (prev + 1) % BEFORE_AFTER_CASES.length);
  };

  const handlePrevCase = () => {
    setSelectedCaseIdx((prev) => (prev - 1 + BEFORE_AFTER_CASES.length) % BEFORE_AFTER_CASES.length);
  };

  const currentCase = BEFORE_AFTER_CASES[selectedCaseIdx];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100">
      {/* Top Header */}
      <header className="w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#006194] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-2xl">dentistry</span>
          </div>
          <div>
            <h1 className="font-headline font-bold text-lg text-white tracking-wide flex items-center gap-2">
              <span>DentalCare Clinic</span>
              <span className="text-[11px] font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                Healthcare Portal
              </span>
            </h1>
            <p className="text-xs text-slate-400">Integrated Clinical Management & Patient Portal</p>
          </div>
        </div>

        {/* Portal Selection Tabs */}
        <div className="flex items-center bg-slate-800/90 p-1.5 rounded-xl border border-slate-700/80 text-xs font-medium">
          <button
            onClick={() => setActiveTab('doctor-login')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'doctor-login'
                ? 'bg-[#006194] text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">stethoscope</span>
            <span>Doctor & Staff</span>
          </button>

          <button
            onClick={() => setActiveTab('patient-login')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'patient-login'
                ? 'bg-[#006194] text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            <span>Patient Login</span>
          </button>

          <button
            onClick={() => setActiveTab('patient-signup')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'patient-signup'
                ? 'bg-[#006194] text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>New Patient</span>
          </button>
        </div>
      </header>

      {/* Quick Demo Access Bar */}
      <div className="bg-blue-950/80 border-b border-blue-800/40 text-blue-200 px-6 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-white">Direct Demo Access:</span>
          <span className="text-slate-300">Click a portal below to enter with full demo privileges</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDoctorLoginSuccess}
            className="bg-[#006194] hover:bg-[#004b73] text-white px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">stethoscope</span>
            <span>Enter as Dr. Ahmed</span>
          </button>
          <button
            onClick={() => onPatientLoginSuccess('849201')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">account_circle</span>
            <span>Enter as Patient (Mohamed Ali)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8">
        
        {/* Top Split: Left Interactive Before/After Showcase + Right Login Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Before & After Transformation Showcase (Single Split Frame per Patient in Looping Slider) */}
          <div 
            className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl space-y-5 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Header with Case Counter & Autoplay Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00a3e0] text-2xl">compare</span>
                  <h3 className="font-headline font-bold text-xl text-white">
                    Before & After Transformations
                  </h3>
                  <span className="bg-blue-950 text-[#00a3e0] border border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Loop Slider
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  معرض حالات المرضى قبل وبعد العلاج (صورة واحدة مقسومة نصفين لكل حالة)
                </p>
              </div>

              {/* Slider Controls: Auto-play status & Next/Prev */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  title={isAutoPlaying ? 'Pause Auto-slide' : 'Resume Auto-slide'}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isAutoPlaying ? 'pause' : 'play_arrow'}
                  </span>
                  <span className="hidden sm:inline">{isAutoPlaying ? 'Auto' : 'Paused'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevCase}
                    title="Previous Patient / الحالة السابقة"
                    className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>

                  <span className="text-xs font-mono font-bold text-slate-400 px-1">
                    {selectedCaseIdx + 1}/{BEFORE_AFTER_CASES.length}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextCase}
                    title="Next Patient / الحالة التالية"
                    className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Loop Autoplay Progress Bar */}
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div
                key={selectedCaseIdx + (isAutoPlaying && !isHovered ? '-active' : '-paused')}
                className={`h-full bg-linear-to-r from-[#006194] to-[#00a3e0] rounded-full ${
                  isAutoPlaying && !isHovered ? 'w-full transition-all duration-4500 ease-linear' : 'w-full opacity-60'
                }`}
                style={{
                  animation: isAutoPlaying && !isHovered ? 'progress 4.5s linear infinite' : 'none'
                }}
              />
            </div>

            {/* Single Image Frame: 50% Before / 50% After Comparison */}
            <div 
              className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-16/10 select-none group shadow-inner"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.max(10, Math.min(rect.width - 10, e.clientX - rect.left));
                const percent = (x / rect.width) * 100;
                setSliderPosition(percent);
              }}
              onTouchMove={(e) => {
                if (e.touches.length > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(10, Math.min(rect.width - 10, e.touches[0].clientX - rect.left));
                  const percent = (x / rect.width) * 100;
                  setSliderPosition(percent);
                }
              }}
            >
              {/* After Image Layer (Full Background) */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={currentCase.afterImg}
                  alt={`${currentCase.patientName} - After Treatment`}
                  className="w-full h-full object-cover"
                />
                {/* AFTER BADGE */}
                <div className="absolute top-3.5 right-3.5 z-10 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-lg border border-emerald-400/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  <span>AFTER (بعد العلاج)</span>
                </div>
              </div>

              {/* Before Image Layer (Clipped at sliderPosition percentage) */}
              <div 
                className="absolute inset-0 h-full overflow-hidden z-5"
                style={{ width: `${sliderPosition}%` }}
              >
                {/* Fixed width container inside so image stays perfectly aligned */}
                <div className="absolute inset-0 w-full h-full" style={{ width: '100%' }}>
                  <img
                    src={currentCase.beforeImg}
                    alt={`${currentCase.patientName} - Before Treatment`}
                    className="w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                {/* BEFORE BADGE */}
                <div className="absolute top-3.5 left-3.5 z-10 bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-lg border border-rose-400/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>BEFORE (قبل العلاج)</span>
                </div>
              </div>

              {/* Divider Line & Glowing Handle */}
              <div 
                className="absolute top-0 bottom-0 z-20 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Vertical Line */}
                <div className="absolute top-0 bottom-0 -left-0.5 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"></div>

                {/* Handle Icon Button */}
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-slate-900 shadow-2xl flex items-center justify-center border-2 border-[#006194]">
                  <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
                </div>
              </div>

              {/* Patient Name Overlay on bottom-left */}
              <div className="absolute bottom-3 left-3 z-10 bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700/70 text-xs px-3 py-1.5 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#00a3e0]">account_circle</span>
                <span className="font-bold text-white">{currentCase.patientName}</span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] text-slate-300">{currentCase.specialty}</span>
              </div>

              {/* Quick Arrow Controls overlaid on image for easy clicking */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevCase();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg border border-slate-700"
                title="Previous Case"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextCase();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg border border-slate-700"
                title="Next Case"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>

            {/* Quick Patient Selection Carousel Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {BEFORE_AFTER_CASES.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    selectedCaseIdx === idx
                      ? 'bg-[#006194] text-white shadow-md border border-blue-400/40 scale-102'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/60'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedCaseIdx === idx ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <span>{c.patientName}</span>
                </button>
              ))}
            </div>

            {/* Case Details & Narrative */}
            <div className="space-y-2.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">{currentCase.title}</h4>
                  <p className="text-xs text-[#00a3e0] font-medium">{currentCase.arabicTitle}</p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {currentCase.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentCase.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400">
                  Doctor: <strong className="text-white">{currentCase.doctor}</strong> ({currentCase.specialty})
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-slate-400">
                  Treatment Duration: <strong className="text-slate-200">{currentCase.duration}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Active Form Container */}
          <div className="lg:col-span-5 flex justify-center">
            {activeTab === 'doctor-login' && (
              <div className="w-full max-w-md">
                <DoctorLogin
                  onLoginSuccess={onDoctorLoginSuccess}
                  onGoToPatientLogin={() => setActiveTab('patient-login')}
                />
              </div>
            )}

            {activeTab === 'patient-login' && (
              <div className="w-full max-w-md">
                <PatientLogin
                  onLoginSuccess={onPatientLoginSuccess}
                  onGoToSignUp={() => setActiveTab('patient-signup')}
                  onGoToDoctorLogin={() => setActiveTab('doctor-login')}
                />
              </div>
            )}

            {activeTab === 'patient-signup' && (
              <div className="w-full max-w-md">
                <PatientSignUp
                  onSignUpSuccess={onPatientSignUpSuccess}
                  onGoToLogin={() => setActiveTab('patient-login')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Public Clinic Suites & Active Doctors Roster (User explicit requirement: "احط الجزء بتاع العيادات و الدكاترة اللى موجودين فيها دى برة خالص قبل ما المريض يسجل دخول") */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00a3e0] text-2xl">medical_information</span>
                <h3 className="font-headline font-bold text-xl text-white">
                  Active Clinic Suites & Attending Specialists
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                العيادات المتاحة بالمركز والأطباء المناوبون وجاهزية غرف العمليات والكشف
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Room Status
              </span>
            </div>
          </div>

          {/* Grid of Clinic Rooms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {clinics.map((room) => {
              const isOccupied = room.status === 'occupied';

              return (
                <div
                  key={room.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isOccupied
                      ? 'bg-slate-800/80 border-slate-700 hover:border-[#006194]'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {room.name}
                      </span>
                      <h4 className="font-bold text-white text-base mt-0.5">
                        {room.doctorName || 'Available Suite'}
                      </h4>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isOccupied
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isOccupied ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                      {isOccupied ? 'In Session' : 'Ready'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-700/60">
                    {room.doctorAvatar ? (
                      <img
                        src={room.doctorAvatar}
                        alt={room.doctorName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-600 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 border border-slate-700">
                        <span className="material-symbols-outlined text-[20px]">meeting_room</span>
                      </div>
                    )}

                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {room.doctorSpecialty || 'General Operatory & Imaging'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {room.currentPatient ? `Patient: ${room.currentPatient}` : 'Open for consultations'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-900 bg-slate-950">
        DentalCare Clinical Management System &copy; 2026 • HIPAA Compliant & ISO 27001 Certified
      </footer>
    </div>
  );
};

