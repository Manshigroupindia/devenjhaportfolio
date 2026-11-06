import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Save,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Plus,
  ArrowRight,
  Sliders,
  CalendarDays,
  FileSpreadsheet,
  Layers,
  Settings as SettingsIcon,
  Eye,
  CheckCheck,
} from 'lucide-react';
import {
  DateAvailabilityDoc,
  TimeSlot,
  AppointmentDoc,
  AppointmentStatus,
  DayStatus,
  CLOSURE_REASON_OPTIONS,
  OFFICIAL_SLOT_DEFINITIONS,
  createDefaultSlots,
} from '../../types/appointment.ts';
import {
  subscribeToMonthAvailability,
  subscribeToAppointments,
  saveDateAvailability,
  setDateDayStatus,
  hasActiveBookingsForDate,
  toggleWholeDateAvailability,
  bulkConfigureDates,
  copyDateSchedule,
  cancelAppointment,
  markAppointmentCompleted,
  seedMonthDefaultSchedule,
  getDateAvailability,
} from '../../services/appointmentService.ts';
import {
  getISTNow,
  getISTTodayString,
  formatToISTDateString,
  isPastDateIST,
  isTodayIST,
  formatHumanDate,
  formatShortDate,
  getDaysInMonth,
  getFirstDayOfWeek,
  MONTH_NAMES,
  WEEKDAY_NAMES,
} from '../../utils/appointmentDateUtils.ts';

type ActiveTab = 'dashboard' | 'availability' | 'bookings' | 'calendar' | 'settings';

