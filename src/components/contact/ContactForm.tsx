import React, { useState } from 'react';
import {
  Send,
  User,
  Mail,
  Phone,
  HelpCircle,
  FileText,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';

export const PURPOSE_OPTIONS = [
  'General Enquiry',
  'Social Work / NGO',
  'Business Collaboration',
  'Media & Interview',
  'Celebrity Booking',
  'Appointment Request',
  'Other',
] as const;

export type PurposeType = (typeof PURPOSE_OPTIONS)[number];

interface ContactFormProps {
  defaultPurpose?: string;
  onSuccess?: (referenceId: string) => void;
}

interface SubmittedData {
  referenceId: string;
  fullName: string;
  email: string;
  mobile: string;
  purpose: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  defaultPurpose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    purpose: defaultPurpose || '',
    subject: '',
    message: '',
    honeypot: '', // Spam defense
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Spam bot honeypot check
    if (formData.honeypot.trim() !== '') {
      newErrors.general = 'Spam submission detected.';
      setErrors(newErrors);
      return false;
    }

    // Full name check
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.';
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Mobile check (at least 10 digits)
    const digitsOnly = formData.mobile.replace(/\D/g, '');
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required.';
    } else if (digitsOnly.length < 10) {
      newErrors.mobile = 'Please enter a valid phone number (at least 10 digits).';
    }

    // Purpose check
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Please select the purpose of your enquiry.';
    }

    // Message check
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a message with at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Simulate realistic processing / persistence delay
      await new Promise((resolve) => setTimeout(resolve, 650));

      // Generate verified enquiry reference
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const referenceId = `DJ-${new Date().getFullYear()}-${randomSuffix}`;
      const nowIso = new Date().toISOString();

      const newEnquiry: SubmittedData = {
        referenceId,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        purpose: formData.purpose,
        subject: formData.subject.trim() || 'General Inquiry',
        message: formData.message.trim(),
        submittedAt: nowIso,
      };

      // Persist to localStorage for client-side persistence
      try {
        const stored = localStorage.getItem('deven_jha_enquiries');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newEnquiry);
        localStorage.setItem('deven_jha_enquiries', JSON.stringify(list));
      } catch (err) {
        console.warn('Could not persist enquiry to localStorage:', err);
      }

      setSubmittedData(newEnquiry);
      if (onSuccess) {
        onSuccess(referenceId);
      }
    } catch {
      setErrors({
        general: 'An unexpected error occurred while sending your message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (submittedData?.referenceId) {
      navigator.clipboard.writeText(submittedData.referenceId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleResetForm = () => {
    setSubmittedData(null);
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      purpose: defaultPurpose || '',
      subject: '',
      message: '',
      honeypot: '',
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ebdcc9] p-6 sm:p-8 lg:p-10 shadow-md">
      {/* Header */}
      <div className="mb-6">
        <span className="text-[11px] font-bold tracking-[0.2em] text-[#BD9256] uppercase block mb-1">
          DIRECT COMMUNICATION
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14283B]">
          Send Me A Message
        </h2>
        <p className="text-sm text-[#777777] mt-1.5 leading-relaxed">
          Share your thoughts, requests or collaboration ideas. Every message is reviewed personally by our office.
        </p>
      </div>

      {/* Success State */}
      {submittedData ? (
        <div className="bg-[#FAF8F5] border border-[#ebdcc9] rounded-xl p-6 sm:p-8 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-[#14283B] text-[#BD9256] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#BD9256] block mb-1">
            ENQUIRY SUBMITTED SUCCESSFULLY
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#14283B] mb-2">
            Thank You, {submittedData.fullName}!
          </h3>
          <p className="text-sm text-[#555555] max-w-md mx-auto mb-6 leading-relaxed">
            Your message regarding <span className="font-semibold text-[#14283B]">&quot;{submittedData.purpose}&quot;</span> has been received. Our team will review your inquiry and respond within 24 to 48 business hours.
          </p>

          {/* Reference Badge */}
          <div className="inline-flex items-center gap-3 bg-white px-4 py-2.5 rounded-lg border border-[#ebdcc9] shadow-xs mb-6">
            <div className="text-left">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">
                Enquiry Reference ID
              </span>
              <span className="font-mono text-sm font-bold text-[#14283B]">
                {submittedData.referenceId}
              </span>
            </div>
            <button
              onClick={handleCopyReference}
              className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-[#BD9256] transition"
              title="Copy Reference ID"
            >
              {copiedRef ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div>
            <button
              onClick={handleResetForm}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#14283B] hover:bg-[#1e3852] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              Send Another Message
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Honeypot field for spam bots (hidden from humans) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website_check">Leave this field blank</label>
            <input
              type="text"
              id="website_check"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              value={formData.honeypot}
              onChange={handleChange}
            />
          </div>

          {/* General submission error banner */}
          {errors.general && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Row 1: Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-bold uppercase tracking-wider text-[#14283B] mb-1.5"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#faf8f5] text-[#14283B] rounded-lg border transition-colors outline-none focus:bg-white ${
                    errors.fullName
                      ? 'border-red-400 focus:border-red-500 ring-1 ring-red-300'
                      : 'border-[#ebdcc9] focus:border-[#BD9256]'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-[11px] text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-[#14283B] mb-1.5"
              >
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="e.g. rajesh@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#faf8f5] text-[#14283B] rounded-lg border transition-colors outline-none focus:bg-white ${
                    errors.email
                      ? 'border-red-400 focus:border-red-500 ring-1 ring-red-300'
                      : 'border-[#ebdcc9] focus:border-[#BD9256]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Row 2: Mobile Number & Purpose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="mobile"
                className="block text-xs font-bold uppercase tracking-wider text-[#14283B] mb-1.5"
              >
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#faf8f5] text-[#14283B] rounded-lg border transition-colors outline-none focus:bg-white ${
                    errors.mobile
                      ? 'border-red-400 focus:border-red-500 ring-1 ring-red-300'
                      : 'border-[#ebdcc9] focus:border-[#BD9256]'
                  }`}
                />
              </div>
              {errors.mobile && (
                <p className="mt-1 text-[11px] text-red-600">{errors.mobile}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="purpose"
                className="block text-xs font-bold uppercase tracking-wider text-[#14283B] mb-1.5"
              >
                Purpose <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <select
                  id="purpose"
                  name="purpose"
                  required
                  value={formData.purpose}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-[#faf8f5] text-[#14283B] rounded-lg border transition-colors outline-none focus:bg-white appearance-none cursor-pointer ${
                    errors.purpose
                      ? 'border-red-400 focus:border-red-500 ring-1 ring-red-300'
                      : 'border-[#ebdcc9] focus:border-[#BD9256]'
                  }`}
                >
                  <option value="" disabled>
                    Select Purpose
                  </option>
                  {PURPOSE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-xs">
                  ▼
                </div>
              </div>
              {errors.purpose && (
                <p className="mt-1 text-[11px] text-red-600">{errors.purpose}</p>
              )}
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <label
              htmlFor="subject"
              className="block text-xs font-bold uppercase tracking-wider text-[#14283B] mb-1.5"
            >
              Subject <span className="text-gray-400 font-normal text-[11px]">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FileText className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Brief subject of your message"
                value={formData.subject}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#faf8f5] text-[#14283B] rounded-lg border border-[#ebdcc9] focus:border-[#BD9256] transition-colors outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-bold uppercase tracking-wider text-[#14283B] mb-1.5"
            >
              Message <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder="Write your detailed message, request, or proposal here..."
                value={formData.message}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#faf8f5] text-[#14283B] rounded-lg border transition-colors outline-none focus:bg-white resize-y ${
                  errors.message
                    ? 'border-red-400 focus:border-red-500 ring-1 ring-red-300'
                    : 'border-[#ebdcc9] focus:border-[#BD9256]'
                }`}
              />
            </div>
            {errors.message && (
              <p className="mt-1 text-[11px] text-red-600">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 px-8 py-3.5 bg-[#BD9256] hover:bg-[#a87932] disabled:bg-gray-400 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
