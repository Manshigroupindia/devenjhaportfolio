import React from 'react';
import {
  Users,
  Tv,
  Film,
  Star,
  LayoutGrid,
  ArrowRight,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface BusinessItem {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  url: string;
}

const businessVentures: BusinessItem[] = [
  {
    id: 'peoples-association',
    name: "People's Association",
    category: 'Social Welfare & NGO',
    icon: <Users className="w-5 h-5 text-teal-600" />,
    url: 'https://peoplesassociation.org',
  },
  {
    id: 'janta-live',
    name: 'Janta Live',
    category: 'News & Media',
    icon: <Tv className="w-5 h-5 text-red-600" />,
    url: 'https://www.youtube.com/c/jantalivenews/',
  },
  {
    id: 'production-house',
    name: 'Production House',
    category: 'Media Production',
    icon: <Film className="w-5 h-5 text-cyan-700" />,
    url: '#',
  },
  {
    id: 'celebrity-bulaye',
    name: 'Celebrity Bulaye',
    category: 'Celebrity Booking & Management',
    icon: <Star className="w-5 h-5 text-blue-600 fill-blue-600" />,
    url: 'https://celebritybulaye.com',
  },
  {
    id: 'more-businesses',
    name: 'More Businesses',
    category: 'Additional Ventures',
    icon: <LayoutGrid className="w-5 h-5 text-indigo-600" />,
    url: '#',
  },
];

const socialProfiles = [
  {
    name: 'Facebook',
    handle: '@Devenjha96',
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
    url: 'https://instagram.com/devenjha96',
    bgColor: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
    icon: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Youtube',
    handle: 'Janta Live',
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
    url: 'https://linkedin.com/in/devenjha',
    bgColor: 'bg-[#0077B5]',
    icon: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: 'X',
    handle: '@Devenjha96',
    url: 'https://x.com/Devenjha96',
    bgColor: 'bg-[#000000]',
    icon: (
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Other',
    handle: 'Portals',
    url: '#businesses',
    bgColor: 'bg-[#2d3748]',
    icon: <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />,
  },
];

export const MyBusiness: React.FC = () => {
  return (
    <section id="businesses" className="py-16 sm:py-20 bg-[#faf8f5] border-b border-[#ebdcc9]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* Left Side: My Business (approx 8 cols) */}
          <div className="lg:col-span-8">
            <div className="mb-6">
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.2em] text-[#a87932] uppercase block mb-1">
                MY BUSINESS
              </span>
              <h2 className="font-serif text-[24px] sm:text-[28px] lg:text-[30px] font-bold text-[#111c2a] leading-tight mb-1">
                Entrepreneurship Beyond Boundaries
              </h2>
              <p className="text-xs sm:text-[13.5px] text-[#64748b]">
                Building ventures that connect people, ideas, media and opportunities.
              </p>
            </div>

            {/* Business Cards Row (5 cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-3.5">
              {businessVentures.map((biz) => (
                <div
                  key={biz.id}
                  className="group bg-white rounded-lg p-3.5 border border-[#e8ded0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between items-center text-center hover:border-[#b8863b]"
                >
                  <div className="w-10 h-10 rounded-full bg-[#f8f4ed] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    {biz.icon}
                  </div>

                  <div className="mb-3">
                    <h3 className="font-bold text-[12px] sm:text-[12.5px] text-[#111c2a] group-hover:text-[#a87932] transition-colors line-clamp-1 mb-0.5">
                      {biz.name}
                    </h3>
                    <p className="text-[10px] text-[#64748b] line-clamp-2 leading-snug">
                      {biz.category}
                    </p>
                  </div>

                  <a
                    href={biz.url}
                    target={biz.url.startsWith('http') ? '_blank' : '_self'}
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#a87932] group-hover:text-[#8b6122] transition-colors mt-auto"
                  >
                    <span>Visit Website</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Connect With Me (approx 4 cols) */}
          <div id="social" className="lg:col-span-4 lg:pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#111c2a]">
                Connect With Me
              </h3>
              <a
                href="#businesses"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748b] hover:text-[#a87932] transition-colors"
              >
                <span>View All Businesses</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-[#64748b] mb-6">
              Follow for latest updates and stay connected.
            </p>

            {/* Social Grid (6 icons: 3 columns x 2 rows) */}
            <div className="grid grid-cols-3 gap-4">
              {socialProfiles.map((platform) => (
                <a
                  key={platform.name}
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
                  <span className="text-[11.5px] font-medium text-[#334155] group-hover:text-[#a87932] transition-colors">
                    {platform.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

