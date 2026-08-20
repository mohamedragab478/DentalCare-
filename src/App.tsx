import React, { useState } from 'react';
import { AppView, Patient, ToothStatus, ClinicRoom, VisitRecord, MedicalImage, DoctorProfile } from './types';
import { INITIAL_PATIENTS, CLINIC_ROOMS, INITIAL_DOCTOR } from './data/initialData';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientTable } from './components/PatientTable';
import { PatientProfile } from './components/PatientProfile';
import { PatientDashboard } from './components/PatientDashboard';
import { PatientDentalRecord } from './components/PatientDentalRecord';
import { PatientVisitsView } from './components/PatientVisitsView';
import { AuthGateway } from './components/AuthGateway';
import { VisitsView } from './components/VisitsView';
import { ClinicStatusView } from './components/ClinicStatusView';
import { DoctorSettingsView } from './components/DoctorSettingsView';
import { NewConsultationModal } from './components/NewConsultationModal';
import { AddPatientModal } from './components/AddPatientModal';
import { UploadImageModal } from './components/UploadImageModal';

export function App() {
  // Authentication & Role State
  // Default is unauthenticated so user starts at the external Auth Gateway / Login Carousel
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'doctor' | 'patient'>('doctor');
  const [currentView, setCurrentView] = useState<AppView>('auth-gateway');

  // Attending Doctor Profile State (User explicit requirement: profile photo upload + settings)
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>({
    id: 'doc-01',
    name: 'Dr. Ahmed Al-Sayed',
    specialty: 'Prosthodontics & Implantology',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxTdB6BFCRDU6qr8N5YlyqcvvBqAlixK076_tUMWhheQjfjcVCtO0UBEY8sL1jYC9cucKVnoLoEgJlDKaSn0Qb5FJkx7v8MdhtOBjzCb8dHppP7IhiJllCOCEHHLwVXSrsa5mcVTHwz5OLt5nCjCSdaOMEjmqz6mQGAz0pZXk-7oBvgitx-9e-JaGvGW1CTaWYwwuVfl_PBgRvo3t6bQ1DMA1TZCepbWvSxDJrfFFqBCZE6ilABoY5eg',
    assignedClinic: 'Clinic 1',
    phone: '+1 (555) 234-5678',
    email: 'dr.ahmed@dentalcarepro.clinic',
    consultationFee: 150,
    bio: 'Specializing in complex restorative prosthodontics, digital smile design, and guided implant surgery with over 12 years of clinical excellence.'
  });

  // Today's Queue Completed Status Tracking (User explicit requirement: خلصت البيشنت دا)
  const [completedQueueIds, setCompletedQueueIds] = useState<string[]>(['849202']);

  // Core Clinical State
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('849201'); // Mohamed Ali (Numeric ID)
  const [clinics, setClinics] = useState<ClinicRoom[]>(CLINIC_ROOMS);

  // Modals & Edit State
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);

  // Current active patient
  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // ================= Handlers =================
  const handleDoctorLogin = () => {
    setIsAuthenticated(true);
    setUserRole('doctor');
    setCurrentView('doctor-dashboard');
  };

  const handlePatientLogin = (inputPatientId?: string) => {
    if (inputPatientId) {
      const found = patients.find((p) => p.id === inputPatientId || p.phone.includes(inputPatientId));
      if (found) {
        setSelectedPatientId(found.id);
      }
    }
    setIsAuthenticated(true);
    setUserRole('patient');
    setCurrentView('patient-dashboard');
  };

  const handlePatientSignUp = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatientId(newPatient.id);
    setIsAuthenticated(true);
    setUserRole('patient');
    setCurrentView('patient-dashboard');
  };

  const handleTogglePatientCompleted = (patientId: string) => {
    setCompletedQueueIds((prev) =>
      prev.includes(patientId) ? prev.filter((id) => id !== patientId) : [...prev, patientId]
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEditingPatient(null);
    setCurrentView('auth-gateway');
  };

  const handleUpdateTooth = (toothId: number, status: ToothStatus, notes?: string, date?: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          const updatedTeeth = {
            ...p.teeth,
            [toothId]: {
              id: toothId,
              status,
              notes: notes !== undefined ? notes : p.teeth[toothId]?.notes,
              lastTreatmentDate: date !== undefined ? date : p.teeth[toothId]?.lastTreatmentDate
            }
          };
          return {
            ...p,
            teeth: updatedTeeth,
            lastVisit: date || p.lastVisit
          };
        }
        return p;
      })
    );
  };

  const handleAddConsultation = (
    patientId: string,
    visit: VisitRecord,
    isScheduledFuture?: boolean,
    scheduledTime?: string
  ) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          if (isScheduledFuture) {
            return {
              ...p,
              nextVisit: visit.date,
              nextVisitTime: scheduledTime || '10:30 AM',
              attendingClinic: visit.clinicRoom,
              visits: [visit, ...p.visits]
            };
          } else {
            return {
              ...p,
              lastVisit: visit.date,
              visits: [visit, ...p.visits]
            };
          }
        }
        return p;
      })
    );
  };

  // Add or Edit Patient with pre-filled state retention
  const handleSavePatient = (savedPatient: Patient) => {
    setPatients((prev) => {
      const exists = prev.some((p) => p.id === savedPatient.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPatient.id ? savedPatient : p));
      }
      return [savedPatient, ...prev];
    });
    setSelectedPatientId(savedPatient.id);
    setEditingPatient(null);
  };

  const handleOpenEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsAddPatientOpen(true);
  };

  const handleOpenNewPatient = () => {
    setEditingPatient(null);
    setIsAddPatientOpen(true);
  };

  const handleUploadImage = (image: MedicalImage) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          return {
            ...p,
            images: [image, ...p.images]
          };
        }
        return p;
      })
    );
  };

  // Clinic Management: Doctor restricted to one clinic, cannot kick out other doctors
  const handleAssignDoctor = (roomId: number) => {
    setClinics((prev) =>
      prev.map((room) => {
        // If room is the chosen target room
        if (room.id === roomId) {
          return {
            ...room,
            status: 'occupied',
            doctorName: INITIAL_DOCTOR.name,
            doctorAvatar: INITIAL_DOCTOR.avatar,
            doctorSpecialty: INITIAL_DOCTOR.specialty
          };
        }
        // If this was another room previously occupied by Dr. Ahmed, vacate it!
        if (room.doctorName === INITIAL_DOCTOR.name) {
          return {
            ...room,
            status: 'available',
            doctorName: undefined,
            doctorAvatar: undefined,
            doctorSpecialty: undefined,
            currentPatient: undefined
          };
        }
        // Leave other doctors' rooms untouched
        return room;
      })
    );
  };

  const handleVacateDoctor = (roomId: number) => {
    setClinics((prev) =>
      prev.map((room) => {
        if (room.id === roomId && room.doctorName === INITIAL_DOCTOR.name) {
          return {
            ...room,
            status: 'available',
            doctorName: undefined,
            doctorAvatar: undefined,
            doctorSpecialty: undefined,
            currentPatient: undefined
          };
        }
        return room;
      })
    );
  };

  // Determine if viewing outside auth view
  const isAuthView =
    !isAuthenticated ||
    currentView === 'auth-gateway' ||
    currentView === 'doctor-login' ||
    currentView === 'patient-login' ||
    currentView === 'patient-signup';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#181c20] font-sans flex flex-col selection:bg-[#cce5ff]">
      {/* ========================================================================= */}
      {/* 1. OUTSIDE / AUTH GATEWAY (صفحة تسجيل الدخول والخروج مع الكاروسيل الدوار)  */}
      {/* ========================================================================= */}
      {isAuthView && (
        <AuthGateway
          initialTab={
            currentView === 'patient-login'
              ? 'patient-login'
              : currentView === 'patient-signup'
              ? 'patient-signup'
              : 'doctor-login'
          }
          onDoctorLoginSuccess={handleDoctorLogin}
          onPatientLoginSuccess={handlePatientLogin}
          onPatientSignUpSuccess={handlePatientSignUp}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. INSIDE PORTAL (فصل كامل وحصري بين بوابة الطبيب وبوابة المريض)            */}
      {/* ========================================================================= */}
      {!isAuthView && (
        <>
          {/* Top Navigation */}
          <TopNav
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            userRole={userRole}
            doctorProfile={doctorProfile}
            activePatient={activePatient}
            onLogout={handleLogout}
          />

          <div className="flex pt-16 flex-1">
            {/* Sidebar shown ONLY for Doctor in the clinical portal */}
            {userRole === 'doctor' && (
              <Sidebar
                currentView={currentView}
                onNavigate={(view) => setCurrentView(view)}
                onNewConsultation={() => setIsConsultationOpen(true)}
              />
            )}

            {/* Main Content Area */}
            <main
              className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all ${
                userRole === 'doctor' ? 'md:ml-64' : 'max-w-7xl mx-auto w-full'
              }`}
            >
              {/* ==================================================== */}
              {/* A. DOCTOR PORTAL PAGES (صفحات الطبيب)                 */}
              {/* ==================================================== */}
              {userRole === 'doctor' && (
                <>
                  {/* Doctor Dashboard */}
                  {currentView === 'doctor-dashboard' && (
                    <DoctorDashboard
                      patients={patients}
                      clinics={clinics}
                      doctorProfile={doctorProfile}
                      completedPatientIds={completedQueueIds}
                      onTogglePatientCompleted={handleTogglePatientCompleted}
                      onSelectPatient={(p) => {
                        setSelectedPatientId(p.id);
                        setCurrentView('doctor-patient-profile');
                      }}
                      onNavigate={(v) => setCurrentView(v)}
                      onNewConsultation={() => setIsConsultationOpen(true)}
                    />
                  )}

                  {/* Patients Directory */}
                  {currentView === 'doctor-patients' && (
                    <PatientTable
                      patients={patients}
                      onSelectPatient={(p) => {
                        setSelectedPatientId(p.id);
                        setCurrentView('doctor-patient-profile');
                      }}
                      onAddPatient={handleOpenNewPatient}
                    />
                  )}

                  {/* Patient Profile & FDI Dental Chart */}
                  {currentView === 'doctor-patient-profile' && (
                    <PatientProfile
                      patient={activePatient}
                      onBack={() => setCurrentView('doctor-patients')}
                      onUpdateTooth={handleUpdateTooth}
                      onAddVisit={() => setIsConsultationOpen(true)}
                      onUploadImage={() => setIsUploadImageOpen(true)}
                      onEditPatient={() => handleOpenEditPatient(activePatient)}
                      isReadOnly={false}
                    />
                  )}

                  {/* Visits & Schedule */}
                  {currentView === 'doctor-visits' && (
                    <VisitsView
                      patients={patients}
                      onSelectPatient={(p) => {
                        setSelectedPatientId(p.id);
                        setCurrentView('doctor-patient-profile');
                      }}
                      onNewConsultation={() => setIsConsultationOpen(true)}
                    />
                  )}

                  {/* Clinic Operatory Status */}
                  {currentView === 'doctor-clinics' && (
                    <ClinicStatusView
                      clinics={clinics}
                      onAssignDoctor={handleAssignDoctor}
                      onVacateDoctor={handleVacateDoctor}
                      currentDoctorName={doctorProfile.name}
                    />
                  )}

                  {/* Doctor & Clinic Settings (Profile Picture Upload + Credentials) */}
                  {currentView === 'doctor-settings' && (
                    <DoctorSettingsView
                      doctorProfile={doctorProfile}
                      onUpdateDoctorProfile={(updated) => setDoctorProfile(updated)}
                      clinics={clinics}
                    />
                  )}
                </>
              )}

              {/* ==================================================== */}
              {/* B. PATIENT PORTAL PAGES (صفحات المريض)                */}
              {/* ==================================================== */}
              {userRole === 'patient' && (
                <>
                  {/* Patient Dashboard */}
                  {currentView === 'patient-dashboard' && (
                    <PatientDashboard
                      patient={activePatient}
                      clinics={clinics}
                      onNavigate={(v) => setCurrentView(v)}
                      onBookAppointment={() => {
                        // Patients can only inspect their visits view
                        setCurrentView('patient-visits');
                      }}
                    />
                  )}

                  {/* Patient Dental Chart & Diagnostic Imaging */}
                  {currentView === 'patient-chart' && (
                    <PatientDentalRecord
                      patient={activePatient}
                      onBookConsultation={() => {
                        setCurrentView('patient-visits');
                      }}
                    />
                  )}

                  {/* Patient Visits & History (View Only) */}
                  {currentView === 'patient-visits' && (
                    <PatientVisitsView
                      patient={activePatient}
                      onBookAppointment={() => {
                        setCurrentView('patient-dashboard');
                      }}
                    />
                  )}

                  {/* Patient Health Profile & Dossier */}
                  {currentView === 'patient-profile' && (
                    <PatientProfile
                      patient={activePatient}
                      onBack={() => setCurrentView('patient-dashboard')}
                      onUpdateTooth={handleUpdateTooth}
                      isReadOnly={true}
                    />
                  )}
                </>
              )}
            </main>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* Global Modals (Consultation Scheduler, New/Edit Patient, Upload Imaging)   */}
      {/* ========================================================================= */}
      <NewConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        patients={patients}
        onAddConsultation={handleAddConsultation}
        preselectedPatientId={activePatient?.id}
      />

      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => {
          setIsAddPatientOpen(false);
          setEditingPatient(null);
        }}
        onAddPatient={handleSavePatient}
        initialPatient={editingPatient}
      />

      <UploadImageModal
        isOpen={isUploadImageOpen}
        onClose={() => setIsUploadImageOpen(false)}
        onUpload={handleUploadImage}
      />
    </div>
  );
}

export default App;
