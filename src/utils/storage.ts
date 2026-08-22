import { DoctorProfile, Patient, ClinicRoom } from '../types';
import { INITIAL_DOCTOR, INITIAL_PATIENTS, CLINIC_ROOMS } from '../data/initialData';

const DOCTOR_KEY = 'dentalcare_doctor_profile_v2';
const PATIENTS_KEY = 'dentalcare_patients_v2';
const CLINICS_KEY = 'dentalcare_clinics_v2';
const QUEUE_KEY = 'dentalcare_completed_queue_v2';

const DEFAULT_DOCTOR: DoctorProfile = {
  id: 'doc-01',
  name: 'Dr. Ahmed Al-Sayed',
  specialty: 'Prosthodontics & Implantology',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxTdB6BFCRDU6qr8N5YlyqcvvBqAlixK076_tUMWhheQjfjcVCtO0UBEY8sL1jYC9cucKVnoLoEgJlDKaSn0Qb5FJkx7v8MdhtOBjzCb8dHppP7IhiJllCOCEHHLwVXSrsa5mcVTHwz5OLt5nCjCSdaOMEjmqz6mQGAz0pZXk-7oBvgitx-9e-JaGvGW1CTaWYwwuVfl_PBgRvo3t6bQ1DMA1TZCepbWvSxDJrfFFqBCZE6ilABoY5eg',
  assignedClinic: 'Clinic 1',
  phone: '+1 (555) 234-5678',
  email: 'dr.ahmed@dentalcarepro.clinic',
  consultationFee: 150,
  bio: 'Specializing in complex restorative prosthodontics, digital smile design, and guided implant surgery with over 12 years of clinical excellence.'
};

export const storage = {
  getDoctorProfile: (): DoctorProfile => {
    try {
      const data = localStorage.getItem(DOCTOR_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load doctor profile from localStorage', e);
    }
    return DEFAULT_DOCTOR;
  },

  setDoctorProfile: (profile: DoctorProfile) => {
    try {
      localStorage.setItem(DOCTOR_KEY, JSON.stringify(profile));
      broadcastChange({ type: 'DOCTOR_UPDATED', payload: profile });
    } catch (e) {
      console.warn('Failed to save doctor profile', e);
    }
  },

  getPatients: (): Patient[] => {
    try {
      const data = localStorage.getItem(PATIENTS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load patients from localStorage', e);
    }
    return INITIAL_PATIENTS;
  },

  setPatients: (patients: Patient[]) => {
    try {
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
      broadcastChange({ type: 'PATIENTS_UPDATED', payload: patients });
    } catch (e) {
      console.warn('Failed to save patients', e);
    }
  },

  getClinics: (): ClinicRoom[] => {
    try {
      const data = localStorage.getItem(CLINICS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load clinics from localStorage', e);
    }
    return CLINIC_ROOMS;
  },

  setClinics: (clinics: ClinicRoom[]) => {
    try {
      localStorage.setItem(CLINICS_KEY, JSON.stringify(clinics));
      broadcastChange({ type: 'CLINICS_UPDATED', payload: clinics });
    } catch (e) {
      console.warn('Failed to save clinics', e);
    }
  },

  getCompletedQueue: (): string[] => {
    try {
      const data = localStorage.getItem(QUEUE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load completed queue', e);
    }
    return [];
  },

  setCompletedQueue: (ids: string[]) => {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(ids));
      broadcastChange({ type: 'QUEUE_UPDATED', payload: ids });
    } catch (e) {
      console.warn('Failed to save completed queue', e);
    }
  },

  syncAll: (doctor: DoctorProfile, clinics: ClinicRoom[], patients: Patient[]) => {
    try {
      localStorage.setItem(DOCTOR_KEY, JSON.stringify(doctor));
      localStorage.setItem(CLINICS_KEY, JSON.stringify(clinics));
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
      broadcastChange({
        type: 'FULL_SYNC',
        payload: { doctor, clinics, patients }
      });
    } catch (e) {
      console.warn('Failed to sync all', e);
    }
  }
};

let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel('dentalcare_sync_channel');
  }
} catch (e) {
  // BroadcastChannel fallback
}

function broadcastChange(data: any) {
  if (syncChannel) {
    try {
      syncChannel.postMessage(data);
    } catch (e) {}
  }
}

export function subscribeToStorageUpdates(
  onUpdate: (type: string, payload: any) => void
): () => void {
  // 1. BroadcastChannel listener
  const bcListener = (event: MessageEvent) => {
    if (event.data && event.data.type) {
      onUpdate(event.data.type, event.data.payload);
    }
  };

  if (syncChannel) {
    syncChannel.addEventListener('message', bcListener);
  }

  // 2. Storage event listener (across browser tabs)
  const storageListener = (event: StorageEvent) => {
    if (!event.key || !event.newValue) return;
    try {
      const parsed = JSON.parse(event.newValue);
      if (event.key === DOCTOR_KEY) {
        onUpdate('DOCTOR_UPDATED', parsed);
      } else if (event.key === CLINICS_KEY) {
        onUpdate('CLINICS_UPDATED', parsed);
      } else if (event.key === PATIENTS_KEY) {
        onUpdate('PATIENTS_UPDATED', parsed);
      } else if (event.key === QUEUE_KEY) {
        onUpdate('QUEUE_UPDATED', parsed);
      }
    } catch (e) {}
  };

  window.addEventListener('storage', storageListener);

  return () => {
    if (syncChannel) {
      syncChannel.removeEventListener('message', bcListener);
    }
    window.removeEventListener('storage', storageListener);
  };
}
