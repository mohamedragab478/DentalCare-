import React, { useState } from 'react';
import { Patient, Prescription, PrescriptionItem, MealTiming, DoctorProfile } from '../types';
import {
  DEFAULT_MEDICINES,
  MEAL_TIMING_OPTIONS,
  FREQUENCY_OPTIONS,
  getStoredMedicines,
  saveCustomMedicine,
  MedicineOption
} from '../data/prescriptionMedicines';
import { useAppThemeLanguage } from '../context/ThemeLanguageContext';
import systemLogo from '../assets/logo.png';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  currentDoctor?: DoctorProfile;
  onSavePrescription: (prescription: Prescription) => void;
  initialPrescription?: Prescription | null;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentDoctor,
  onSavePrescription,
  initialPrescription
}) => {
  const { isRTL } = useAppThemeLanguage();

  // Medicines list (defaults + custom added)
  const [medicines, setMedicines] = useState<MedicineOption[]>(() => getStoredMedicines());
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // New item form state
  const [selectedMedId, setSelectedMedId] = useState<string>(DEFAULT_MEDICINES[0]?.id || '');
  const [frequency, setFrequency] = useState<string>('مرتين');
  const [mealTiming, setMealTiming] = useState<MealTiming>('after_meal');
  const [itemNotes, setItemNotes] = useState<string>('');

  const [doctorName, setDoctorName] = useState<string>(
    initialPrescription?.doctorName || currentDoctor?.name || 'د. أحمد السيد'
  );
  const [doctorSpecialty, setDoctorSpecialty] = useState<string>(
    initialPrescription?.doctorSpecialty || currentDoctor?.specialty || 'استشاري طب وجراحة وتجميل الفم والأسنان'
  );

  // Items in this prescription
  const [items, setItems] = useState<PrescriptionItem[]>(() => {
    if (initialPrescription?.items && initialPrescription.items.length > 0) {
      return initialPrescription.items;
    }
    // Default initial item
    return [
      {
        id: 'item-1',
        medicineName: 'Amoxicillin + Clavulanic acid mg – 1000',
        frequency: 'مرتين',
        timing: 'after_meal',
        notes: 'بعد الأكل مع كوب ماء كامل'
      },
      {
        id: 'item-2',
        medicineName: 'Ibuprofen mg – 400',
        frequency: '3 مرات',
        timing: 'after_meal_30m',
        notes: 'عند اللزوم لتسكين الألم والتورم'
      }
    ];
  });

  // Custom medicine dialog state
  const [isAddingNewMed, setIsAddingNewMed] = useState<boolean>(false);
  const [newMedName, setNewMedName] = useState<string>('');
  const [newMedCategoryLabel, setNewMedCategoryLabel] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Auto-fill defaults when selecting a medicine
  const handleSelectMedicine = (medId: string) => {
    setSelectedMedId(medId);
    const found = medicines.find(m => m.id === medId);
    if (found) {
      if (found.defaultFrequency) {
        if (found.defaultFrequency.includes('مرتين')) setFrequency('مرتين');
        else if (found.defaultFrequency.includes('3') || found.defaultFrequency.includes('٣')) setFrequency('3 مرات');
        else if (found.defaultFrequency.includes('مرة')) setFrequency('مرة');
        else setFrequency(found.defaultFrequency);
      }
      if (found.defaultTiming) setMealTiming(found.defaultTiming);
    }
  };

  // Add item to prescription
  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const found = medicines.find(m => m.id === selectedMedId);
    if (!found) return;

    const newItem: PrescriptionItem = {
      id: `rx-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      medicineName: found.name,
      frequency,
      timing: mealTiming,
      notes: itemNotes.trim() || undefined
    };

    setItems(prev => [...prev, newItem]);
    setItemNotes('');
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Handle saving new custom medicine
  const handleCreateCustomMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    const created = saveCustomMedicine({
      name: newMedName.trim(),
      categoryLabelAr: newMedCategoryLabel.trim() || 'دواء مخصص',
      categoryLabelEn: 'Custom Medication',
      defaultFrequency: frequency,
      defaultTiming: mealTiming
    });

    const updated = getStoredMedicines();
    setMedicines(updated);
    setSelectedMedId(created.id);
    setNewMedName('');
    setNewMedCategoryLabel('');
    setIsAddingNewMed(false);
  };

  // Save to patient
  const handleSave = () => {
    if (items.length === 0) {
      alert(isRTL ? 'يرجى إضافة دواء واحد على الأقل للروشتة' : 'Please add at least one medication to the prescription');
      return;
    }

    const prescription: Prescription = {
      id: initialPrescription?.id || `rx-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      doctorName,
      doctorSpecialty,
      clinicName: 'DentalCare Pro',
      date: initialPrescription?.date || new Date().toISOString().split('T')[0],
      items,
      createdAt: initialPrescription?.createdAt || new Date().toISOString()
    };

    onSavePrescription(prescription);
    onClose();
  };

  // Print prescription
  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.categoryLabelAr.includes(searchTerm)
  );

  const selectedMed = medicines.find(m => m.id === selectedMedId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      
      {/* Outer Modal Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <img
              src={systemLogo}
              alt="DentalCare Pro"
              className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <h2 className="text-base sm:text-lg font-headline font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isRTL ? "إصدار وطباعة روشتة طبية" : "Issue & Print Prescription"}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#006194]/10 text-[#006194] dark:text-[#00a3e0] border border-[#006194]/20">
                  ℞
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isRTL ? "المريض" : "Patient"}: <strong className="text-slate-800 dark:text-slate-200">{patient.name}</strong> ({patient.age} {isRTL ? "سنة" : "yrs"})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher tabs */}
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'editor'
                    ? 'bg-white dark:bg-slate-900 text-[#006194] dark:text-[#00a3e0] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span>{isRTL ? "محرر الأدوية" : "Builder"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-[#006194] dark:text-[#00a3e0] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>{isRTL ? "معاينة الورقة الرسمية" : "Print Preview"}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: Prescription Builder / Editor */}
          {activeTab === 'editor' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (Inputs & Controls) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Medicine Selection Card */}
                <div className="bg-slate-50 dark:bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#006194] dark:text-[#00a3e0]">medication</span>
                      <span>{isRTL ? "اختيار الدواء من القائمة" : "Select Medication"}</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsAddingNewMed(true)}
                      className="text-xs font-bold text-[#006194] dark:text-[#00a3e0] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_circle</span>
                      <span>{isRTL ? "إضافة دواء جديد للقائمة" : "Add New Medicine"}</span>
                    </button>
                  </div>

                  {/* Inline Add New Medicine Form (when toggled) */}
                  {isAddingNewMed && (
                    <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#006194] dark:text-[#00a3e0] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">medication_liquid</span>
                          <span>{isRTL ? "تسجيل دواء جديد وحفظه بالقائمة" : "Register Custom Medication"}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAddingNewMed(false)}
                          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {isRTL ? "إلغاء" : "Cancel"}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          placeholder={isRTL ? "اسم الدواء والتركيز (مثلاً: Ketoprofen mg – 150)" : "Medicine name & strength"}
                          value={newMedName}
                          onChange={(e) => setNewMedName(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder={isRTL ? "نوع الدواء أو تصنيفه (اختياري)" : "Category description (Optional)"}
                          value={newMedCategoryLabel}
                          onChange={(e) => setNewMedCategoryLabel(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateCustomMed}
                        disabled={!newMedName.trim()}
                        className="w-full py-2 bg-[#006194] hover:bg-[#004b73] disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        {isRTL ? "حفظ وإضافة الدواء مباشرة للقائمة" : "Save & Add to Catalog"}
                      </button>
                    </div>
                  )}

                  {/* Filter / Search input */}
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder={isRTL ? "ابحث بالاسم أو التركيز أو التصنيف..." : "Search medicine by name or category..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#006194]"
                    />
                  </div>

                  {/* Medicine Selector Dropdown */}
                  <div className="space-y-1">
                    <select
                      value={selectedMedId}
                      onChange={(e) => handleSelectMedicine(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-[#006194]"
                    >
                      {filteredMedicines.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.categoryLabelAr})
                        </option>
                      ))}
                    </select>

                    {selectedMed && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 px-1 pt-1">
                        {isRTL ? "التصنيف الإكلينيكي" : "Clinical Category"}: <strong className="text-slate-700 dark:text-slate-300">{selectedMed.categoryLabelAr}</strong>
                      </p>
                    )}
                  </div>

                  {/* Meal Timing (تحديد قبل أو بعد الأكل بدقة) */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-amber-600">restaurant</span>
                        <span>{isRTL ? "توقيت تناول الدواء بالنسبة للأكل" : "Timing with Meals"}</span>
                      </span>
                      <span className="text-[11px] text-[#006194] dark:text-[#00a3e0] font-semibold">
                        {isRTL ? "محدد إلزامي" : "Required"}
                      </span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {MEAL_TIMING_OPTIONS.map((option) => {
                        const isSelected = mealTiming === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setMealTiming(option.value)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold text-start border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-[#006194] text-white border-[#006194] shadow-xs'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span>{isRTL ? option.labelAr : option.labelEn}</span>
                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-white bg-white' : 'border-slate-400'
                            }`}>
                              {isSelected && <span className="w-2 h-2 rounded-full bg-[#006194]" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dosage Frequency (مرة، مرتين، 3 مرات) */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">schedule</span>
                        <span>{isRTL ? "التكرار اليومي" : "Daily Frequency"}</span>
                      </span>
                      <span className="text-[11px] text-[#006194] dark:text-[#00a3e0] font-bold">
                        {frequency}
                      </span>
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {(['مرة', 'مرتين', '3 مرات'] as const).map((opt) => {
                        const isSelected = frequency === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFrequency(opt)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#006194] text-white border-[#006194] shadow-xs'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            {isSelected && (
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            )}
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes for this medication */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-slate-500">info</span>
                      <span>{isRTL ? "ملاحظات إضافية للجرعة (اختياري)" : "Medication Notes (Optional)"}</span>
                    </label>
                    <input
                      type="text"
                      value={itemNotes}
                      onChange={(e) => setItemNotes(e.target.value)}
                      placeholder={isRTL ? "مثال: مع كوب ماء وفير، مضمضة دقيقة بدون بلع، إلخ" : "e.g. Drink with full glass of water, gargle 1 min"}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Add to Prescription Button */}
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full py-2.5 bg-[#006194] hover:bg-[#004b73] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    <span>{isRTL ? "إضافة الدواء إلى الروشتة الحالية" : "Add Medication to Prescription"}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Current Items List & Actions */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex-1 flex flex-col">
                  
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-headline font-bold text-slate-900 dark:text-white">
                        {isRTL ? "الأدوية المسجلة بالروشتة" : "Prescription Items"}
                      </span>
                      <span className="bg-[#006194] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {items.length}
                      </span>
                    </div>

                    {items.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setItems([])}
                        className="text-[11px] font-semibold text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        {isRTL ? "مسح الكل" : "Clear All"}
                      </button>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                      <span className="material-symbols-outlined text-4xl mb-2 text-slate-300 dark:text-slate-700">receipt_long</span>
                      <p className="text-xs font-medium">
                        {isRTL ? "لم تقم بإضافة أي دواء للروشتة بعد" : "No medications added yet"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {isRTL ? "اختر الدواء من القائمة وحدد توقيت الأكل ثم اضغط إضافة" : "Select medicine, set meal timing, and click add"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
                      {items.map((item, index) => {
                        const timingInfo = MEAL_TIMING_OPTIONS.find(o => o.value === item.timing);
                        return (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 relative group transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-[#006194] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  {index + 1}
                                </span>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                    {item.medicineName}
                                  </h4>
                                  
                                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px]">
                                    <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                                      {item.frequency}
                                    </span>
                                    
                                    {timingInfo && (
                                      <span className={`px-2 py-0.5 rounded-md font-bold border ${timingInfo.color}`}>
                                        {isRTL ? timingInfo.labelAr : timingInfo.labelEn}
                                      </span>
                                    )}
                                  </div>

                                  {item.notes && (
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                                      * {item.notes}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                title={isRTL ? "حذف" : "Remove"}
                                className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Doctor Info Footer in editor */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2 mt-auto">
                    <span>{isRTL ? "الطبيب المعالج" : "Doctor"}: <strong className="text-slate-800 dark:text-slate-200">{doctorName}</strong></span>
                    <span>{isRTL ? "التاريخ" : "Date"}: {new Date().toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</span>
                  </div>
                </div>

                {/* Action Buttons in Editor */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    <span>{isRTL ? "معاينة شكل الروشتة الرسمية" : "Preview Prescription"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={items.length === 0}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>{isRTL ? "حفظ في ملف المريض" : "Save to Profile"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Official Rx Print Preview Sheet */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              
              {/* Actions Bar above preview */}
              <div className="flex items-center justify-between gap-3 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl">
                <div className="flex items-center gap-2 text-xs text-[#006194] dark:text-[#00a3e0] font-semibold">
                  <span className="material-symbols-outlined text-[20px]">print</span>
                  <span>{isRTL ? "معاينة جاهزة للطباعة الورقية أو الحفظ بصيغة PDF" : "Print-ready layout for paper or PDF export"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2 bg-[#006194] hover:bg-[#004b73] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    <span>{isRTL ? "طباعة الروشتة الآن" : "Print Rx Now"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>{isRTL ? "حفظ وإغلاق" : "Save & Close"}</span>
                  </button>
                </div>
              </div>

              {/* REALISTIC MEDICAL PRESCRIPTION SHEET (PRINTABLE) */}
              <div className="flex justify-center p-2">
                <div 
                  id="printable-prescription"
                  className="w-full max-w-2xl bg-white text-slate-900 border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-md relative font-sans print:border-none print:shadow-none print:p-4 print:m-0"
                  style={{ minHeight: '650px' }}
                >
                  {/* Top Header of Rx */}
                  <div className="flex justify-between items-start border-b-2 border-[#006194] pb-4 mb-4">
                    {/* Clinic Branding */}
                    <div className="flex items-center gap-3">
                      <img
                        src={systemLogo}
                        alt="DentalCare"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                      />
                      <div>
                        <h1 className="font-headline font-extrabold text-lg text-[#006194]">
                          {isRTL ? "مركز دينتال كير برو للأسنان" : "DentalCare Pro Clinic"}
                        </h1>
                        <p className="text-[11px] text-slate-600 font-medium">
                          {isRTL ? "طب وجراحة وزراعة وتجميل الفم والأسنان" : "Specialized Dental & Oral Surgery Center"}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {isRTL ? "ترخيص طبي رقم: 4892 / معتمد" : "License No: 4892 • Certified"}
                        </p>
                      </div>
                    </div>

                    {/* Attending Doctor Information */}
                    <div className="text-end">
                      <h2 className="font-headline font-bold text-sm text-slate-900">
                        {doctorName}
                      </h2>
                      <p className="text-[11px] text-[#006194] font-medium">
                        {doctorSpecialty}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {isRTL ? "التاريخ" : "Date"}: {new Date().toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                      </p>
                    </div>
                  </div>

                  {/* Patient Info Strip */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6 flex flex-wrap justify-between items-center text-xs gap-y-2">
                    <div>
                      <span className="text-slate-500">{isRTL ? "اسم المريض" : "Patient"}: </span>
                      <strong className="text-slate-950 font-headline font-bold text-sm">{patient.name}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500">{isRTL ? "السن" : "Age"}: </span>
                      <strong className="text-slate-900">{patient.age} {isRTL ? "سنة" : "years"}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500">{isRTL ? "الجنس" : "Gender"}: </span>
                      <strong className="text-slate-900">{patient.gender === 'Female' ? (isRTL ? 'أنثى' : 'Female') : (isRTL ? 'ذكر' : 'Male')}</strong>
                    </div>
                  </div>

                  {/* Iconic Latin ℞ Symbol */}
                  <div className="mb-4">
                    <span className="text-4xl font-serif font-black text-[#006194] select-none">
                      ℞
                    </span>
                  </div>

                  {/* Prescribed Medications List */}
                  <div className="space-y-4 mb-8 min-h-[300px]">
                    {items.map((item, idx) => {
                      const timingInfo = MEAL_TIMING_OPTIONS.find(o => o.value === item.timing);
                      return (
                        <div
                          key={item.id}
                          className="border-b border-dashed border-slate-200 pb-3.5 last:border-b-0"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="font-bold text-sm text-[#006194] mt-0.5">
                              {idx + 1}.
                            </span>
                            <div className="flex-1">
                              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                <h3 className="font-bold text-sm text-slate-950 font-mono tracking-tight">
                                  {item.medicineName}
                                </h3>
                              </div>

                              {/* Dosage & Timing Instructions */}
                              <div className="flex items-center gap-2 flex-wrap mt-1 text-xs">
                                <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md">
                                  {item.frequency}
                                </span>

                                {timingInfo && (
                                  <span className="font-bold text-[#006194] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                                    {isRTL ? timingInfo.labelAr : timingInfo.labelEn}
                                  </span>
                                )}
                              </div>

                              {item.notes && (
                                <p className="text-[11px] text-slate-600 mt-1 italic">
                                  * {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Signatures & Stamp */}
                  <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-end mt-auto text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        DentalCare Pro E-Prescription System • ID: {initialPrescription?.id || `RX-${Date.now().toString().slice(-6)}`}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {isRTL ? "العنوان: برج الأطباء، الدور الرابع • تليفون: 01000000000" : "Doctors Plaza, 4th Floor • Tel: +20 100 000 0000"}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-32 h-14 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] text-slate-400 mb-1">
                        {isRTL ? "ختم العيادة" : "Clinic Stamp"}
                      </div>
                      <p className="font-bold text-slate-900 text-xs">
                        {doctorName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {isRTL ? "توقيع الطبيب" : "Signature"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            {isRTL ? "إغلاق" : "Close"}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>{isRTL ? "طباعة" : "Print"}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={items.length === 0}
              className="px-5 py-2 bg-[#006194] hover:bg-[#004b73] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>{isRTL ? "حفظ الروشتة في ملف المريض" : "Save to Patient Profile"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
