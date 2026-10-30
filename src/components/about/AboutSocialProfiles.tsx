import React from 'react';
import { Share2, ExternalLink, ArrowRight } from 'lucide-react';

const socialAccounts = [
  {
    name: 'Facebook',
    handle: '@Devenjha96',
    role: 'Official Updates & Community Drives',
    url: 'https://facebook.com/Devenjha96',
    bgColor: 'bg-[#1877F2]',
    icon: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    handle: '@devenjha96',
    role: 'Field Photography & Visual Stories',
    url: 'https://instagram.com/devenjha96',
    bgColor: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
    icon: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    handle: 'Janta Live News',
    role: 'Video Broadcasts & Interviews',
    url: 'https://www.youtube.com/c/jantalivenews/',
    bgColor: 'bg-[#FF0000]',
    icon: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    handle: 'Deven Jha',
    role: 'Professional Network & Leadership',
    url: 'https://linkedin.com/in/devenjha',
    bgColor: 'bg-[#0077B5]',
    icon: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    handle: '@Devenjha96',
    role: 'Thoughts, Statements & Current Affairs',
    url: 'https://x.com/Devenjha96',
    bgColor: 'bg-[#000000]',
    icon: (
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export const AboutSocialProfiles: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#FFFFFF] border-b border-[#ebdcc9]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <Share2 className="w-4 h-4 text-[#BD9256]" />
            <span className="text-[11px] sm:text-[11.5px] font-bold tracking-[0.22em] text-[#BD9256] uppercase">
              COMMUNITY CHANNELS
            </span>
          </div>
          <h2 className="font-serif text-[30px] sm:text-[36px] font-bold text-[#14283B] leading-tight mb-2">
            Stay Connected With Me
          </h2>
          <p className="text-xs sm:text-[14px] text-[#777777]">
            Follow my journey, initiatives and activities across social platforms.
          </p>
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {socialAccounts.map((soc) => (
            <a
              key={soc.name}
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

      </div>
    </section>
  );
};
