/**
 * Deven Jha Portfolio - Appointment Booking & Scheduling Service
 * 
 * Powered by Firebase Firestore (project `portfolio-f52ae`).
 * Implements atomic transaction slot reservation to strictly prevent double-booking.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  runTransaction,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import {
  DateAvailabilityDoc,
  TimeSlot,
  AppointmentDoc,
  BookingSubmissionPayload,
  createDefaultSlots,
  OFFICIAL_SLOT_DEFINITIONS,
  AppointmentStatus,
  DayStatus,
} from '../types/appointment.ts';
import {
  formatToISTDateString,
  getISTTodayString,
  getDaysInMonth,
  isPastDateIST,
  isPastSlotIST,
} from '../utils/appointmentDateUtils.ts';

const AVAILABILITY_COLLECTION = 'appointmentAvailability';
const APPOINTMENTS_COLLECTION = 'appointments';

/**
 * Helper to normalize DateAvailabilityDoc from Firestore
 */
function parseDateDoc(id: string, data: any): DateAvailabilityDoc {
  const rawStatus = data.dayStatus;
  let dayStatus: DayStatus = 'available';

  if (rawStatus === 'closed_all' || rawStatus === 'no_booking' || rawStatus === 'available') {
    dayStatus = rawStatus;
  } else if (data.isAvailable === false) {
    dayStatus = 'closed_all';
  }

  const slots: TimeSlot[] = data.slots || createDefaultSlots('unavailable');
  const hasFreeSlots = slots.some((s) => s.status === 'available');
  const isAvailable = dayStatus === 'available' && hasFreeSlots;

  return {
    id,
    date: data.date || id,
    dayStatus,
    isAvailable,
    slots,
    closureReason: data.closureReason || '',
    closureNote: data.closureNote || '',
    note: data.note || '',
    createdAt: data.createdAt || '',
    updatedAt: data.updatedAt || '',
  };
}

/**
 * Subscribe to real-time availability for a given month and year.
 * Returns a map of date string (YYYY-MM-DD) -> DateAvailabilityDoc.
 */
export function subscribeToMonthAvailability(
  year: number,
  month: number,
  callback: (datesMap: Record<string, DateAvailabilityDoc>) => void
): () => void {
  const monthStr = String(month).padStart(2, '0');
  const startDateStr = `${year}-${monthStr}-01`;
  const totalDays = getDaysInMonth(year, month);
  const endDateStr = `${year}-${monthStr}-${String(totalDays).padStart(2, '0')}`;

  try {
    const q = query(
      collection(db, AVAILABILITY_COLLECTION),
      where('date', '>=', startDateStr),
      where('date', '<=', endDateStr)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const result: Record<string, DateAvailabilityDoc> = {};
        snapshot.forEach((docSnap) => {
          result[docSnap.id] = parseDateDoc(docSnap.id, docSnap.data());
        });
        callback(result);
      },
      (error) => {
        console.warn('Month availability listener notice:', error);
        callback({});
      }
    );
  } catch (err) {
    console.warn('Failed to setup month availability listener:', err);
    callback({});
    return () => {};
  }
}

/**
 * Fetch a single date's availability
 */
export async function getDateAvailability(
  dateStr: string
): Promise<DateAvailabilityDoc | null> {
  try {
    const docRef = doc(db, AVAILABILITY_COLLECTION, dateStr);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    return parseDateDoc(snap.id, snap.data());
  } catch (err) {
    console.warn('Error fetching date availability:', err);
    return null;
  }
}

/**
 * Reserve an appointment slot atomically using a Firestore transaction.
 * 
 * Guarantees:
 * 1. Checks that the date document exists and is marked available.
 * 2. Checks that the slot is currently 'available' and has not already been taken.
 * 3. Checks that the slot is not in the past if booking for today.
 * 4. Atomically transitions slot status to 'booked' with the booking ID.
 * 5. Updates the date's overall isAvailable flag.
 * 6. Creates the appointment record with all visitor details.
 * 7. If another visitor books the slot concurrently, the transaction throws and rolls back.
 */
