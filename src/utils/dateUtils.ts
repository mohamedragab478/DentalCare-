/**
 * Utility functions to calculate appointment date differences, countdowns, and date formatting
 */

export interface AppointmentCountdown {
  formattedDate: string;
  formattedTime: string;
  diffDays: number;
  status: 'today' | 'tomorrow' | 'upcoming' | 'yesterday' | 'past' | 'none';
  badgeArabic: string;
  badgeEnglish: string;
  descriptionArabic: string;
  descriptionEnglish: string;
  badgeColorClass: string;
  isPast: boolean;
  isToday: boolean;
}

// Month name lookup for parsing '01 Sep 2026', '12 May 2026', etc.
const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11
};

const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const ARABIC_MONTH_MAP: Record<string, number> = {
  'يناير': 0, 'فبراير': 1, 'مارس': 2, 'أبريل': 3, 'ابريل': 3, 'مايو': 4, 'يونيو': 5,
  'يوليو': 6, 'أغسطس': 7, 'اغسطس': 7, 'سبتمبر': 8, 'أكتوبر': 9, 'اكتوبر': 9, 'نوفمبر': 10, 'ديسمبر': 11
};

export function parseAppointmentDate(dateStr?: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Try standard Date parsing
  const standardParsed = new Date(trimmed);
  if (!isNaN(standardParsed.getTime())) {
    return standardParsed;
  }

  // Try Arabic month parsing e.g. "26 أغسطس 2026" or "26 أغسطس"
  for (const [arMonth, mIdx] of Object.entries(ARABIC_MONTH_MAP)) {
    if (trimmed.includes(arMonth)) {
      const numbers = trimmed.match(/\d+/g);
      if (numbers && numbers.length >= 1) {
        const day = parseInt(numbers[0], 10);
        const year = numbers.length >= 2 ? parseInt(numbers[1], 10) : new Date().getFullYear();
        if (!isNaN(day) && day >= 1 && day <= 31) {
          return new Date(year, mIdx, day);
        }
      }
    }
  }

  // Try "DD MMM YYYY" pattern e.g. "01 Sep 2026" or "28 Aug 2026"
  const parts = trimmed.split(/[\s-]+/);
  if (parts.length === 3) {
    // Check if parts[1] is month name
    const monthKey = parts[1].toLowerCase();
    if (MONTH_MAP[monthKey] !== undefined) {
      const day = parseInt(parts[0], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(year)) {
        return new Date(year, MONTH_MAP[monthKey], day);
      }
    }
    // Check if parts[0] is year: "2026-08-28"
    if (parts[0].length === 4) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
  }

  return null;
}

/**
 * Format a Date object into "DD MMM YYYY" (e.g. "28 Aug 2026")
 */
export function formatDateDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Format a Date object into ISO "YYYY-MM-DD"
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface WeekdayOption {
  dayIndex: number; // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  nameArabic: string;
  nameEnglish: string;
  shortArabic: string;
  shortEnglish: string;
  targetDate: Date;
  isoStr: string;
  displayStr: string;
  arabicDisplay: string;
  diffDays: number;
  isToday: boolean;
}

/**
 * Get weekday options calculated dynamically relative to today
 * e.g., if today is Sunday 21, Tuesday calculates to 23, Saturday to 27.
 */
export function getUpcomingWeekdays(weekOffset: number = 0): WeekdayOption[] {
  const now = new Date();
  const todayDayIndex = now.getDay(); // 0 = Sunday, 1 = Mon ... 6 = Sat

  // Middle-Eastern standard order: Sat -> Fri
  const weekdaysOrder = [
    { dayIndex: 6, nameArabic: 'السبت', nameEnglish: 'Saturday', shortArabic: 'سبت', shortEnglish: 'Sat' },
    { dayIndex: 0, nameArabic: 'الأحد', nameEnglish: 'Sunday', shortArabic: 'أحد', shortEnglish: 'Sun' },
    { dayIndex: 1, nameArabic: 'الإثنين', nameEnglish: 'Monday', shortArabic: 'إثنين', shortEnglish: 'Mon' },
    { dayIndex: 2, nameArabic: 'الثلاثاء', nameEnglish: 'Tuesday', shortArabic: 'ثلاثاء', shortEnglish: 'Tue' },
    { dayIndex: 3, nameArabic: 'الأربعاء', nameEnglish: 'Wednesday', shortArabic: 'أربعاء', shortEnglish: 'Wed' },
    { dayIndex: 4, nameArabic: 'الخميس', nameEnglish: 'Thursday', shortArabic: 'خميس', shortEnglish: 'Thu' },
    { dayIndex: 5, nameArabic: 'الجمعة', nameEnglish: 'Friday', shortArabic: 'جمعة', shortEnglish: 'Fri' },
  ];

  return weekdaysOrder.map((wd) => {
    let diffDays = (wd.dayIndex - todayDayIndex + 7) % 7;
    
    // If diffDays is 0 and weekOffset is 0, it is today.
    // If weekOffset > 0, we add weekOffset * 7
    diffDays += weekOffset * 7;

    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffDays);
    const isToday = diffDays === 0;

    return {
      dayIndex: wd.dayIndex,
      nameArabic: wd.nameArabic,
      nameEnglish: wd.nameEnglish,
      shortArabic: wd.shortArabic,
      shortEnglish: wd.shortEnglish,
      targetDate,
      isoStr: formatDateISO(targetDate),
      displayStr: formatDateDisplay(targetDate),
      arabicDisplay: `${targetDate.getDate()} ${ARABIC_MONTHS[targetDate.getMonth()]}`,
      diffDays,
      isToday
    };
  });
}

