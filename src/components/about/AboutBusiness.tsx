import React from 'react';
import {
  Users,
  Tv,
  Film,
  Star,
  LayoutGrid,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

interface BusinessItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  url: string;
}

const businessVentures: BusinessItem[] = [
  {
    id: 'peoples-association',
    name: "People's Association",
    category: 'Social Welfare & NGO',
    description: 'National NGO working across 15 states in education, healthcare, and food assistance.',
    icon: <Users className="w-5 h-5 text-teal-600" />,
    url: 'https://peoplesassociation.org',
  },
  {
    id: 'janta-live',
    name: 'Janta Live',
    category: 'News & Media',
    description: 'Digital news and media broadcasting network delivering ground-level public interest journalism.',
    icon: <Tv className="w-5 h-5 text-red-600" />,
    url: 'https://www.youtube.com/c/jantalivenews/',
  },
  {
    id: 'production-house',
    name: 'Production House',
    category: 'Media Production',
    description: 'Content creation, video documentaries, event audio-visuals, and digital production solutions.',
    icon: <Film className="w-5 h-5 text-cyan-700" />,
    url: '#',
  },
  {
    id: 'celebrity-bulaye',
    name: 'Celebrity Bulaye',
    category: 'Celebrity Booking & Management',
    description: 'Artist coordination, VIP appearances, celebrity management, and high-profile event engagements.',
    icon: <Star className="w-5 h-5 text-blue-600 fill-blue-600" />,
    url: 'https://celebritybulaye.com',
  },
  {
    id: 'more-businesses',
    name: 'More Businesses',
    category: 'Additional Ventures',
    description: 'Consultancy, strategic enterprise development, and cross-sector commercial collaborations.',
    icon: <LayoutGrid className="w-5 h-5 text-indigo-600" />,
    url: '#',
  },
];

export const AboutBusiness: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#F8F6F0] border-b border-[#ebdcc9]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-[#BD9256]" />
            <span className="text-[11px] sm:text-[11.5px] font-bold tracking-[0.22em] text-[#BD9256] uppercase">
              ENTREPRENEURIAL VENTURES
            </span>
          </div>
          <h2 className="font-serif text-[30px] sm:text-[36px] font-bold text-[#14283B] leading-tight mb-2">
            Beyond Social Work – <br />
            <span className="font-serif italic text-[#BD9256]">My Entrepreneurial Journey</span>
          </h2>
          <p className="text-xs sm:text-[14px] text-[#777777]">
            Alongside social initiatives, I have been associated with ventures across media, entertainment and business.
          </p>
        </div>

        {/* 5 Premium Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {businessVentures.map((biz) => (
            <div
              key={biz.id}
              className="group bg-white rounded-xl p-5 border border-[#e8ded0] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:border-[#BD9256]"
            >
              <div>
                <div className="w-11 h-11 rounded-lg bg-[#F8F6F0] border border-[#e5d8c6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  {biz.icon}
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256] block mb-1">
                  {biz.category}
                </span>

                <h3 className="font-bold text-[14px] text-[#14283B] group-hover:text-[#BD9256] transition-colors mb-2 leading-snug">
                  {biz.name}
                </h3>

                <p className="text-xs text-[#777777] leading-relaxed mb-4">
                  {biz.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#f0e8dc]">
                <a
                  href={biz.url}
                  target={biz.url.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#BD9256] group-hover:text-[#966b2b] transition-colors"
                >
                  <span>Visit Website</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