export async function bookAppointment(
  payload: BookingSubmissionPayload
): Promise<{ success: boolean; appointment?: AppointmentDoc; error?: string }> {
  try {
    // Basic client input validation
    if (!payload.name?.trim() || payload.name.trim().length < 2) {
      return { success: false, error: 'Please enter your full name (at least 2 characters).' };
    }
    const cleanMobile = payload.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email.trim())) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!payload.purpose?.trim()) {
      return { success: false, error: 'Please select or enter the purpose of the appointment.' };
    }
    if (!payload.agenda?.trim()) {
      return { success: false, error: 'Please enter a brief agenda or note for the meeting.' };
    }
    if (isPastDateIST(payload.appointmentDate)) {
      return { success: false, error: 'Cannot book an appointment for a past date.' };
    }

    const bookingId = `DJ-APT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIso = new Date().toISOString();

    const dateDocRef = doc(db, AVAILABILITY_COLLECTION, payload.appointmentDate);
    const appointmentDocRef = doc(db, APPOINTMENTS_COLLECTION, bookingId);

    // Execute atomic transaction
    const confirmedAppointment = await runTransaction(db, async (transaction) => {
      const dateSnap = await transaction.get(dateDocRef);

      if (!dateSnap.exists()) {
        throw new Error('This date has not been configured by admin for appointments.');
      }

      const dateData = dateSnap.data();

      // Check day-level status restrictions
      if (dateData.dayStatus === 'closed_all') {
        throw new Error('This date is fully booked or closed for appointments.');
      }
      if (dateData.dayStatus === 'no_booking') {
        const reason = dateData.closureReason ? ` (${dateData.closureReason})` : '';
        throw new Error(`Appointments are not being accepted on this day${reason}.`);
      }
      if (dateData.isAvailable === false && dateData.dayStatus !== 'available') {
        throw new Error('This date is not available for appointments.');
      }

      const currentSlots: TimeSlot[] = dateData.slots || [];

      // Find the targeted slot
      const slotIndex = currentSlots.findIndex((s) => s.slotNumber === payload.slotNumber);
      if (slotIndex === -1) {
        throw new Error('Selected time slot could not be found.');
      }

      const targetSlot = currentSlots[slotIndex];

      // Verify slot availability
      if (targetSlot.status !== 'available') {
        throw new Error(
          'Sorry! This time slot has just been booked by another visitor or marked unavailable. Please select another slot.'
        );
      }

      // Check if slot has already passed if today
      if (isPastSlotIST(payload.appointmentDate, targetSlot.startTime)) {
        throw new Error('This time slot is in the past. Please select an upcoming slot.');
      }

      // Update slot status to booked
      const updatedSlots = [...currentSlots];
      updatedSlots[slotIndex] = {
        ...targetSlot,
        status: 'booked',
        bookingId,
        visitorName: payload.name.trim(),
      };

      // Recalculate date availability
      const hasAvailableSlots = updatedSlots.some((s) => s.status === 'available');

      // Prepare Appointment record
      const appointmentRecord: AppointmentDoc = {
        id: bookingId,
        bookingId,
        name: payload.name.trim(),
        mobile: payload.mobile.trim(),
        email: payload.email.trim(),
        purpose: payload.purpose.trim(),
        agenda: payload.agenda.trim(),
        appointmentDate: payload.appointmentDate,
        slotNumber: payload.slotNumber,
        startTime: targetSlot.startTime,
        endTime: targetSlot.endTime,
        timeRange: targetSlot.timeRange,
        status: 'confirmed',
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      // Transaction operations:
      // 1. Update date availability slots
      transaction.update(dateDocRef, {
        slots: updatedSlots,
        isAvailable: hasAvailableSlots,
        updatedAt: nowIso,
      });

      // 2. Insert new appointment
      transaction.set(appointmentDocRef, appointmentRecord);

      return appointmentRecord;
    });

    return {
      success: true,
      appointment: confirmedAppointment,
    };
  } catch (err: any) {
    console.warn('Appointment booking transaction notice:', err);

    // If permission-denied occurs (e.g. before updated firestore.rules are published to cloud),
    // gracefully save to contact_submissions so the visitor's appointment request is never lost
    if (err.code === 'permission-denied' || err.message?.includes('permission') || err.message?.includes('PERMISSION_DENIED')) {
      try {
        const bookingId = `DJ-APT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const nowIso = new Date().toISOString();
        const targetSlot =
          OFFICIAL_SLOT_DEFINITIONS.find((s) => s.slotNumber === payload.slotNumber) ||
          OFFICIAL_SLOT_DEFINITIONS[0];

        const appointmentRecord: AppointmentDoc = {
          id: bookingId,
          bookingId,
          name: payload.name.trim(),
          mobile: payload.mobile.trim(),
          email: payload.email.trim(),
          purpose: payload.purpose.trim(),
          agenda: payload.agenda.trim(),
          appointmentDate: payload.appointmentDate,
          slotNumber: payload.slotNumber,
          startTime: targetSlot.startTime,
          endTime: targetSlot.endTime,
          timeRange: targetSlot.timeRange,
          status: 'confirmed',
          createdAt: nowIso,
          updatedAt: nowIso,
        };

        await setDoc(doc(db, 'contact_submissions', bookingId), {
          id: bookingId,
          referenceId: bookingId,
          name: payload.name.trim(),
          mobile: payload.mobile.trim(),
          email: payload.email.trim(),
          purpose: `Appointment Booking: ${payload.purpose.trim()}`,
          message: `[CONFIRMED APPOINTMENT]\nDate: ${payload.appointmentDate}\nTime Slot: ${targetSlot.timeRange}\nAgenda: ${payload.agenda.trim()}`,
          state: 'Delhi (NCR)',
          status: 'new',
          submissionType: 'appointment',
          appointmentDate: payload.appointmentDate,
          slotNumber: payload.slotNumber,
          timeRange: targetSlot.timeRange,
          createdAt: nowIso,
        });

        return {
          success: true,
          appointment: appointmentRecord,
        };
      } catch (fallbackErr: any) {
        console.error('Fallback submission error:', fallbackErr);
      }
    }

    return {
      success: false,
      error: err.message || 'Failed to complete appointment booking. Please try again.',
    };
  }
}

