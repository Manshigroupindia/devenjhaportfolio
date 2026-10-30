import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Copy, Check } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { useContactSettings } from '../hooks/useCMSContent.ts';

const indianStates = [
  'Delhi (NCR)',
  'Bihar',
  'Maharashtra',
  'Uttar Pradesh',
  'Haryana',
  'Punjab',
  'Rajasthan',
  'Madhya Pradesh',
  'West Bengal',
  'Karnataka',
  'Gujarat',
  'Tamil Nadu',
  'Telangana',
  'Jharkhand',
  'Uttarakhand',
  'Other State',
];

const purposeOptions = [
  'Social Initiative & NGO Collaboration',
  'Meeting & Personal Appointment',
  'Media, Press & TV Interview',
  'Celebrity Bulaye / Event Booking',
  'Janta Live News Query',
  'General Inquiry / Other',
];

export const ContactSection: React.FC = () => {
  const { data: contactSettings } = useContactSettings();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    state: '',
    purpose: '',
    message: '',
    honeypot: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot.trim() !== '') {
      setErrorMsg('Spam submission detected.');
      return;
    }

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const digitsOnly = formData.mobile.replace(/\D/g, '');
    if (!formData.mobile.trim() || digitsOnly.length < 10) {
      setErrorMsg('Please enter a valid mobile number (at least 10 digits).');
      return;
    }

    const refId = `DJ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(refId);
    setSubmitting(true);

    const submissionPayload = {
      id: refId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      state: formData.state || 'Not Specified',
      purpose: formData.purpose || 'General Inquiry',
      message: formData.message.trim(),
      referenceId: refId,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    try {
      // 1. Save to Firebase Firestore
      await setDoc(doc(db, 'contact_submissions', refId), submissionPayload);
    } catch (err) {
      console.warn('Firestore submission fallback notice:', err);
    }

    // 2. Also save to localStorage as backup
    try {
      const stored = localStorage.getItem('deven_jha_enquiries');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(submissionPayload);
      localStorage.setItem('deven_jha_enquiries', JSON.stringify(list));
    } catch (err) {
      console.warn('Could not persist enquiry to localStorage:', err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const handleCopyRef = () => {
    if (referenceId) {
      navigator.clipboard.writeText(referenceId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-[#fbf9f5] border-b border-[#ebdcc9]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="font-serif text-[26px] sm:text-[30px] font-bold text-[#111c2a] leading-tight mb-1">
            Get In Touch
          </h2>
          <p className="text-xs sm:text-[13.5px] text-[#64748b]">
            Every meaningful connection begins with a conversation.
          </p>
        </div>

        {/* Content Grid: Form (Left) & Contact Info + Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Side: Contact Form (approx 7 cols) */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-white rounded-xl p-8 border border-[#d6c7b3] shadow-sm text-center animate-fadeIn">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111c2a] mb-2">
                  Thank You for Reaching Out
                </h3>
                
                <p className="text-xs sm:text-sm text-[#4a5568] max-w-md mx-auto mb-6 leading-relaxed">
                  Your message has been successfully received by Deven Jha&apos;s executive office. We review all communications and will respond shortly.
                </p>

                {/* Reference ID Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f8f5ee] border border-[#dfd2be] rounded-lg mb-6">
                  <span className="text-xs text-[#6b7280]">Tracking Reference:</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#a87932]">
                    {referenceId}
                  </span>
                  <button
                    onClick={handleCopyRef}
                    className="p-1 text-[#6b7280] hover:text-[#a87932] transition-colors cursor-pointer"
                    title="Copy reference ID"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        mobile: '',
                        state: '',
                        purpose: '',
                        message: '',
                        honeypot: '',
                      });
                    }}
                    className="px-5 py-2.5 bg-[#a87932] hover:bg-[#946927] text-white text-xs font-semibold rounded-md shadow-xs transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Honeypot anti-spam field */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs">
                    {errorMsg}
                  </div>
                )}

                {/* Row 1: Name, Email, Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[11.5px] font-medium text-[#4a5568] mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 text-xs bg-[#fdfcf9] border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-medium text-[#4a5568] mb-1">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3 py-2 text-xs bg-[#fdfcf9] border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-medium text-[#4a5568] mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="+91 98765 00000"
                      className="w-full px-3 py-2 text-xs bg-[#fdfcf9] border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932] transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: State & Purpose */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11.5px] font-medium text-[#4a5568] mb-1">
                      Your State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-xs bg-[#fdfcf9] border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932] transition-colors"
                    >
                      <option value="">Select Your State</option>
                      {indianStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-medium text-[#4a5568] mb-1">
                      Purpose of Contact <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-xs bg-[#fdfcf9] border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932] transition-colors"
                    >
                      <option value="">Select Purpose</option>
                      {purposeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3: Message */}
                <div>
                  <label className="block text-[11.5px] font-medium text-[#4a5568] mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your thoughts, request or collaboration idea here..."
                    className="w-full px-3 py-2 text-xs bg-[#fdfcf9] border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932] transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#a87932] hover:bg-[#946927] active:scale-[0.98] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    <span>{submitting ? 'Submitting...' : 'Submit Message'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Side: Contact Information & Google Maps (approx 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Details Card */}
            <div>
              <h3 className="font-bold text-[13.5px] text-[#111c2a] uppercase tracking-wider mb-3">
                Contact Information
              </h3>
              <ul className="space-y-2 text-xs text-[#334155]">
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#a87932] shrink-0" />
                  <a href={`tel:${contactSettings.phone.replace(/\s+/g, '')}`} className="hover:text-[#a87932] transition-colors font-medium">
                    {contactSettings.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#a87932] shrink-0" />
                  <a href={`mailto:${contactSettings.email}`} className="hover:text-[#a87932] transition-colors font-medium">
                    {contactSettings.email}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#a87932] shrink-0" />
                  <span className="font-medium">{contactSettings.cityState}</span>
                </li>
              </ul>

              <div className="mt-4 pt-3 border-t border-[#ebdcc9]">
                <h4 className="font-bold text-[12px] text-[#111c2a] uppercase tracking-wide mb-1">
                  Office Location
                </h4>
                <p className="text-xs text-[#4a5568]">
                  {contactSettings.addressNote}
                </p>
                <p className="text-[11px] text-[#64748b] italic mt-1">
                  Hours: {contactSettings.officeHours}
                </p>
              </div>
            </div>

            {/* Google Map Card Preview */}
            <div className="rounded-xl overflow-hidden border border-[#d8cbba] shadow-sm bg-white relative group">
              <a
                href={contactSettings.mapsQueryUrl}
                target="_blank"
                rel="noreferrer"
                className="block relative overflow-hidden"
              >
                {contactSettings.mapsPreviewImage ? (
                  <img
                    src={contactSettings.mapsPreviewImage}
                    alt="Google Map Location - New Delhi"
                    className="w-full h-[140px] sm:h-[160px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-[140px] sm:h-[160px] bg-[#f0ede6] flex flex-col items-center justify-center text-[#7a8699] p-4 text-center">
                    <MapPin className="w-8 h-8 text-[#b8863b] mb-1" />
                    <span className="text-xs font-semibold text-[#14283B]">{contactSettings.cityState}</span>
                    <span className="text-[10px] text-[#7a8699]">Click to open Google Maps</span>
                  </div>
                )}
                
                {/* Overlay badge */}
                <div className="absolute top-2 left-2 bg-white/95 px-2.5 py-1 rounded shadow-sm text-[11px] font-semibold text-[#111c2a] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-600 fill-red-600" />
                  <span>{contactSettings.cityState.split(',')[0]}</span>
                </div>

                <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-0.5 rounded text-[10px] text-[#1e293b] font-medium shadow-xs">
                  View larger map
                </div>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
