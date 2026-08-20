import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { DoctorLogin } from './DoctorLogin';
import { PatientLogin } from './PatientLogin';
import { PatientSignUp } from './PatientSignUp';

interface AuthGatewayProps {
  initialTab?: 'doctor-login' | 'patient-login' | 'patient-signup';
  onDoctorLoginSuccess: () => void;
  onPatientLoginSuccess: (patientId?: string) => void;
  onPatientSignUpSuccess: (patient: Patient) => void;
}

interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
  tag: string;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZoqMgIOkE4Sf3l_Cm61qM0gcqafhyt0fXCeYneDdS-j0DJIBrJdB24DVWx3ZdF6wKBGrengis_lUoIYcH-n1B_xfE9lPYn7iuxmUSZwWtvk6e7BbvYkRrciVJ38g9kIhDn3pTq4-8WytqOkA3gmu8PjfqWea5dtp5qz49_50y7tbU-7ciKeQkFwxQhwuf6jP5ewgxca0a9_i3YESSCRF_6zXJXlUL1MG4dLGyTqHK9rGXWUImgQXMuw',
    title: 'Precision Dental Diagnostics & Charting',
    subtitle: 'Interactive 32-tooth anatomical mapping, periodontal probing, and unified digital records.',
    tag: 'Next-Gen Clinical Suite'
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC21kFRx_5ktBeCwtdIqlXj2Irk3hdlAatenkJ_OLad6viNnIr-9f8ZMQqNsZmzFbDi-NgBce-oLRALpVn2saWVWLskqkF87-0A68_132Anub0x00PVWxQonHuJmljF-Vw02kxweA5CLdy7Y7VgHGDCMQER8SJ5o7ErTc7J9U2Ggrwb1x9cu0tDtJEAIyUqK7QPVKrQ1z6tQC3qFVZU9hEP7X-eqc3SahcM13GiDkMGP0ICEVwTA1Nqg',
    title: 'Advanced Operatory Suite Management',
    subtitle: 'Real-time room occupancy, attending specialist check-ins, and dedicated surgical workflows.',
    tag: 'Operatory Live Roster'
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNUJfRvywofbv1G0KsVnD1hWkBS1MArwp6OLKVjZqEJNF28ij4qxEEq9SZGP1DBObE8hVjZPcl7IAqgCw7_x6vB5JBNMrHuBDyckX0ZydrRFcTa9qYfI6OjiDXV3wkLjjaqH7pWOh9LvsTT1rfrhJlWiX0qP97DTBABJhoiMvH06Qel_qGXCgCRDIKylpdsdOfCMkV4cvSP7V_WnVlSS-lhlb4hve4K-iERWoRkPwktmYkGiKOfp_lsg',
    title: 'High-Resolution Panoramic Scans & X-Rays',
    subtitle: 'Inspect full jaw radiography, bitewings, and treatment evolution side-by-side.',
    tag: 'Radiography Archives'
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBk5a_rZ_iU7n7h1bQoB3s6y4l0cR2p8t7Y-w2d8G1f4k5a9z3x-7v2b4c6e8',
    title: 'Compassionate Patient-Centered Care',
    subtitle: 'Transparent treatment timelines, upcoming visit tracking, and instant secure patient portal.',
    tag: 'Patient Experience'
  }
];

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  initialTab = 'doctor-login',
  onDoctorLoginSuccess,
  onPatientLoginSuccess,
  onPatientSignUpSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'doctor-login' | 'patient-login' | 'patient-signup'>(initialTab);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Infinite image carousel loop (user requirement)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const currentSlideData = CAROUSEL_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      {/* Top Header / Portal Switcher */}
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
            <p className="text-xs text-slate-400">Integrated Clinical Management & Patient Records</p>
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

      {/* Main Grid: Left Infinite Image Carousel + Right Form */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Infinite Image Carousel (User explicit requirement) */}
        <div 
          className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-4/3 sm:aspect-16/10 lg:aspect-4/4 xl:aspect-4/3 flex flex-col justify-end bg-slate-900 group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slide Background Images */}
          {CAROUSEL_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to reception image if 4th image fails
                  (e.target as HTMLElement).setAttribute('src', CAROUSEL_SLIDES[0].image);
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            </div>
          ))}

          {/* Slide Content Overlay */}
          <div className="relative z-10 p-6 md:p-8 text-white space-y-2">
            <span className="inline-block bg-[#006194]/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-400/30">
              {currentSlideData.tag}
            </span>
            <h3 className="font-headline font-bold text-2xl md:text-3xl leading-tight">
              {currentSlideData.title}
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-md">
              {currentSlideData.subtitle}
            </p>

            {/* Carousel Navigation Dots & Arrows */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {CAROUSEL_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentSlide ? 'w-8 bg-[#006194]' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevSlide}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-xs flex items-center justify-center text-white transition-all cursor-pointer"
                  title="Previous image"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  onClick={handleNextSlide}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-xs flex items-center justify-center text-white transition-all cursor-pointer"
                  title="Next image"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Active Form Container */}
        <div className="lg:col-span-6 flex justify-center">
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

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-900 bg-slate-950">
        DentalCare Clinical Management System &copy; 2026 • HIPAA Compliant & ISO 27001 Certified
      </footer>
    </div>
  );
};
