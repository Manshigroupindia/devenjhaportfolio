import React from 'react';
import {
  Users,
  Tv,
  Film,
  Star,
  LayoutGrid,
  ArrowRight,
  Briefcase,
  Building,
  Globe,
} from 'lucide-react';
import { useBusinesses } from '../../hooks/useCMSContent.ts';
import { defaultBusinesses } from '../../services/defaultData.ts';
import { BusinessDoc } from '../../types/cms.ts';

export const AboutBusiness: React.FC = () => {
  const { data: remoteBusinesses } = useBusinesses(true);
  const businesses: BusinessDoc[] = remoteBusinesses && remoteBusinesses.length ? remoteBusinesses : defaultBusinesses;

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
          {businesses.map((biz) => (
            <div
              key={biz.id}
              className="group bg-white rounded-xl p-5 border border-[#e8ded0] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:border-[#BD9256]"
            >
              <div>
                <div className="w-11 h-11 rounded-lg bg-[#F8F6F0] border border-[#e5d8c6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  {biz.logoUrl ? (
                    <img src={biz.logoUrl} alt={biz.name} className="w-6 h-6 object-contain" />
                  ) : (
                    renderIcon(biz.iconName)
                  )}
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256] block mb-1">
                  {biz.category}
                </span>

                <h3 className="font-bold text-[14px] text-[#14283B] group-hover:text-[#BD9256] transition-colors mb-2 leading-snug">
                  {biz.name}
                </h3>
              </div>

              <div className="pt-3 border-t border-[#f0e8dc] mt-4">
                {biz.url && biz.url.startsWith('http') ? (
                  <a
                    href={biz.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#BD9256] group-hover:text-[#966b2b] transition-colors"
                  >
                    <span>Visit Website</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <button
                    onClick={() =>
                      alert(
                        `${biz.name}: Dedicated portal is expanding. For commercial and media inquiries, please connect via our Contact Us page.`
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#BD9256] group-hover:text-[#966b2b] transition-colors cursor-pointer"
                  >
                    <span>Inquire Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
