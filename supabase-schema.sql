-- ============================================================================
-- DentalCare Pro - Complete Supabase Database Schema & Initial Seed Data
-- Instructions: 
-- 1. Open your Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Go to "SQL Editor" on the left menu
-- 3. Click "New query", paste this entire script, and click "RUN"
-- ============================================================================

-- ==========================================
-- 1. Create Tables
-- ==========================================

-- A. Patients Table
CREATE TABLE IF NOT EXISTS public.patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    initials TEXT,
    age INTEGER DEFAULT 30,
    gender TEXT DEFAULT 'Male',
    phone TEXT,
    birth_date TEXT,
    avatar TEXT,
    last_visit TEXT,
    next_visit TEXT,
    next_visit_time TEXT,
    attending_doctor TEXT,
    attending_clinic TEXT,
    medical_notes TEXT,
    treatment_type TEXT,
    in_clinic BOOLEAN DEFAULT false,
    in_clinic_time TEXT,
    teeth JSONB DEFAULT '{}'::jsonb,
    visits JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- B. Doctors Table
CREATE TABLE IF NOT EXISTS public.doctors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    avatar TEXT,
    assigned_clinic TEXT,
    phone TEXT,
    email TEXT,
    consultation_fee NUMERIC DEFAULT 150,
    bio TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- C. Clinics Table