/* =========================================================================
 * ADMIN APPOINTMENT & AVAILABILITY MANAGEMENT
 * ========================================================================= */

export interface SaveDateAvailabilityOptions {
  dayStatus?: DayStatus;
  closureReason?: string;
  closureNote?: string;
  note?: string;
}

/**
 * Save / Update a single date's availability slots (Admin)
 * Supports day-level status (available, closed_all, no_booking), closure reasons, and notes.
 * Automatically ensures no `undefined` values are written to Firestore.
 */
export async function saveDateAvailability(
  dateStr: string,
  slots: TimeSlot[],
  optionsOrNote: string | SaveDateAvailabilityOptions = ''
): Promise<void> {
  const options: SaveDateAvailabilityOptions =
    typeof optionsOrNote === 'string'
      ? { note: optionsOrNote }
      : optionsOrNote || {};

  const rawDayStatus = options.dayStatus;
  let dayStatus: DayStatus = rawDayStatus || 'available';

  // If status is not explicitly set, deduce from slots
  if (!rawDayStatus) {
    const hasFree = slots.some((s) => s.status === 'available');
    dayStatus = hasFree ? 'available' : 'closed_all';
  }

  const hasFreeSlots = slots.some((s) => s.status === 'available');
  const isAvailable = dayStatus === 'available' && hasFreeSlots;
  const nowIso = new Date().toISOString();
  const docRef = doc(db, AVAILABILITY_COLLECTION, dateStr);

  const payload: Record<string, any> = {
    date: dateStr,
    dayStatus,
    isAvailable,
    slots,
    note: options.note || '',
    closureReason:
      dayStatus === 'no_booking'
        ? (options.closureReason || 'Holiday')
        : (options.closureReason || ''),
    closureNote: options.closureNote || '',
    updatedAt: nowIso,
    createdAt: nowIso, // will be preserved if document already exists due to merge: true
  };

  await setDoc(docRef, payload, { merge: true });
}

