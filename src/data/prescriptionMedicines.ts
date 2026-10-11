import { MealTiming } from '../types';

export interface MedicineOption {
  id: string;
  name: string;
  category: 'analgesic' | 'antibiotic' | 'antiseptic' | 'topical' | 'custom';
  categoryLabelAr: string;
  categoryLabelEn: string;
  defaultFrequency?: string;
  defaultTiming?: MealTiming;
  defaultDuration?: string;
}

export const DEFAULT_MEDICINES: MedicineOption[] = [
  // Analgesics & Anti-inflammatories (مسكنات ومضادات الالتهاب)
  {
    id: 'paracetamol-1000',
    name: 'Paracetamol mg – 1000',
    category: 'analgesic',
    categoryLabelAr: 'مسكن وخافض حرارة',
    categoryLabelEn: 'Analgesic & Antipyretic',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal',
    defaultDuration: 'عند اللزوم'
  },
  {
    id: 'paracetamol-500',
    name: 'Paracetamol mg – 500',
    category: 'analgesic',
    categoryLabelAr: 'مسكن وخافض حرارة',
    categoryLabelEn: 'Analgesic & Antipyretic',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal',
    defaultDuration: 'عند اللزوم'
  },
  {
    id: 'ibuprofen-600',
    name: 'Ibuprofen mg – 600',
    category: 'analgesic',
    categoryLabelAr: 'مسكن ومضاد للالتهاب والتورم',
    categoryLabelEn: 'NSAID Analgesic',
    defaultFrequency: 'مرتين',
    defaultTiming: 'after_meal',
    defaultDuration: 'عند اللزوم'
  },
  {
    id: 'ibuprofen-400',
    name: 'Ibuprofen mg – 400',
    category: 'analgesic',
    categoryLabelAr: 'مسكن ومضاد للالتهاب والتورم',
    categoryLabelEn: 'NSAID Analgesic',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal',
    defaultDuration: 'عند اللزوم'
  },
  {
    id: 'ibuprofen-200',
    name: 'Ibuprofen mg – 200',
    category: 'analgesic',
    categoryLabelAr: 'مسكن ومضاد للالتهاب والتورم',
    categoryLabelEn: 'NSAID Analgesic',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal',
    defaultDuration: 'عند اللزوم'
  },
  {
    id: 'diclofenac-50',
    name: 'Diclofenac mg – 50',
    category: 'analgesic',
    categoryLabelAr: 'مسكن قوي لآلام الأسنان',
    categoryLabelEn: 'Potent NSAID',
    defaultFrequency: 'مرتين',
    defaultTiming: 'after_meal',
    defaultDuration: 'عند اللزوم'
  },
  {
    id: 'diclofenac-25',
    name: 'Diclofenac mg – 25',
    category: 'analgesic',
    categoryLabelAr: 'مسكن قوي لآلام الأسنان',
    categoryLabelEn: 'Potent NSAID',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal',
    defaultDuration: 'عند اللزوم'
  },
  {
    id: 'nimesulide-100',
    name: 'Nimesulide mg – 100',
    category: 'analgesic',
    categoryLabelAr: 'مسكن ومضاد التهاب حاد',
    categoryLabelEn: 'NSAID Analgesic',
    defaultFrequency: 'مرتين',
    defaultTiming: 'after_meal',
    defaultDuration: 'عند اللزوم'
  },

  // Antibiotics (مضادات حيوية)
  {
    id: 'amoxicillin-1000',
    name: 'Amoxicillin mg – 1000',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد حيوي واسع المجال',
    categoryLabelEn: 'Broad-Spectrum Antibiotic',
    defaultFrequency: 'مرتين',
    defaultTiming: 'after_meal'
  },
  {
    id: 'amoxicillin-875',
    name: 'Amoxicillin mg – 875',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد حيوي واسع المجال',
    categoryLabelEn: 'Broad-Spectrum Antibiotic',
    defaultFrequency: 'مرتين',
    defaultTiming: 'after_meal'
  },
  {
    id: 'amoxicillin-500',
    name: 'Amoxicillin mg – 500',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد حيوي واسع المجال',
    categoryLabelEn: 'Broad-Spectrum Antibiotic',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal'
  },
  {
    id: 'amoxicillin-250',
    name: 'Amoxicillin mg – 250',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد حيوي واسع المجال',
    categoryLabelEn: 'Broad-Spectrum Antibiotic',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal'
  },
  {
    id: 'amox-clav-1000',
    name: 'Amoxicillin + Clavulanic acid mg – 1000',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد حيوي ممتد الفعالية للعدوى السنية',
    categoryLabelEn: 'Potent Dental Antibiotic',
    defaultFrequency: 'مرتين',
    defaultTiming: 'after_meal'
  },
  {
    id: 'amox-clav-625',
    name: 'Amoxicillin + Clavulanic acid mg – 625',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد حيوي ممتد الفعالية للعدوى السنية',
    categoryLabelEn: 'Potent Dental Antibiotic',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal'
  },
  {
    id: 'metronidazole-500',
    name: 'Metronidazole mg – 500',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد للبكتيريا اللاهوائية وعدوى اللثة',
    categoryLabelEn: 'Anaerobic Antibacterial',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal_30m'
  },
  {
    id: 'metronidazole-400',
    name: 'Metronidazole mg – 400',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد للبكتيريا اللاهوائية وعدوى اللثة',
    categoryLabelEn: 'Anaerobic Antibacterial',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal_30m'
  },
  {
    id: 'azithromycin-500',
    name: 'Azithromycin mg – 500',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد حيوي سريع المفعول (لحساسية البنسلين)',
    categoryLabelEn: 'Macrolide Antibiotic',
    defaultFrequency: 'مرة',
    defaultTiming: 'before_meal_30m'
  },
  {
    id: 'azithromycin-250',
    name: 'Azithromycin mg – 250',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد حيوي سريع المفعول (لحساسية البنسلين)',
    categoryLabelEn: 'Macrolide Antibiotic',
    defaultFrequency: 'مرة',
    defaultTiming: 'before_meal_30m'
  },
  {
    id: 'clindamycin-300',
    name: 'Clindamycin mg – 300',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد حيوي لاختراق العظام وخراج الأسنان',
    categoryLabelEn: 'Bone Penetrating Antibiotic',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal_30m'
  },
  {
    id: 'clindamycin-150',
    name: 'Clindamycin mg – 150',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد حيوي لاختراق العظام وخراج الأسنان',
    categoryLabelEn: 'Bone Penetrating Antibiotic',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal_30m'
  },
  {
    id: 'doxycycline-100',
    name: 'Doxycycline mg – 100',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد لالتهابات دواعم السن والأنسجة',
    categoryLabelEn: 'Periodontal Antibiotic',
    defaultFrequency: 'مرة',
    defaultTiming: 'after_meal'
  },
  {
    id: 'cephalexin-500',
    name: 'Cephalexin mg – 500',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد حيوي لالتهابات الأنسجة الرخوة',
    categoryLabelEn: 'Cephalosporin Antibiotic',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal'
  },
  {
    id: 'cephalexin-250',
    name: 'Cephalexin mg – 250',
    category: 'antibiotic',
    categoryLabelAr: 'مضاد حيوي لالتهابات الأنسجة الرخوة',
    categoryLabelEn: 'Cephalosporin Antibiotic',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal'
  },

  // Antiseptic & Mouthwashes (مطهرات وغسول فم)
  {
    id: 'chlorhexidine-02',
    name: 'Chlorhexidine % – 0.2',
    category: 'antiseptic',
    categoryLabelAr: 'غسول فم ومطهر جراحي فائق الفعالية',
    categoryLabelEn: 'Antiseptic Mouthwash',
    defaultFrequency: 'مرتين',
    defaultTiming: 'after_meal_30m'
  },
  {
    id: 'chlorhexidine-012',
    name: 'Chlorhexidine % – 0.12',
    category: 'antiseptic',
    categoryLabelAr: 'غسول فم مطهر يومي للثة والأسنان',
    categoryLabelEn: 'Antiseptic Mouthwash',
    defaultFrequency: 'مرتين',
    defaultTiming: 'after_meal_30m'
  },
  {
    id: 'benzydamine-015',
    name: 'Benzydamine % – 0.15',
    category: 'antiseptic',
    categoryLabelAr: 'غسول ومسكن لالتهاب الحلق وقرح الفم',
    categoryLabelEn: 'Analgesic Oral Rinse',
    defaultFrequency: '3 مرات',
    defaultTiming: 'after_meal'
  },

  // Topicals, Local Anesthetics & Steroids (موضعي وتسكين)
  {
    id: 'lidocaine-2',
    name: 'Lidocaine % – 2',
    category: 'topical',
    categoryLabelAr: 'جل مخدر موضعي لآلام اللثة والغشاء المخاطي',
    categoryLabelEn: 'Topical Anesthetic Gel',
    defaultFrequency: 'مرتين',
    defaultTiming: 'before_meal_30m'
  },
  {
    id: 'triamcinolone-1',
    name: 'Triamcinolone acetonide mg – 1',
    category: 'topical',
    categoryLabelAr: 'معجون كورتيزون موضعي لقرح والتهابات الفم',
    categoryLabelEn: 'Oral Corticosteroid Paste',
    defaultFrequency: 'مرتين',
    defaultTiming: 'after_meal'
  }
];

