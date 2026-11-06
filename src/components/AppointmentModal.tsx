import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  AlertCircle,
  MapPin,
  ShieldCheck,
  Building2,
  CalendarDays,
} from 'lucide-react';
import {
  DateAvailabilityDoc,
  TimeSlot,
  AppointmentDoc,
  APPOINTMENT_PURPOSES,
} from '../types/appointment.ts';
import {
  subscribeToMonthAvailability,
  bookAppointment,
} from '../services/appointmentService.ts';
import {
  getISTNow,
  getISTTodayString,
  formatToISTDateString,
  isPastDateIST,
  isTodayIST,
  isPastSlotIST,
  formatHumanDate,
  getDaysInMonth,
  getFirstDayOfWeek,
  MONTH_NAMES,
  WEEKDAY_NAMES,
} from '../utils/appointmentDateUtils.ts';
import { useContactSettings } from '../hooks/useCMSContent.ts';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = 'details' | 'calendar' | 'slots' | 'confirmed';

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  const { data: contactSettings } = useContactSettings();

  // Current active step
  const [currentStep, setCurrentStep] = useState<BookingStep>('details');

  // Step 1: Visitor details
  const [visitorDetails, setVisitorDetails] = useState({
    name: '',
    mobile: '',
    email: '',
    purpose: APPOINTMENT_PURPOSES[0],
    agenda: '',
  });

  // Step 1 Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 2: Calendar month/year navigation (default: current IST month)
  const istNow = getISTNow();
  const [calendarYear, setCalendarYear] = useState<number>(istNow.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(istNow.getMonth() + 1); // 1-12

  // Month availability data from Firestore
  const [monthAvailability, setMonthAvailability] = useState<Record<string, DateAvailabilityDoc>>({});
  const [loadingMonth, setLoadingMonth] = useState<boolean>(true);

  // Selected date & slot
  const [selectedDateStr, setSelectedDateStr] = useState<string>('');
  const [selectedSlotNumber, setSelectedSlotNumber] = useState<number | null>(null);

  // Booking state
  const [isSubmittingBooking, setIsSubmittingBooking] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentDoc | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Calendar notice banner (for Closed All, Holiday/No Booking, Availability Not Set)
  const [calendarNotice, setCalendarNotice] = useState<{
    type: 'info' | 'warning' | 'error';
    message: string;
    details?: string;
  } | null>(null);

  // Subscribe to month availability when modal is open and calendar month changes
  useEffect(() => {
    if (!isOpen) return;

    setLoadingMonth(true);
    const unsubscribe = subscribeToMonthAvailability(
      calendarYear,
      calendarMonth,
      (datesMap) => {
        setMonthAvailability(datesMap);
        setLoadingMonth(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isOpen, calendarYear, calendarMonth]);

  // Reset modal state on close/open
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('details');
      setBookingError(null);
      setConfirmedBooking(null);
      setSelectedDateStr('');
      setSelectedSlotNumber(null);
      const now = getISTNow();
      setCalendarYear(now.getFullYear());
      setCalendarMonth(now.getMonth() + 1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Form Change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVisitorDetails((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate Step 1
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!visitorDetails.name.trim() || visitorDetails.name.trim().length < 2) {
      errors.name = 'Please enter your full name (minimum 2 characters).';
    }

    const cleanMobile = visitorDetails.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      errors.mobile = 'Please enter a valid 10-digit mobile number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!visitorDetails.email.trim() || !emailRegex.test(visitorDetails.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!visitorDetails.purpose.trim()) {
      errors.purpose = 'Please select a meeting purpose.';
    }

    if (!visitorDetails.agenda.trim() || visitorDetails.agenda.trim().length < 5) {
      errors.agenda = 'Please provide a brief agenda or note (at least 5 characters).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Advance to Step 2
  const handleNextToCalendar = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep('calendar');
    }
  };

  // Calendar Month Navigation
  const handlePrevMonth = () => {
    const minDate = getISTNow();
    // Cannot navigate to past months
    if (
      calendarYear === minDate.getFullYear() &&
      calendarMonth === minDate.getMonth() + 1
    ) {
      return;
    }

    if (calendarMonth === 1) {
      setCalendarYear((prev) => prev - 1);
      setCalendarMonth(12);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 12) {
      setCalendarYear((prev) => prev + 1);
      setCalendarMonth(1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  // Check if previous month button should be disabled
  const isPrevDisabled =
    calendarYear === istNow.getFullYear() &&
    calendarMonth === istNow.getMonth() + 1;

  // Selected date availability record
  const selectedDateDoc = selectedDateStr ? monthAvailability[selectedDateStr] : null;

  // Select Date and proceed to slots
  const handleSelectDate = (dateStr: string) => {
    const docData = monthAvailability[dateStr];
    // Check if available
    if (!docData || !docData.isAvailable || isPastDateIST(dateStr)) {
      return;
    }

    // Check if at least one slot is currently valid & not in past
    const hasValidSlot = docData.slots.some(
      (s) => s.status === 'available' && !isPastSlotIST(dateStr, s.startTime)
    );

    if (!hasValidSlot) return;

    setSelectedDateStr(dateStr);
    setSelectedSlotNumber(null);
    setCurrentStep('slots');
  };

  // Confirm booking
  const handleConfirmAppointment = async () => {
    if (!selectedDateStr || selectedSlotNumber === null) {
      setBookingError('Please choose an available time slot.');
      return;
    }

    setIsSubmittingBooking(true);
    setBookingError(null);

    const result = await bookAppointment({
      name: visitorDetails.name,
      mobile: visitorDetails.mobile,
      email: visitorDetails.email,
      purpose: visitorDetails.purpose,
      agenda: visitorDetails.agenda,
      appointmentDate: selectedDateStr,
      slotNumber: selectedSlotNumber,
    });

    setIsSubmittingBooking(false);

    if (result.success && result.appointment) {
      setConfirmedBooking(result.appointment);
      setCurrentStep('confirmed');
    } else {
      setBookingError(result.error || 'Failed to complete booking. Please select another slot.');
    }
  };

  const handleCopyBookingId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  // Days in month calculation
  const totalDays = getDaysInMonth(calendarYear, calendarMonth);
  const firstDayIndex = getFirstDayOfWeek(calendarYear, calendarMonth);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#ebdcc9] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0e1b2b] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#23354c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#b8863b] to-[#8c6123] flex items-center justify-center text-white shadow-xs">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#b8863b] uppercase block">
                OFFICIAL CONSULTATION
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide">
                Take an Appointment
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close appointment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar (Hidden on confirmed) */}
        {currentStep !== 'confirmed' && (
          <div className="bg-[#faf8f5] border-b border-[#ebdcc9] px-4 sm:px-6 py-2.5 shrink-0">
            <div className="flex items-center justify-between max-w-md mx-auto text-xs">
              
              {/* Step 1 Pill */}
              <button
                type="button"
                onClick={() => setCurrentStep('details')}
                className={`flex items-center gap-1.5 font-semibold transition ${
                  currentStep === 'details'
                    ? 'text-[#b8863b]'
                    : 'text-slate-600 hover:text-[#b8863b]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                    currentStep === 'details'
                      ? 'bg-[#b8863b] text-white font-bold'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {currentStep === 'details' ? '1' : '✓'}
                </span>
                <span className="hidden xs:inline">1. Your Details</span>
                <span className="xs:hidden">Details</span>
              </button>

              <span className="w-6 h-[1px] bg-[#d9ccb9]" />

              {/* Step 2 Pill */}
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setCurrentStep('calendar');
                }}
                className={`flex items-center gap-1.5 font-semibold transition ${
                  currentStep === 'calendar'
                    ? 'text-[#b8863b]'
                    : currentStep === 'slots'
                    ? 'text-slate-600 hover:text-[#b8863b]'
                    : 'text-slate-400 pointer-events-none'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                    currentStep === 'calendar'
                      ? 'bg-[#b8863b] text-white font-bold'
                      : currentStep === 'slots'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentStep === 'slots' ? '✓' : '2'}
                </span>
                <span className="hidden xs:inline">2. Choose Date</span>
                <span className="xs:hidden">Date</span>
              </button>

              <span className="w-6 h-[1px] bg-[#d9ccb9]" />

              {/* Step 3 Pill */}
              <div
                className={`flex items-center gap-1.5 font-semibold ${
                  currentStep === 'slots' ? 'text-[#b8863b]' : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                    currentStep === 'slots'
                      ? 'bg-[#b8863b] text-white font-bold'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  3
                </span>
                <span className="hidden xs:inline">3. Select Slot</span>
                <span className="xs:hidden">Slot</span>
              </div>

            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          
          {/* =========================================================================
              STEP 1: VISITOR DETAILS FORM
             ========================================================================= */}
          {currentStep === 'details' && (
            <form onSubmit={handleNextToCalendar} className="space-y-4 animate-fadeIn">
              <div className="mb-2">
                <h4 className="font-serif text-lg font-bold text-[#111c2a]">
                  Visitor Information
                </h4>
                <p className="text-xs text-slate-500">
                  Please provide your contact information and discussion objective.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={visitorDetails.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#faf8f5] border rounded-lg focus:outline-none transition ${
                      formErrors.name
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                        : 'border-[#ebdcc9] focus:border-[#b8863b]'
                    }`}
                  />
                </div>
                {formErrors.name && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{formErrors.name}</span>
                  </p>
                )}
              </div>

              {/* Row 2: Mobile & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Mobile */}
                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="tel"
                      name="mobile"
                      required
                      value={visitorDetails.mobile}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#faf8f5] border rounded-lg focus:outline-none transition ${
                        formErrors.mobile
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                          : 'border-[#ebdcc9] focus:border-[#b8863b]'
                      }`}
                    />
                  </div>
                  {formErrors.mobile && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.mobile}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={visitorDetails.email}
                      onChange={handleInputChange}
                      placeholder="e.g. rahul@example.com"
                      className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#faf8f5] border rounded-lg focus:outline-none transition ${
                        formErrors.email
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                          : 'border-[#ebdcc9] focus:border-[#b8863b]'
                      }`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                  Purpose of Appointment <span className="text-red-500">*</span>
                </label>
                <select
                  name="purpose"
                  value={visitorDetails.purpose}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#faf8f5] border border-[#ebdcc9] rounded-lg focus:outline-none focus:border-[#b8863b] text-[#1e293b]"
                >
                  {APPOINTMENT_PURPOSES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brief Agenda */}
              <div>
                <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                  Brief Agenda / Meeting Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="agenda"
                  required
                  rows={3}
                  value={visitorDetails.agenda}
                  onChange={handleInputChange}
                  placeholder="Share a short summary of the discussion topic, collaboration proposal, or matters to address..."
                  className={`w-full p-3 text-xs sm:text-sm bg-[#faf8f5] border rounded-lg focus:outline-none resize-none transition ${
                    formErrors.agenda
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : 'border-[#ebdcc9] focus:border-[#b8863b]'
                  }`}
                />
                {formErrors.agenda && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{formErrors.agenda}</span>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-[#f0e6d8]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#b8863b] hover:bg-[#a37430] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <span>Next: Choose Date &amp; Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              STEP 2: MONTHLY AVAILABILITY CALENDAR (IST Asia/Kolkata)
             ========================================================================= */}
          {currentStep === 'calendar' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#111c2a]">
                    Select Appointment Date
                  </h4>
                  <p className="text-xs text-slate-500">
                    Dates are synchronized live with office schedule (IST).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep('details')}
                  className="text-xs text-[#b8863b] hover:underline font-semibold cursor-pointer"
                >
                  ← Edit Details
                </button>
              </div>

              {/* Month Navigation Banner */}
              <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-[#ebdcc9] rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setCalendarNotice(null);
                    handlePrevMonth();
                  }}
                  disabled={isPrevDisabled}
                  className={`p-1.5 rounded-lg border transition ${
                    isPrevDisabled
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-[#ebdcc9] bg-white text-slate-700 hover:bg-[#f2e9dc] cursor-pointer'
                  }`}
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <span className="font-serif text-base sm:text-lg font-bold text-[#111c2a]">
                    {MONTH_NAMES[calendarMonth - 1]} {calendarYear}
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                    India Standard Time (IST)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCalendarNotice(null);
                    handleNextMonth();
                  }}
                  className="p-1.5 rounded-lg border border-[#ebdcc9] bg-white text-slate-700 hover:bg-[#f2e9dc] transition cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Status / Closure Notice Banner (if visitor clicks Closed / Holiday / Unset date) */}
              {calendarNotice && (
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs animate-fadeIn ${
                    calendarNotice.type === 'error'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : calendarNotice.type === 'warning'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <AlertCircle
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      calendarNotice.type === 'error'
                        ? 'text-rose-600'
                        : calendarNotice.type === 'warning'
                        ? 'text-amber-600'
                        : 'text-slate-500'
                    }`}
                  />
                  <div className="flex-1">
                    <span className="font-bold block">{calendarNotice.message}</span>
                    {calendarNotice.details && (
                      <span className="text-[11.5px] opacity-90 block mt-0.5">
                        {calendarNotice.details}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCalendarNotice(null)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    aria-label="Dismiss notice"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Calendar Grid */}
              <div className="border border-[#ebdcc9] rounded-xl p-3 bg-white">
                {/* Weekday Row */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {WEEKDAY_NAMES.map((d) => (
                    <span
                      key={d}
                      className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1"
                    >
                      {d}
                    </span>
                  ))}
                </div>

                {/* Days Cells */}
                {loadingMonth ? (
                  <div className="py-12 flex flex-col items-center justify-center text-xs text-slate-400">
                    <div className="w-6 h-6 border-2 border-[#b8863b] border-t-transparent rounded-full animate-spin mb-2" />
                    <span>Loading real-time availability...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty placeholder cells for offset */}
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                      <div key={`offset-${i}`} className="h-10 sm:h-12" />
                    ))}

                    {/* Day Cells */}
                    {Array.from({ length: totalDays }).map((_, idx) => {
                      const dayNum = idx + 1;
                      const dayStr = String(dayNum).padStart(2, '0');
                      const monthStr = String(calendarMonth).padStart(2, '0');
                      const dateStr = `${calendarYear}-${monthStr}-${dayStr}`;

                      const isPast = isPastDateIST(dateStr);
                      const isToday = isTodayIST(dateStr);
                      const isSelected = selectedDateStr === dateStr;

                      // Firestore schedule doc
                      const docData = monthAvailability[dateStr];
                      const isConfigured = Boolean(docData);

                      // Check if at least 1 slot is currently free & not passed
                      let hasFreeSlot = false;
                      let isFullyBooked = false;

                      if (isConfigured && !isPast) {
                        const slots = docData.slots || [];
                        const validSlots = slots.filter(
                          (s) => s.status === 'available' && !isPastSlotIST(dateStr, s.startTime)
                        );
                        hasFreeSlot = validSlots.length > 0;
                        const allBooked = slots.length > 0 && slots.every((s) => s.status === 'booked');
                        isFullyBooked = allBooked || (slots.length > 0 && !hasFreeSlot && docData.isAvailable);
                      }

                      // Determine cell status: 'past' | 'available' | 'closed_all' | 'no_booking' | 'not_configured'
                      let cellState: 'past' | 'available' | 'closed_all' | 'no_booking' | 'not_configured' = 'not_configured';

                      if (isPast) {
                        cellState = 'past';
                      } else if (!isConfigured) {
                        cellState = 'not_configured';
                      } else if (docData.dayStatus === 'no_booking') {
                        cellState = 'no_booking';
                      } else if (docData.dayStatus === 'closed_all' || isFullyBooked || !docData.isAvailable || !hasFreeSlot) {
                        cellState = 'closed_all';
                      } else if (docData.dayStatus === 'available' && hasFreeSlot) {
                        cellState = 'available';
                      } else {
                        cellState = 'closed_all';
                      }

                      // Styling configuration based on status
                      let cellStyle = '';
                      let cellTitle = '';
                      if (cellState === 'past') {
                        cellStyle = 'bg-slate-100/70 text-slate-300 border-slate-100 cursor-not-allowed select-none';
                        cellTitle = 'Past Date';
                      } else if (cellState === 'available') {
                        cellStyle =
                          'bg-emerald-50/90 text-emerald-950 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-500 hover:scale-[1.03] cursor-pointer shadow-2xs';
                        cellTitle = `Available for Appointments on ${formatHumanDate(dateStr)}`;
                      } else if (cellState === 'closed_all') {
                        cellStyle =
                          'bg-rose-50/90 text-rose-900 border border-rose-300 hover:bg-rose-100/90 hover:border-rose-400 cursor-pointer';
                        cellTitle = 'No Appointments Available';
                      } else if (cellState === 'no_booking') {
                        cellStyle =
                          'bg-amber-50/90 text-amber-950 border border-amber-300 hover:bg-amber-100 hover:border-amber-400 cursor-pointer';
                        const reasonSuffix = docData?.closureReason ? ` — ${docData.closureReason}` : '';
                        cellTitle = `Booking Not Accepted on This Day${reasonSuffix}`;
                      } else {
                        // not_configured
                        cellStyle =
                          'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 cursor-pointer';
                        cellTitle = 'Availability Not Set';
                      }

                      const handleCellClick = () => {
                        if (cellState === 'past') return;

                        if (cellState === 'available') {
                          setCalendarNotice(null);
                          handleSelectDate(dateStr);
                        } else if (cellState === 'closed_all') {
                          setCalendarNotice({
                            type: 'error',
                            message: 'No Appointments Available',
                            details: `There are no available consultation slots for ${formatHumanDate(dateStr)}. All slots are either fully booked or closed.`,
                          });
                        } else if (cellState === 'no_booking') {
                          const reason = docData?.closureReason ? docData.closureReason : 'Holiday';
                          const note = docData?.closureNote ? ` — ${docData.closureNote}` : '';
                          setCalendarNotice({
                            type: 'warning',
                            message: 'Booking Not Accepted on This Day',
                            details: `${formatHumanDate(dateStr)}: ${reason}${note}`,
                          });
                        } else if (cellState === 'not_configured') {
                          setCalendarNotice({
                            type: 'info',
                            message: 'Availability Not Set',
                            details: `The schedule for ${formatHumanDate(dateStr)} has not been published yet. Please choose an available green date.`,
                          });
                        }
                      };

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          onClick={handleCellClick}
                          disabled={cellState === 'past'}
                          className={`h-10 sm:h-12 rounded-lg flex flex-col items-center justify-center relative transition-all duration-150 ${cellStyle} ${
                            isSelected ? 'ring-2 ring-[#b8863b] bg-amber-50 shadow-xs' : ''
                          }`}
                          title={cellTitle}
                        >
                          <span
                            className={`text-xs sm:text-sm font-semibold ${
                              cellState === 'available'
                                ? 'text-emerald-950 font-bold'
                                : cellState === 'closed_all'
                                ? 'text-rose-700 font-bold'
                                : cellState === 'no_booking'
                                ? 'text-amber-900 font-bold'
                                : cellState === 'not_configured'
                                ? 'text-slate-600'
                                : 'text-slate-300'
                            }`}
                          >
                            {dayNum}
                          </span>

                          {/* Status Indicator Dot */}
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {cellState === 'available' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                            )}
                            {cellState === 'closed_all' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                            )}
                            {cellState === 'no_booking' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                            )}
                            {cellState === 'not_configured' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                            )}
                            {isToday && (
                              <span className="text-[8.5px] uppercase font-bold text-[#b8863b] leading-none ml-0.5">
                                Today
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Calendar Color Legend */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 text-xs text-slate-700 pt-2 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-50 border border-emerald-400 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </span>
                  <span className="font-semibold text-emerald-950">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-rose-50 border border-rose-300 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  </span>
                  <span className="font-semibold text-rose-950">No Appointments Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-amber-50 border border-amber-300 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  </span>
                  <span className="font-semibold text-amber-950">Booking Not Accepted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  </span>
                  <span className="font-medium text-slate-500">Availability Not Set</span>
                </div>
              </div>

              {/* Navigation Back */}
              <div className="pt-2 flex justify-between border-t border-[#f0e6d8]">
                <button
                  type="button"
                  onClick={() => setCurrentStep('details')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Visitor Details</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: DATE-WISE TIME SLOT SELECTION
             ========================================================================= */}
          {currentStep === 'slots' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#111c2a]">
                    Select Hourly Time Slot
                  </h4>
                  <p className="text-xs text-slate-500">
                    Official consultation hours: 11:00 AM – 6:00 PM IST
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep('calendar')}
                  className="text-xs text-[#b8863b] hover:underline font-semibold cursor-pointer"
                >
                  ← Change Date
                </button>
              </div>

              {/* Date Header Pill */}
              <div className="p-3 bg-[#FAF8F5] border border-[#ebdcc9] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#b8863b]/15 text-[#b8863b] flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#b8863b] tracking-wider block">
                      APPOINTMENT DATE
                    </span>
                    <span className="font-serif text-sm sm:text-base font-bold text-[#111c2a]">
                      {formatHumanDate(selectedDateStr)}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Open for Booking
                </span>
              </div>

              {/* 7 Hourly Slots Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#1e293b] uppercase tracking-wider block">
                  Available Slots:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDateDoc?.slots.map((slot) => {
                    const isPast = isPastSlotIST(selectedDateStr, slot.startTime);
                    const isBooked = slot.status === 'booked';
                    const isUnavailable = slot.status === 'unavailable' || isPast;
                    const isAvailable = slot.status === 'available' && !isPast;
                    const isSelected = selectedSlotNumber === slot.slotNumber;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedSlotNumber(slot.slotNumber);
                            setBookingError(null);
                          }
                        }}
                        disabled={!isAvailable}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all select-none ${
                          isSelected
                            ? 'bg-[#b8863b] text-white border-[#b8863b] shadow-md'
                            : isAvailable
                            ? 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-950 border-emerald-200 cursor-pointer hover:border-[#b8863b]'
                            : isBooked
                            ? 'bg-rose-50/70 text-rose-400 border-rose-200 cursor-not-allowed opacity-75'
                            : 'bg-slate-100/70 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock
                            className={`w-4 h-4 shrink-0 ${
                              isSelected
                                ? 'text-white'
                                : isAvailable
                                ? 'text-emerald-700'
                                : 'text-slate-400'
                            }`}
                          />
                          <div>
                            <span className="text-xs sm:text-sm font-bold block leading-tight">
                              {slot.timeRange}
                            </span>
                            <span
                              className={`text-[10px] ${
                                isSelected
                                  ? 'text-white/80'
                                  : isAvailable
                                  ? 'text-emerald-700'
                                  : 'text-slate-400'
                              }`}
                            >
                              Slot #{slot.slotNumber}
                            </span>
                          </div>
                        </div>

                        {/* Status Label */}
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            isSelected
                              ? 'bg-white text-[#b8863b]'
                              : isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : isBooked
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isSelected
                            ? 'Selected'
                            : isAvailable
                            ? 'Available'
                            : isBooked
                            ? 'Booked'
                            : 'Closed'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Booking Summary Box */}
              {selectedSlotNumber !== null && (
                <div className="p-3.5 bg-[#faf8f5] border border-[#ebdcc9] rounded-xl space-y-2 animate-fadeIn">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#b8863b] block">
                    BOOKING APPOINTMENT SUMMARY
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10.5px]">Visitor:</span>
                      <span className="font-semibold">{visitorDetails.name}</span> ({visitorDetails.mobile})
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10.5px]">Scheduled Date &amp; Time:</span>
                      <span className="font-semibold">
                        {formatHumanDate(selectedDateStr)} at{' '}
                        {
                          selectedDateDoc?.slots.find((s) => s.slotNumber === selectedSlotNumber)
                            ?.timeRange
                        }
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block text-[10.5px]">Purpose:</span>
                      <span className="font-medium text-slate-600">{visitorDetails.purpose}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {bookingError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-[#f0e6d8]">
                <button
                  type="button"
                  onClick={() => setCurrentStep('calendar')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Calendar</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAppointment}
                  disabled={selectedSlotNumber === null || isSubmittingBooking}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-md transition ${
                    selectedSlotNumber === null || isSubmittingBooking
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[#b8863b] hover:bg-[#a37430] text-white active:scale-95 cursor-pointer'
                  }`}
                >
                  {isSubmittingBooking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Reserving Slot...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              PART 3: CONFIRMATION SUCCESS SCREEN
             ========================================================================= */}
          {currentStep === 'confirmed' && confirmedBooking && (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-scaleIn">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b8863b] block mb-1">
                  APPOINTMENT RESERVED
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#111c2a]">
                  Appointment Request Submitted!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Your appointment request has been submitted successfully. We look forward to connecting with you.
                </p>
              </div>

              {/* Booking Reference Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF8F5] border border-[#ebdcc9] rounded-xl shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Booking ID:</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#b8863b]">
                  {confirmedBooking.bookingId}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyBookingId(confirmedBooking.bookingId)}
                  className="p-1 text-slate-500 hover:text-[#b8863b] transition cursor-pointer"
                  title="Copy Booking ID"
                >
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Verified Details Card */}
              <div className="max-w-md mx-auto bg-white border border-[#ebdcc9] rounded-xl p-4 text-left shadow-xs space-y-2.5 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10.5px] text-slate-400 block font-medium">Visitor Name:</span>
                    <span className="font-bold text-[#111c2a]">{confirmedBooking.name}</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 block font-medium">Contact:</span>
                    <span className="font-semibold text-slate-800">{confirmedBooking.mobile}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-[10.5px] text-slate-400 block font-medium">Scheduled Date:</span>
                    <span className="font-bold text-[#111c2a]">
                      {formatHumanDate(confirmedBooking.appointmentDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 block font-medium">Time Slot:</span>
                    <span className="font-bold text-[#b8863b]">{confirmedBooking.timeRange}</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <span className="text-[10.5px] text-slate-400 block font-medium">Purpose:</span>
                  <span className="font-medium text-slate-700">{confirmedBooking.purpose}</span>
                </div>

                {/* Office Contact Info */}
                <div className="pt-2 border-t border-[#f0e6d8] bg-[#FAF8F5] p-2.5 rounded-lg text-[11px] text-slate-600">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#b8863b] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#111c2a] block">
                        Executive Office Location:
                      </span>
                      <span>
                        {contactSettings.addressNote || contactSettings.cityState || 'Noida / Delhi NCR, India'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-2.5 bg-[#0e1b2b] hover:bg-[#182a3f] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition cursor-pointer"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