/**
 * Format date in Arabic string (e.g. 28 أغسطس 2026)
 */
export function formatDateArabic(dateStr?: string): string {
  const d = parseAppointmentDate(dateStr);
  if (!d) return dateStr || '';
  const day = d.getDate();
  const monthArabic = ARABIC_MONTHS[d.getMonth()] || '';
  const year = d.getFullYear();
  return `${day} ${monthArabic} ${year}`;
}

export function getAppointmentCountdown(dateStr?: string, timeStr?: string): AppointmentCountdown {
  const fallbackTime = timeStr || '10:30 AM';

  if (!dateStr) {
    return {
      formattedDate: 'No upcoming visit scheduled',
      formattedTime: fallbackTime,
      diffDays: 0,
      status: 'none',
      badgeArabic: 'لا يوجد موعد محدد',
      badgeEnglish: 'No Scheduled Date',
      descriptionArabic: 'لم يتم تحديد موعد زيارة قادمة بعد.',
      descriptionEnglish: 'No follow-up appointment is currently scheduled.',
      badgeColorClass: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      isPast: false,
      isToday: false
    };
  }

  const targetDate = parseAppointmentDate(dateStr);

  if (!targetDate) {
    return {
      formattedDate: dateStr,
      formattedTime: fallbackTime,
      diffDays: 0,
      status: 'upcoming',
      badgeArabic: 'موعد مؤكد',
      badgeEnglish: 'Confirmed Appointment',
      descriptionArabic: `موعدك المحدد: ${dateStr}`,
      descriptionEnglish: `Scheduled on ${dateStr}`,
      badgeColorClass: 'bg-blue-50 text-[#006194] border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
      isPast: false,
      isToday: false
    };
  }

  // Calculate calendar day difference using midnight of both dates
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();

  const diffMs = targetMidnight - todayMidnight;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const dateAr = formatDateArabic(dateStr);

  if (diffDays === 0) {
    return {
      formattedDate: dateStr,
      formattedTime: fallbackTime,
      diffDays: 0,
      status: 'today',
      badgeArabic: 'موعدك اليوم!',
      badgeEnglish: 'Today',
      descriptionArabic: `موعد الزيارة اليوم (${dateAr})! العيادة وفريق الأطباء في انتظارك.`,
      descriptionEnglish: 'Your appointment is scheduled for today.',
      badgeColorClass: 'bg-emerald-500 text-white border-emerald-400 animate-pulse',
      isPast: false,
      isToday: true
    };
  }

  if (diffDays === 1) {
    return {
      formattedDate: dateStr,
      formattedTime: fallbackTime,
      diffDays: 1,
      status: 'tomorrow',
      badgeArabic: 'غداً (فاضل يوم واحد)',
      badgeEnglish: 'Tomorrow (In 1 day)',
      descriptionArabic: `باقي يوم واحد على موعد زيارتك القادمة (${dateAr} في تمام ${fallbackTime}).`,
      descriptionEnglish: '1 day remaining until your dental appointment.',
      badgeColorClass: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700',
      isPast: false,
      isToday: false
    };
  }

  if (diffDays > 1) {
    return {
      formattedDate: dateStr,
      formattedTime: fallbackTime,
      diffDays: diffDays,
      status: 'upcoming',
      badgeArabic: `فاضل ${diffDays} أيام (متبقي ${diffDays} يوم)`,
      badgeEnglish: `In ${diffDays} days`,
      descriptionArabic: `باقي ${diffDays} أيام على موعد زيارتك القادمة (${dateAr} / ${dateStr} في تمام ${fallbackTime}).`,
      descriptionEnglish: `${diffDays} days remaining until your next visit on ${dateStr} at ${fallbackTime}.`,
      badgeColorClass: 'bg-blue-50 text-[#006194] border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
      isPast: false,
      isToday: false
    };
  }

  if (diffDays === -1) {
    return {
      formattedDate: dateStr,
      formattedTime: fallbackTime,
      diffDays: -1,
      status: 'yesterday',
      badgeArabic: 'أمس (فات عليها يوم واحد)',
      badgeEnglish: 'Passed 1 day ago',
      descriptionArabic: `فات موعد هذه الزيارة منذ يوم واحد (${dateAr}). يمكنك إعادة جدولتها الآن.`,
      descriptionEnglish: 'This appointment passed 1 day ago. You can easily reschedule.',
      badgeColorClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800',
      isPast: true,
      isToday: false
    };
  }

  // diffDays < -1 (Passed in past)
  const passedDays = Math.abs(diffDays);
  return {
    formattedDate: dateStr,
    formattedTime: fallbackTime,
    diffDays: diffDays,
    status: 'past',
    badgeArabic: `فات عليها ${passedDays} يوم (مضى ${passedDays} يوم)`,
    badgeEnglish: `Passed ${passedDays} days ago`,
    descriptionArabic: `فات موعد هذه الزيارة منذ ${passedDays} يوم (${dateAr} / ${dateStr}). يرجى حجز موعد متابعة جديد.`,
    descriptionEnglish: `This appointment was scheduled for ${passedDays} days ago (${dateStr}).`,
    badgeColorClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800',
    isPast: true,
    isToday: false
  };
}
