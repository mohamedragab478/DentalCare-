import React, { useState } from 'react';
import { AppView, Patient, ToothStatus, ClinicRoom, VisitRecord, MedicalImage } from './types';
import { INITIAL_PATIENTS, CLINIC_ROOMS, INITIAL_DOCTOR } from './data/initialData';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { DoctorDashboard } from './components/DoctorDashboard';
import { PatientTable } from './components/PatientTable';
import { PatientProfile } from './components/PatientProfile';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorLogin } from './components/DoctorLogin';
import { PatientLogin } from './components/PatientLogin';
import { PatientSignUp } from './components/PatientSignUp';
import { VisitsView } from './components/VisitsView';
import { ClinicStatusView } from './components/ClinicStatusView';
import { NewConsultationModal } from './components/NewConsultationModal';
import { AddPatientModal } from './components/AddPatientModal';
import { UploadImageModal } from './components/UploadImageModal';

export function App() {
  const [userRole, setUserRole] = useState<'doctor' | 'patient'>('doctor');
  const [currentView, setCurrentView] = useState<AppView>('doctor-patient-profile');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('#DC-84920'); // Mohamed Ali by default
  const [clinics, setClinics] = useState<ClinicRoom[]>(CLINIC_ROOMS);

  // Modal states
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);

  // Active patient selector
  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Handlers
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

  const handleAddConsultation = (patientId: string, visit: VisitRecord) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            lastVisit: visit.date,
            visits: [visit, ...p.visits]
          };
        }
        return p;
      })
    );
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatientId(newPatient.id);
    setCurrentView('doctor-patient-profile');
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

  const handleToggleClinicRoom = (roomId: number) => {
    setClinics((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          const isOccupied = room.status === 'occupied';
          return {
            ...room,
            status: isOccupied ? 'available' : 'occupied',
            doctorName: isOccupied ? undefined : INITIAL_DOCTOR.name,
            doctorAvatar: isOccupied ? undefined : INITIAL_DOCTOR.avatar,
            doctorSpecialty: isOccupied ? undefined : INITIAL_DOCTOR.specialty
          };
        }
        return room;
      })
    );
  };

  const handleSwitchRole = (newRole: 'doctor' | 'patient') => {
    setUserRole(newRole);
    if (newRole === 'doctor') {
      setCurrentView('doctor-dashboard');
    } else {
      setCurrentView('patient-dashboard');
    }
  };

  // Check if viewing standalone Auth views
  const isAuthView =
    currentView === 'doctor-login' ||
    currentView === 'patient-login' ||
    currentView === 'patient-signup';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#181c20] font-sans flex flex-col selection:bg-[#cce5ff]">
      {/* Interactive Mockup Quick-Tour Header Bar for fast previewing across all 7 screens */}
      <div className="bg-slate-900 text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-50 shadow-md">
        <div className="flex items-center gap-2 font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>DENTALCARE PRO WORKSPACE</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-medium">
          <span className="text-slate-400 mr-1 text-[11px]">Screens:</span>
          <button
            onClick={() => {
              setUserRole('doctor');
              setCurrentView('doctor-dashboard');
            }}
            className={`px-2.5 py-1 rounded-md transition-all ${
              currentView === 'doctor-dashboard'
                ? 'bg-[#006194] text-white font-bold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            1. Doctor Dashboard
          </button>

          <button
            onClick={() => {
              setUserRole('doctor');
              setCurrentView('doctor-patients');
            }}
            className={`px-2.5 py-1 rounded-md transition-all ${
              currentView === 'doctor-patients'
                ? 'bg-[#006194] text-white font-bold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            2. Patients Table
          </button>

          <button
            onClick={() => {
              setUserRole('doctor');
              setCurrentView('doctor-patient-profile');
            }}
            className={`px-2.5 py-1 rounded-md transition-all ${
              currentView === 'doctor-patient-profile'
                ? 'bg-[#006194] text-white font-bold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            3. Patient Profile & Chart
          </button>

          <button
            onClick={() => {
              setUserRole('patient');
              setCurrentView('patient-dashboard');
            }}
            className={`px-2.5 py-1 rounded-md transition-all ${
              currentView === 'patient-dashboard'
                ? 'bg-[#006194] text-white font-bold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            4. Patient Portal
          </button>

          <button
            onClick={() => setCurrentView('doctor-login')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              currentView === 'doctor-login'
                ? 'bg-[#006194] text-white font-bold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            5. Doctor Login
          </button>

          <button
            onClick={() => setCurrentView('patient-login')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              currentView === 'patient-login'
                ? 'bg-[#006194] text-white font-bold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            6. Patient Login
          </button>

          <button
            onClick={() => setCurrentView('patient-signup')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              currentView === 'patient-signup'
                ? 'bg-[#006194] text-white font-bold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            7. Patient Sign Up
          </button>
        </div>
      </div>

      {/* Render Auth Screens standalone if active */}
      {currentView === 'doctor-login' && (
        <DoctorLogin
          onLoginSuccess={() => {
            setUserRole('doctor');
            setCurrentView('doctor-dashboard');
          }}
          onGoToPatientLogin={() => setCurrentView('patient-login')}
        />
      )}

      {currentView === 'patient-login' && (
        <PatientLogin
          onLoginSuccess={() => {
            setUserRole('patient');
            setCurrentView('patient-dashboard');
          }}
          onGoToSignUp={() => setCurrentView('patient-signup')}
          onGoToDoctorLogin={() => setCurrentView('doctor-login')}
        />
      )}

      {currentView === 'patient-signup' && (
        <PatientSignUp
          onSignUpSuccess={(newPatient) => {
            setPatients((prev) => [newPatient, ...prev]);
            setSelectedPatientId(newPatient.id);
            setUserRole('patient');
            setCurrentView('patient-dashboard');
          }}
          onGoToLogin={() => setCurrentView('patient-login')}
        />
      )}

      {/* Main Authenticated Layout */}
      {!isAuthView && (
        <>
          {/* Top Navigation */}
          <TopNav
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            userRole={userRole}
            onSwitchRole={handleSwitchRole}
            onLogout={() => setCurrentView('doctor-login')}
          />

          <div className="flex pt-16 flex-1">
            {/* Sidebar shown in doctor views */}
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
              {/* Doctor Dashboard */}
              {currentView === 'doctor-dashboard' && (
                <DoctorDashboard
                  patients={patients}
                  clinics={clinics}
                  onSelectPatient={(p) => {
                    setSelectedPatientId(p.id);
                    setCurrentView('doctor-patient-profile');
                  }}
                  onNavigate={(v) => setCurrentView(v)}
                  onNewConsultation={() => setIsConsultationOpen(true)}
                />
              )}

              {/* Patients List View */}
              {currentView === 'doctor-patients' && (
                <PatientTable
                  patients={patients}
                  onSelectPatient={(p) => {
                    setSelectedPatientId(p.id);
                    setCurrentView('doctor-patient-profile');
                  }}
                  onAddPatient={() => setIsAddPatientOpen(true)}
                />
              )}

              {/* Patient Profile & Interactive Chart */}
              {currentView === 'doctor-patient-profile' && (
                <PatientProfile
                  patient={activePatient}
                  onBack={() => setCurrentView('doctor-patients')}
                  onUpdateTooth={handleUpdateTooth}
                  onAddVisit={() => setIsConsultationOpen(true)}
                  onUploadImage={() => setIsUploadImageOpen(true)}
                  onEditPatient={() => setIsAddPatientOpen(true)}
                />
              )}

              {/* Doctor Visits View */}
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

              {/* Clinic Status View */}
              {currentView === 'doctor-clinics' && (
                <ClinicStatusView
                  clinics={clinics}
                  onToggleStatus={handleToggleClinicRoom}
                />
              )}

              {/* Doctor Settings */}
              {currentView === 'doctor-settings' && (
                <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
                  <h2 className="font-headline font-bold text-2xl text-slate-900">Clinic & Doctor Settings</h2>
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Doctor Name</label>
                        <input
                          type="text"
                          defaultValue="Dr. Ahmed"
                          className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Specialty</label>
                        <input
                          type="text"
                          defaultValue="Prosthodontics & Implantology"
                          className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Default Operatory</label>
                      <select className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50" defaultValue="Clinic 3">
                        <option value="Clinic 1">Clinic 1</option>
                        <option value="Clinic 2">Clinic 2</option>
                        <option value="Clinic 3">Clinic 3</option>
                        <option value="Clinic 4">Clinic 4</option>
                      </select>
                    </div>
                    <button
                      onClick={() => alert("Settings saved successfully!")}
                      className="px-5 py-2.5 bg-[#006194] text-white font-bold rounded-lg hover:bg-[#004b73]"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Patient Dashboard */}
              {currentView === 'patient-dashboard' && (
                <PatientDashboard
                  patient={activePatient}
                  clinics={clinics}
                  onNavigate={(v) => setCurrentView(v)}
                  onBookAppointment={() => setIsConsultationOpen(true)}
                />
              )}

              {/* Patient Self Profile */}
              {currentView === 'patient-profile' && (
                <PatientProfile
                  patient={activePatient}
                  onBack={() => setCurrentView('patient-dashboard')}
                  onUpdateTooth={handleUpdateTooth}
                  onAddVisit={() => setIsConsultationOpen(true)}
                  onUploadImage={() => setIsUploadImageOpen(true)}
                  onEditPatient={() => setIsAddPatientOpen(true)}
                />
              )}
            </main>
          </div>
        </>
      )}

      {/* Modals */}
      <NewConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        patients={patients}
        onAddConsultation={handleAddConsultation}
      />

      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        onAddPatient={handleAddPatient}
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
