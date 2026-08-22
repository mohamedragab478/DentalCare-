import { supabase } from '../lib/supabaseClient';
import { Patient, ClinicRoom, DoctorProfile } from '../types';
import { storage } from '../utils/storage';
import { DOCTORS_LIST, CLINIC_ROOMS, INITIAL_PATIENTS } from '../data/initialData';

// Connection status tracking
let isCloudConnected = false;

function generateInitials(name: string): string {
  if (!name) return 'PT';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export const supabaseService = {
  // Test connection to Supabase
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from('patients').select('id').limit(1);
      // If table exists or connection succeeds
      if (!error || error.code === 'PGRST116') {
        isCloudConnected = true;
        return true;
      }
      // If table doesn't exist yet (42P01 in postgres)
      if (error && error.message?.includes('does not exist')) {
        console.info('Supabase connected! Tables pending creation in Supabase SQL editor.');
        isCloudConnected = true;
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Supabase ping check failed:', err);
      return false;
    }
  },

  isConnected(): boolean {
    return isCloudConnected;
  },

  // ----------------- PATIENTS -----------------
  async fetchPatients(): Promise<Patient[] | null> {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.warn('Could not fetch patients from Supabase:', error.message);
        return null;
      }

      if (data && data.length > 0) {
        const formatted: Patient[] = data.map((item: any) => ({
          id: String(item.id),
          name: item.name || '',
          initials: item.initials || generateInitials(item.name || ''),
          age: Number(item.age) || 30,
          gender: item.gender === 'Female' ? 'Female' : 'Male',
          phone: item.phone || '',
          birthDate: item.birth_date || item.birthDate,
          avatar: item.avatar || undefined,
          lastVisit: item.last_visit || item.lastVisit || 'Today',
          nextVisit: item.next_visit || item.nextVisit,
          nextVisitTime: item.next_visit_time || item.nextVisitTime,
          attendingDoctor: item.attending_doctor || item.attendingDoctor,
          attendingClinic: item.attending_clinic || item.attendingClinic,
          medicalNotes: item.medical_notes || item.medicalNotes,
          treatmentType: item.treatment_type || item.treatmentType,
          inClinic: Boolean(item.in_clinic ?? item.inClinic),
          inClinicTime: item.in_clinic_time || item.inClinicTime,
          teeth: item.teeth || {},
          visits: Array.isArray(item.visits) ? item.visits : [],
          images: Array.isArray(item.images) ? item.images : []
        }));

        return formatted;
      }

      return null;
    } catch (err) {
      console.warn('Error fetching patients from Supabase:', err);
      return null;
    }
  },

  async syncPatientsToCloud(patients: Patient[]): Promise<boolean> {
    try {
      const rows = patients.map((p) => ({
        id: p.id,
        name: p.name,
        age: p.age,
        gender: p.gender,
        phone: p.phone,
        birth_date: p.birthDate || null,
        avatar: p.avatar || null,
        last_visit: p.lastVisit,
        next_visit: p.nextVisit || null,
        next_visit_time: p.nextVisitTime || null,
        attending_doctor: p.attendingDoctor || null,
        attending_clinic: p.attendingClinic || null,
        medical_notes: p.medicalNotes || null,
        treatment_type: p.treatmentType || null,
        in_clinic: Boolean(p.inClinic),
        in_clinic_time: p.inClinicTime || null,
        teeth: p.teeth || {},
        visits: p.visits || [],
        images: p.images || [],
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('patients')
        .upsert(rows, { onConflict: 'id' });

      if (error) {
        console.warn('Failed to upsert patients to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Error syncing patients to Supabase:', err);
      return false;
    }
  },

  async saveSinglePatientToCloud(patient: Patient): Promise<boolean> {
    try {
      const row = {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        birth_date: patient.birthDate || null,
        avatar: patient.avatar || null,
        last_visit: patient.lastVisit,
        next_visit: patient.nextVisit || null,
        next_visit_time: patient.nextVisitTime || null,
        attending_doctor: patient.attendingDoctor || null,
        attending_clinic: patient.attendingClinic || null,
        medical_notes: patient.medicalNotes || null,
        treatment_type: patient.treatmentType || null,
        in_clinic: Boolean(patient.inClinic),
        in_clinic_time: patient.inClinicTime || null,
        teeth: patient.teeth || {},
        visits: patient.visits || [],
        images: patient.images || [],
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('patients')
        .upsert(row, { onConflict: 'id' });

      if (error) {
        console.warn('Failed to save patient to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Error saving patient to Supabase:', err);
      return false;
    }
  },

  // ----------------- DOCTORS -----------------
  async fetchDoctorsList(): Promise<DoctorProfile[] | null> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('id', { ascending: true });

      if (error || !data || data.length === 0) return null;

      const formatted: DoctorProfile[] = data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        specialty: item.specialty,
        avatar: item.avatar,
        assignedClinic: item.assigned_clinic || item.assignedClinic || 'Clinic 1',
        phone: item.phone || '',
        email: item.email || '',
        consultationFee: Number(item.consultation_fee || item.consultationFee) || 150,
        bio: item.bio || ''
      }));

      return formatted;
    } catch (err) {
      console.warn('Error fetching doctors list from Supabase:', err);
      return null;
    }
  },

  async syncDoctorsListToCloud(doctors: DoctorProfile[]): Promise<boolean> {
    try {
      const rows = doctors.map((d) => ({
        id: d.id,
        name: d.name,
        specialty: d.specialty,
        avatar: d.avatar,
        assigned_clinic: d.assignedClinic,
        phone: d.phone,
        email: d.email,
        consultation_fee: d.consultationFee,
        bio: d.bio || '',
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('doctors')
        .upsert(rows, { onConflict: 'id' });

      return !error;
    } catch (err) {
      console.warn('Error syncing doctors list to Supabase:', err);
      return false;
    }
  },

  // ----------------- CLINICS -----------------
  async fetchClinics(): Promise<ClinicRoom[] | null> {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('id', { ascending: true });

      if (error || !data || data.length === 0) return null;

      const formatted: ClinicRoom[] = data.map((item: any) => ({
        id: Number(item.id),
        name: item.name,
        doctorName: item.doctor_name || item.doctorName,
        doctorAvatar: item.doctor_avatar || item.doctorAvatar,
        doctorSpecialty: item.doctor_specialty || item.doctorSpecialty,
        status: item.status || 'available',
        currentPatient: item.current_patient || item.currentPatient
      }));

      return formatted;
    } catch (err) {
      console.warn('Error fetching clinics from Supabase:', err);
      return null;
    }
  },

  async syncClinicsToCloud(clinics: ClinicRoom[]): Promise<boolean> {
    try {
      const rows = clinics.map((c) => ({
        id: c.id,
        name: c.name,
        doctor_name: c.doctorName || null,
        doctor_avatar: c.doctorAvatar || null,
        doctor_specialty: c.doctorSpecialty || null,
        status: c.status,
        current_patient: c.currentPatient || null,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('clinics')
        .upsert(rows, { onConflict: 'id' });

      if (error) {
        console.warn('Failed to sync clinics to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Error syncing clinics to Supabase:', err);
      return false;
    }
  },

  // ----------------- DOCTOR PROFILE -----------------
  async fetchDoctorProfile(): Promise<DoctorProfile | null> {
    try {
      const { data, error } = await supabase
        .from('doctor_profile')
        .select('*')
        .limit(1)
        .single();

      if (error || !data) return null;

      const formatted: DoctorProfile = {
        id: data.id || 'doc-01',
        name: data.name,
        specialty: data.specialty,
        avatar: data.avatar,
        assignedClinic: data.assigned_clinic || data.assignedClinic || 'Clinic 1',
        phone: data.phone || '',
        email: data.email || '',
        consultationFee: Number(data.consultation_fee || data.consultationFee) || 150,
        bio: data.bio || ''
      };

      return formatted;
    } catch (err) {
      console.warn('Error fetching doctor profile from Supabase:', err);
      return null;
    }
  },

  async syncDoctorProfileToCloud(doctor: DoctorProfile): Promise<boolean> {
    try {
      const row = {
        id: doctor.id || 'doc-01',
        name: doctor.name,
        specialty: doctor.specialty,
        avatar: doctor.avatar,
        assigned_clinic: doctor.assignedClinic,
        phone: doctor.phone,
        email: doctor.email,
        consultation_fee: doctor.consultationFee,
        bio: doctor.bio,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('doctor_profile')
        .upsert(row, { onConflict: 'id' });

      if (error) {
        console.warn('Failed to sync doctor to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Error syncing doctor to Supabase:', err);
      return false;
    }
  },

  // ----------------- COMPLETED QUEUE -----------------
  async fetchCompletedQueue(): Promise<string[] | null> {
    try {
      const { data, error } = await supabase
        .from('clinic_queue')
        .select('completed_ids')
        .eq('id', 'daily_queue')
        .single();

      if (error || !data) return null;
      return Array.isArray(data.completed_ids) ? data.completed_ids : [];
    } catch (err) {
      return null;
    }
  },

  async syncCompletedQueueToCloud(ids: string[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clinic_queue')
        .upsert({
          id: 'daily_queue',
          completed_ids: ids,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      return !error;
    } catch (err) {
      return false;
    }
  },

  // ----------------- SEED ALL INITIAL DATA -----------------
  async seedAllInitialData(): Promise<{ success: boolean; message: string }> {
    try {
      await this.syncDoctorsListToCloud(DOCTORS_LIST);
      await this.syncDoctorProfileToCloud(DOCTORS_LIST[0]);
      await this.syncClinicsToCloud(CLINIC_ROOMS);
      await this.syncPatientsToCloud(INITIAL_PATIENTS);
      return { success: true, message: 'Successfully synced 3 Doctors and 3 Patients to Supabase Cloud!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Error seeding data to cloud' };
    }
  },

  // ----------------- REALTIME SUBSCRIPTION -----------------
  subscribeToCloudChanges(callbacks: {
    onPatientsChange?: (patients: Patient[]) => void;
    onClinicsChange?: (clinics: ClinicRoom[]) => void;
    onDoctorChange?: (doctor: DoctorProfile) => void;
    onQueueChange?: (ids: string[]) => void;
  }): () => void {
    const channel = supabase
      .channel('dentalcare_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'patients' },
        async () => {
          const freshPatients = await supabaseService.fetchPatients();
          if (freshPatients && callbacks.onPatientsChange) {
            callbacks.onPatientsChange(freshPatients);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clinics' },
        async () => {
          const freshClinics = await supabaseService.fetchClinics();
          if (freshClinics && callbacks.onClinicsChange) {
            callbacks.onClinicsChange(freshClinics);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'doctor_profile' },
        async () => {
          const freshDoctor = await supabaseService.fetchDoctorProfile();
          if (freshDoctor && callbacks.onDoctorChange) {
            callbacks.onDoctorChange(freshDoctor);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clinic_queue' },
        async () => {
          const freshQueue = await supabaseService.fetchCompletedQueue();
          if (freshQueue && callbacks.onQueueChange) {
            callbacks.onQueueChange(freshQueue);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