export interface MealTimingOption {
  value: MealTiming;
  labelAr: string;
  labelEn: string;
  shortBadgeAr: string;
  shortBadgeEn: string;
  color: string;
}

export const MEAL_TIMING_OPTIONS: MealTimingOption[] = [
  {
    value: 'before_meal_30m',
    labelAr: 'قبل الأكل بنصف ساعة',
    labelEn: '30 min before meal',
    shortBadgeAr: 'قبل الأكل بـ 30 دقيقة',
    shortBadgeEn: '30m before meal',
    color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800'
  },
  {
    value: 'before_meal_immediately',
    labelAr: 'قبل الأكل مباشرة',
    labelEn: 'Immediately before meal',
    shortBadgeAr: 'قبل الأكل مباشرة',
    shortBadgeEn: 'Right before meal',
    color: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/70 dark:text-orange-200 dark:border-orange-800'
  },
  {
    value: 'after_meal',
    labelAr: 'بعد الأكل',
    labelEn: 'After meal',
    shortBadgeAr: 'بعد الأكل',
    shortBadgeEn: 'After meal',
    color: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-800'
  },
  {
    value: 'after_meal_30m',
    labelAr: 'بعد الأكل بنصف ساعة',
    labelEn: '30 min after meal',
    shortBadgeAr: 'بعد الأكل بـ 30 دقيقة',
    shortBadgeEn: '30m after meal',
    color: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/70 dark:text-teal-200 dark:border-teal-800'
  },
  {
    value: 'as_needed',
    labelAr: 'عند اللزوم',
    labelEn: 'As needed (PRN)',
    shortBadgeAr: 'عند اللزوم',
    shortBadgeEn: 'As needed',
    color: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
  }
];

