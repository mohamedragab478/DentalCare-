import { Patient, ClinicRoom } from '../types';

export const INITIAL_DOCTOR = {
  name: 'Dr. Ahmed',
  specialty: 'Prosthodontics & Implantology',
  clinic: 'Clinic 1',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiZbB6Im6Xu7XRgyfySUQ0rnzkpsVPotlguTz9Lc_4_emwRGMwsUZWk3jCQBBPjON9pZuCcuZfZ0KaU-MkTNwd9E8-kJE4qE1RADCiJB27t36OOZEyT-ZN1pDoXnCmgs2ooji4aVFiB8wTydeRlOVM82YUG3ff7vcdwl0bunNK8c4GwHUUZsSmM2gZ89ZmSwEnEOur8ZdQ9453Rv-Z-PYTDwMmgCtqMDKB-feeN-LgSgmRtgHZDdjoNg',
  email: 'dr.ahmed@dentalcarepro.com',
  id: '101'
};

export const CLINIC_ROOMS: ClinicRoom[] = [
  {
    id: 1,
    name: 'Clinic 1',
    doctorName: 'Dr. Ahmed',
    doctorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkPYVPmuNczQ83HKwL_IM-WpaH4bUz-B4CLXpvtp79R5FvsWyKWe0OpjU6lyER-9OF6BCbNqxN8oGap9BTbSXKTdVJ7yP47iURdE6PRcOjbVW5hrf3BRSUldQf9W_gvGiEpbWP9qoobc62Zw17tAu9ZcVtbqHVilIWmdbEBSj6Y4trzngyDmuVlgkD9S-ErJ0_tD-z6hVh_qdA1PEMMNj-na2z-nHIm91CuVijGPaiBKeXkl7KSv2gdA',
    doctorSpecialty: 'Prosthodontics & Surgery',
    status: 'occupied',
    currentPatient: 'Mohamed Ali'
  },
  {
    id: 2,
    name: 'Clinic 2',
    doctorName: 'Dr. Mohamed',
    doctorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrsHu0YBZ-qIKWH1gYdoXrqf8KtvxUTiCjoAoxPhabvHytICRNAJq43h71DhxcDbI3AwBH2SPHreTkz4JQRCcDVg13eZz92P-dwus5UdxrrGaLjr4DQuUPknPHcRCiI1XbPhtRrBGxtG2YlQbKk8RN7jslot_4RXdlJw0V6QSBeFL9J1dQxn4x3Bwzv_kkjvdFZcjVhrf062FVJkc3bkYm281iF-NkCqWcsSBY4gk2ml9SriRuZQf81Q',
    doctorSpecialty: 'Orthodontics & Pediatric',
    status: 'occupied',
    currentPatient: 'Alice Smith'
  },
  {
    id: 3,
    name: 'Clinic 3',
    doctorName: 'Dr. Mahmoud',
    doctorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaF315g4eWMjDcYCZD4LlKxo-da9R6C3aZ9HOclUa8DZas075CI5hsDLUbU9Kswa0YNmW96-7OXa1Ke69Ocruzt_5IIRioT31mAP888DBwk0skdKtfkFjJp54E_yoBJGKgVeRrMVU79e2j6p8LPPs8hifI3exjEqcd0Ik48IEOpNi3l7NNs1WHTT1gulzdPzMAn7EuFrTjCX-hPh-dteTv0iCvySuWOfXyV0zeGTIioPf1lGZnvSNimw',
    doctorSpecialty: 'Periodontics & Endodontics',
    status: 'occupied',
    currentPatient: 'Emily Williams'
  },
  {
    id: 4,
    name: 'Clinic 4',
    status: 'available'
  }
];