CREATE TABLE IF NOT EXISTS public.clinics (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    doctor_name TEXT,
    doctor_avatar TEXT,
    doctor_specialty TEXT,
    status TEXT DEFAULT 'available',
    current_patient TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- D. Doctor Profile (Current active session profile)
CREATE TABLE IF NOT EXISTS public.doctor_profile (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialty TEXT,
    avatar TEXT,
    assigned_clinic TEXT,
    phone TEXT,
    email TEXT,
    consultation_fee NUMERIC DEFAULT 150,
    bio TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- E. Clinic Queue Tracking Table
CREATE TABLE IF NOT EXISTS public.clinic_queue (
    id TEXT PRIMARY KEY,
    completed_ids JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- 2. Enable Row Level Security (RLS) & Realtime
-- ==========================================
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_queue ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public read-write for patients" ON public.patients;
    DROP POLICY IF EXISTS "Allow public read-write for doctors" ON public.doctors;
    DROP POLICY IF EXISTS "Allow public read-write for clinics" ON public.clinics;
    DROP POLICY IF EXISTS "Allow public read-write for doctor_profile" ON public.doctor_profile;
    DROP POLICY IF EXISTS "Allow public read-write for clinic_queue" ON public.clinic_queue;
END $$;

CREATE POLICY "Allow public read-write for patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for doctors" ON public.doctors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for clinics" ON public.clinics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for doctor_profile" ON public.doctor_profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for clinic_queue" ON public.clinic_queue FOR ALL USING (true) WITH CHECK (true);

-- Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.patients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.doctors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clinics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.doctor_profile;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clinic_queue;


-- ============================================================================
-- 3. SEED DATA (3 Doctors & 3 Patients)
-- ============================================================================

-- Insert 3 Doctors
INSERT INTO public.doctors (id, name, specialty, avatar, assigned_clinic, phone, email, consultation_fee, bio)
VALUES
  (
    'doc-01',
    'Dr. Ahmed Al-Sayed',
    'Prosthodontics & Implantology',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCkPYVPmuNczQ83HKwL_IM-WpaH4bUz-B4CLXpvtp79R5FvsWyKWe0OpjU6lyER-9OF6BCbNqxN8oGap9BTbSXKTdVJ7yP47iURdE6PRcOjbVW5hrf3BRSUldQf9W_gvGiEpbWP9qoobc62Zw17tAu9ZcVtbqHVilIWmdbEBSj6Y4trzngyDmuVlgkD9S-ErJ0_tD-z6hVh_qdA1PEMMNj-na2z-nHIm91CuVijGPaiBKeXkl7KSv2gdA',
    'Clinic 1',
    '+20 100 123 4567',
    'dr.ahmed@dentalcarepro.com',
    200,
    'Senior Consultant in Prosthetic Dentistry and Implantology with over 15 years of clinical experience.'
  ),
  (
    'doc-02',
    'Dr. Mohamed Hassan',
    'Orthodontics & Pediatric Dentistry',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDrsHu0YBZ-qIKWH1gYdoXrqf8KtvxUTiCjoAoxPhabvHytICRNAJq43h71DhxcDbI3AwBH2SPHreTkz4JQRCcDVg13eZz92P-dwus5UdxrrGaLjr4DQuUPknPHcRCiI1XbPhtRrBGxtG2YlQbKk8RN7jslot_4RXdlJw0V6QSBeFL9J1dQxn4x3Bwzv_kkjvdFZcjVhrf062FVJkc3bkYm281iF-NkCqWcsSBY4gk2ml9SriRuZQf81Q',
    'Clinic 2',
    '+20 101 234 5678',
    'dr.mohamed@dentalcarepro.com',
    180,
    'Specialist in Clear Aligners, Fixed Orthodontics, and Preventive Pediatric Dental Care.'
  ),
  (
    'doc-03',
    'Dr. Mahmoud Ibrahim',
    'Periodontics & Endodontics',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCaF315g4eWMjDcYCZD4LlKxo-da9R6C3aZ9HOclUa8DZas075CI5hsDLUbU9Kswa0YNmW96-7OXa1Ke69Ocruzt_5IIRioT31mAP888DBwk0skdKtfkFjJp54E_yoBJGKgVeRrMVU79e2j6p8LPPs8hifI3exjEqcd0Ik48IEOpNi3l7NNs1WHTT1gulzdPzMAn7EuFrTjCX-hPh-dteTv0iCvySuWOfXyV0zeGTIioPf1lGZnvSNimw',
    'Clinic 3',
    '+20 102 345 6789',
    'dr.mahmoud@dentalcarepro.com',
    190,
    'Microscopic Endodontist and Specialist in Periodontal Regeneration and Gum Surgery.'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  specialty = EXCLUDED.specialty,
  avatar = EXCLUDED.avatar,
  assigned_clinic = EXCLUDED.assigned_clinic,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  consultation_fee = EXCLUDED.consultation_fee,
  bio = EXCLUDED.bio;

-- Insert Active Doctor Profile
INSERT INTO public.doctor_profile (id, name, specialty, avatar, assigned_clinic, phone, email, consultation_fee, bio)
VALUES (
  'doc-01',
  'Dr. Ahmed Al-Sayed',
  'Prosthodontics & Implantology',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCkPYVPmuNczQ83HKwL_IM-WpaH4bUz-B4CLXpvtp79R5FvsWyKWe0OpjU6lyER-9OF6BCbNqxN8oGap9BTbSXKTdVJ7yP47iURdE6PRcOjbVW5hrf3BRSUldQf9W_gvGiEpbWP9qoobc62Zw17tAu9ZcVtbqHVilIWmdbEBSj6Y4trzngyDmuVlgkD9S-ErJ0_tD-z6hVh_qdA1PEMMNj-na2z-nHIm91CuVijGPaiBKeXkl7KSv2gdA',
  'Clinic 1',
  '+20 100 123 4567',
  'dr.ahmed@dentalcarepro.com',
  200,
  'Senior Consultant in Prosthetic Dentistry and Implantology with over 15 years of clinical experience.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  specialty = EXCLUDED.specialty,
  avatar = EXCLUDED.avatar,
  assigned_clinic = EXCLUDED.assigned_clinic;

-- Insert Clinic Rooms
INSERT INTO public.clinics (id, name, doctor_name, doctor_avatar, doctor_specialty, status, current_patient)
VALUES
  (
    1,
    'Clinic 1',
    'Dr. Ahmed Al-Sayed',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCkPYVPmuNczQ83HKwL_IM-WpaH4bUz-B4CLXpvtp79R5FvsWyKWe0OpjU6lyER-9OF6BCbNqxN8oGap9BTbSXKTdVJ7yP47iURdE6PRcOjbVW5hrf3BRSUldQf9W_gvGiEpbWP9qoobc62Zw17tAu9ZcVtbqHVilIWmdbEBSj6Y4trzngyDmuVlgkD9S-ErJ0_tD-z6hVh_qdA1PEMMNj-na2z-nHIm91CuVijGPaiBKeXkl7KSv2gdA',
    'Prosthodontics & Implantology',
    'occupied',
    'Mohamed Ali'
  ),
  (
    2,
    'Clinic 2',
    'Dr. Mohamed Hassan',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDrsHu0YBZ-qIKWH1gYdoXrqf8KtvxUTiCjoAoxPhabvHytICRNAJq43h71DhxcDbI3AwBH2SPHreTkz4JQRCcDVg13eZz92P-dwus5UdxrrGaLjr4DQuUPknPHcRCiI1XbPhtRrBGxtG2YlQbKk8RN7jslot_4RXdlJw0V6QSBeFL9J1dQxn4x3Bwzv_kkjvdFZcjVhrf062FVJkc3bkYm281iF-NkCqWcsSBY4gk2ml9SriRuZQf81Q',
    'Orthodontics & Pediatric Dentistry',
    'occupied',
    'Alice Smith'
  ),
  (
    3,
    'Clinic 3',
    'Dr. Mahmoud Ibrahim',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCaF315g4eWMjDcYCZD4LlKxo-da9R6C3aZ9HOclUa8DZas075CI5hsDLUbU9Kswa0YNmW96-7OXa1Ke69Ocruzt_5IIRioT31mAP888DBwk0skdKtfkFjJp54E_yoBJGKgVeRrMVU79e2j6p8LPPs8hifI3exjEqcd0Ik48IEOpNi3l7NNs1WHTT1gulzdPzMAn7EuFrTjCX-hPh-dteTv0iCvySuWOfXyV0zeGTIioPf1lGZnvSNimw',
    'Periodontics & Endodontics',
    'occupied',
    'Emily Williams'
  ),
  (
    4,
    'Clinic 4',
    NULL,
    NULL,
    NULL,
    'available',
    NULL
  )
ON CONFLICT (id) DO UPDATE SET
  doctor_name = EXCLUDED.doctor_name,
  doctor_avatar = EXCLUDED.doctor_avatar,
  doctor_specialty = EXCLUDED.doctor_specialty,
  status = EXCLUDED.status,
  current_patient = EXCLUDED.current_patient;

-- Insert 3 Patients
INSERT INTO public.patients (
  id, name, initials, age, gender, phone, birth_date, avatar,
  last_visit, next_visit, next_visit_time, attending_doctor, attending_clinic,
  treatment_type, in_clinic, in_clinic_time, medical_notes, teeth, visits, images
)
VALUES
  -- 1. Patient: Mohamed Ali (Assigned to Dr. Ahmed Al-Sayed)
  (
    '849201',
    'Mohamed Ali',
    'MA',
    34,
    'Male',
    '+20 100 849 2010',
    '12 May 1992',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBjPiLDyWepU0CeZ8X8tIln_VVoHrQtBpyU8CiodPf3F7v4BwoQcpHQcQYAzQPGLjtRhljnPUN7UWpWts7Z9cw13fBY7FOdrq2AntU5wzQDzRpOLGsrVmX5g7cIZn-DxUOUuNPZ83xs-iLQObirdHXR0A0t5KUcZiOoTP4BNMOMdEutnr0mgJO-uOU3wJ98k7MRm-dTt8NHMhFnTDXibTruBygcqXVVBZHEzQlUS7eeDlfczpm5v0NK2g',
    '18 Aug 2026',
    '01 Sep 2026',
    '10:30 AM',
    'Dr. Ahmed Al-Sayed',
    'Clinic 1',
    'Filling',
    true,
    '10:15 AM',
    'Mild dental anxiety. Patient responded well to gentle local numbing. Composite filling applied to tooth 26.',
    '{"18":{"id":18,"status":"none","notes":"Normal eruption, healthy"},"26":{"id":26,"status":"filling","lastTreatmentDate":"18 Aug 2026","notes":"Composite filling applied to occlusal surface. Margin integrity good."},"36":{"id":36,"status":"crown","lastTreatmentDate":"15 Jan 2026","notes":"Zirconia crown placed on tooth 36, excellent fit."},"46":{"id":46,"status":"root-canal","lastTreatmentDate":"02 Jun 2026","notes":"Complete obturation, 3 canals sealed with gutta-percha."},"48":{"id":48,"status":"extraction","lastTreatmentDate":"12 May 2025","notes":"Impacted 3rd molar extracted uneventfully."}}'::jsonb,
    '[
      {"id":"v-201","date":"18 Aug 2026","doctorName":"Dr. Ahmed Al-Sayed","procedure":"Composite Restoration (Tooth #26)","notes":"Composite filling applied to occlusal surface. Margin integrity good.","status":"completed","clinicRoom":"Clinic 1","cost":180},
      {"id":"v-202","date":"02 Jun 2026","doctorName":"Dr. Ahmed Al-Sayed","procedure":"Routine checkup & cleaning","notes":"General scale and polish completed. Advised flossing frequency increase.","status":"completed","clinicRoom":"Clinic 1","cost":110},
      {"id":"v-203","date":"15 Jan 2026","doctorName":"Dr. Ahmed Al-Sayed","procedure":"Consultation & X-ray review","notes":"Full mouth evaluation, identified incipient lesion on upper molar.","status":"completed","clinicRoom":"Clinic 1","cost":95}
    ]'::jsonb,
    '[
      {"id":"img-panoramic","title":"Panoramic X-ray","date":"12 May 2026","url":"https://lh3.googleusercontent.com/aida-public/AB6AXuCNUJfRvywofbv1G0KsVnD1hWkBS1MArwp6OLKVjZqEJNF28ij4qxEEq9SZGP1DBObE8hVjZPcl7IAqgCw7_x6vB5JBNMrHuBDyckX0ZydrRFcTa9qYfI6OjiDXV3wkLjjaqH7pWOh9LvsTT1rfrhJlWiX0qP97DTBABJhoiMvH06Qel_qGXCgCRDIKylpdsdOfCMkV4cvSP7V_WnVlSS-lhlb4hve4K-iERWoRkPwktmYkGiKOfp_lsg","type":"xray","notes":"Full jaw panoramic showing normal bone density and root anatomy."}
    ]'::jsonb
  ),

  -- 2. Patient: Alice Smith (Assigned to Dr. Mohamed Hassan)
  (
    '102943',
    'Alice Smith',
    'AS',
    32,
    'Female',
    '+20 101 987 6543',
    '22 Feb 1994',
    NULL,
    '05 Sep 2025',
    '15 Nov 2026',
    '02:00 PM',
    'Dr. Mohamed Hassan',
    'Clinic 2',
    'Orthodontics',
    false,
    NULL,
    'Latex allergy reported. Advised to use nitrile gloves.',
    '{"14":{"id":14,"status":"filling","lastTreatmentDate":"05 Sep 2025","notes":"Tooth #14 filled with resin composite."},"26":{"id":26,"status":"none"},"36":{"id":36,"status":"none"}}'::jsonb,
    '[
      {"id":"v-102","date":"05 Sep 2025","doctorName":"Dr. Mohamed Hassan","procedure":"Premolar composite restoration","notes":"Tooth #14 filled with resin composite.","status":"completed","clinicRoom":"Clinic 2","cost":210},
      {"id":"v-103","date":"15 Nov 2026","doctorName":"Dr. Mohamed Hassan","procedure":"Orthodontic adjustment","notes":"Follow-up aligner review.","status":"scheduled","clinicRoom":"Clinic 2"}
    ]'::jsonb,
    '[
      {"id":"img-bitewing","title":"Bitewing X-ray","date":"05 Sep 2025","url":"https://lh3.googleusercontent.com/aida-public/AB6AXuCNUJfRvywofbv1G0KsVnD1hWkBS1MArwp6OLKVjZqEJNF28ij4qxEEq9SZGP1DBObE8hVjZPcl7IAqgCw7_x6vB5JBNMrHuBDyckX0ZydrRFcTa9qYfI6OjiDXV3wkLjjaqH7pWOh9LvsTT1rfrhJlWiX0qP97DTBABJhoiMvH06Qel_qGXCgCRDIKylpdsdOfCMkV4cvSP7V_WnVlSS-lhlb4hve4K-iERWoRkPwktmYkGiKOfp_lsg","type":"bitewing","notes":"Bitewing view showing interproximal bone level."}
    ]'::jsonb
  ),

  -- 3. Patient: Emily Williams (Assigned to Dr. Mahmoud Ibrahim)
  (
    '102964',
    'Emily Williams',
    'EW',
    24,
    'Female',
    '+20 102 222 3333',
    '19 Jun 2002',
    NULL,
    '25 Oct 2025',
    '02 Dec 2026',
    '11:00 AM',
    'Dr. Mahmoud Ibrahim',
    'Clinic 3',
    'Cleaning & Periodontics',
    false,
    NULL,
    'Wisdom teeth check recommended in 6 months. Good oral hygiene.',
    '{"18":{"id":18,"status":"none"},"48":{"id":48,"status":"none"}}'::jsonb,
    '[
      {"id":"v-105","date":"25 Oct 2025","doctorName":"Dr. Mahmoud Ibrahim","procedure":"Deep cleaning & periodontal assessment","notes":"Gingival health good, minor calculus lower anterior removed.","status":"completed","clinicRoom":"Clinic 3","cost":150},
      {"id":"v-106","date":"02 Dec 2026","doctorName":"Dr. Mahmoud Ibrahim","procedure":"Dental whitening consultation","notes":"Shade baseline recorded at A2.","status":"scheduled","clinicRoom":"Clinic 3"}
    ]'::jsonb,
    '[]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  initials = EXCLUDED.initials,
  age = EXCLUDED.age,
  gender = EXCLUDED.gender,
  phone = EXCLUDED.phone,
  birth_date = EXCLUDED.birth_date,
  last_visit = EXCLUDED.last_visit,
  next_visit = EXCLUDED.next_visit,
  next_visit_time = EXCLUDED.next_visit_time,
  attending_doctor = EXCLUDED.attending_doctor,
  attending_clinic = EXCLUDED.attending_clinic,
  treatment_type = EXCLUDED.treatment_type,
  in_clinic = EXCLUDED.in_clinic,
  medical_notes = EXCLUDED.medical_notes,
  teeth = EXCLUDED.teeth,
  visits = EXCLUDED.visits,
  images = EXCLUDED.images;