export const FREQUENCY_OPTIONS = [
  { valueAr: 'مرة', valueEn: 'Once' },
  { valueAr: 'مرتين', valueEn: 'Twice' },
  { valueAr: '3 مرات', valueEn: '3 times' }
];

export const DURATION_OPTIONS = [
  { valueAr: '3 أيام', valueEn: '3 days' },
  { valueAr: '5 أيام', valueEn: '5 days' },
  { valueAr: '7 أيام (أسبوع)', valueEn: '7 days' },
  { valueAr: '10 أيام', valueEn: '10 days' },
  { valueAr: '14 يوم (أسبوعين)', valueEn: '14 days' },
  { valueAr: 'حتى انتهاء العبوة', valueEn: 'Until finished' },
  { valueAr: 'عند اللزوم فقط', valueEn: 'As needed only' }
];

const CUSTOM_MEDS_STORAGE_KEY = 'dentalcare_custom_medicines_v1';

export function getStoredMedicines(): MedicineOption[] {
  try {
    const stored = localStorage.getItem(CUSTOM_MEDS_STORAGE_KEY);
    if (!stored) return DEFAULT_MEDICINES;
    const customList: MedicineOption[] = JSON.parse(stored);
    return [...DEFAULT_MEDICINES, ...customList];
  } catch (err) {
    console.error('Error loading custom medicines:', err);
    return DEFAULT_MEDICINES;
  }
}

export function saveCustomMedicine(newMed: Omit<MedicineOption, 'id' | 'category'>): MedicineOption {
  try {
    const id = `custom-${Date.now()}`;
    const fullMed: MedicineOption = {
      ...newMed,
      id,
      category: 'custom',
      categoryLabelAr: 'دواء مضاف مخصص',
      categoryLabelEn: 'Custom Medicine'
    };

    const stored = localStorage.getItem(CUSTOM_MEDS_STORAGE_KEY);
    const existingList: MedicineOption[] = stored ? JSON.parse(stored) : [];
    existingList.push(fullMed);
    localStorage.setItem(CUSTOM_MEDS_STORAGE_KEY, JSON.stringify(existingList));

    return fullMed;
  } catch (err) {
    console.error('Error saving custom medicine:', err);
    return {
      ...newMed,
      id: `custom-${Date.now()}`,
      category: 'custom',
      categoryLabelAr: 'دواء مضاف مخصص',
      categoryLabelEn: 'Custom Medicine'
    };
  }
}