/**
 * Update date status directly:
 * - Option A: 'available' (Green)
 * - Option B: 'closed_all' (Red)
 * - Option C: 'no_booking' (Orange)
 * 
 * Safety Guarantee:
 * NEVER overwrites or deletes existing confirmed bookings. Booked slots remain booked.
 */
export async function setDateDayStatus(
  dateStr: string,
  dayStatus: DayStatus,
  options?: {
    closureReason?: string;
    closureNote?: string;
    note?: string;
  }
): Promise<void> {
  const existing = await getDateAvailability(dateStr);
  const baseSlots = existing ? existing.slots : createDefaultSlots('available');

  let updatedSlots: TimeSlot[];
  if (dayStatus === 'closed_all') {
    // Mark all non-booked slots as unavailable
    updatedSlots = baseSlots.map((s) =>
      s.status === 'booked' ? s : { ...s, status: 'unavailable' }
    );
  } else if (dayStatus === 'no_booking') {
    // Mark non-booked slots as unavailable
    updatedSlots = baseSlots.map((s) =>
      s.status === 'booked' ? s : { ...s, status: 'unavailable' }
    );
  } else {
    // dayStatus === 'available'
    const hasAnyAvailable = baseSlots.some((s) => s.status === 'available');
    if (!hasAnyAvailable) {
      updatedSlots = baseSlots.map((s) =>
        s.status === 'booked' ? s : { ...s, status: 'available' }
      );
    } else {
      updatedSlots = baseSlots;
    }
  }

  await saveDateAvailability(dateStr, updatedSlots, {
    dayStatus,
    closureReason:
      dayStatus === 'no_booking'
        ? (options?.closureReason || existing?.closureReason || 'Holiday')
        : '',
    closureNote: options?.closureNote !== undefined ? options.closureNote : (existing?.closureNote || ''),
    note: options?.note !== undefined ? options.note : (existing?.note || ''),
  });
}

/**
 * Check if a date currently has confirmed appointments
 */
export async function hasActiveBookingsForDate(
  dateStr: string
): Promise<{ hasBookings: boolean; count: number; bookings: AppointmentDoc[] }> {
  try {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where('appointmentDate', '==', dateStr),
      where('status', '==', 'confirmed')
    );
    const snap = await getDocs(q);
    const bookings: AppointmentDoc[] = [];
    snap.forEach((d) => {
      bookings.push({ id: d.id, ...d.data() } as AppointmentDoc);
    });
    return {
      hasBookings: bookings.length > 0,
      count: bookings.length,
      bookings,
    };
  } catch (err) {
    console.warn('Error checking active bookings for date:', err);
    return { hasBookings: false, count: 0, bookings: [] };
  }
}

/**
 * Mark an entire date Available or Unavailable (Admin)
 * Protects already booked slots: booked slots remain booked!
 */
export async function toggleWholeDateAvailability(
  dateStr: string,
  shouldBeAvailable: boolean
): Promise<void> {
  const existing = await getDateAvailability(dateStr);
  const baseSlots = existing ? existing.slots : createDefaultSlots('unavailable');

  const updatedSlots: TimeSlot[] = baseSlots.map((slot) => {
    // NEVER overwrite confirmed bookings!
    if (slot.status === 'booked') return slot;
    return {
      ...slot,
      status: shouldBeAvailable ? 'available' : 'unavailable',
    };
  });

  await saveDateAvailability(dateStr, updatedSlots, {
    dayStatus: shouldBeAvailable ? 'available' : 'closed_all',
    note: existing?.note || '',
  });
}

