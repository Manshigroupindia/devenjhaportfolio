import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { OFFICIAL_SOCIAL_PROFILES } from '../../config/socialLinks.tsx';
import { useContactSettings, useSocialProfiles } from '../../hooks/useCMSContent.ts';

export const ContactInfo: React.FC = () => {
  const { data: contactSettings } = useContactSettings();
  const { data: remoteSocials } = useSocialProfiles(true);
  const socialList = remoteSocials && remoteSocials.length ? remoteSocials : OFFICIAL_SOCIAL_PROFILES;

  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(key);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Primary Contact Cards Box */}
      <div className="bg-[#14283B] text-white rounded-2xl p-6 sm:p-8 lg:p-9 shadow-lg relative overflow-hidden border border-[#1e3b56]">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#BD9256]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#BD9256] uppercase block mb-1">
            DIRECT TOUCHPOINTS
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
            Contact Information
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
            Reach out via phone, email or connect directly with our office for press, philanthropic or leadership inquiries.
          </p>

          <div className="space-y-4">
            {/* Phone Item */}
            <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-[#1b344d]/80 border border-[#2b4c6e] hover:border-[#BD9256]/60 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#BD9256]/20 border border-[#BD9256]/40 flex items-center justify-center shrink-0 text-[#BD9256] mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256] block">
                    Phone &amp; WhatsApp
                  </span>
                  <a
                    href={`tel:${contactSettings.phone.replace(/\s+/g, '')}`}
                    className="text-sm sm:text-base font-semibold text-white hover:text-[#BD9256] transition-colors inline-block"
                  >
                    {contactSettings.phone}
                  </a>
                  <span className="block text-[11px] text-gray-400 mt-0.5">
                    {contactSettings.officeHours}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCopy(contactSettings.phone, 'phone')}
                className="p-2 rounded-md hover:bg-[#254566] text-gray-400 hover:text-white transition"
                title="Copy phone number"
              >
                {copiedItem === 'phone' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Email Item */}
            <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-[#1b344d]/80 border border-[#2b4c6e] hover:border-[#BD9256]/60 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#BD9256]/20 border border-[#BD9256]/40 flex items-center justify-center shrink-0 text-[#BD9256] mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256] block">
                    Official Email
                  </span>
                  <a
                    href={`mailto:${contactSettings.email}`}
                    className="text-sm sm:text-base font-semibold text-white hover:text-[#BD9256] transition-colors inline-block"
                  >
                    {contactSettings.email}
                  </a>
                  <span className="block text-[11px] text-gray-400 mt-0.5">
                    Inquiries, press &amp; collaborations
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCopy(contactSettings.email, 'email')}
                className="p-2 rounded-md hover:bg-[#254566] text-gray-400 hover:text-white transition"
                title="Copy email address"
              >
                {copiedItem === 'email' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Location Item */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#1b344d]/80 border border-[#2b4c6e]">
              <div className="w-10 h-10 rounded-lg bg-[#BD9256]/20 border border-[#BD9256]/40 flex items-center justify-center shrink-0 text-[#BD9256] mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256] block">
                  Office Location
                </span>
                <span className="text-sm sm:text-base font-semibold text-white block">
                  {contactSettings.cityState}
                </span>
                <span className="block text-[11px] text-[#BD9256]/90 mt-0.5 italic">
                  {contactSettings.addressNote}
                </span>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#162a3e] border border-[#233d59]">
              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 text-gray-300 mt-0.5">
                <Clock className="w-5 h-5 text-[#BD9256]" />
              </div>
              <div className="text-xs text-gray-300 space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256] block">
                  Working Hours
                </span>
                <p className="font-medium text-white">
                  {contactSettings.officeHours}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Social Profiles Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#ebdcc9] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BD9256] block">
              VERIFIED CHANNELS
            </span>
            <h4 className="font-serif text-lg font-bold text-[#14283B]">
              Connect Across Social Media
            </h4>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#14283B] bg-[#faf8f5] px-2.5 py-1 rounded-md border border-[#ebdcc9]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#BD9256]" />
            Official
          </div>
        </div>

        <p className="text-xs text-[#777777] mb-4">
          Follow verified handles for real-time field updates, philanthropic drives, media videos and thought leadership.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {OFFICIAL_SOCIAL_PROFILES.map((soc) => (
            <a
              key={soc.id}
              href={soc.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-white border border-[#ebdcc9] hover:border-[#BD9256] transition-all duration-200 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full ${soc.bgColor} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                >
                  {soc.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#14283B] group-hover:text-[#BD9256] transition-colors block leading-tight">
                    {soc.name}
                  </span>
                  <span className="text-[10px] text-[#777777] block">
                    {soc.handle}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#BD9256] transition-colors shrink-0 mr-1" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

