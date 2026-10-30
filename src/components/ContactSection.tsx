import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    state: '',
    purpose: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    setSubmitted(true);
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Side: Contact Form (approx 7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-xl border border-[#ebdcc9] shadow-sm">
            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mb-3" />
                <h3 className="font-serif text-xl font-bold text-[#111c2a] mb-2">
                  Thank You for Reaching Out!
                </h3>
                <p className="text-sm text-[#4a5568] max-w-md mb-6">
                  Your message has been successfully received. Deven Jha&apos;s team will review your inquiry and get in touch with you shortly.
                </p>
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
                    });
                  }}
                  className="px-5 py-2 bg-[#a87932] hover:bg-[#946927] text-white text-xs font-semibold rounded-md transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
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
                      className="w-full px-3 py-2 text-xs bg-[#fdfcf9] border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932] transition-colors text-[#334155]"
                    >
                      <option value="">Select State</option>
                      {indianStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-medium text-[#4a5568] mb-1">
                      Select Purpose <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-xs bg-[#fdfcf9] border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932] transition-colors text-[#334155]"
                    >
                      <option value="">Select Purpose</option>
                      {purposeOptions.map((pur) => (
                        <option key={pur} value={pur}>
                          {pur}
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
                    rows={3}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Briefly describe your request, event, or initiative..."
                    className="w-full px-3 py-2 text-xs bg-[#fdfcf9] border border-[#d9ccb9] rounded-md focus:outline-none focus:border-[#a87932] transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#a87932] hover:bg-[#946927] active:scale-[0.98] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <span>Submit Message</span>
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
                  <a href="tel:+919876543210" className="hover:text-[#a87932] transition-colors font-medium">
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#a87932] shrink-0" />
                  <a href="mailto:info@devenjha.com" className="hover:text-[#a87932] transition-colors font-medium">
                    info@devenjha.com
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#a87932] shrink-0" />
                  <span className="font-medium">New Delhi, India</span>
                </li>
              </ul>

              <div className="mt-4 pt-3 border-t border-[#ebdcc9]">
                <h4 className="font-bold text-[12px] text-[#111c2a] uppercase tracking-wide mb-1">
                  Office Location
                </h4>
                <p className="text-xs text-[#4a5568]">
                  New Delhi, India
                </p>
                <p className="text-[11px] text-[#64748b] italic">
                  (Exact address available on request)
                </p>
              </div>
            </div>

            {/* Google Map Card Preview */}
            <div className="rounded-xl overflow-hidden border border-[#d8cbba] shadow-sm bg-white relative group">
              <a
                href="https://maps.google.com/?q=New+Delhi"
                target="_blank"
                rel="noreferrer"
                className="block relative overflow-hidden"
              >
                <img
                  src="/images/map-preview.png"
                  alt="Google Map Location - New Delhi"
                  className="w-full h-[140px] sm:h-[160px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay badge */}
                <div className="absolute top-2 left-2 bg-white/95 px-2.5 py-1 rounded shadow-sm text-[11px] font-semibold text-[#111c2a] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-600 fill-red-600" />
                  <span>New Delhi</span>
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