const DEFAULT_TEETH_MAP: Record<number, { id: number; status: any; lastTreatmentDate?: string; notes?: string }> = {
  18: { id: 18, status: 'none', notes: 'Normal eruption, healthy' },
  17: { id: 17, status: 'none' },
  16: { id: 16, status: 'none' },
  15: { id: 15, status: 'none' },
  14: { id: 14, status: 'none' },
  13: { id: 13, status: 'none' },
  12: { id: 12, status: 'none' },
  11: { id: 11, status: 'none' },
  21: { id: 21, status: 'none' },
  22: { id: 22, status: 'none' },
  23: { id: 23, status: 'none' },
  24: { id: 24, status: 'none' },
  25: { id: 25, status: 'none' },
  26: { 
    id: 26, 
    status: 'filling', 
    lastTreatmentDate: '18 Aug 2026', 
    notes: 'Composite filling applied to occlusal surface. Margin integrity good.' 
  },
  27: { id: 27, status: 'none' },
  28: { id: 28, status: 'none' },
  38: { id: 38, status: 'none' },
  37: { id: 37, status: 'none' },
  36: { id: 36, status: 'crown', lastTreatmentDate: '15 Jan 2026', notes: 'Zirconia crown placed on tooth 36, excellent fit.' },
  35: { id: 35, status: 'none' },
  34: { id: 34, status: 'none' },
  33: { id: 33, status: 'none' },
  32: { id: 32, status: 'none' },
  31: { id: 31, status: 'none' },
  41: { id: 41, status: 'none' },
  42: { id: 42, status: 'none' },
  43: { id: 43, status: 'none' },
  44: { id: 44, status: 'none' },
  45: { id: 45, status: 'none' },
  46: { id: 46, status: 'root-canal', lastTreatmentDate: '02 Jun 2026', notes: 'Complete obturation, 3 canals sealed with gutta-percha.' },
  47: { id: 47, status: 'none' },
  48: { id: 48, status: 'extraction', lastTreatmentDate: '12 May 2025', notes: 'Impacted 3rd molar extracted uneventfully.' }
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: '849201',
    name: 'Mohamed Ali',
    initials: 'MA',
    age: 34,
    gender: 'Male',
    phone: '+1 (555) 019-2830',
    birthDate: '12 May 1992',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjPiLDyWepU0CeZ8X8tIln_VVoHrQtBpyU8CiodPf3F7v4BwoQcpHQcQYAzQPGLjtRhljnPUN7UWpWts7Z9cw13fBY7FOdrq2AntU5wzQDzRpOLGsrVmX5g7cIZn-DxUOUuNPZ83xs-iLQObirdHXR0A0t5KUcZiOoTP4BNMOMdEutnr0mgJO-uOU3wJ98k7MRm-dTt8NHMhFnTDXibTruBygcqXVVBZHEzQlUS7eeDlfczpm5v0NK2g',
    lastVisit: '18 Aug 2026',
    nextVisit: '01 Sep 2026',
    nextVisitTime: '10:30 AM',
    attendingDoctor: 'Dr. Ahmed',
    attendingClinic: 'Clinic 1',
    treatmentType: 'Filling',
    inClinic: true,
    inClinicTime: '10:15 AM',
    medicalNotes: 'Mild dental anxiety. Patient responded well to gentle local numbing. Composite filling applied to tooth 26.',
    teeth: { ...DEFAULT_TEETH_MAP },
    visits: [
      {
        id: 'v-201',
        date: '18 Aug 2026',
        doctorName: 'Dr. Ahmed',
        procedure: 'Treatment completed (Tooth 26 filling)',
        notes: 'Composite filling applied to occlusal surface. Margin integrity good.',
        status: 'completed',
        clinicRoom: 'Clinic 1',
        cost: 180
      },
      {
        id: 'v-202',
        date: '02 Jun 2026',
        doctorName: 'Dr. Mohamed',
        procedure: 'Routine checkup & cleaning',
        notes: 'General scale and polish completed. Advised flossing frequency increase.',
        status: 'completed',
        clinicRoom: 'Clinic 2',
        cost: 110
      },
      {
        id: 'v-203',
        date: '15 Jan 2026',
        doctorName: 'Dr. Mahmoud',
        procedure: 'Consultation & X-ray review',
        notes: 'Full mouth evaluation, identified incipient lesion on upper molar.',
        status: 'completed',
        clinicRoom: 'Clinic 3',
        cost: 95
      }
    ],
    images: [
      {
        id: 'img-panoramic',
        title: 'Panoramic X-ray',
        date: '12 May 2026',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNUJfRvywofbv1G0KsVnD1hWkBS1MArwp6OLKVjZqEJNF28ij4qxEEq9SZGP1DBObE8hVjZPcl7IAqgCw7_x6vB5JBNMrHuBDyckX0ZydrRFcTa9qYfI6OjiDXV3wkLjjaqH7pWOh9LvsTT1rfrhJlWiX0qP97DTBABJhoiMvH06Qel_qGXCgCRDIKylpdsdOfCMkV4cvSP7V_WnVlSS-lhlb4hve4K-iERWoRkPwktmYkGiKOfp_lsg',
        type: 'xray',
        notes: 'Full jaw panoramic showing normal bone density and root anatomy.'
      }
    ]
  },
  {
    id: '102943',
    name: 'Alice Smith',
    initials: 'AS',
    age: 32,
    gender: 'Female',
    phone: '(555) 987-6543',
    birthDate: '22 Feb 1994',
    lastVisit: '05 Sep 2025',
    nextVisit: '15 Nov 2026',
    nextVisitTime: '02:00 PM',
    attendingDoctor: 'Dr. Mohamed',
    attendingClinic: 'Clinic 2',
    treatmentType: 'Filling',
    medicalNotes: 'Latex allergy reported. Advised to use nitrile gloves.',
    teeth: { ...DEFAULT_TEETH_MAP },
    visits: [
      {
        id: 'v-102',
        date: '05 Sep 2025',
        doctorName: 'Dr. Mohamed',
        procedure: 'Premolar composite restoration',
        notes: 'Tooth #14 filled with resin composite.',
        status: 'completed',
        clinicRoom: 'Clinic 2',
        cost: 210
      },
      {
        id: 'v-103',
        date: '15 Nov 2026',
        doctorName: 'Dr. Mohamed',
        procedure: 'Orthodontic adjustment',
        notes: 'Follow-up aligner review.',
        status: 'scheduled',
        clinicRoom: 'Clinic 2'
      }
    ],
    images: []
  },
  {
    id: '102935',
    name: 'John Doe',
    initials: 'JD',
    age: 45,
    gender: 'Male',
    phone: '(555) 123-4567',
    birthDate: '14 Oct 1980',
    lastVisit: '12 Oct 2025',
    nextVisit: undefined,
    treatmentType: 'Cleaning',
    medicalNotes: 'No known allergies. Slight hypertension controlled by medication.',
    teeth: { ...DEFAULT_TEETH_MAP },
    visits: [
      {
        id: 'v-101',
        date: '12 Oct 2025',
        doctorName: 'Dr. Ahmed',
        procedure: 'Comprehensive oral prophylaxis',
        notes: 'Plaque and calculus removed, fluoride varnish applied.',
        status: 'completed',
        clinicRoom: 'Clinic 1',
        cost: 120
      }
    ],
    images: [
      {
        id: 'img-1',
        title: 'Panoramic X-ray',
        date: '12 May 2026',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNUJfRvywofbv1G0KsVnD1hWkBS1MArwp6OLKVjZqEJNF28ij4qxEEq9SZGP1DBObE8hVjZPcl7IAqgCw7_x6vB5JBNMrHuBDyckX0ZydrRFcTa9qYfI6OjiDXV3wkLjjaqH7pWOh9LvsTT1rfrhJlWiX0qP97DTBABJhoiMvH06Qel_qGXCgCRDIKylpdsdOfCMkV4cvSP7V_WnVlSS-lhlb4hve4K-iERWoRkPwktmYkGiKOfp_lsg',
        type: 'xray'
      }
    ]
  },
  {
    id: '102958',
    name: 'Michael Johnson',
    initials: 'MJ',
    age: 58,
    gender: 'Male',
    phone: '(555) 456-7890',
    birthDate: '08 Mar 1968',
    lastVisit: '20 Aug 2025',
    nextVisit: undefined,
    treatmentType: 'Extraction',
    medicalNotes: 'Type 2 Diabetes. Monitored healing post extraction.',
    teeth: { ...DEFAULT_TEETH_MAP },
    visits: [
      {
        id: 'v-104',
        date: '20 Aug 2025',
        doctorName: 'Dr. Mahmoud',
        procedure: 'Surgical extraction tooth #48',
        notes: 'Local anesthesia 2% Lidocaine with 1:100k epi. Sutures placed.',
        status: 'completed',
        clinicRoom: 'Clinic 3',
        cost: 350
      }
    ],
    images: []
  },
  {
    id: '102964',
    name: 'Emily Williams',
    initials: 'EW',
    age: 24,
    gender: 'Female',
    phone: '(555) 222-3333',
    birthDate: '19 Jun 2002',
    lastVisit: '25 Oct 2025',
    nextVisit: '02 Dec 2026',
    nextVisitTime: '11:00 AM',
    attendingDoctor: 'Dr. Ahmed',
    attendingClinic: 'Clinic 1',
    treatmentType: 'Cleaning',
    medicalNotes: 'Wisdom teeth check recommended in 6 months.',
    teeth: { ...DEFAULT_TEETH_MAP },
    visits: [
      {
        id: 'v-105',
        date: '25 Oct 2025',
        doctorName: 'Dr. Ahmed',
        procedure: 'Deep cleaning & assessment',
        notes: 'Gingival health good, minor calculus lower anterior.',
        status: 'completed',
        clinicRoom: 'Clinic 1',
        cost: 150
      },
      {
        id: 'v-106',
        date: '02 Dec 2026',
        doctorName: 'Dr. Ahmed',
        procedure: 'Dental whitening consultation',
        notes: 'Shade baseline recorded at A2.',
        status: 'scheduled',
        clinicRoom: 'Clinic 1'
      }
    ],
    images: []
  }
];
