import React, { useState, useEffect } from 'react';
import { AppView, Patient, ToothStatus, ClinicRoom, VisitRecord, MedicalImage, DoctorProfile } from './types';
import { INITIAL_PATIENTS, CLINIC_ROOMS, INITIAL_DOCTOR } from './data/initialData';
import { storage, subscribeToStorageUpdates } from './utils/storage';
import { UnifiedHeader } from './components/UnifiedHeader';
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
import { ScheduleVisitModal } from './components/ScheduleVisitModal';
import { useAppThemeLanguage } from './context/ThemeLanguageContext';

export function App() {
  const { isRTL } = useAppThemeLanguage();

  // Authentication & Role State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'doctor' | 'patient'>('doctor');
  const [currentView, setCurrentView] = useState<AppView>('auth-gateway');

  // Attending Doctor Profile State (Loaded with Persistent Storage fallback)
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>(() => storage.getDoctorProfile());

  // Today's Queue Completed Status Tracking (خلصت البيشنت دا)
  const [completedQueueIds, setCompletedQueueIds] = useState<string[]>(() => storage.getCompletedQueue());

  // Application Data State (Loaded with Persistent Storage fallback)
  const [patients, setPatients] = useState<Patient[]>(() => storage.getPatients());
  const [selectedPatientId, setSelectedPatientId] = useState<string>('849201'); // Mohamed Ali
  const [clinics, setClinics] = useState<ClinicRoom[]>(() => storage.getClinics());

  // Real-time synchronization across browser tabs and persistence to localStorage
  useEffect(() => {
    storage.setDoctorProfile(doctorProfile);
  }, [doctorProfile]);

  useEffect(() => {
    storage.setPatients(patients);
  }, [patients]);

  useEffect(() => {
    storage.setClinics(clinics);
  }, [clinics]);

  useEffect(() => {
    storage.setCompletedQueue(completedQueueIds);
  }, [completedQueueIds]);

  useEffect(() => {
    const unsubscribe = subscribeToStorageUpdates((type, payload) => {
      if (type === 'DOCTOR_UPDATED' && payload) {
        setDoctorProfile(payload);
      } else if (type === 'CLINICS_UPDATED' && payload) {
        setClinics(payload);
      } else if (type === 'PATIENTS_UPDATED' && payload) {
        setPatients(payload);
      } else if (type === 'QUEUE_UPDATED' && payload) {
        setCompletedQueueIds(payload);
      } else if (type === 'FULL_SYNC' && payload) {
        if (payload.doctor) setDoctorProfile(payload.doctor);
        if (payload.clinics) setClinics(payload.clinics);
        if (payload.patients) setPatients(payload.patients);
      }
    });

    return () => unsubscribe();
  }, []);

  // Modals & Edit State
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
  const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState(false);
  const [scheduleTargetPatient, setScheduleTargetPatient] = useState<Patient | null>(null);

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

  // When a new patient signs up from AuthGateway, append to the END of list
  const handlePatientSignUp = (newPatient: Patient) => {
    setPatients((prev) => [...prev, newPatient]);
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

  const handleToggleInClinic = (patientId: string) => {
    setPatients((prev) => {
      const target = prev.find((p) => p.id === patientId);
      if (!target) return prev;

      const isNowInClinic = !target.inClinic;
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const updatedPatient: Patient = {
        ...target,
        inClinic: isNowInClinic,
        inClinicTime: isNowInClinic ? nowTime : undefined
      };

      if (isNowInClinic) {
        // Move to the top of the queue right after any patients already in clinic
        const others = prev.filter((p) => p.id !== patientId);
        const alreadyInClinic = others.filter((p) => p.inClinic);
        const notInClinic = others.filter((p) => !p.inClinic);
        return [...alreadyInClinic, updatedPatient, ...notInClinic];
      } else {
        // If untoggled, preserve others and put this patient with the non-in-clinic group
        const others = prev.filter((p) => p.id !== patientId);
        const alreadyInClinic = others.filter((p) => p.inClinic);
        const notInClinic = others.filter((p) => !p.inClinic);
        return [...alreadyInClinic, ...notInClinic, updatedPatient];
      }
    });
  };

  const handleReorderPatients = (newOrder: Patient[]) => {
    setPatients(newOrder);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('auth-gateway');
  };

  // FDI Tooth Update
  const handleUpdateTooth = (
    toothId: number,
    status: ToothStatus,
    notes?: string,
    date?: string,
    customProcedureName?: string,
    bridgeSpan?: number[]
  ) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          const updatedTeeth = {
            ...p.teeth,
            [toothId]: {
              id: toothId,
              status,
              notes: notes || p.teeth[toothId]?.notes || '',
              history: [
                {
                  date: date || new Date().toISOString().split('T')[0],
                  procedure: customProcedureName || `${status.toUpperCase()} treatment recorded`,
                  doctor: doctorProfile.name,
                  notes: notes || ''
                },
                ...(p.teeth[toothId]?.history || [])
              ],
              bridgeSpan: bridgeSpan !== undefined ? bridgeSpan : p.teeth[toothId]?.bridgeSpan
            }
          };

          return {
            ...p,
            teeth: updatedTeeth
          };
        }
        return p;
      })
    );
  };

  // FDI Multi-Tooth / Batch Update
  const handleBatchUpdateTeeth = (
    updates: Array<{
      toothId: number;
      status: ToothStatus;
      notes?: string;
      date?: string;
      customProcedureName?: string;
      bridgeSpan?: number[];
    }>
  ) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === activePatient.id) {
          const newTeeth = { ...p.teeth };
          const currentDate = new Date().toISOString().split('T')[0];

          updates.forEach((item) => {
            newTeeth[item.toothId] = {
              id: item.toothId,
              status: item.status,
              notes: item.notes || newTeeth[item.toothId]?.notes || '',
              history: [
                {
                  date: item.date || currentDate,
                  procedure: item.customProcedureName || `${item.status.toUpperCase()} treatment recorded`,
                  doctor: doctorProfile.name,
                  notes: item.notes || ''
                },
                ...(newTeeth[item.toothId]?.history || [])
              ],
              bridgeSpan: item.bridgeSpan !== undefined ? item.bridgeSpan : newTeeth[item.toothId]?.bridgeSpan
            };
          });

          return {
            ...p,
            teeth: newTeeth
          };
        }
        return p;
      })
    );
  };

  // Add Consultation Record
  const handleAddConsultation = (
    patientId: string,
    procedure: string,
    doctorName: string,
    clinicRoom: string,
    notes: string,
    cost?: number,
    nextVisitDate?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const newVisit: VisitRecord = {
      id: `v-${Date.now()}`,
      date: today,
      procedure,
      doctorName: doctorName || doctorProfile.name,
      clinicRoom: clinicRoom || doctorProfile.assignedClinic,
      notes,
      cost,
      status: 'completed'
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            visits: [newVisit, ...p.visits],
            lastVisit: today,
            nextVisit: nextVisitDate || p.nextVisit,
            treatmentType: procedure || p.treatmentType
          };
        }
        return p;
      })
    );
    setIsConsultationOpen(false);
  };

  // Schedule Next Visit (with Day 28 preset)
  const handleOpenScheduleVisit = (patient?: Patient) => {
    setScheduleTargetPatient(patient || activePatient);
    setIsScheduleVisitOpen(true);
  };

  const handleConfirmScheduleVisit = (
    patientId: string,
    date: string,
    time: string,
    clinic: string,
    procedure: string,
    notes: string
  ) => {
    const newVisit: VisitRecord = {
      id: `v-${Date.now()}`,
      date: date,
      procedure: procedure || 'Scheduled Dental Checkup',
      doctorName: doctorProfile.name,
      clinicRoom: clinic,
      notes: notes || 'Upcoming scheduled appointment',
      status: 'scheduled'
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            nextVisit: date,
            nextVisitTime: time,
            attendingClinic: clinic,
            attendingDoctor: doctorProfile.name,
            treatmentType: procedure || p.treatmentType,
            visits: [newVisit, ...p.visits]
          };
        }
        return p;
      })
    );

    setIsScheduleVisitOpen(false);
    setScheduleTargetPatient(null);
  };

  // Delete Visit
  const handleDeleteVisit = (patientId: string, visitId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          const remainingVisits = p.visits.filter((v) => v.id !== visitId);
          const completedVisits = remainingVisits.filter((v) => v.status === 'completed');
          const scheduledVisits = remainingVisits.filter((v) => v.status === 'scheduled');

          return {
            ...p,
            visits: remainingVisits,
            lastVisit: completedVisits.length > 0 ? completedVisits[0].date : (remainingVisits.length > 0 ? remainingVisits[0].date : 'No visits'),
            nextVisit: scheduledVisits.length > 0 ? scheduledVisits[0].date : undefined,
            nextVisitTime: scheduledVisits.length > 0 ? p.nextVisitTime : undefined
          };
        }
        return p;
      })
    );
  };

  // Add or Edit Patient (New patients are appended to the END of the list)
  const handleSavePatient = (savedPatient: Patient) => {
    setPatients((prev) => {
      const exists = prev.some((p) => p.id === savedPatient.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPatient.id ? savedPatient : p));
      }
      // Put new patient at the end of the list
      return [...prev, savedPatient];
    });
    setSelectedPatientId(savedPatient.id);
    setEditingPatient(null);
  };

  const handleSelectExistingPatientToQueue = (existingPatient: Patient, treatmentType?: string) => {
    setPatients((prev) => {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const todayDate = new Date().toISOString().split('T')[0];

      const updatedTarget: Patient = {
        ...existingPatient,
        inClinic: true,
        inClinicTime: nowTime,
        lastVisit: todayDate,
        treatmentType: treatmentType || existingPatient.treatmentType || 'General Care'
      };

      const others = prev.filter((p) => p.id !== existingPatient.id);
      const alreadyInClinic = others.filter((p) => p.inClinic);
      const notInClinic = others.filter((p) => !p.inClinic);

      return [...alreadyInClinic, updatedTarget, ...notInClinic];
    });

    setSelectedPatientId(existingPatient.id);
    setIsAddPatientOpen(false);
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

  // Clinic & Doctor Profile State Synchronization
  const handleUpdateDoctorProfile = (updated: DoctorProfile) => {
    setDoctorProfile(updated);

    // 1. Synchronize Clinics Live Roster State
    setClinics((prev) =>
      prev.map((room) => {
        const isTargetRoom = room.name.toLowerCase() === (updated.assignedClinic || '').toLowerCase();
        const hadThisDoctor = room.doctorName === doctorProfile.name || room.doctorName === updated.name || room.doctorName === INITIAL_DOCTOR.name;

        if (isTargetRoom) {
          return {
            ...room,
            status: 'occupied',
            doctorName: updated.name,
            doctorAvatar: updated.avatar,
            doctorSpecialty: updated.specialty
          };
        }

        // If this room previously held this doctor and is not the new clinic, vacate it
        if (hadThisDoctor) {
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

    // 2. Synchronize Patients & Upcoming Appointments
    setPatients((prev) =>
      prev.map((p) => {
        const isUnderThisDoctor =
          !p.attendingDoctor ||
          p.attendingDoctor.includes('Ahmed') ||
          p.attendingDoctor === doctorProfile.name ||
          p.attendingDoctor === updated.name;

        if (isUnderThisDoctor) {
          return {
            ...p,
            attendingDoctor: updated.name,
            attendingClinic: updated.assignedClinic || p.attendingClinic
          };
        }
        return p;
      })
    );
  };

  // Clinic Management: Doctor restricted to one clinic, cannot move into an occupied clinic
  const handleAssignDoctor = (roomId: number) => {
    const targetRoom = clinics.find((c) => c.id === roomId);
    if (!targetRoom) return;

    // Validation: Cannot take a room that is already occupied by another doctor
    if (targetRoom.doctorName && targetRoom.doctorName !== doctorProfile.name && targetRoom.status === 'occupied') {
      return;
    }

    const newClinicName = targetRoom.name;

    // Update Doctor Profile assigned clinic
    setDoctorProfile((prev) => ({
      ...prev,
      assignedClinic: newClinicName
    }));

    // Update Clinics Roster
    setClinics((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            status: 'occupied',
            doctorName: doctorProfile.name,
            doctorAvatar: doctorProfile.avatar,
            doctorSpecialty: doctorProfile.specialty
          };
        }
        if (
          room.doctorName === doctorProfile.name ||
          room.doctorName === INITIAL_DOCTOR.name ||
          (room.doctorName && room.doctorName.includes('Ahmed')) ||
          (doctorProfile.assignedClinic && room.name.toLowerCase() === doctorProfile.assignedClinic.toLowerCase())
        ) {
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

    // Update Patients assigned clinic
    setPatients((prev) =>
      prev.map((p) => {
        if (!p.attendingDoctor || p.attendingDoctor.includes('Ahmed') || p.attendingDoctor === doctorProfile.name) {
          return {
            ...p,
            attendingClinic: newClinicName
          };
        }
        return p;
      })
    );
  };

  const handleVacateDoctor = (roomId?: number) => {
    const activeClinic = doctorProfile.assignedClinic;

    // Update Doctor Profile
    const updatedDoctor: DoctorProfile = {
      ...doctorProfile,
      assignedClinic: ''
    };
    setDoctorProfile(updatedDoctor);

    // Update Clinics roster
    const updatedClinics = clinics.map((room) => {
      const isTarget = roomId
        ? room.id === roomId
        : (
            room.doctorName === doctorProfile.name ||
            (activeClinic && room.name.toLowerCase() === activeClinic.toLowerCase()) ||
            room.doctorName === INITIAL_DOCTOR.name
          );

      if (isTarget) {
        return {
          ...room,
          status: 'available' as const,
          doctorName: undefined,
          doctorAvatar: undefined,
          doctorSpecialty: undefined,
          currentPatient: undefined
        };
      }
      return room;
    });
    setClinics(updatedClinics);

    // Update Patients attendingClinic
    const updatedPatients = patients.map((p) => {
      if (!p.attendingDoctor || p.attendingDoctor.includes('Ahmed') || p.attendingDoctor === doctorProfile.name) {
        return {
          ...p,
          attendingClinic: ''
        };
      }
      return p;
    });
    setPatients(updatedPatients);

    // Sync state
    storage.syncAll(updatedDoctor, updatedClinics, updatedPatients);
  };

  // Determine if viewing outside auth view
  const isAuthView =
    !isAuthenticated ||
    currentView === 'auth-gateway' ||
    currentView === 'doctor-login' ||
    currentView === 'patient-login' ||
    currentView === 'patient-signup';

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-[#181c20] dark:text-slate-100 font-sans flex flex-col selection:bg-[#cce5ff] transition-colors">
      {/* ========================================================================= */}
      {/* 1. OUTSIDE / AUTH GATEWAY                                                 */}
      {/* ========================================================================= */}
      {isAuthView && (
        <AuthGateway
          patients={patients}
          clinics={clinics}
          onDoctorLoginSuccess={handleDoctorLogin}
          onPatientLoginSuccess={handlePatientLogin}
          onPatientSignUpSuccess={handlePatientSignUp}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. INSIDE PORTAL                                                          */}
      {/* ========================================================================= */}
      {!isAuthView && (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
          {/* Single Unified Header */}
          <UnifiedHeader
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            userRole={userRole}
            doctorProfile={doctorProfile}
            activePatient={activePatient}
            onLogout={handleLogout}
            onAddPatient={handleOpenNewPatient}
            onScheduleVisit={() => handleOpenScheduleVisit(activePatient)}
          />

          {/* Main Workspace Area (Clean, Full-Width) */}
          <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
            {/* ==================================================== */}
            {/* A. DOCTOR PORTAL PAGES                               */}
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
                      onToggleInClinic={handleToggleInClinic}
                      onReorderPatients={handleReorderPatients}
                      onDeleteVisit={handleDeleteVisit}
                      onSelectPatient={(p) => {
                        setSelectedPatientId(p.id);
                        setCurrentView('doctor-patient-profile');
                      }}
                      onNavigate={(v) => setCurrentView(v)}
                      onAddPatient={handleOpenNewPatient}
                      onScheduleVisit={handleOpenScheduleVisit}
                      onAssignDoctor={handleAssignDoctor}
                      onVacateDoctor={handleVacateDoctor}
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
                      onUpdatePatient={handleSavePatient}
                      onUpdateTooth={handleUpdateTooth}
                      onBatchUpdateTeeth={handleBatchUpdateTeeth}
                      onAddVisit={() => setIsConsultationOpen(true)}
                      onScheduleVisit={handleOpenScheduleVisit}
                      onDeleteVisit={(visitId) => handleDeleteVisit(activePatient.id, visitId)}
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
                      onNewConsultation={() => handleOpenScheduleVisit(activePatient)}
                      onDeleteVisit={handleDeleteVisit}
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

                  {/* Doctor & Clinic Settings */}
                  {currentView === 'doctor-settings' && (
                    <DoctorSettingsView
                      doctorProfile={doctorProfile}
                      onUpdateDoctorProfile={handleUpdateDoctorProfile}
                      clinics={clinics}
                    />
                  )}
                </>
              )}

              {/* ==================================================== */}
              {/* B. PATIENT PORTAL PAGES                              */}
              {/* ==================================================== */}
              {userRole === 'patient' && (
                <>
                  {/* Patient Dashboard */}
                  {currentView === 'patient-dashboard' && (
                    <PatientDashboard
                      patient={activePatient}
                      clinics={clinics}
                      doctorProfile={doctorProfile}
                      onNavigate={(v) => setCurrentView(v)}
                      onBookAppointment={() => {
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
      )}

      {/* ========================================================================= */}
      {/* Global Modals                                                             */}
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
        existingPatients={patients}
        onSelectExistingPatient={handleSelectExistingPatientToQueue}
        initialPatient={editingPatient}
      />

      <UploadImageModal
        isOpen={isUploadImageOpen}
        onClose={() => setIsUploadImageOpen(false)}
        onUpload={handleUploadImage}
      />

      <ScheduleVisitModal
        isOpen={isScheduleVisitOpen}
        onClose={() => {
          setIsScheduleVisitOpen(false);
          setScheduleTargetPatient(null);
        }}
        patients={patients}
        clinics={clinics}
        selectedPatient={scheduleTargetPatient || activePatient}
        onSchedule={handleConfirmScheduleVisit}
      />
    </div>
  );
}

export default App;
