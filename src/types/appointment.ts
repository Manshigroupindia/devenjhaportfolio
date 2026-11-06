/**
 * Deven Jha Portfolio - Appointment System Data Types
 */

export type SlotStatus = 'available' | 'booked' | 'unavailable';

export type DayStatus = 'available' | 'closed_all' | 'no_booking';

export type ClosureReason = 'Holiday' | 'Personal Commitment' | 'Office Closed' | 'Other' | string;

export const CLOSURE_REASON_OPTIONS: string[] = [
  'Holiday',
  'Personal Commitment',
  'Office Closed',
  'Other',
];

export interface TimeSlot {
  id: string; // e.g. "slot-1"
  slotNumber: number; // 1 to 7
  startTime: string; // e.g. "11:00 AM"
  endTime: string; // e.g. "12:00 PM"
  timeRange: string; // e.g. "11:00 AM – 12:00 PM"
  status: SlotStatus;
  bookingId?: string;
  visitorName?: string;
}

export interface DateAvailabilityDoc {
  id: string; // "YYYY-MM-DD"
  date: string; // "YYYY-MM-DD"
  dayStatus: DayStatus; // 'available' | 'closed_all' | 'no_booking'
  isAvailable: boolean; // true if at least one slot is 'available' and dayStatus === 'available'
  slots: TimeSlot[];
  closureReason?: string;
  closureNote?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 'confirmed' | 'cancelled' | 'completed';

export interface AppointmentDoc {
  id: string;
  bookingId: string;
  name: string;
  mobile: string;
  email: string;
  purpose: string;
  agenda: string;
  appointmentDate: string; // "YYYY-MM-DD"
  slotNumber: number;
  startTime: string;
  endTime: string;
  timeRange: string;
  status: AppointmentStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingSubmissionPayload {
  name: string;
  mobile: string;
  email: string;
  purpose: string;
  agenda: string;
  appointmentDate: string; // "YYYY-MM-DD"
  slotNumber: number;
}

/**
 * The 7 official daily appointment slots: 11:00 AM to 6:00 PM IST
 */
export const OFFICIAL_SLOT_DEFINITIONS: Omit<TimeSlot, 'status'>[] = [
  {
    id: 'slot-1',
    slotNumber: 1,
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    timeRange: '11:00 AM – 12:00 PM',
  },
  {
    id: 'slot-2',
    slotNumber: 2,
    startTime: '12:00 PM',
    endTime: '1:00 PM',
    timeRange: '12:00 PM – 1:00 PM',
  },
  {
    id: 'slot-3',
    slotNumber: 3,
    startTime: '1:00 PM',
    endTime: '2:00 PM',
    timeRange: '1:00 PM – 2:00 PM',
  },
  {
    id: 'slot-4',
    slotNumber: 4,
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    timeRange: '2:00 PM – 3:00 PM',
  },
  {
    id: 'slot-5',
    slotNumber: 5,
    startTime: '3:00 PM',
    endTime: '4:00 PM',
    timeRange: '3:00 PM – 4:00 PM',
  },
  {
    id: 'slot-6',
    slotNumber: 6,
    startTime: '4:00 PM',
    endTime: '5:00 PM',
    timeRange: '4:00 PM – 5:00 PM',
  },
  {
    id: 'slot-7',
    slotNumber: 7,
    startTime: '5:00 PM',
    endTime: '6:00 PM',
    timeRange: '5:00 PM – 6:00 PM',
  },
];

/**
 * Helper to generate 7 default slots for a date
 */
export function createDefaultSlots(defaultStatus: SlotStatus = 'available'): TimeSlot[] {
  return OFFICIAL_SLOT_DEFINITIONS.map((def) => ({
    ...def,
    status: defaultStatus,
  }));
}

export const APPOINTMENT_PURPOSES = [
  'Social Initiative & NGO Collaboration',
  'Meeting & Personal Appointment',
  'Media, Press & TV Interview',
  'Celebrity Bulaye / Event Partnership',
  'Janta Live News Query',
  'Youth Mentorship & Guidance',
  'General Inquiry / Other',
];

