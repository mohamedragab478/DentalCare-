import React, { useState } from 'react';
import { AppView, Patient, DoctorProfile } from '../types';

interface TopNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  activePatient?: Patient;
  onSelectPatient?: (patient: Patient) => void;
  doctorProfile?: DoctorProfile;
  userRole: 'doctor' | 'patient';
  onLogout: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onNavigate,
  userRole,
  doctorProfile,
  activePatient,
  onLogout
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const isDoctor = userRole === 'doctor';

  const defaultDoctorAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxTdB6BFCRDU6qr8N5YlyqcvvBqAlixK076_tUMWhheQjfjcVCtO0UBEY8sL1jYC9cucKVnoLoEgJlDKaSn0Qb5FJkx7v8MdhtOBjzCb8dHppP7IhiJllCOCEHHLwVXSrsa5mcVTHwz5OLt5nCjCSdaOMEjmqz6mQGAz0pZXk-7oBvgitx-9e-JaGvGW1CTaWYwwuVfl_PBgRvo3t6bQ1DMA1TZCepbWvSxDJrfFFqBCZE6ilABoY5eg';
  const doctorAvatar = doctorProfile?.avatar || defaultDoctorAvatar;
  const doctorName = doctorProfile?.name || 'Dr. Ahmed';
  const doctorSpecialty = doctorProfile?.specialty || 'Prosthodontist';
  const doctorClinic = doctorProfile?.assignedClinic || 'Clinic 1';

  const patientAvatar = activePatient?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCff4LEmqAkU8xYpwAnrA1mCIcr5F4QFgt-xHUZuN1RS46NhxWswGWtb1ife39PcANIhIT6tcMLq5zJbUimAFrNPcjtx_1Zk9TkMinJiwzMu8cgYUFulj42DT502WAC22L9Cmao6p8L0QMz5UTYmsCbcvvrWdcadrEbnJBDBXhK8KdXzuY9W47A2j3zBpMjz8Na33CRIM3VQl15ByJs3EsVwBplDm-F5ziqTnfjusXcrCX9jvMa6NXfUg';
  const patientName = activePatient?.name || 'Mohamed Ali';

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b border-[#e2e8f0]">
      {/* Brand & Desktop Links */}
      <div className="flex items-center gap-8">
        <div 
          onClick={() => onNavigate(isDoctor ? 'doctor-dashboard' : 'patient-dashboard')}
          className="font-headline font-bold text-2xl text-[#006194] cursor-pointer flex items-center gap-2 select-none"
        >
          <span className="material-symbols-outlined text-[#006194] fill-1 text-2xl">dentistry</span>
          <span>DentalCare</span>
          {!isDoctor ? (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Patient Portal
            </span>
          ) : (
            <span className="text-xs font-semibold text-[#006194] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              Clinical Specialist
            </span>
          )}
        </div>

        <nav className="hidden md:flex gap-6 h-16 items-center">
          {isDoctor ? (
            <>
              <button
                onClick={() => onNavigate('doctor-dashboard')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'doctor-dashboard'
                    ? 'text-[#006194] border-[#006194] font-bold'
                    : 'text-slate-600 border-transparent hover:text-[#006194]'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => onNavigate('doctor-patients')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  (currentView === 'doctor-patients' || currentView === 'doctor-patient-profile')
                    ? 'text-[#006194] border-[#006194] font-bold'
                    : 'text-slate-600 border-transparent hover:text-[#006194]'
                }`}
              >
                Patients
              </button>

              <button
                onClick={() => onNavigate('doctor-visits')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'doctor-visits'
                    ? 'text-[#006194] border-[#006194] font-bold'
                    : 'text-slate-600 border-transparent hover:text-[#006194]'
                }`}
              >
                Visits & Schedule
              </button>

              <button
                onClick={() => onNavigate('doctor-clinics')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'doctor-clinics'
                    ? 'text-[#006194] border-[#006194] font-bold'
                    : 'text-slate-600 border-transparent hover:text-[#006194]'
                }`}
              >
                Clinic Status
              </button>

              <button
                onClick={() => onNavigate('doctor-settings')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'doctor-settings'
                    ? 'text-[#006194] border-[#006194] font-bold'
                    : 'text-slate-600 border-transparent hover:text-[#006194]'
                }`}
              >
                Settings
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('patient-dashboard')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'patient-dashboard'
                    ? 'text-[#006194] border-[#006194] font-bold'
                    : 'text-slate-600 border-transparent hover:text-[#006194]'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => onNavigate('patient-chart')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'patient-chart'
                    ? 'text-[#006194] border-[#006194] font-bold'
                    : 'text-slate-600 border-transparent hover:text-[#006194]'
                }`}
              >
                Dental Chart & Imaging
              </button>

              <button
                onClick={() => onNavigate('patient-visits')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'patient-visits'
                    ? 'text-[#006194] border-[#006194] font-bold'
                    : 'text-slate-600 border-transparent hover:text-[#006194]'
                }`}
              >
                My Appointments
              </button>

              <button
                onClick={() => onNavigate('patient-profile')}
                className={`font-sans text-sm h-full flex items-center transition-colors border-b-2 font-medium cursor-pointer ${
                  currentView === 'patient-profile'
                    ? 'text-[#006194] border-[#006194] font-bold'
                    : 'text-slate-600 border-transparent hover:text-[#006194]'
                }`}
              >
                Health Profile
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationToast(!showNotificationToast)}
            className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#006194] hover:bg-slate-100 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotificationToast && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="font-headline font-bold text-sm text-slate-800">Notifications</span>
                <span className="text-[11px] bg-blue-50 text-[#006194] font-medium px-2 py-0.5 rounded-full">Recent</span>
              </div>
              <div className="space-y-2 text-xs">
                {isDoctor ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                      <p className="font-semibold text-slate-800">Patient Arrived in Clinic</p>
                      <p className="text-slate-500 mt-0.5">Mohamed Ali is in Chair for Clinic 1 consultation.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="font-semibold text-slate-800">Lab X-ray Available</p>
                      <p className="text-slate-500 mt-0.5">Panoramic scan ready for patient #849201.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <p className="font-semibold text-slate-800">Upcoming Visit Scheduled</p>
                      <p className="text-slate-500 mt-0.5">Dr. Ahmed scheduled your visit on 01 Sep 2026 at 10:30 AM.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="font-semibold text-slate-800">Dental Record Updated</p>
                      <p className="text-slate-500 mt-0.5">Tooth #26 filling successfully documented in chart.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Sign Out */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#006194]/20 transition-all cursor-pointer"
              id="profile-menu-button"
            >
              <img
                src={isDoctor ? doctorAvatar : patientAvatar}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-[#e2e8f0]"
              />
              <div className="hidden lg:block text-left text-xs">
                <p className="font-bold text-slate-800 leading-tight">{isDoctor ? doctorName : patientName}</p>
                <p className="text-[10px] text-slate-500">{isDoctor ? doctorSpecialty : 'Patient'}</p>
              </div>
            </button>

            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95"
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="font-bold text-sm text-slate-900">{isDoctor ? doctorName : patientName}</p>
                  <p className="text-xs text-slate-500">{isDoctor ? `${doctorSpecialty} • ${doctorClinic}` : `Patient ID #${activePatient?.id || '849201'}`}</p>
                </div>

                <div className="py-1 text-sm">
                  <button
                    onClick={() => onNavigate(isDoctor ? 'doctor-dashboard' : 'patient-dashboard')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                    Dashboard
                  </button>
                  {isDoctor ? (
                    <button
                      onClick={() => onNavigate('doctor-patients')}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">groups</span>
                      Patients Directory
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('patient-chart')}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">dentistry</span>
                      My Dental Chart
                    </button>
                  )}
                  <button
                    onClick={() => onNavigate(isDoctor ? 'doctor-settings' : 'patient-profile')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    {isDoctor ? 'Clinic Settings' : 'My Health Profile'}
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            title="Sign Out to Login Screen"
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-600 hover:bg-red-50/80 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