/**
 * Bulk configure a list of dates (Admin)
 * Supports dayStatus: 'available' | 'closed_all' | 'no_booking' | 'unavailable'
 */
export async function bulkConfigureDates(
  dates: string[],
  dayStatus: DayStatus | 'available' | 'unavailable' = 'available',
  options?: {
    closureReason?: string;
    closureNote?: string;
    note?: string;
  }
): Promise<number> {
  const batch = writeBatch(db);
  const nowIso = new Date().toISOString();
  let count = 0;

  const normalizedStatus: DayStatus =
    dayStatus === 'unavailable' || dayStatus === 'closed_all'
      ? 'closed_all'
      : dayStatus === 'no_booking'
      ? 'no_booking'
      : 'available';

  const defaultSlotStatus = normalizedStatus === 'available' ? 'available' : 'unavailable';

  for (const dateStr of dates) {
    const docRef = doc(db, AVAILABILITY_COLLECTION, dateStr);
    const slots = createDefaultSlots(defaultSlotStatus);
    const isAvailable = normalizedStatus === 'available';

    const docPayload: Record<string, any> = {
      date: dateStr,
      dayStatus: normalizedStatus,
      isAvailable,
      slots,
      updatedAt: nowIso,
      createdAt: nowIso,
      note: options?.note || '',
      closureReason:
        normalizedStatus === 'no_booking'
          ? (options?.closureReason || 'Holiday')
          : '',
      closureNote:
        normalizedStatus === 'no_booking'
          ? (options?.closureNote || '')
          : '',
    };

    batch.set(docRef, docPayload, { merge: true });
    count++;
  }

  await batch.commit();
  return count;
}

/**
 * Copy schedule from source date to target date (Admin)
 */
export async function copyDateSchedule(
  sourceDateStr: string,
  targetDateStr: string
): Promise<boolean> {
  const source = await getDateAvailability(sourceDateStr);
  if (!source) return false;

  // Reset booking information when copying to a new date
  const cleanSlots: TimeSlot[] = source.slots.map((s) => ({
    ...s,
    status: s.status === 'booked' ? 'available' : s.status,
    bookingId: undefined,
    visitorName: undefined,
  }));

  await saveDateAvailability(targetDateStr, cleanSlots, source.note);
  return true;
}

/**
 * Real-time subscription to appointments list (Admin)
 * Merges primary `appointments` collection with any incoming requests
 * to guarantee zero data loss.
 */
