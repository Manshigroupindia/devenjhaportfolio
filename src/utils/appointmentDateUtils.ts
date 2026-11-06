/**
 * Deven Jha Portfolio - Appointment Date & Time Utilities
 * 
 * Strict India Standard Time (IST - Asia/Kolkata, UTC+05:30) calculations
 * to ensure that all booking operations, calendar rendering, and slot
 * cutoffs use local Indian calendar terms regardless of the visitor's device timezone.
 */

export const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Get current time in India Standard Time
 */
export function getISTNow(): Date {
  const now = new Date();
  const istDateString = now.toLocaleString('en-US', { timeZone: IST_TIMEZONE });
  return new Date(istDateString);
}

/**
 * Format a Date object into YYYY-MM-DD in IST
 */
export function formatToISTDateString(d: Date = getISTNow()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date in YYYY-MM-DD (IST)
 */
export function getISTTodayString(): string {
  return formatToISTDateString(getISTNow());
}

/**
 * Parse YYYY-MM-DD into numeric parts without UTC timezone shifting
 */
export function parseDateString(dateStr: string): { year: number; month: number; day: number } {
  const parts = dateStr.split('-');
  return {
    year: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    day: parseInt(parts[2], 10),
  };
}

/**
 * Check if a YYYY-MM-DD date is in the past in IST
 */
export function isPastDateIST(dateStr: string): boolean {
  const todayStr = getISTTodayString();
  return dateStr < todayStr;
}

/**
 * Check if a date is today in IST
 */
export function isTodayIST(dateStr: string): boolean {
  return dateStr === getISTTodayString();
}

/**
 * Check if an hourly slot on today's date has already passed in IST.
 * Slot starts at e.g. "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", etc.
 */
export function isPastSlotIST(dateStr: string, slotStartTime: string): boolean {
  if (isPastDateIST(dateStr)) return true;
  if (!isTodayIST(dateStr)) return false;

  const istNow = getISTNow();
  const currentHour = istNow.getHours(); // 0 - 23
  const currentMinute = istNow.getMinutes();

  // Parse slot start hour (e.g. "11:00 AM" -> 11, "1:00 PM" -> 13)
  const slotHour24 = parseSlotHourTo24(slotStartTime);

  // If slot start hour is in the past, or currently running past first 15 mins
  if (currentHour > slotHour24) return true;
  if (currentHour === slotHour24 && currentMinute >= 15) return true;

  return false;
}

/**
 * Helper to convert "11:00 AM", "1:00 PM", etc. to 24-hour integer
 */
export function parseSlotHourTo24(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 11;

  let hour = parseInt(match[1], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  return hour;
}

/**
 * Format YYYY-MM-DD into human-readable label, e.g. "Wednesday, 18 Nov 2026"
 */
export function formatHumanDate(dateStr: string): string {
  try {
    const { year, month, day } = parseDateString(dateStr);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format YYYY-MM-DD into short label, e.g. "18 Nov 2026"
 */
export function formatShortDate(dateStr: string): string {
  try {
    const { year, month, day } = parseDateString(dateStr);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Get days in month for a given year & month (1-based)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Get day of week for the 1st of month (0 = Sunday, 1 = Monday, ...)
 */
export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

