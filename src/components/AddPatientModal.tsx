import React, { useState, useEffect, useMemo } from 'react';
import { Patient } from '../types';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: Patient) => void;
  initialPatient?: Patient | null;
  existingPatients?: Patient[];
  onSelectExistingPatient?: (patient: Patient, treatmentType?: string) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
  initialPatient,
  existingPatients = [],
  onSelectExistingPatient
}) => {
  const { t, isRTL } = useAppThemeLanguage();

  // Mode tab: 'existing' or 'new'
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');

  // Tab 1 State: Existing Patient selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExistingId, setSelectedExistingId] = useState<string>('');
  const [existingTreatmentType, setExistingTreatmentType] = useState('General Care');

  // Tab 2 / Edit Form State: New Patient
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

      if (existingPatients.length > 0) {
        setSelectedExistingId(existingPatients[0].id);
        setActiveTab('existing');
      } else {
        setActiveTab('new');
      }
    }
  }, [initialPatient, isOpen, existingPatients]);

  const filteredExistingPatients = useMemo(() => {
    if (!searchQuery.trim()) return existingPatients;
    const q = searchQuery.toLowerCase();
    return existingPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q)
    );
  }, [existingPatients, searchQuery]);

  const selectedExistingPatient = useMemo(
    () => existingPatients.find((p) => p.id === selectedExistingId) || filteredExistingPatients[0] || null,
    [existingPatients, selectedExistingId, filteredExistingPatients]
  );

  if (!isOpen) return null;

  const handleAddExistingToQueue = () => {
    if (!selectedExistingPatient) return;
    if (onSelectExistingPatient) {
      onSelectExistingPatient(selectedExistingPatient, existingTreatmentType);
    }
    onClose();
  };

  const handleSubmitNew = (e: React.FormEvent) => {
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
        inClinic: true,
        inClinicTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
              {isRTL ? "تم تسجيل وتفعيل ملف المريض وإضافته لطابور اليوم بنجاح. يمكنك مشاركة بيانات الدخول مع المريض:" : "Patient profile registered and added to today's queue. Share credentials with patient:"}
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
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="font-headline font-bold text-xl text-slate-900">
              {isEditMode 
                ? (isRTL ? "تعديل بيانات المريض" : "Edit Patient Profile") 
                : (isRTL ? "إضافة مريض لطابور اليوم" : "Add Patient to Queue")}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? (isRTL ? "تحديث السجلات والمعلومات الأساسية للمريض" : "Update patient clinical profile and contact details")
                : (isRTL ? "اختر مريضاً مسجلاً من الداتا بيز أو قم بتسجيل مريض جديد" : "Select an existing patient from database or register a new patient")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Selector (only when NOT in edit mode and existingPatients available) */}
        {!isEditMode && existingPatients.length > 0 && (
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-5 text-xs font-bold border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('existing')}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'existing'
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">folder_shared</span>
              <span>{isRTL ? "مريض مسجل بالعيادة (من الداتا بيز)" : "Select Existing Patient"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'new'
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">person_add</span>
              <span>{isRTL ? "تسجيل مريض جديد" : "Register New Patient"}</span>
            </button>
          </div>
        )}

        {/* TAB 1: Existing Patient Selection */}
        {!isEditMode && activeTab === 'existing' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {isRTL ? "البحث في مرضى العيادة" : "Search Patients Directory"}
              </label>
              <div className="relative mb-3">
                <span className={`material-symbols-outlined absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 text-[18px]`}>
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRTL ? "ابحث بالاسم، رقم الهاتف، أو معرف المريض (#ID)..." : "Search name, phone, or ID (#ID)..."}
                  className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-[#006194]`}
                />
              </div>

              {/* Patients List Box */}
              <div className="max-h-52 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-slate-50">
                {filteredExistingPatients.map((p) => {
                  const isSelected = selectedExistingId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedExistingId(p.id)}
                      className={`p-3 flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#006194]'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#006194] font-bold text-xs flex items-center justify-center shrink-0">
                          {p.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900">{p.name}</p>
                            {p.inClinic && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                {isRTL ? 'في العيادة' : 'In Clinic'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">{p.phone} • {isRTL ? `العمر ${p.age}` : `Age ${p.age}`}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                        #{p.id}
                      </span>
                    </div>
                  );
                })}

                {filteredExistingPatients.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    <span className="material-symbols-outlined text-2xl block mb-1">search_off</span>
                    <span>{isRTL ? "لم يتم العثور على مريض بهذا الاسم." : "No patients found matching query."}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Treatment / Visit Type Selector for the queue */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isRTL ? "سبب الحضور / نوع الكشف اليوم" : "Today's Visit / Treatment Type"}
              </label>
              <select
                value={existingTreatmentType}
                onChange={(e) => setExistingTreatmentType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-[#006194]"
              >
                <option value="General Care">{isRTL ? "كشف عام وفحص سريري" : "General Care & Consultation"}</option>
                <option value="Cleaning">{t('cleaning')}</option>
                <option value="Filling">{t('filling')}</option>
                <option value="Root Canal">{t('root_canal_status')}</option>
                <option value="Crown & Bridge">{t('crown_bridge')}</option>
                <option value="Extraction">{t('extraction')}</option>
              </select>
            </div>

            {/* Selected Patient Banner */}
            {selectedExistingPatient && (
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <span className="text-slate-700">
                  {isRTL ? "المريض المحدد:" : "Selected:"} <strong className="text-[#006194]">{selectedExistingPatient.name}</strong>
                </span>
                <span className="font-mono text-slate-500">#{selectedExistingPatient.id}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                disabled={!selectedExistingPatient}
                onClick={handleAddExistingToQueue}
                className="px-6 py-2.5 rounded-xl bg-[#006194] hover:bg-[#004b73] disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                <span>{isRTL ? "إضافة إلى طابور كشوفات اليوم" : "Add to Today's Queue"}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2 or EDIT MODE: New Patient Form */}
        {(isEditMode || activeTab === 'new') && (
          <form onSubmit={handleSubmitNew} className="space-y-4">
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
                <span>{isEditMode ? t('save') : (isRTL ? "تسجيل المريض وإضافته" : "Register & Add Patient")}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
