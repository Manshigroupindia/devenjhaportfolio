import React from 'react';
import {
  Users,
  Tv,
  Film,
  Star,
  LayoutGrid,
  Building,
  Briefcase,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { ReusableSocialGrid } from './common/ReusableSocialGrid.tsx';
import { useBusinesses } from '../hooks/useCMSContent.ts';
import { BusinessDoc } from '../types/cms.ts';

const defaultBusinessVentures = [
  {
    id: 'peoples-association',
    name: "People's Association",
    category: 'Social Welfare & NGO',
    iconName: 'Users',
    url: 'https://peoplesassociation.org',
  },
  {
    id: 'janta-live',
    name: 'Janta Live',
    category: 'News & Media',
    iconName: 'Tv',
    url: 'https://www.youtube.com/c/jantalivenews/',
  },
  {
    id: 'production-house',
    name: 'Production House',
    category: 'Media Production',
    iconName: 'Film',
    url: '#',
  },
  {
    id: 'celebrity-bulaye',
    name: 'Celebrity Bulaye',
    category: 'Celebrity Booking & Management',
    iconName: 'Star',
    url: 'https://celebritybulaye.com',
  },
  {
    id: 'more-businesses',
    name: 'More Businesses',
    category: 'Additional Ventures',
    iconName: 'LayoutGrid',
    url: '#',
  },
];

export const MyBusiness: React.FC = () => {
  const { data: remoteBusinesses } = useBusinesses(true);
  const businesses = remoteBusinesses && remoteBusinesses.length ? remoteBusinesses : defaultBusinessVentures;

  const renderIcon = (name?: string) => {
    switch (name) {
      case 'Users':
        return <Users className="w-5 h-5 text-teal-600" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-red-600" />;
      case 'Film':
        return <Film className="w-5 h-5 text-cyan-700" />;
      case 'Star':
        return <Star className="w-5 h-5 text-blue-600 fill-blue-600" />;
      case 'Building':
        return <Building className="w-5 h-5 text-amber-700" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-purple-700" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-emerald-600" />;
      case 'LayoutGrid':
      default:
        return <LayoutGrid className="w-5 h-5 text-indigo-600" />;
    }
  };

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

            {/* Business Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-3.5">
              {businesses.map((biz: any) => (
                <div
                  key={biz.id}
                  className="group bg-white rounded-lg p-3.5 border border-[#e8ded0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between items-center text-center hover:border-[#b8863b]"
                >
                  <div className="w-10 h-10 rounded-full bg-[#f8f4ed] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    {biz.logoUrl ? (
                      <img src={biz.logoUrl} alt={biz.name} className="w-6 h-6 object-contain" />
                    ) : (
                      renderIcon(biz.iconName)
                    )}
                  </div>

                  <div className="mb-3">
                    <h3 className="font-bold text-[12px] sm:text-[12.5px] text-[#111c2a] group-hover:text-[#a87932] transition-colors line-clamp-1 mb-0.5">
                      {biz.name}
                    </h3>
                    <p className="text-[10px] text-[#64748b] line-clamp-2 leading-snug">
                      {biz.category}
                    </p>
                  </div>

                  {biz.url && biz.url.startsWith('http') ? (
                    <a
                      href={biz.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#a87932] group-hover:text-[#8b6122] transition-colors mt-auto"
                    >
                      <span>Visit Website</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <button
                      onClick={() =>
                        alert(
                          `${biz.name}: Official dedicated portal is under expansion. For commercial and media inquiries, please connect via our Contact Us page.`
                        )
                      }
                      className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#a87932] group-hover:text-[#8b6122] transition-colors mt-auto cursor-pointer"
                    >
                      <span>Inquire Details</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
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

            {/* Social Grid */}
            <ReusableSocialGrid variant="grid" />
          </div>

        </div>

      </div>
    </section>
  );
};
