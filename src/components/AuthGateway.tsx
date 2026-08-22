import React, { useState, useEffect } from 'react';
import { Patient, ClinicRoom } from '../types';
import { CLINIC_ROOMS, INITIAL_PATIENTS } from '../data/initialData';
import { UnifiedLogin } from './UnifiedLogin';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface AuthGatewayProps {
  patients?: Patient[];
  clinics?: ClinicRoom[];
  onDoctorLoginSuccess: () => void;
  onPatientLoginSuccess: (patientId?: string) => void;
  onPatientSignUpSuccess?: (patient: Patient) => void;
}

interface BeforeAfterCase {
  id: string;
  patientName: string;
  arabicPatientName: string;
  title: string;
  arabicTitle: string;
  doctor: string;
  arabicDoctor: string;
  specialty: string;
  arabicSpecialty: string;
  duration: string;
  arabicDuration: string;
  beforeImg: string;
  afterImg: string;
  description: string;
  arabicDescription: string;
  tags: string[];
  arabicTags: string[];
}

const BEFORE_AFTER_CASES: BeforeAfterCase[] = [
  {
    id: 'case-1',
    patientName: 'Mohamed Ali',
    arabicPatientName: 'محمد علي',
    title: 'Composite Occlusal Restoration & Cavity Treatment',
    arabicTitle: 'حشو تجميلي ضوئي وعلاج تسوس الأسنان الخلفية',
    doctor: 'Dr. Ahmed Al-Sayed',
    arabicDoctor: 'د. أحمد السيد',
    specialty: 'Restorative & Aesthetic Dentistry',
    arabicSpecialty: 'علاج وتجميل الأسنان',
    duration: '1 Session (30 Minutes)',
    arabicDuration: 'جلسة واحدة (30 دقيقة)',
    beforeImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNUJfRvywofbv1G0KsVnD1hWkBS1MArwp6OLKVjZqEJNF28ij4qxEEq9SZGP1DBObE8hVjZPcl7IAqgCw7_x6vB5JBNMrHuBDyckX0ZydrRFcTa9qYfI6OjiDXV3wkLjjaqH7pWOh9LvsTT1rfrhJlWiX0qP97DTBABJhoiMvH06Qel_qGXCgCRDIKylpdsdOfCMkV4cvSP7V_WnVlSS-lhlb4hve4K-iERWoRkPwktmYkGiKOfp_lsg',
    afterImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC21kFRx_5ktBeCwtdIqlXj2Irk3hdlAatenkJ_OLad6viNnIr-9f8ZMQqNsZmzFbDi-NgBce-oLRALpVn2saWVWLskqkF87-0A68_132Anub0x00PVWxQonHuJmljF-Vw02kxweA5CLdy7Y7VgHGDCMQER8SJ5o7ErTc7J9U2Ggrwb1x9cu0tDtJEAIyUqK7QPVKrQ1z6tQC3qFVZU9hEP7X-eqc3SahcM13GiDkMGP0ICEVwTA1Nqg',
    description: 'Removal of deep fissures caries and anatomical biomimetic composite layer restoration matching natural enamel and dentin opacity.',
    arabicDescription: 'تنظيف تسوس عميق وبناء طبقات حشو تجميلي متطابق مع مينا الأسنان ولونها الطبيعي دون ألم.',
    tags: ['Composite Filling', 'Restorative', 'Biomimetic'],
    arabicTags: ['حشو تجميلي', 'ترميم الأسنان', 'طبقات ضوئية']
  },
  {
    id: 'case-2',
    patientName: 'Sarah Hassan',
    arabicPatientName: 'سارة حسن',
    title: 'Porcelain Veneers & Hollywood Smile Makeover',
    arabicTitle: 'عدسات فينيرز تجميلية وابتسامة هوليوود المتناسقة',
    doctor: 'Dr. Mohamed',
    arabicDoctor: 'د. محمد',
    specialty: 'Cosmetic Dentistry',
    arabicSpecialty: 'تجميل الأسنان والابتسامة',
    duration: '2 Weeks (2 Visits)',
    arabicDuration: 'أسبوعان (زيارتان)',
    beforeImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZoqMgIOkE4Sf3l_Cm61qM0gcqafhyt0fXCeYneDdS-j0DJIBrJdB24DVWx3ZdF6wKBGrengis_lUoIYcH-n1B_xfE9lPYn7iuxmUSZwWtvk6e7BbvYkRrciVJ38g9kIhDn3pTq4-8WytqOkA3gmu8PjfqWea5dtp5qz49_50y7tbU-7ciKeQkFwxQhwuf6jP5ewgxca0a9_i3YESSCRF_6zXJXlUL1MG4dLGyTqHK9rGXWUImgQXMuw',
    afterImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC21kFRx_5ktBeCwtdIqlXj2Irk3hdlAatenkJ_OLad6viNnIr-9f8ZMQqNsZmzFbDi-NgBce-oLRALpVn2saWVWLskqkF87-0A68_132Anub0x00PVWxQonHuJmljF-Vw02kxweA5CLdy7Y7VgHGDCMQER8SJ5o7ErTc7J9U2Ggrwb1x9cu0tDtJEAIyUqK7QPVKrQ1z6tQC3qFVZU9hEP7X-eqc3SahcM13GiDkMGP0ICEVwTA1Nqg',
    description: 'Custom handcrafted E-max porcelain veneers on upper anterior teeth to close midline diastema and elevate aesthetic symmetry.',
    arabicDescription: 'تركيب عدسات إيماكس الخزفية للأسنان الأمامية العلوية لغلق الفراغات وتنسيق شكل الابتسامة.',
    tags: ['E-max Veneers', 'Hollywood Smile', 'Aesthetics'],
    arabicTags: ['عدسات إيماكس', 'ابتسامة هوليوود', 'تجميل']
  },
  {
    id: 'case-3',
    patientName: 'Karim Mahmoud',
    arabicPatientName: 'كريم محمود',
    title: 'Guided Dental Implant & Monolithic Zirconia Crown',
    arabicTitle: 'زراعة سن جراحية موجهة مع طربوش زركونيا',
    doctor: 'Dr. Mahmoud',
    arabicDoctor: 'د. محمود',
    specialty: 'Oral Surgery & Implants',
    arabicSpecialty: 'جراحة الفم وزراعة الأسنان',
    duration: '2 Months (Osseointegration)',
    arabicDuration: 'شهران (التئام وتثبيت)',
    beforeImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZoqMgIOkE4Sf3l_Cm61qM0gcqafhyt0fXCeYneDdS-j0DJIBrJdB24DVWx3ZdF6wKBGrengis_lUoIYcH-n1B_xfE9lPYn7iuxmUSZwWtvk6e7BbvYkRrciVJ38g9kIhDn3pTq4-8WytqOkA3gmu8PjfqWea5dtp5qz49_50y7tbU-7ciKeQkFwxQhwuf6jP5ewgxca0a9_i3YESSCRF_6zXJXlUL1MG4dLGyTqHK9rGXWUImgQXMuw',
    afterImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiZbB6Im6Xu7XRgyfySUQ0rnzkpsVPotlguTz9Lc_4_emwRGMwsUZWk3jCQBBPjON9pZuCcuZfZ0KaU-MkTNwd9E8-kJE4qE1RADCiJB27t36OOZEyT-ZN1pDoXnCmgs2ooji4aVFiB8wTydeRlOVM82YUG3ff7vcdwl0bunNK8c4GwHUUZsSmM2gZ89ZmSwEnEOur8ZdQ9453Rv-Z-PYTDwMmgCtqMDKB-feeN-LgSgmRtgHZDdjoNg',
    description: 'Computer-guided titanium implant placement at site #36 followed by screw-retained ceramic crown with ideal tissue emergence profile.',
    arabicDescription: 'غرس زرعة تيتانيوم موجهة رقمياً في الضرس رقم 36 مع تركيب تاج زركونيا عالي الصلابة والجمال.',
    tags: ['Dental Implant', 'Endodontics', 'Surgery'],
    arabicTags: ['زراعة أسنان', 'جراحة', 'زركونيا']
  },
  {
    id: 'case-4',
    patientName: 'Nourhan Tarek',
    arabicPatientName: 'نورهان طارق',
    title: 'In-Office Laser Teeth Whitening & Polishing',
    arabicTitle: 'جلسة تبييض الأسنان بالليزر وإزالة التصبغات',
    doctor: 'Dr. Ahmed',
    arabicDoctor: 'د. أحمد',
    specialty: 'Aesthetic Dentistry',
    arabicSpecialty: 'تبييض وتنظيف الأسنان',
    duration: '1 Session (45 Minutes)',
    arabicDuration: 'جلسة واحدة (45 دقيقة)',
    beforeImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNUJfRvywofbv1G0KsVnD1hWkBS1MArwp6OLKVjZqEJNF28ij4qxEEq9SZGP1DBObE8hVjZPcl7IAqgCw7_x6vB5JBNMrHuBDyckX0ZydrRFcTa9qYfI6OjiDXV3wkLjjaqH7pWOh9LvsTT1rfrhJlWiX0qP97DTBABJhoiMvH06Qel_qGXCgCRDIKylpdsdOfCMkV4cvSP7V_WnVlSS-lhlb4hve4K-iERWoRkPwktmYkGiKOfp_lsg',
    afterImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC21kFRx_5ktBeCwtdIqlXj2Irk3hdlAatenkJ_OLad6viNnIr-9f8ZMQqNsZmzFbDi-NgBce-oLRALpVn2saWVWLskqkF87-0A68_132Anub0x00PVWxQonHuJmljF-Vw02kxweA5CLdy7Y7VgHGDCMQER8SJ5o7ErTc7J9U2Ggrwb1x9cu0tDtJEAIyUqK7QPVKrQ1z6tQC3qFVZU9hEP7X-eqc3SahcM13GiDkMGP0ICEVwTA1Nqg',
    description: 'Photothermal blue light laser activation removing deep tea/coffee staining and restoring 6 shades of brightness with zero tooth sensitivity.',
    arabicDescription: 'تفتيح 6 درجات لونية بجلسة ليزر متطورة لإزالة تصبغات القهوة والتدخين بدون أي تحسس.',
    tags: ['Laser Whitening', 'Smile Refresh', 'Hygiene'],
    arabicTags: ['تبييض ليزر', 'تلميع', 'عناية بصحة الفم']
  },
  {
    id: 'case-5',
    patientName: 'Youssef Ibrahim',
    arabicPatientName: 'يوسف إبراهيم',
    title: 'Full Arch Ceramic Bridge & Smile Reconstruction',
    arabicTitle: 'تركيب جسر سيراميك كامل وتجميل الابتسامة',
    doctor: 'Dr. Mohamed',
    arabicDoctor: 'د. محمد',
    specialty: 'Prosthodontics',
    arabicSpecialty: 'التركيبات الثابتة والجسور',
    duration: '3 Weeks (3 Visits)',
    arabicDuration: '3 أسابيع (3 زيارات)',
    beforeImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZoqMgIOkE4Sf3l_Cm61qM0gcqafhyt0fXCeYneDdS-j0DJIBrJdB24DVWx3ZdF6wKBGrengis_lUoIYcH-n1B_xfE9lPYn7iuxmUSZwWtvk6e7BbvYkRrciVJ38g9kIhDn3pTq4-8WytqOkA3gmu8PjfqWea5dtp5qz49_50y7tbU-7ciKeQkFwxQhwuf6jP5ewgxca0a9_i3YESSCRF_6zXJXlUL1MG4dLGyTqHK9rGXWUImgQXMuw',
    afterImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC21kFRx_5ktBeCwtdIqlXj2Irk3hdlAatenkJ_OLad6viNnIr-9f8ZMQqNsZmzFbDi-NgBce-oLRALpVn2saWVWLskqkF87-0A68_132Anub0x00PVWxQonHuJmljF-Vw02kxweA5CLdy7Y7VgHGDCMQER8SJ5o7ErTc7J9U2Ggrwb1x9cu0tDtJEAIyUqK7QPVKrQ1z6tQC3qFVZU9hEP7X-eqc3SahcM13GiDkMGP0ICEVwTA1Nqg',
    description: 'Digital 3D aligner staging resolving anterior tooth crowding, crossbite alignment, and achieving an expansive smile contour.',
    arabicDescription: 'تركيب جسر خزفي متين لتعويض الأسنان المفقودة واستعادة القدرة الطبيعية على المضغ مع مظهر جمالي متناسق.',
    tags: ['Ceramic Bridge', 'Reconstruction', 'Prosthetics'],
    arabicTags: ['جسر سيراميك', 'تعويض أسنان', 'تركيبات']
  }
];

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  patients = INITIAL_PATIENTS,
  clinics = CLINIC_ROOMS,
  onDoctorLoginSuccess,
  onPatientLoginSuccess,
  onPatientSignUpSuccess
}) => {
  const { theme, toggleTheme, lang, toggleLanguage, t, isRTL } = useAppThemeLanguage();

  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-between text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#006194] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-2xl">dentistry</span>
          </div>
          <div>
            <h1 className="font-headline font-bold text-lg text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
              <span>{t('app_title')}</span>
              <span className="text-[11px] font-normal text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                {t('healthcare_portal')}
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('portal_subtitle')}</p>
          </div>
        </div>

        {/* Top Controls: Language Switcher, Theme Switcher, Unified Portal Status Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
          >
            <span className="material-symbols-outlined text-[17px] text-[#006194] dark:text-[#00a3e0]">language</span>
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-500 dark:text-amber-400 border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title={theme === 'dark' ? t('light_mode') : t('dark_mode')}
          >
            <span className="material-symbols-outlined text-[19px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0] text-[18px]">verified_user</span>
            <span>{t('unified_access')}</span>
          </div>
        </div>
      </header>

      {/* Quick Demo Access Bar */}
      <div className="bg-blue-50 dark:bg-blue-950/80 border-b border-blue-200 dark:border-blue-800/40 text-blue-900 dark:text-blue-200 px-6 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-900 dark:text-white">{t('direct_demo_access')}</span>
          <span className="text-slate-600 dark:text-slate-300">{t('demo_description')}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDoctorLoginSuccess}
            className="bg-[#006194] hover:bg-[#004b73] text-white px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">stethoscope</span>
            <span>{t('enter_as_doctor')}</span>
          </button>
          <button
            onClick={() => onPatientLoginSuccess('849201')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">account_circle</span>
            <span>{t('enter_as_patient')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8">
        
        {/* Top Split: Left Interactive Before/After Showcase + Right Login Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Before & After Transformation Showcase */}
          <div 
            className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-5 relative transition-colors"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Header with Case Counter & Autoplay Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0] text-2xl">compare</span>
                  <h3 className="font-headline font-bold text-xl text-slate-900 dark:text-white">
                    {t('before_after_title')}
                  </h3>
                  <span className="bg-blue-50 dark:bg-blue-950 text-[#006194] dark:text-[#00a3e0] border border-blue-200 dark:border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {isRTL ? "عرض تلقائي متتابع" : "Loop Slider"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('before_after_subtitle')}
                </p>
              </div>

              {/* Slider Controls: Auto-play status & Next/Prev */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  title={isAutoPlaying ? (isRTL ? 'إيقاف مؤقت' : 'Pause Auto-slide') : (isRTL ? 'تشغيل تلقائي' : 'Resume Auto-slide')}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isAutoPlaying ? 'pause' : 'play_arrow'}
                  </span>
                  <span className="hidden sm:inline">{isAutoPlaying ? (isRTL ? 'تلقائي' : 'Auto') : (isRTL ? 'متوقف' : 'Paused')}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevCase}
                    title={isRTL ? "الحالة السابقة" : "Previous Patient"}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isRTL ? 'chevron_right' : 'chevron_left'}
                    </span>
                  </button>

                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 px-1">
                    {selectedCaseIdx + 1}/{BEFORE_AFTER_CASES.length}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextCase}
                    title={isRTL ? "الحالة التالية" : "Next Patient"}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isRTL ? 'chevron_left' : 'chevron_right'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Loop Autoplay Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
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

            {/* Single Image Frame: 50% Left (Before) and 50% Right (After) */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-700 aspect-16/10 select-none group shadow-lg">
              {/* Animated Carousel Slide for current Patient */}
              <div 
                key={currentCase.id} 
                className="w-full h-full grid grid-cols-2 relative transition-all duration-500 ease-out animate-fadeIn"
              >
                {/* LEFT HALF: BEFORE */}
                <div className="relative h-full overflow-hidden bg-slate-900 border-r-2 border-white/90">
                  <img
                    src={currentCase.beforeImg}
                    alt={`${currentCase.patientName} - ${t('before_badge')}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />
                  
                  {/* BEFORE BADGE */}
                  <div className="absolute top-3.5 left-3.5 z-10 bg-rose-600/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-lg border border-rose-400/40 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    <span>{t('before_badge')}</span>
                  </div>
                </div>

                {/* RIGHT HALF: AFTER */}
                <div className="relative h-full overflow-hidden bg-slate-900">
                  <img
                    src={currentCase.afterImg}
                    alt={`${currentCase.patientName} - ${t('after_badge')}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />

                  {/* AFTER BADGE */}
                  <div className="absolute top-3.5 right-3.5 z-10 bg-emerald-600/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-lg border border-emerald-400/40 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>{t('after_badge')}</span>
                  </div>
                </div>
              </div>

              {/* Center Crisp Divider Line */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center justify-center">
                <div className="w-1 h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                <div className="absolute top-1/2 -translate-y-1/2 bg-slate-900/90 text-white border-2 border-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xl backdrop-blur-md flex items-center gap-1">
                  <span>{isRTL ? "قبل" : "Before"}</span>
                  <span className="text-slate-400">|</span>
                  <span>{isRTL ? "بعد" : "After"}</span>
                </div>
              </div>

              {/* Patient Name Overlay on bottom */}
              <div className="absolute bottom-3 left-3 z-20 bg-slate-950/85 backdrop-blur-md text-slate-200 border border-slate-700/80 text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                <span className="material-symbols-outlined text-[16px] text-[#00a3e0]">account_circle</span>
                <span className="font-bold text-white">
                  {currentCase.patientName}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] text-slate-300 font-medium">
                  {isRTL ? currentCase.arabicSpecialty : currentCase.specialty}
                </span>
              </div>
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
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedCaseIdx === idx ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                  <span>{c.patientName}</span>
                </button>
              ))}
            </div>

            {/* Case Details & Narrative */}
            <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {isRTL ? currentCase.arabicTitle : currentCase.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {(isRTL ? currentCase.arabicTags : currentCase.tags).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isRTL ? currentCase.arabicDescription : currentCase.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {t('doctor')}: <strong className="text-slate-900 dark:text-white">{currentCase.doctor}</strong> ({isRTL ? currentCase.arabicSpecialty : currentCase.specialty})
                </span>
                <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {t('treatment_duration')}: <strong className="text-slate-800 dark:text-slate-200">{isRTL ? currentCase.arabicDuration : currentCase.duration}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Active Form Container (PERMANENTLY WHITE CARD) */}
          <div className="lg:col-span-5 flex justify-center">
            <UnifiedLogin
              patients={patients}
              onDoctorLoginSuccess={onDoctorLoginSuccess}
              onPatientLoginSuccess={(patientId) => onPatientLoginSuccess(patientId)}
            />
          </div>
        </div>

        {/* Public Clinic Suites & Active Doctors Roster */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006194] dark:text-[#00a3e0] text-2xl">medical_information</span>
                <h3 className="font-headline font-bold text-xl text-slate-900 dark:text-white">
                  {t('active_suites_title')}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('active_suites_subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{t('live_room_status')}</span>
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
                      ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-[#006194]'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {isRTL ? room.name.replace('Clinic', 'عيادة') : room.name}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                        {room.doctorName ? room.doctorName : t('available_suite')}
                      </h4>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isOccupied
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isOccupied ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      <span>{isOccupied ? t('in_session') : t('ready_suite')}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                    {room.doctorAvatar ? (
                      <img
                        src={room.doctorAvatar}
                        alt={room.doctorName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-600 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-[20px]">meeting_room</span>
                      </div>
                    )}

                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {isRTL ? (room.doctorSpecialty ? 'طب وجراحة الأسنان' : 'كشف عام وأشعة') : (room.doctorSpecialty || 'General Operatory & Imaging')}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {room.currentPatient
                          ? `${isRTL ? 'المريض' : 'Patient'}: ${room.currentPatient}`
                          : t('open_for_consultations')}
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
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 transition-colors">
        {isRTL
          ? 'نظام إدارة العيادات والمراكز الطبية للأسنان © 2026 • متوافق مع معايير الأمان والخصوصية الطبية'
          : 'DentalCare Clinical Management System © 2026 • HIPAA Compliant & ISO 27001 Certified'}
      </footer>
    </div>
  );
};