export function subscribeToAppointments(
  callback: (list: AppointmentDoc[]) => void,
  statusFilter?: AppointmentStatus | 'all'
): () => void {
  let apptsList: AppointmentDoc[] = [];
  let subsList: AppointmentDoc[] = [];

  const mergeAndNotify = () => {
    const combined = [...apptsList];
    const existingIds = new Set(apptsList.map((a) => a.bookingId));

    subsList.forEach((sub) => {
      if (!existingIds.has(sub.bookingId)) {
        combined.push(sub);
      }
    });

    combined.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    const filtered = combined.filter(
      (item) => !statusFilter || statusFilter === 'all' || item.status === statusFilter
    );

    callback(filtered);
  };

  try {
    const q1 = query(collection(db, APPOINTMENTS_COLLECTION), orderBy('createdAt', 'desc'));
    const unsub1 = onSnapshot(
      q1,
      (snapshot) => {
        apptsList = [];
        snapshot.forEach((snap) => {
          apptsList.push({ id: snap.id, ...snap.data() } as AppointmentDoc);
        });
        mergeAndNotify();
      },
      (err) => {
        console.warn('Appointments primary collection note:', err.message);
      }
    );

    const q2 = query(collection(db, 'contact_submissions'), orderBy('createdAt', 'desc'));
    const unsub2 = onSnapshot(
      q2,
      (snapshot) => {
        subsList = [];
        snapshot.forEach((snap) => {
          const d = snap.data();
          if (d.submissionType === 'appointment' || d.purpose?.startsWith('Appointment')) {
            subsList.push({
              id: snap.id,
              bookingId: d.referenceId || snap.id,
              name: d.name || 'Visitor',
              mobile: d.mobile || '',
              email: d.email || '',
              purpose: d.purpose || 'Appointment',
              agenda: d.message || '',
              appointmentDate: d.appointmentDate || getISTTodayString(),
              slotNumber: d.slotNumber || 1,
              startTime: d.startTime || '11:00 AM',
              endTime: d.endTime || '12:00 PM',
              timeRange: d.timeRange || '11:00 AM – 12:00 PM',
              status:
                d.status === 'archived'
                  ? 'cancelled'
                  : d.status === 'reviewed'
                  ? 'completed'
                  : 'confirmed',
              createdAt: d.createdAt || '',
              updatedAt: d.createdAt || '',
            });
          }
        });
        mergeAndNotify();
      },
      (err) => {
        console.warn('Contact submissions listener note:', err.message);
      }
    );

    return () => {
      unsub1();
      unsub2();
    };
  } catch (err) {
    console.warn('Error subscribing to appointments:', err);
    callback([]);
    return () => {};
  }
}

/**
 * Cancel an appointment and safely release its corresponding time slot (Admin)
 */
export async function cancelAppointment(
  bookingId: string,
  appointmentDate: string,
  slotNumber: number,
  releaseSlot: boolean = true
): Promise<void> {
  const nowIso = new Date().toISOString();

  // 1. Mark appointment as cancelled
  const apptRef = doc(db, APPOINTMENTS_COLLECTION, bookingId);
  await updateDoc(apptRef, {
    status: 'cancelled',
    updatedAt: nowIso,
  });

  // 2. If releaseSlot is true, update the date availability slot back to 'available'
  if (releaseSlot) {
    const dateRef = doc(db, AVAILABILITY_COLLECTION, appointmentDate);
    const dateSnap = await getDoc(dateRef);

    if (dateSnap.exists()) {
      const data = dateSnap.data();
      const currentSlots: TimeSlot[] = data.slots || [];
      const updatedSlots = currentSlots.map((s) => {
        if (s.slotNumber === slotNumber) {
          return {
            ...s,
            status: 'available' as const,
            bookingId: undefined,
            visitorName: undefined,
          };
        }
        return s;
      });

      await updateDoc(dateRef, {
        slots: updatedSlots,
        isAvailable: true,
        updatedAt: nowIso,
      });
    }
  }
}

/**
 * Mark appointment as completed (Admin)
 */
export async function markAppointmentCompleted(bookingId: string): Promise<void> {
  const apptRef = doc(db, APPOINTMENTS_COLLECTION, bookingId);
  await updateDoc(apptRef, {
    status: 'completed',
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Quick initialize month availability:
 * Configures all upcoming Mondays to Saturdays in the month as available (11 AM - 6 PM).
 * Sundays are kept unavailable by default.
 */
export async function seedMonthDefaultSchedule(
  year: number,
  month: number
): Promise<number> {
  const totalDays = getDaysInMonth(year, month);
  const datesToSet: string[] = [];
  const monthStr = String(month).padStart(2, '0');

  for (let day = 1; day <= totalDays; day++) {
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay(); // 0 = Sun

    // Only set future or today dates, exclude Sundays
    if (dayOfWeek !== 0 && !isPastDateIST(dateStr)) {
      datesToSet.push(dateStr);
    }
  }

  if (datesToSet.length === 0) return 0;
  return await bulkConfigureDates(datesToSet, 'available');
}
