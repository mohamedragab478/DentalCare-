import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: Patient) => void;
  initialPatient?: Patient | null;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
  initialPatient
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [age, setAge] = useState<string>('30');
  const [phone, setPhone] = useState('+1 (555) 019-2830');
  const [treatmentType, setTreatmentType] = useState('Cleaning');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [previewNumericId, setPreviewNumericId] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const isEditMode = Boolean(initialPatient);

  useEffect(() => {
    if (initialPatient) {
      setName(initialPatient.name || '');
      setGender(initialPatient.gender || 'Male');
      setAge(initialPatient.age?.toString() || '30');
      setPhone(initialPatient.phone || '');
      setTreatmentType(initialPatient.treatmentType || 'Cleaning');
      setMedicalNotes(initialPatient.medicalNotes || '');
      setPreviewNumericId(initialPatient.id);
      setCreatedCredentials(null);
    } else {
      setName('');
      setGender('Male');
      setAge('30');
      setPhone('+1 (555) ');
      setTreatmentType('Cleaning');
      setMedicalNotes('');
      setPreviewNumericId(Math.floor(100000 + Math.random() * 900000).toString());
      setCreatedCredentials(null);
      setIsCopied(false);
    }
  }, [initialPatient, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    if (isEditMode && initialPatient) {
      const updatedPatient: Patient = {
        ...initialPatient,
        name,
        initials: initials || initialPatient.initials,
        age: parseInt(age, 10) || initialPatient.age,
        gender,
        phone,
        treatmentType,
        medicalNotes
      };
      onAddPatient(updatedPatient);
      onClose();
    } else {
      const assignedId = previewNumericId || Math.floor(100000 + Math.random() * 900000).toString();

      const newPatient: Patient = {
        id: assignedId,
        name,
        initials: initials || 'PT',
        age: parseInt(age, 10) || 30,
        gender,
        phone,
        lastVisit: today,
        treatmentType,
        medicalNotes,
        teeth: {},
        visits: [],
        images: []
      };
      onAddPatient(newPatient);
      setCreatedCredentials({
        id: assignedId,
        name: newPatient.name,
        phone: newPatient.phone
      });
    }
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `DentalCare Patient Portal Credentials:\nPatient Name: ${createdCredentials.name}\nPatient Login ID: ${createdCredentials.id}\nRegistered Phone: ${createdCredentials.phone}`;
    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  if (createdCredentials) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        {/* Modal Box: ALWAYS WHITE as requested */}
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 text-center space-y-6 text-slate-900">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-3xl">how_to_reg</span>
          </div>

          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              <span>{isRTL ? "تم إنشاء الحساب المصرح بنجاح" : "Doctor Authorized Account Created"}</span>
            </span>
            <h2 className="font-headline font-bold text-2xl text-slate-900">
              {isRTL ? "حساب المريض جاهز!" : "Patient Account Ready!"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isRTL ? "تم تسجيل وتفعيل ملف المريض بنجاح. يمكنك مشاركة بيانات الدخول التالية مع المريض:" : "Patient profile successfully registered. Share these login credentials with the patient:"}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-start space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-xs text-slate-500">{t('patient_name')}</span>
              <span className="font-bold text-sm text-slate-900">{createdCredentials.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-xs text-slate-500">{isRTL ? "رقم ملف المريض للدخول" : "Patient Login ID"}</span>
              <span className="font-mono font-bold text-sm text-[#006194] bg-blue-50 px-2 py-0.5 rounded">
                #{createdCredentials.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">{t('phone')}</span>
              <span className="font-mono text-xs text-slate-800">{createdCredentials.phone}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopyCredentials}
              className="flex-1 py-3 px-4 rounded-xl border border-[#006194] text-[#006194] hover:bg-blue-50 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">{isCopied ? 'done' : 'content_copy'}</span>
              <span>{isCopied ? (isRTL ? "تم النسخ!" : "Copied!") : (isRTL ? "نسخ البيانات" : "Copy Details")}</span>
            </button>
            <button
              onClick={() => {
                setCreatedCredentials(null);
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#006194] hover:bg-[#004b73] text-white font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95"
            >
              {isRTL ? "تم وإغلاق" : "Done & Close"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      {/* Modal Box: ALWAYS WHITE as requested */}
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
          <div>
            <h2 className="font-headline font-bold text-xl text-slate-900">
              {isEditMode ? (isRTL ? "تعديل بيانات المريض" : "Edit Patient Profile") : t('new_patient')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? (isRTL ? "تحديث السجلات والمعلومات الأساسية للمريض" : "Update patient clinical profile and contact details")
                : (isRTL ? "تسجيل مريض جديد في قاعدة بيانات العيادة" : "Create new clinical record and generate access credentials")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('patient_name')} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isRTL ? "مثال: محمد أحمد" : "e.g. John Doe"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-[#006194]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('age')} *
              </label>
              <input
                type="number"
                required
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-[#006194]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('gender')} *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-[#006194]"
              >
                <option value="Male">{isRTL ? "ذكر" : "Male"}</option>
                <option value="Female">{isRTL ? "أنثى" : "Female"}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('phone')} *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={isRTL ? "01012345678" : "+1 (555) 019-2830"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#006194]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('visit_type')}
            </label>
            <select
              value={treatmentType}
              onChange={(e) => setTreatmentType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-[#006194]"
            >
              <option value="Cleaning">{t('cleaning')}</option>
              <option value="Filling">{t('filling')}</option>
              <option value="Root Canal">{t('root_canal_status')}</option>
              <option value="Crown & Bridge">{t('crown_bridge')}</option>
              <option value="Extraction">{t('extraction')}</option>
              <option value="General Care">{isRTL ? "كشف عام وفحص" : "General Care"}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('medical_notes')}
            </label>
            <textarea
              rows={2}
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              placeholder={isRTL ? "مثال: حساسية بنسلين، ضغط، سكري..." : "e.g. Penicillin allergy, hypertensive, dental anxiety..."}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-[#006194]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#006194] hover:bg-[#004b73] text-white text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isEditMode ? 'save' : 'person_add'}
              </span>
              <span>{isEditMode ? t('save') : (isRTL ? "تسجيل المريض" : "Register Patient")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