export const AppointmentManagementCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Month navigation state
  const istNow = getISTNow();
  const [calendarYear, setCalendarYear] = useState<number>(istNow.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(istNow.getMonth() + 1); // 1-12

  // Month availability state
  const [monthAvailability, setMonthAvailability] = useState<Record<string, DateAvailabilityDoc>>({});
  const [loadingAvailability, setLoadingAvailability] = useState<boolean>(true);

  // Appointments state
  const [appointments, setAppointments] = useState<AppointmentDoc[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(true);

  // Selected date for daily slot management
  const [selectedDateStr, setSelectedDateStr] = useState<string>(getISTTodayString());
  const [editingDayStatus, setEditingDayStatus] = useState<DayStatus>('available');
  const [editingClosureReason, setEditingClosureReason] = useState<string>('Holiday');
  const [editingClosureNote, setEditingClosureNote] = useState<string>('');
  const [editingSlots, setEditingSlots] = useState<TimeSlot[]>(createDefaultSlots('available'));
  const [editingNote, setEditingNote] = useState<string>('');
  const [isSavingSlots, setIsSavingSlots] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Active bookings warning modal when admin switches to Closed All or Holiday
  const [warningPendingStatus, setWarningPendingStatus] = useState<{
    targetStatus: DayStatus;
    activeBookings: AppointmentDoc[];
  } | null>(null);

  // Search & Filter state for Bookings
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  // Modal / Detail views
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<AppointmentDoc | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<AppointmentDoc | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // Bulk configuration state
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [bulkStartDate, setBulkStartDate] = useState<string>(getISTTodayString());
  const [bulkEndDate, setBulkEndDate] = useState<string>(getISTTodayString());
  const [bulkDayStatus, setBulkDayStatus] = useState<DayStatus>('available');
  const [bulkClosureReason, setBulkClosureReason] = useState<string>('Holiday');
  const [bulkClosureNote, setBulkClosureNote] = useState<string>('');
  const [isBulkRunning, setIsBulkRunning] = useState<boolean>(false);

  // Copy schedule state
  const [targetCopyDate, setTargetCopyDate] = useState<string>('');
  const [copySuccessMsg, setCopySuccessMsg] = useState<string | null>(null);

  // 1. Subscribe to month availability
  useEffect(() => {
    setLoadingAvailability(true);
    const unsubscribe = subscribeToMonthAvailability(
      calendarYear,
      calendarMonth,
      (datesMap) => {
        setMonthAvailability(datesMap);
        setLoadingAvailability(false);
      }
    );
    return () => unsubscribe();
  }, [calendarYear, calendarMonth]);

  // 2. Subscribe to all appointments
  useEffect(() => {
    setLoadingAppointments(true);
    const unsubscribe = subscribeToAppointments((list) => {
      setAppointments(list);
      setLoadingAppointments(false);
    });
    return () => unsubscribe();
  }, []);

  // 3. Load slots when selected date changes
  useEffect(() => {
    const existing = monthAvailability[selectedDateStr];
    if (existing) {
      setEditingDayStatus(existing.dayStatus || (existing.isAvailable ? 'available' : 'closed_all'));
      setEditingClosureReason(existing.closureReason || 'Holiday');
      setEditingClosureNote(existing.closureNote || '');
      setEditingSlots(existing.slots || createDefaultSlots('unavailable'));
      setEditingNote(existing.note || '');
    } else {
      getDateAvailability(selectedDateStr).then((docData) => {
        if (docData) {
          setEditingDayStatus(docData.dayStatus);
          setEditingClosureReason(docData.closureReason || 'Holiday');
          setEditingClosureNote(docData.closureNote || '');
          setEditingSlots(docData.slots);
          setEditingNote(docData.note || '');
        } else {
          setEditingDayStatus('available');
          setEditingClosureReason('Holiday');
          setEditingClosureNote('');
          setEditingSlots(createDefaultSlots('available'));
          setEditingNote('');
        }
      });
    }
  }, [selectedDateStr, monthAvailability]);

  // Switch date status with safety guard against closing dates with active confirmed bookings
  const handleSelectDateStatus = (status: DayStatus) => {
    if (status === editingDayStatus) return;

    const activeBookings = appointments.filter(
      (a) => a.appointmentDate === selectedDateStr && a.status === 'confirmed'
    );

    if ((status === 'closed_all' || status === 'no_booking') && activeBookings.length > 0) {
      setWarningPendingStatus({
        targetStatus: status,
        activeBookings,
      });
      return;
    }

    applyStatusChange(status);
  };

  const applyStatusChange = (status: DayStatus) => {
    setEditingDayStatus(status);
    if (status === 'closed_all' || status === 'no_booking') {
      // Mark unbooked slots as unavailable
      setEditingSlots((prev) =>
        prev.map((s) => (s.status === 'booked' ? s : { ...s, status: 'unavailable' }))
      );
    } else if (status === 'available') {
      const hasAnyAvailable = editingSlots.some((s) => s.status === 'available');
      if (!hasAnyAvailable) {
        setEditingSlots((prev) =>
          prev.map((s) => (s.status === 'booked' ? s : { ...s, status: 'available' }))
        );
      }
    }
  };

  // Save selected date slots
  const handleSaveSelectedDateSlots = async () => {
    setIsSavingSlots(true);
    try {
      await saveDateAvailability(selectedDateStr, editingSlots, {
        dayStatus: editingDayStatus,
        closureReason: editingDayStatus === 'no_booking' ? editingClosureReason : '',
        closureNote: editingDayStatus === 'no_booking' ? editingClosureNote : '',
        note: editingNote,
      });
      setSaveSuccessMsg(`Schedule for ${formatShortDate(selectedDateStr)} saved successfully!`);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (err: any) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setIsSavingSlots(false);
    }
  };

  // Toggle single slot status
  const handleSlotStatusChange = (
    slotNumber: number,
    newStatus: 'available' | 'unavailable'
  ) => {
    setEditingSlots((prev) =>
      prev.map((slot) => {
        if (slot.slotNumber !== slotNumber) return slot;
        if (slot.status === 'booked') {
          alert('This slot is already booked. To change it, please cancel the appointment first.');
          return slot;
        }
        return {
          ...slot,
          status: newStatus,
        };
      })
    );
  };

  // Mark all slots available for selected date
  const handleMarkAllSlotsAvailable = () => {
    setEditingDayStatus('available');
    setEditingSlots((prev) =>
      prev.map((s) => ({
        ...s,
        status: s.status === 'booked' ? 'booked' : 'available',
      }))
    );
  };

  // Mark all slots unavailable for selected date (Close All)
  const handleMarkAllSlotsUnavailable = () => {
    handleSelectDateStatus('closed_all');
  };

  // Bulk configure dates
  const handleRunBulkConfig = async () => {
    if (!bulkStartDate || !bulkEndDate) return;
    if (bulkStartDate > bulkEndDate) {
      alert('Start date must be before or equal to End date.');
      return;
    }

    setIsBulkRunning(true);
    try {
      const datesToUpdate: string[] = [];
      const current = new Date(bulkStartDate);
      const end = new Date(bulkEndDate);

      while (current <= end) {
        datesToUpdate.push(formatToISTDateString(current));
        current.setDate(current.getDate() + 1);
      }

      const count = await bulkConfigureDates(datesToUpdate, bulkDayStatus, {
        closureReason: bulkDayStatus === 'no_booking' ? bulkClosureReason : '',
        closureNote: bulkDayStatus === 'no_booking' ? bulkClosureNote : '',
      });
      alert(
        `Successfully updated ${count} dates to ${
          bulkDayStatus === 'available'
            ? 'Available'
            : bulkDayStatus === 'closed_all'
            ? 'Closed All'
            : 'Holiday / No Booking'
        }!`
      );
      setShowBulkModal(false);
    } catch (err: any) {
      alert(`Bulk update failed: ${err.message}`);
    } finally {
      setIsBulkRunning(false);
    }
  };

  // 1-Click seed current month
  const handleSeedMonth = async () => {
    if (
      !window.confirm(
        `Initialize ${MONTH_NAMES[calendarMonth - 1]} ${calendarYear} with default availability (Mon–Sat 11 AM – 6 PM)?`
      )
    ) {
      return;
    }

    try {
      const count = await seedMonthDefaultSchedule(calendarYear, calendarMonth);
      alert(`Configured ${count} upcoming dates for ${MONTH_NAMES[calendarMonth - 1]} ${calendarYear}!`);
    } catch (err: any) {
      alert(`Initialization error: ${err.message}`);
    }
  };

  // Cancel Appointment Confirmation
  const handleConfirmCancelAppointment = async () => {
    if (!cancellingBooking) return;
    setIsCancelling(true);
    try {
      await cancelAppointment(
        cancellingBooking.bookingId,
        cancellingBooking.appointmentDate,
        cancellingBooking.slotNumber,
        true // release slot back to available
      );
      setCancellingBooking(null);
      if (selectedBookingForModal?.id === cancellingBooking.id) {
        setSelectedBookingForModal(null);
      }
    } catch (err: any) {
      alert(`Failed to cancel appointment: ${err.message}`);
    } finally {
      setIsCancelling(false);
    }
  };

  // Mark completed
  const handleMarkCompleted = async (bookingId: string) => {
    try {
      await markAppointmentCompleted(bookingId);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // Copy schedule to target date
  const handleCopySchedule = async () => {
    if (!targetCopyDate) return;
    try {
      await copyDateSchedule(selectedDateStr, targetCopyDate);
      setCopySuccessMsg(`Copied schedule from ${selectedDateStr} to ${targetCopyDate}!`);
      setTimeout(() => setCopySuccessMsg(null), 3000);
      setTargetCopyDate('');
    } catch (err: any) {
      alert(`Copy error: ${err.message}`);
    }
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((appt) => {
    // Status filter
    if (statusFilter !== 'all' && appt.status !== statusFilter) return false;

    // Date filter
    const todayStr = getISTTodayString();
    if (dateFilter === 'upcoming' && appt.appointmentDate < todayStr) return false;
    if (dateFilter === 'past' && appt.appointmentDate >= todayStr) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = appt.name.toLowerCase().includes(q);
      const matchMobile = appt.mobile.includes(q);
      const matchEmail = appt.email.toLowerCase().includes(q);
      const matchId = appt.bookingId.toLowerCase().includes(q);
      const matchPurpose = appt.purpose.toLowerCase().includes(q);
      return matchName || matchMobile || matchEmail || matchId || matchPurpose;
    }

    return true;
  });

  // Calculate Dashboard metrics
  const totalBookingsCount = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length;
  const todayStr = getISTTodayString();
  const todayBookings = appointments.filter(
    (a) => a.appointmentDate === todayStr && a.status === 'confirmed'
  );

  // Calendar calculations
  const totalDays = getDaysInMonth(calendarYear, calendarMonth);
  const firstDayIndex = getFirstDayOfWeek(calendarYear, calendarMonth);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5decb]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#a87932]">
            Consultations &amp; Schedules
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111c2a]">
            Appointment Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure hourly slot availability, monitor visitor bookings, and manage schedule in India Standard Time (IST).
          </p>
        </div>

        {/* Quick Month Seed Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSeedMonth}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#ebdcc9] text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition cursor-pointer"
            title="Initialize availability for current month (Mon-Sat 11 AM - 6 PM)"
          >
            <CalendarDays className="w-4 h-4 text-[#b8863b]" />
            <span>Seed {MONTH_NAMES[calendarMonth - 1]}</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#ebdcc9]">
        {[
          { key: 'dashboard', label: 'Dashboard', icon: Layers },
          { key: 'availability', label: 'Manage Availability', icon: Sliders },
          { key: 'bookings', label: `Bookings (${confirmedCount})`, icon: CalendarIcon },
          { key: 'calendar', label: 'Calendar View', icon: CalendarDays },
          { key: 'settings', label: 'Settings & Overview', icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as ActiveTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#111c2a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: DASHBOARD
         ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-[#ebdcc9] shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Bookings
              </span>
              <span className="text-2xl font-bold text-[#111c2a] tabular-nums">
                {totalBookingsCount}
              </span>
              <span className="block text-[11px] text-slate-500 mt-1">
                All-time consultation requests
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                Confirmed / Active
              </span>
              <span className="text-2xl font-bold text-emerald-800 tabular-nums">
                {confirmedCount}
              </span>
              <span className="block text-[11px] text-emerald-600 mt-1">
                Scheduled consultations
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
                Completed
              </span>
              <span className="text-2xl font-bold text-blue-800 tabular-nums">
                {completedCount}
              </span>
              <span className="block text-[11px] text-blue-600 mt-1">
                Past successful meetings
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-rose-200 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                Cancelled
              </span>
              <span className="text-2xl font-bold text-rose-800 tabular-nums">
                {cancelledCount}
              </span>
              <span className="block text-[11px] text-rose-600 mt-1">
                Released time slots
              </span>
            </div>
          </div>

          {/* Today's Schedule Banner */}
          <div className="bg-white border border-[#ebdcc9] rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b8863b] block">
                  TODAY&apos;S SCHEDULE (IST)
                </span>
                <h3 className="font-serif text-lg font-bold text-[#111c2a]">
                  {formatHumanDate(todayStr)}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-[#b8863b] border border-[#ebdcc9]">
                {todayBookings.length} Bookings Today
              </span>
            </div>

            {/* Today's Slots Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
              {OFFICIAL_SLOT_DEFINITIONS.map((def) => {
                const todayDoc = monthAvailability[todayStr];
                const slot = todayDoc?.slots.find((s) => s.slotNumber === def.slotNumber);
                const isBooked = slot?.status === 'booked';
                const isAvailable = slot?.status === 'available';

                return (
                  <div
                    key={def.id}
                    className={`p-2.5 rounded-lg border text-xs text-left ${
                      isBooked
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : isAvailable
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <span className="font-bold block leading-tight text-[11px]">
                      {def.timeRange}
                    </span>
                    <span className="text-[10px] font-semibold mt-1 block">
                      {isBooked ? `Booked: ${slot?.visitorName || 'Visitor'}` : isAvailable ? 'Available' : 'Closed'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming 5 Appointments */}
          <div className="bg-white border border-[#ebdcc9] rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-[#111c2a]">
                Upcoming Appointments
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className="text-xs font-semibold text-[#b8863b] hover:underline cursor-pointer"
              >
                View All Bookings →
              </button>
            </div>

            {loadingAppointments ? (
              <p className="text-xs text-slate-400 py-4 text-center">Loading appointments...</p>
            ) : appointments.filter((a) => a.status === 'confirmed').length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming appointments scheduled.</p>
            ) : (
              <div className="space-y-2">
                {appointments
                  .filter((a) => a.status === 'confirmed')
                  .slice(0, 5)
                  .map((appt) => (
                    <div
                      key={appt.id}
                      className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#111c2a] text-sm">{appt.name}</span>
                          <span className="font-mono text-[10.5px] text-slate-400">({appt.bookingId})</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 mt-1">
                          <span>{formatHumanDate(appt.appointmentDate)}</span>
                          <span>•</span>
                          <span className="font-semibold text-[#b8863b]">{appt.timeRange}</span>
                          <span>•</span>
                          <span>{appt.mobile}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForModal(appt)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-semibold cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMarkCompleted(appt.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded font-semibold cursor-pointer"
                        >
                          Complete
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancellingBooking(appt)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MANAGE AVAILABILITY
         ========================================================================= */}
      {activeTab === 'availability' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header Controls: Month Selector & Bulk Config */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-[#ebdcc9] rounded-xl shadow-2xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (calendarMonth === 1) {
                    setCalendarYear((y) => y - 1);
                    setCalendarMonth(12);
                  } else {
                    setCalendarMonth((m) => m - 1);
                  }
                }}
                className="p-1.5 rounded-lg border border-[#ebdcc9] bg-slate-50 hover:bg-white text-slate-700 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-serif text-lg font-bold text-[#111c2a] min-w-[160px] text-center">
                {MONTH_NAMES[calendarMonth - 1]} {calendarYear}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (calendarMonth === 12) {
                    setCalendarYear((y) => y + 1);
                    setCalendarMonth(1);
                  } else {
                    setCalendarMonth((m) => m + 1);
                  }
                }}
                className="p-1.5 rounded-lg border border-[#ebdcc9] bg-slate-50 hover:bg-white text-slate-700 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#b8863b] hover:bg-[#a37430] text-white text-xs font-semibold rounded-lg shadow-2xs transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Bulk Configure Dates</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Monthly Calendar (7 cols on lg) */}
            <div className="lg:col-span-7 bg-white border border-[#ebdcc9] rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111c2a] uppercase tracking-wider">
                  Select Date to Manage Slots:
                </span>
                <span className="text-[11px] text-slate-400">
                  Green = Available • Red = Closed • Orange = Holiday
                </span>
              </div>

              {/* Weekday Row */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {WEEKDAY_NAMES.map((d) => (
                  <span key={d} className="text-[10.5px] font-bold text-slate-400 uppercase py-1">
                    {d}
                  </span>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`offset-${i}`} className="h-12" />
                ))}

                {Array.from({ length: totalDays }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dayStr = String(dayNum).padStart(2, '0');
                  const monthStr = String(calendarMonth).padStart(2, '0');
                  const dateStr = `${calendarYear}-${monthStr}-${dayStr}`;

                  const isSelected = selectedDateStr === dateStr;
                  const isToday = isTodayIST(dateStr);
                  const docData = monthAvailability[dateStr];
                  const slots = docData?.slots || [];
                  const bookedCount = slots.filter((s) => s.status === 'booked').length;
                  const hasFreeSlot = slots.some((s) => s.status === 'available');

                  let bgStyle = 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300';
                  let statusLabel = 'Unset';

                  if (docData) {
                    if (docData.dayStatus === 'no_booking') {
                      bgStyle = 'bg-amber-50 text-amber-950 border-amber-300 hover:border-amber-400';
                      statusLabel = docData.closureReason || 'Holiday';
                    } else if (
                      docData.dayStatus === 'closed_all' ||
                      (!hasFreeSlot && slots.length > 0) ||
                      !docData.isAvailable
                    ) {
                      bgStyle = 'bg-rose-50 text-rose-900 border-rose-300 hover:border-rose-400';
                      statusLabel = bookedCount > 0 ? `${bookedCount} Booked` : 'Closed';
                    } else if (docData.dayStatus === 'available' && hasFreeSlot) {
                      bgStyle = 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:border-emerald-400';
                      statusLabel = bookedCount > 0 ? `${bookedCount} Booked` : 'Open';
                    }
                  }

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => setSelectedDateStr(dateStr)}
                      className={`h-12 rounded-lg p-1 flex flex-col justify-between text-left border transition-all cursor-pointer ${bgStyle} ${
                        isSelected ? 'ring-2 ring-[#b8863b] bg-amber-50 shadow-xs' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold">{dayNum}</span>
                        {isToday && (
                          <span className="text-[8px] font-bold text-[#b8863b] uppercase">Today</span>
                        )}
                      </div>
                      <div className="text-[9px] font-medium leading-tight truncate">
                        {bookedCount > 0 ? (
                          <span className="text-rose-600 font-bold">{bookedCount} Booked</span>
                        ) : (
                          <span
                            className={
                              docData?.dayStatus === 'no_booking'
                                ? 'text-amber-800 font-semibold'
                                : docData?.dayStatus === 'available' && hasFreeSlot
                                ? 'text-emerald-700 font-semibold'
                                : 'text-slate-400'
                            }
                          >
                            {statusLabel}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Calendar Color Legend */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-semibold text-emerald-900">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <span className="font-semibold text-rose-900">Closed All</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-semibold text-amber-900">Holiday / No Booking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
                  <span className="font-medium text-slate-500">Unset</span>
                </div>
              </div>
            </div>

            {/* Right Column: Daily Slot Configuration (5 cols on lg) */}
            <div className="lg:col-span-5 bg-white border border-[#ebdcc9] rounded-xl p-5 shadow-2xs space-y-4">
              
              {/* Selected Date Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#b8863b] block">
                    DAILY SCHEDULE
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#111c2a]">
                    {formatHumanDate(selectedDateStr)}
                  </h3>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                    editingDayStatus === 'available'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : editingDayStatus === 'no_booking'
                      ? 'bg-amber-50 text-amber-950 border-amber-300'
                      : 'bg-rose-50 text-rose-900 border-rose-300'
                  }`}
                >
                  {editingDayStatus === 'available'
                    ? 'Available for Appointments'
                    : editingDayStatus === 'no_booking'
                    ? 'Holiday / No Booking'
                    : 'Fully Booked / Closed'}
                </span>
              </div>

              {/* Date-Level Status Selector (Option A: Available, Option B: Closed All, Option C: Holiday) */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Select Date Status:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {/* Option A: Available */}
                  <button
                    type="button"
                    onClick={() => handleSelectDateStatus('available')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer select-none ${
                      editingDayStatus === 'available'
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/50 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-emerald-50/40 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-xs font-bold text-emerald-950">Available</span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      Open for bookings
                    </span>
                  </button>

                  {/* Option B: Closed All */}
                  <button
                    type="button"
                    onClick={() => handleSelectDateStatus('closed_all')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer select-none ${
                      editingDayStatus === 'closed_all'
                        ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/50 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-rose-50/40 hover:border-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                      <span className="text-xs font-bold text-rose-950">Closed All</span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      Close all slots
                    </span>
                  </button>

                  {/* Option C: Holiday / No Booking */}
                  <button
                    type="button"
                    onClick={() => handleSelectDateStatus('no_booking')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer select-none ${
                      editingDayStatus === 'no_booking'
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/50 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-amber-50/40 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-xs font-bold text-amber-950">Holiday</span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      No booking accepted
                    </span>
                  </button>
                </div>
              </div>

              {/* Conditional Holiday / Closure Reason Section */}
              {editingDayStatus === 'no_booking' && (
                <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl space-y-2.5 animate-fadeIn">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs font-bold text-amber-950">
                      Holiday / Closure Details (Shown to Public Visitors)
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Reason for Closure:
                    </label>
                    <select
                      value={editingClosureReason}
                      onChange={(e) => setEditingClosureReason(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400"
                    >
                      {CLOSURE_REASON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Custom Note / Occasion (Optional):
                    </label>
                    <input
                      type="text"
                      value={editingClosureNote}
                      onChange={(e) => setEditingClosureNote(e.target.value)}
                      placeholder="e.g. National Holiday, Out of Town, Office Renovation..."
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* Conditional Closed All Notice */}
              {editingDayStatus === 'closed_all' && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs flex items-center gap-2 animate-fadeIn">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>All consultation slots for this date are marked closed to public visitors.</span>
                </div>
              )}

              {/* Hourly Slots Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-[#111c2a] uppercase tracking-wider">
                    Hourly Time Slots:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleMarkAllSlotsAvailable}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold cursor-pointer"
                    >
                      Open All Slots
                    </button>
                    <button
                      type="button"
                      onClick={handleMarkAllSlotsUnavailable}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded text-xs font-semibold cursor-pointer"
                    >
                      Close All Slots
                    </button>
                  </div>
                </div>

                {/* 7 Hourly Slots Editor */}
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {editingSlots.map((slot) => {
                    const isBooked = slot.status === 'booked';
                    const isAvailable = slot.status === 'available';

                    return (
                      <div
                        key={slot.id}
                        className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition ${
                          isBooked
                            ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                            : isAvailable
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-bold">{slot.timeRange}</span>
                          </div>
                          {isBooked && (
                            <span className="text-[11px] font-semibold text-rose-700 block mt-0.5">
                              Booked by: {slot.visitorName || 'Confirmed Visitor'} ({slot.bookingId})
                            </span>
                          )}
                        </div>

                        {/* State Toggle Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          {isBooked ? (
                            <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                              Booked
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSlotStatusChange(slot.slotNumber, 'available')}
                                className={`px-2 py-1 rounded font-semibold text-[11px] cursor-pointer transition ${
                                  isAvailable
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50'
                                }`}
                              >
                                Available
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSlotStatusChange(slot.slotNumber, 'unavailable')}
                                className={`px-2 py-1 rounded font-semibold text-[11px] cursor-pointer transition ${
                                  !isAvailable
                                    ? 'bg-slate-700 text-white shadow-2xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                Closed
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Optional Date Note */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Internal Admin Note (Optional):
                </label>
                <input
                  type="text"
                  value={editingNote}
                  onChange={(e) => setEditingNote(e.target.value)}
                  placeholder="e.g. VIP delegations / Limited slots"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              {/* Save Feedback */}
              {saveSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveSelectedDateSlots}
                disabled={isSavingSlots}
                className="w-full py-2.5 bg-[#b8863b] hover:bg-[#a37430] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSavingSlots ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save {formatShortDate(selectedDateStr)} Schedule</span>
                  </>
                )}
              </button>

              {/* Copy Schedule to Target Date */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Copy this day&apos;s schedule to another date:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={targetCopyDate}
                    onChange={(e) => setTargetCopyDate(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopySchedule}
                    disabled={!targetCopyDate}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
                {copySuccessMsg && (
                  <p className="text-[11px] text-emerald-600 mt-1">{copySuccessMsg}</p>
                )}
              </div>

            </div>

          </div>

          {/* Bulk Configuration Modal */}
          {showBulkModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-2xl border border-[#ebdcc9] p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#111c2a]">
                    Bulk Configure Date Range
                  </h3>
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      From Date:
                    </label>
                    <input
                      type="date"
                      value={bulkStartDate}
                      onChange={(e) => setBulkStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#b8863b]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      To Date:
                    </label>
                    <input
                      type="date"
                      value={bulkEndDate}
                      onChange={(e) => setBulkEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#b8863b]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Set Schedule Availability:
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition hover:bg-slate-50">
                        <input
                          type="radio"
                          name="bulkDayStatus"
                          checked={bulkDayStatus === 'available'}
                          onChange={() => setBulkDayStatus('available')}
                        />
                        <div>
                          <span className="font-bold text-emerald-900 block">Available (Open)</span>
                          <span className="text-[11px] text-slate-500">
                            Opens all 7 hourly slots (11:00 AM – 6:00 PM IST)
                          </span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition hover:bg-slate-50">
                        <input
                          type="radio"
                          name="bulkDayStatus"
                          checked={bulkDayStatus === 'closed_all'}
                          onChange={() => setBulkDayStatus('closed_all')}
                        />
                        <div>
                          <span className="font-bold text-rose-900 block">Closed All (Unavailable)</span>
                          <span className="text-[11px] text-slate-500">
                            Marks all slots closed (Red on public calendar)
                          </span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition hover:bg-slate-50">
                        <input
                          type="radio"
                          name="bulkDayStatus"
                          checked={bulkDayStatus === 'no_booking'}
                          onChange={() => setBulkDayStatus('no_booking')}
                        />
                        <div>
                          <span className="font-bold text-amber-950 block">Holiday / No Booking</span>
                          <span className="text-[11px] text-slate-500">
                            Marks date as holiday with custom reason (Orange on public calendar)
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {bulkDayStatus === 'no_booking' && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2 animate-fadeIn">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Closure Reason:
                        </label>
                        <select
                          value={bulkClosureReason}
                          onChange={(e) => setBulkClosureReason(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded-lg text-xs"
                        >
                          {CLOSURE_REASON_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Note / Occasion (Optional):
                        </label>
                        <input
                          type="text"
                          value={bulkClosureNote}
                          onChange={(e) => setBulkClosureNote(e.target.value)}
                          placeholder="e.g. Festival Holidays, Travel, Office Renovation"
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRunBulkConfig}
                    disabled={isBulkRunning}
                    className="px-5 py-2 bg-[#b8863b] hover:bg-[#a37430] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    {isBulkRunning ? 'Applying Changes...' : 'Apply Schedule'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Bookings Warning Modal (guards against accidental closure of dates with active bookings) */}
          {warningPendingStatus && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-2xl border border-rose-200 p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#111c2a]">
                      Active Appointments Detected
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Warning before changing {formatHumanDate(selectedDateStr)}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                  <p className="font-bold">
                    There {warningPendingStatus.activeBookings.length === 1 ? 'is' : 'are'}{' '}
                    {warningPendingStatus.activeBookings.length} confirmed appointment(s) on this date:
                  </p>
                  <div className="max-h-28 overflow-y-auto space-y-1 pt-1">
                    {warningPendingStatus.activeBookings.map((b) => (
                      <div key={b.id} className="font-medium bg-white/70 px-2 py-1 rounded">
                        • <strong>{b.name}</strong> ({b.timeRange}) — {b.mobile}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Changing this date to{' '}
                  <strong>
                    {warningPendingStatus.targetStatus === 'closed_all'
                      ? 'Fully Booked / Closed'
                      : 'Holiday / No Booking'}
                  </strong>{' '}
                  will block new bookings from public visitors. Confirmed appointments above will{' '}
                  <strong>NOT</strong> be deleted and will remain in your Bookings list.
                </p>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setWarningPendingStatus(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Keep Date Available
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const status = warningPendingStatus.targetStatus;
                      setWarningPendingStatus(null);
                      applyStatusChange(status);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                  >
                    Proceed &amp; Close Date
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 3: APPOINTMENT BOOKINGS LIST
         ========================================================================= */}
      {activeTab === 'bookings' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Search & Filter Bar */}
          <div className="p-4 bg-white border border-[#ebdcc9] rounded-xl shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by visitor name, phone, email, or booking ID..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#b8863b]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white border border-[#ebdcc9] rounded-xl overflow-hidden shadow-2xs">
            {loadingAppointments ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading bookings...</div>
            ) : filteredAppointments.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No appointment bookings match the selected filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-slate-600 font-bold uppercase text-[10.5px] border-b border-[#ebdcc9]">
                    <tr>
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Visitor Details</th>
                      <th className="py-3 px-4">Appointment Date &amp; Slot</th>
                      <th className="py-3 px-4">Purpose</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50/70 transition">
                        {/* ID */}
                        <td className="py-3 px-4 font-mono font-bold text-[#b8863b]">
                          {appt.bookingId}
                        </td>

                        {/* Visitor */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#111c2a] block text-sm">
                            {appt.name}
                          </span>
                          <span className="text-slate-500 block text-[11px]">{appt.mobile}</span>
                          <span className="text-slate-400 block text-[10.5px]">{appt.email}</span>
                        </td>

                        {/* Date & Time */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800 block">
                            {formatHumanDate(appt.appointmentDate)}
                          </span>
                          <span className="text-xs text-[#b8863b] font-semibold">
                            {appt.timeRange}
                          </span>
                        </td>

                        {/* Purpose */}
                        <td className="py-3 px-4 max-w-[200px]">
                          <span className="font-semibold text-slate-700 block truncate">
                            {appt.purpose}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {appt.agenda}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold uppercase ${
                              appt.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : appt.status === 'completed'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => setSelectedBookingForModal(appt)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded font-semibold text-slate-700 cursor-pointer"
                          >
                            Details
                          </button>
                          {appt.status === 'confirmed' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleMarkCompleted(appt.id)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-semibold cursor-pointer"
                                title="Mark Completed"
                              >
                                Complete
                              </button>
                              <button
                                type="button"
                                onClick={() => setCancellingBooking(appt)}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-semibold cursor-pointer"
                                title="Cancel and release slot"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 4: CALENDAR VIEW
         ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Calendar Box */}
          <div className="bg-white border border-[#ebdcc9] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b8863b] block">
                  MONTHLY BOOKINGS OVERVIEW
                </span>
                <h3 className="font-serif text-lg font-bold text-[#111c2a]">
                  {MONTH_NAMES[calendarMonth - 1]} {calendarYear}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (calendarMonth === 1) {
                      setCalendarYear((y) => y - 1);
                      setCalendarMonth(12);
                    } else {
                      setCalendarMonth((m) => m - 1);
                    }
                  }}
                  className="p-1 rounded border border-[#ebdcc9] bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (calendarMonth === 12) {
                      setCalendarYear((y) => y + 1);
                      setCalendarMonth(1);
                    } else {
                      setCalendarMonth((m) => m + 1);
                    }
                  }}
                  className="p-1 rounded border border-[#ebdcc9] bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {WEEKDAY_NAMES.map((d) => (
                <span key={d} className="text-center font-bold text-[10.5px] text-slate-400 uppercase py-1">
                  {d}
                </span>
              ))}

              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`cal-offset-${i}`} className="h-16" />
              ))}

              {Array.from({ length: totalDays }).map((_, idx) => {
                const dayNum = idx + 1;
                const dayStr = String(dayNum).padStart(2, '0');
                const monthStr = String(calendarMonth).padStart(2, '0');
                const dateStr = `${calendarYear}-${monthStr}-${dayStr}`;

                const docData = monthAvailability[dateStr];
                const dayAppointments = appointments.filter((a) => a.appointmentDate === dateStr);
                const isSelected = selectedDateStr === dateStr;
                const slots = docData?.slots || [];
                const hasFree = slots.some((s) => s.status === 'available');

                let borderStyle = 'border-slate-200 bg-slate-50';
                let statusBadge = null;

                if (docData?.dayStatus === 'no_booking') {
                  borderStyle = 'border-amber-300 bg-amber-50/60';
                  statusBadge = (
                    <span className="text-[9px] font-bold text-amber-900 bg-amber-100/90 px-1 py-0.5 rounded block truncate">
                      {docData.closureReason || 'Holiday'}
                    </span>
                  );
                } else if (
                  docData?.dayStatus === 'closed_all' ||
                  (!hasFree && slots.length > 0) ||
                  (docData && !docData.isAvailable)
                ) {
                  borderStyle = 'border-rose-300 bg-rose-50/50';
                  statusBadge = (
                    <span className="text-[9px] font-bold text-rose-800 bg-rose-100/90 px-1 py-0.5 rounded block">
                      Closed
                    </span>
                  );
                } else if (docData?.dayStatus === 'available' && hasFree) {
                  borderStyle = 'border-emerald-300 bg-emerald-50/50';
                  statusBadge = (
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/90 px-1 py-0.5 rounded block">
                      Open
                    </span>
                  );
                }

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`h-16 p-1.5 rounded-lg border text-left flex flex-col justify-between transition cursor-pointer ${borderStyle} ${
                      isSelected
                        ? 'ring-2 ring-[#b8863b] bg-amber-50 shadow-xs'
                        : 'hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs text-slate-700">{dayNum}</span>
                      {dayAppointments.length > 0 && (
                        <span className="inline-block px-1.5 py-0.2 rounded bg-blue-100 text-blue-900 text-[9.5px] font-bold">
                          {dayAppointments.length} Appt
                        </span>
                      )}
                    </div>
                    <div>
                      {statusBadge}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bookings for Selected Date on Calendar Tab */}
          <div className="bg-white border border-[#ebdcc9] rounded-xl p-5 shadow-2xs space-y-3">
            <h4 className="font-serif text-base font-bold text-[#111c2a]">
              Appointments for {formatHumanDate(selectedDateStr)}
            </h4>

            {appointments.filter((a) => a.appointmentDate === selectedDateStr).length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No appointments booked for this date.</p>
            ) : (
              <div className="space-y-2">
                {appointments
                  .filter((a) => a.appointmentDate === selectedDateStr)
                  .map((a) => (
                    <div
                      key={a.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#111c2a] block text-sm">{a.name}</span>
                        <span className="text-[#b8863b] font-semibold">{a.timeRange}</span> •{' '}
                        <span className="text-slate-500">{a.purpose}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedBookingForModal(a)}
                        className="px-3 py-1 bg-white border border-slate-200 rounded font-semibold cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: SETTINGS & OVERVIEW
         ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border border-[#ebdcc9] rounded-xl p-6 shadow-2xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#111c2a]">
              Appointment Rules &amp; Working Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-sm">
                  1. Operating Hours &amp; Timezone
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Appointments are strictly scheduled from <strong>11:00 AM to 6:00 PM IST</strong> across seven hourly slots. All calendar displays and cutoff checks use <strong>Asia/Kolkata (UTC+5:30)</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-sm">
                  2. Atomic Double-Booking Protection
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Every booking is executed via an atomic Firestore transaction. If two visitors attempt to confirm the same slot concurrently, only one will succeed and the second will receive an immediate notice to select an alternate slot.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-sm">
                  3. Slot Cancellation &amp; Release
                </span>
                <p className="text-slate-600 leading-relaxed">
                  When an administrator cancels an appointment from the Bookings list, the booking status is set to cancelled and the corresponding time slot is safely returned to <strong>Available</strong> for future visitors.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-sm">
                  4. Email &amp; SMS Integration
                </span>
                <p className="text-slate-600 leading-relaxed">
                  The appointment booking hooks are prepared to integrate with Firebase Cloud Functions or an SMTP provider (SendGrid / Postmark / Brevo) to send email confirmations to visitors and office administrators.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          APPOINTMENT DETAIL MODAL
         ========================================================================= */}
      {selectedBookingForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#ebdcc9] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#b8863b] tracking-wider block">
                  BOOKING DETAILS
                </span>
                <h3 className="font-serif text-lg font-bold text-[#111c2a]">
                  {selectedBookingForModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Booking Reference:</span>
                  <span className="font-mono font-bold text-[#b8863b]">{selectedBookingForModal.bookingId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Booking Status:</span>
                  <span className="font-bold uppercase text-emerald-800">{selectedBookingForModal.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Appointment Date:</span>
                  <span className="font-bold text-slate-900">{formatHumanDate(selectedBookingForModal.appointmentDate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Time Slot:</span>
                  <span className="font-bold text-[#b8863b]">{selectedBookingForModal.timeRange}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Mobile Number:</span>
                <a href={`tel:${selectedBookingForModal.mobile}`} className="font-semibold text-blue-700 hover:underline">
                  {selectedBookingForModal.mobile}
                </a>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Email Address:</span>
                <a href={`mailto:${selectedBookingForModal.email}`} className="font-semibold text-blue-700 hover:underline">
                  {selectedBookingForModal.email}
                </a>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Discussion Purpose:</span>
                <p className="font-medium text-slate-800">{selectedBookingForModal.purpose}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Brief Agenda / Notes:</span>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 leading-relaxed text-slate-800 whitespace-pre-wrap">
                  {selectedBookingForModal.agenda}
                </p>
              </div>

              <div className="text-[10px] text-slate-400">
                Requested on: {new Date(selectedBookingForModal.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedBookingForModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
              >
                Close
              </button>
              {selectedBookingForModal.status === 'confirmed' && (
                <button
                  type="button"
                  onClick={() => {
                    setCancellingBooking(selectedBookingForModal);
                  }}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CANCEL CONFIRMATION MODAL
         ========================================================================= */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-rose-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Cancel Appointment?
                </h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to cancel the booking for {cancellingBooking.name}?
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-700">
              <div>
                <strong>Date:</strong> {formatHumanDate(cancellingBooking.appointmentDate)}
              </div>
              <div>
                <strong>Slot:</strong> {cancellingBooking.timeRange}
              </div>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                The time slot will be automatically released and made available for other visitors.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                disabled={isCancelling}
                className="px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelAppointment}
                disabled={isCancelling}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-sm"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel & Release Slot'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

