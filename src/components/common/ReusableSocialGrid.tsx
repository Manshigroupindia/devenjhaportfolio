import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { OFFICIAL_SOCIAL_PROFILES, SocialProfile } from '../../config/socialLinks.tsx';

interface ReusableSocialGridProps {
  variant?: 'dropdown' | 'grid' | 'cards' | 'mobile';
  onItemClick?: () => void;
}

export const ReusableSocialGrid: React.FC<ReusableSocialGridProps> = ({
  variant = 'grid',
  onItemClick,
}) => {
  // Dropdown Variant
  if (variant === 'dropdown') {
    return (
      <div className="w-80 bg-white rounded-xl shadow-2xl border border-[#ebdcc9] p-4 text-[#14283B] animate-fadeIn">
        {/* Dropdown Header */}
        <div className="border-b border-[#f0e6d8] pb-3 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BD9256] block mb-0.5">
            LET&apos;S CONNECT
          </span>
          <h4 className="font-serif text-base font-bold text-[#14283B]">
            Let&apos;s Connect
          </h4>
          <p className="text-[11px] text-[#777777] mt-0.5">
            Stay connected and follow my journey.
          </p>
        </div>

        {/* Social Platforms List */}
        <div className="space-y-1.5">
          {OFFICIAL_SOCIAL_PROFILES.map((soc) => (
            <a
              key={soc.id}
              href={soc.url}
              target="_blank"
              rel="noreferrer"
              onClick={onItemClick}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-[#FAF8F5] transition-all duration-200 border border-transparent hover:border-[#ebdcc9]"
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
                  <span className="text-[10.5px] text-[#777777] group-hover:text-[#BD9256]/80 transition-colors">
                    {soc.handle}
                  </span>
                </div>
              </div>

              <div className="text-gray-400 group-hover:text-[#BD9256] transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>

        {/* Bottom subtle note */}
        <div className="mt-3 pt-2.5 border-t border-[#f0e6d8] text-center">
          <span className="text-[10px] text-[#94a3b8] font-medium">
            Opens official verified profile in new tab
          </span>
        </div>
      </div>
    );
  }

  // Mobile Menu Variant
  if (variant === 'mobile') {
    return (
      <div className="space-y-2 pt-1">
        <div className="px-1 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256] block">
            Let&apos;s Connect
          </span>
          <span className="text-xs text-[#777777]">
            Stay connected and follow my journey.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {OFFICIAL_SOCIAL_PROFILES.map((soc) => (
            <a
              key={soc.id}
              href={soc.url}
              target="_blank"
              rel="noreferrer"
              onClick={onItemClick}
              className="flex items-center gap-2.5 p-2 bg-[#FAF8F5] hover:bg-white rounded-lg border border-[#ebdcc9] transition-all"
            >
              <div
                className={`w-6 h-6 rounded-full ${soc.bgColor} flex items-center justify-center shrink-0`}
              >
                {soc.icon}
              </div>
              <span className="text-xs font-semibold text-[#14283B] line-clamp-1">
                {soc.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // Cards Variant (used in About Us)
  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {OFFICIAL_SOCIAL_PROFILES.map((soc) => (
          <a
            key={soc.id}
            href={soc.url}
            target="_blank"
            rel="noreferrer"
            className="group bg-[#F8F6F0] rounded-xl p-5 border border-[#ebdcc9] hover:border-[#BD9256] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-full ${soc.bgColor} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-200`}
                >
                  {soc.icon}
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#BD9256] transition-colors" />
              </div>

              <h3 className="font-bold text-[14px] text-[#14283B] group-hover:text-[#BD9256] transition-colors mb-0.5">
                {soc.name}
              </h3>
              <span className="text-xs font-semibold text-[#BD9256] block mb-2">
                {soc.handle}
              </span>

              <p className="text-[11px] text-[#777777] leading-relaxed">
                {soc.role}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#ebdcc9] flex items-center justify-between text-xs font-semibold text-[#14283B] group-hover:text-[#BD9256]">
              <span>Connect</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    );
  }

  // Default Grid Variant (used in Homepage "Connect With Me")
  return (
    <div className="grid grid-cols-3 gap-4">
      {OFFICIAL_SOCIAL_PROFILES.map((platform) => (
        <a
          key={platform.id}
          href={platform.url}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center group cursor-pointer"
        >
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${platform.bgColor} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-200 mb-1.5`}
          >
            {platform.icon}
          </div>
          <span className="text-[11.5px] font-medium text-[#334155] group-hover:text-[#a87932] transition-colors text-center line-clamp-1">
            {platform.name}
          </span>
        </a>
      ))}
    </div>
  );
};
