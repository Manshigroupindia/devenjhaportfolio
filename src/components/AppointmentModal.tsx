import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, Send, User, Mail, Phone, MapPin } from 'lucide-react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: '11:00 AM - 12:00 PM',
    type: 'Social / NGO Initiative',
    notes: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#ebdcc9] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0e1b2b] text-white px-6 py-4 flex items-center justify-between border-b border-[#23354c]">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#b8863b] uppercase">
              Schedule A Meeting
            </span>
            <h3 className="font-serif text-xl font-bold">
              Take an Appointment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mb-3" />
              <h4 className="font-serif text-xl font-bold text-[#111c2a] mb-2">
                Appointment Requested!
              </h4>
              <p className="text-sm text-[#4a5568] max-w-sm mb-6">
                Thank you, {formData.name}. Your appointment request for {formData.date || 'the selected date'} has been recorded. Our office will confirm the appointment slot shortly.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-[#a87932] hover:bg-[#946927] text-white text-xs font-semibold rounded-md transition shadow-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <p className="text-xs text-[#64748b]">
                Connect directly with Devendra Kumar Jha (Deven Jha) for community ventures, public engagements, and collaborations.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932] text-[#334155]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Preferred Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932] text-[#334155]"
                    >
                      <option>10:00 AM - 11:00 AM</option>
                      <option>11:00 AM - 12:00 PM</option>
                      <option>02:00 PM - 03:00 PM</option>
                      <option>04:00 PM - 05:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Discussion Purpose
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932] text-[#334155]"
                >
                  <option>Social Welfare / People&apos;s Association Initiative</option>
                  <option>Media Interview / Janta Live News</option>
                  <option>Celebrity Bulaye / Event Partnership</option>
                  <option>Personal Meeting / Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Brief Agenda / Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us what you would like to discuss..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#b8863b] hover:bg-[#a37430] text-white text-xs font-semibold rounded-md shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Appointment</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

