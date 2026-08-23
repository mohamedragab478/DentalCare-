import React, { useState, useEffect, useRef } from 'react';
import { AppView, Patient, ToothStatus, ClinicRoom, VisitRecord, MedicalImage, DoctorProfile } from './types';
import { INITIAL_PATIENTS, CLINIC_ROOMS, INITIAL_DOCTOR, DOCTORS_LIST } from './data/initialData';
import { storage, subscribeToStorageUpdates } from './utils/storage';
import { supabaseService } from './services/supabaseService';
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
import { SelectClinicModal } from './components/SelectClinicModal';
import { useAppThemeLanguage } from './context/ThemeLanguageContext';

export function App() {
  const { isRTL } = useAppThemeLanguage();

  // Authentication & Role State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'doctor' | 'patient'>('doctor');
  const [currentView, setCurrentView] = useState<AppView>('auth-gateway');

  // Attending Doctor Profile State (Loaded with Persistent Storage fallback)
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>(() => storage.getDoctorProfile());

  // Today's Queue Completed Status Tracking (تم الانتهاء)
  const [completedQueueIds, setCompletedQueueIds] = useState<string[]>(() => storage.getCompletedQueue());

  // Application Data State (Loaded with Persistent Storage fallback)
  const [patients, setPatients] = useState<Patient[]>(() => storage.getPatients());
  const [selectedPatientId, setSelectedPatientId] = useState<string>('849201'); // Mohamed Ali
  const [clinics, setClinics] = useState<ClinicRoom[]>(() => storage.getClinics());

  // Last synced serialized strings to prevent echo loops
  const lastSyncedDoctorRef = useRef<string>(JSON.stringify(doctorProfile));
  const lastSyncedPatientsRef = useRef<string>(JSON.stringify(patients));
  const lastSyncedClinicsRef = useRef<string>(JSON.stringify(clinics));
  const lastSyncedQueueRef = useRef<string>(JSON.stringify(completedQueueIds));

  // Real-time persistence to localStorage & Supabase
  useEffect(() => {
    const serialized = JSON.stringify(doctorProfile);
    if (lastSyncedDoctorRef.current !== serialized) {
      lastSyncedDoctorRef.current = serialized;
      storage.setDoctorProfile(doctorProfile);
      supabaseService.syncDoctorProfileToCloud(doctorProfile);
    }
  }, [doctorProfile]);

  useEffect(() => {
    const serialized = JSON.stringify(patients);
    if (lastSyncedPatientsRef.current !== serialized) {
      lastSyncedPatientsRef.current = serialized;
      storage.setPatients(patients);
      supabaseService.syncPatientsToCloud(patients);
    }
  }, [patients]);

  useEffect(() => {
    const serialized = JSON.stringify(clinics);
    if (lastSyncedClinicsRef.current !== serialized) {
      lastSyncedClinicsRef.current = serialized;
      storage.setClinics(clinics);
      supabaseService.syncClinicsToCloud(clinics);
    }
  }, [clinics]);

  useEffect(() => {
    const serialized = JSON.stringify(completedQueueIds);
    if (lastSyncedQueueRef.current !== serialized) {
      lastSyncedQueueRef.current = serialized;
      storage.setCompletedQueue(completedQueueIds);
      supabaseService.syncCompletedQueueToCloud(completedQueueIds);
    }
  }, [completedQueueIds]);

  // Initial cloud fetch & realtime cloud subscription on mount
  useEffect(() => {
    const mergeWithLocal = (incoming: Patient[]): Patient[] => {
      const local = storage.getPatients();
      const localMap = new Map(local.map((p) => [p.id, p]));
      return incoming.map((cp) => {
        const lp = localMap.get(cp.id);
        if (!lp) return cp;
        return {
          ...cp,
          inClinicOrder: cp.inClinicOrder ?? (cp.inClinic ? lp.inClinicOrder : undefined),
          inClinicTimestamp: cp.inClinicTimestamp ?? (cp.inClinic ? lp.inClinicTimestamp : undefined),
          inClinicTime: cp.inClinicTime || (cp.inClinic ? lp.inClinicTime : undefined)
        };
      });
    };

    // 1. Initial cloud fetch
    async function loadCloudData() {
      try {
        const cloudPatients = await supabaseService.fetchPatients();
        if (cloudPatients && cloudPatients.length > 0) {
          const merged = mergeWithLocal(cloudPatients);
          lastSyncedPatientsRef.current = JSON.stringify(merged);
          setPatients(merged);
          storage.setPatients(merged);
        } else {
          // Push initial data to cloud so Supabase gets populated
          const currentLocalPatients = storage.getPatients();
          supabaseService.syncPatientsToCloud(currentLocalPatients);
        }

        const cloudClinics = await supabaseService.fetchClinics();
        if (cloudClinics && cloudClinics.length > 0) {
          lastSyncedClinicsRef.current = JSON.stringify(cloudClinics);
          setClinics(cloudClinics);
          storage.setClinics(cloudClinics);
        } else {
          supabaseService.syncClinicsToCloud(storage.getClinics());
        }

        const cloudDoctor = await supabaseService.fetchDoctorProfile();
        if (cloudDoctor) {
          lastSyncedDoctorRef.current = JSON.stringify(cloudDoctor);
          setDoctorProfile(cloudDoctor);
          storage.setDoctorProfile(cloudDoctor);
        } else {
          supabaseService.syncDoctorProfileToCloud(storage.getDoctorProfile());
        }

        const cloudQueue = await supabaseService.fetchCompletedQueue();
        if (cloudQueue) {
          lastSyncedQueueRef.current = JSON.stringify(cloudQueue);
          setCompletedQueueIds(cloudQueue);
        }
      } catch (err) {
        console.warn('Initial cloud load skipped / using local data', err);
      }
    }

    loadCloudData();

    // 2. Realtime cloud table subscriptions
    const unsubscribeCloud = supabaseService.subscribeToCloudChanges({
      onPatientsChange: (newPatients) => {
        const merged = mergeWithLocal(newPatients);
        const serialized = JSON.stringify(merged);
        if (lastSyncedPatientsRef.current !== serialized) {
          lastSyncedPatientsRef.current = serialized;
          setPatients(merged);
          storage.setPatients(merged);
        }
      },
      onClinicsChange: (newClinics) => {
        const serialized = JSON.stringify(newClinics);
        if (lastSyncedClinicsRef.current !== serialized) {
          lastSyncedClinicsRef.current = serialized;
          setClinics(newClinics);
        }
      },
      onDoctorChange: (newDoctor) => {
        const serialized = JSON.stringify(newDoctor);
        if (lastSyncedDoctorRef.current !== serialized) {
          lastSyncedDoctorRef.current = serialized;
          setDoctorProfile(newDoctor);
        }
      },
      onQueueChange: (newQueue) => {
        const serialized = JSON.stringify(newQueue);
        if (lastSyncedQueueRef.current !== serialized) {
          lastSyncedQueueRef.current = serialized;
          setCompletedQueueIds(newQueue);
        }
      }
    });

    // 3. Local tab synchronization
    const unsubscribeLocal = subscribeToStorageUpdates((type, payload) => {
      if (type === 'DOCTOR_UPDATED' && payload) {
        const serialized = JSON.stringify(payload);
        if (lastSyncedDoctorRef.current !== serialized) {
          lastSyncedDoctorRef.current = serialized;
          setDoctorProfile(payload);
        }
      } else if (type === 'CLINICS_UPDATED' && payload) {
        const serialized = JSON.stringify(payload);
        if (lastSyncedClinicsRef.current !== serialized) {
          lastSyncedClinicsRef.current = serialized;
          setClinics(payload);
        }
      } else if (type === 'PATIENTS_UPDATED' && payload) {
        const serialized = JSON.stringify(payload);
        if (lastSyncedPatientsRef.current !== serialized) {
          lastSyncedPatientsRef.current = serialized;
          setPatients(payload);
        }
      } else if (type === 'QUEUE_UPDATED' && payload) {
        const serialized = JSON.stringify(payload);
        if (lastSyncedQueueRef.current !== serialized) {
          lastSyncedQueueRef.current = serialized;
          setCompletedQueueIds(payload);
        }
      } else if (type === 'FULL_SYNC' && payload) {
        if (payload.doctor) {
          lastSyncedDoctorRef.current = JSON.stringify(payload.doctor);
          setDoctorProfile(payload.doctor);
        }
        if (payload.clinics) {
          lastSyncedClinicsRef.current = JSON.stringify(payload.clinics);
          setClinics(payload.clinics);
        }
        if (payload.patients) {
          lastSyncedPatientsRef.current = JSON.stringify(payload.patients);
          setPatients(payload.patients);
        }
      }
    });

    return () => {
      unsubscribeCloud();
      unsubscribeLocal();
    };
  }, []);

  // Active Doctor Clinic State
  const [activeClinic, setActiveClinic] = useState<string>(() => doctorProfile.assignedClinic || 'Clinic 1');

  const handleUpdateActiveClinic = (clinic: string) => {
    setActiveClinic(clinic);
    
    // 1. Update doctor profile
    const updatedDoctor = {
      ...doctorProfile,
      assignedClinic: clinic
    };
    setDoctorProfile(updatedDoctor);

    // 2. Automatically assign doctor to the selected clinic room in the Clinics Roster
    setClinics((prev) => {
      const updatedClinics = prev.map((room) => {
        const isTarget = room.name.toLowerCase() === clinic.toLowerCase();
        const wasDoctorRoom =
          room.doctorName === doctorProfile.name ||
          (doctorProfile.assignedClinic && room.name.toLowerCase() === doctorProfile.assignedClinic.toLowerCase());

        if (isTarget) {
          return {
            ...room,
            status: 'occupied' as const,
            doctorName: doctorProfile.name,
            doctorAvatar: doctorProfile.avatar,
            doctorSpecialty: doctorProfile.specialty
          };
        }
        if (wasDoctorRoom) {
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

      storage.syncAll(updatedDoctor, updatedClinics, patients);
      return updatedClinics;
    });
  };

  // Modals & Edit State
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
  const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState(false);
  const [isSelectClinicOpen, setIsSelectClinicOpen] = useState(false);
  const [scheduleTargetPatient, setScheduleTargetPatient] = useState<Patient | null>(null);

  // Current active patient
  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // ================= Handlers =================
  const handleDoctorLogin = (doctorId?: string) => {
    if (doctorId) {
      const cleanTarget = doctorId.toLowerCase().trim();
      const digits = cleanTarget.replace(/\D/g, '');
      const matchedDoctor = DOCTORS_LIST.find((d) => {
        const docDigits = d.id.replace(/\D/g, '');
        return (
          d.id.toLowerCase() === cleanTarget ||
          d.email.toLowerCase() === cleanTarget ||
          d.name.toLowerCase().includes(cleanTarget) ||
          (digits.length > 0 && docDigits.endsWith(digits)) ||
          cleanTarget === `doc-${docDigits}` ||
          cleanTarget === `doc-10${docDigits}` ||
          cleanTarget === `10${docDigits}` ||
          (cleanTarget === 'doc-101' && d.id === 'doc-01') ||
          (cleanTarget === 'doc-102' && d.id === 'doc-02') ||
          (cleanTarget === 'doc-103' && d.id === 'doc-03')
        );
      });

      if (matchedDoctor) {
        setDoctorProfile(matchedDoctor);
        storage.setDoctorProfile(matchedDoctor);
      }
    }
    setIsAuthenticated(true);
    setUserRole('doctor');
    setCurrentView('doctor-dashboard');
    setIsSelectClinicOpen(true); // Open center-screen window to select active clinic
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
      // Calculate maxOrder among currently in-clinic patients
      const currentInClinic = prev.filter((p) => p.inClinic && p.id !== patientId);
      const maxOrder = Math.max(0, ...currentInClinic.map((p) => p.inClinicOrder || 0));

      const updatedPatient: Patient = {
        ...target,
        inClinic: isNowInClinic,
        inClinicTime: isNowInClinic ? nowTime : undefined,
        inClinicTimestamp: isNowInClinic ? Date.now() : undefined,
        inClinicOrder: isNowInClinic ? (maxOrder + 1) : undefined
      };

      // Immediately sync this individual change to Supabase
      supabaseService.saveSinglePatientToCloud(updatedPatient);

      const others = prev.filter((p) => p.id !== patientId);
      const inClinicGroup = others.filter((p) => p.inClinic);
      const notInClinicGroup = others.filter((p) => !p.inClinic);

      if (isNowInClinic) {
        return [...inClinicGroup, updatedPatient, ...notInClinicGroup];
      } else {
        return [...inClinicGroup, ...notInClinicGroup, updatedPatient];
      }
    });
  };

  const handleReorderPatients = (newOrder: Patient[]) => {
    let orderCounter = 1;
    const reordered = newOrder.map((p) => {
      if (p.inClinic) {
        return { ...p, inClinicOrder: orderCounter++ };
      }
      return { ...p, inClinicOrder: undefined };
    });
    setPatients(reordered);
    storage.setPatients(reordered);
    supabaseService.syncPatientsToCloud(reordered);
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

  // Add or Edit Patient
  const handleSavePatient = (savedPatient: Patient) => {
    const currentInClinic = patients.filter((p) => p.inClinic && p.id !== savedPatient.id);
    const maxOrder = Math.max(0, ...currentInClinic.map((p) => p.inClinicOrder || 0));
    const patientWithOrder = {
      ...savedPatient,
      inClinicTimestamp: savedPatient.inClinic ? (savedPatient.inClinicTimestamp || Date.now()) : undefined,
      inClinicOrder: savedPatient.inClinic ? (savedPatient.inClinicOrder || maxOrder + 1) : undefined
    };

    // Trigger instant Supabase save
    supabaseService.saveSinglePatientToCloud(patientWithOrder).then((success) => {
      if (!success) {
        console.warn('Could not save patient directly to Supabase. Check RLS policies or credentials.');
      }
    });

    setPatients((prev) => {
      const exists = prev.some((p) => p.id === patientWithOrder.id);
      if (exists) {
        return prev.map((p) => (p.id === patientWithOrder.id ? patientWithOrder : p));
      }
      if (patientWithOrder.inClinic) {
        const alreadyInClinic = prev.filter((p) => p.inClinic);
        const notInClinic = prev.filter((p) => !p.inClinic);
        return [...alreadyInClinic, patientWithOrder, ...notInClinic];
      }
      return [...prev, patientWithOrder];
    });
    setSelectedPatientId(savedPatient.id);
    setEditingPatient(null);
  };

  const handleSelectExistingPatientToQueue = (existingPatient: Patient, treatmentType?: string) => {
    setPatients((prev) => {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const todayDate = new Date().toISOString().split('T')[0];
      const maxOrder = Math.max(0, ...prev.map((p) => p.inClinicOrder || 0));

      const updatedTarget: Patient = {
        ...existingPatient,
        inClinic: true,
        inClinicTime: nowTime,
        inClinicTimestamp: existingPatient.inClinicTimestamp || Date.now(),
        inClinicOrder: existingPatient.inClinicOrder || (maxOrder + 1),
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
            activeClinic={activeClinic}
            onUpdateActiveClinic={handleUpdateActiveClinic}
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
                      activeClinic={activeClinic}
                      onUpdateActiveClinic={handleUpdateActiveClinic}
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
        activeClinic={activeClinic}
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
        activeClinic={activeClinic}
        selectedPatient={scheduleTargetPatient || activePatient}
        onSchedule={handleConfirmScheduleVisit}
      />

      <SelectClinicModal
        isOpen={isSelectClinicOpen && isAuthenticated && userRole === 'doctor'}
        onClose={() => setIsSelectClinicOpen(false)}
        doctorProfile={doctorProfile}
        clinics={clinics}
        onSelectClinic={(chosenClinic) => {
          handleUpdateActiveClinic(chosenClinic);
          setIsSelectClinicOpen(false);
        }}
      />
    </div>
  );
}

export default App;
