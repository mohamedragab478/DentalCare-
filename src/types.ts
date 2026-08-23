export type ToothStatus = 'extraction' | 'filling' | 'root-canal' | 'crown' | 'implant' | 'bridge' | 'other' | 'none';

export interface ToothRecord {
  id: number; // FDI notation e.g. 11, 12, 18, 21, 26, 31, 41, etc.
  name?: string;
  status: ToothStatus;
  customProcedureName?: string; // For 'other' procedure
  bridgeSpan?: number[]; // FDI numbers of connected adjacent teeth for 'bridge'
  lastTreatmentDate?: string;
  notes?: string;
}

export interface MedicalImage {
  id: string;
  title: string;
  date: string;
  url: string;
  type: 'xray' | 'bitewing' | 'intraoral' | 'photo';
  notes?: string;
}

export interface VisitRecord {
  id: string;
  date: string;
  doctorName: string;
  procedure: string;
  notes: string;
  status: 'completed' | 'scheduled' | 'in-progress' | 'cancelled';
  clinicRoom?: string;
  cost?: number;
}

export interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: 'Male' | 'Female';
  phone: string;
  birthDate?: string;
  avatar?: string;
  lastVisit: string;
  nextVisit?: string;
  nextVisitTime?: string;
  attendingDoctor?: string;
  attendingClinic?: string;
  medicalNotes?: string;
  treatmentType?: string;
  inClinic?: boolean;
  inClinicTime?: string;
  inClinicTimestamp?: number;
  inClinicOrder?: number;
  teeth: Record<number, ToothRecord>;
  visits: VisitRecord[];
  images: MedicalImage[];
}

export interface ClinicRoom {
  id: number;
  name: string;
  doctorName?: string;
  doctorAvatar?: string;
  doctorSpecialty?: string;
  status: 'occupied' | 'available' | 'empty';
  currentPatient?: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  assignedClinic: string;
  phone: string;
  email: string;
  consultationFee: number;
  bio?: string;
  licenseNumber?: string;
  password?: string;
}

export type UserRole = 'doctor' | 'patient';

export type AppView = 
  | 'auth-gateway'
  | 'doctor-login'
  | 'patient-login'
  | 'patient-signup'
  | 'doctor-dashboard'
  | 'doctor-patients'
  | 'doctor-patient-profile'
  | 'doctor-visits'
  | 'doctor-clinics'
  | 'doctor-settings'
  | 'patient-dashboard'
  | 'patient-chart'
  | 'patient-visits'
  | 'patient-profile';
