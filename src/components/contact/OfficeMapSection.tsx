import React from 'react';
import { MapPin, Navigation, Compass, Building2, Train, Car } from 'lucide-react';
import { useContactSettings } from '../../hooks/useCMSContent.ts';

export const OfficeMapSection: React.FC = () => {
  const { data: contactSettings } = useContactSettings();
  const locationLabel = contactSettings.addressNote || contactSettings.cityState || 'New Delhi, India';
  const directionsUrl =
    contactSettings.mapsQueryUrl ||
    `https://maps.google.com/?q=${encodeURIComponent(locationLabel)}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(locationLabel)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5] border-t border-b border-[#ebdcc9]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#ebdcc9] shadow-xs mb-3">
            <Compass className="w-3.5 h-3.5 text-[#BD9256]" />
            <span className="text-[10.5px] font-bold tracking-[0.2em] text-[#BD9256] uppercase">
              LOCATION &amp; ACCESS
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#14283B] mb-2 tracking-tight">
            Find Our Office
          </h2>
          <p className="text-sm sm:text-base text-[#777777] leading-relaxed">
            Visit us or get directions to our office in the capital city. Prior appointment is recommended for all in-person meetings.
          </p>
        </div>

        {/* Map & Office Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive Google Map iframe (8 cols on lg) */}
          <div className="lg:col-span-8 bg-white rounded-2xl overflow-hidden border border-[#ebdcc9] shadow-md relative min-h-[360px] sm:min-h-[420px] flex flex-col">
            <iframe
              title="Deven Jha Office Location - New Delhi"
              src={embedMapUrl}
              className="w-full h-full flex-1 border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Map bottom bar */}
            <div className="bg-white/95 backdrop-blur-sm border-t border-[#ebdcc9] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#BD9256] shrink-0" />
                <span className="font-semibold text-[#14283B]">
                  {locationLabel}
                </span>
              </div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#BD9256] hover:text-[#946927] transition-colors"
              >
                <span>Open in Google Maps</span>
                <Navigation className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Office Detail Card (4 cols on lg) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 sm:p-7 border border-[#ebdcc9] shadow-md flex flex-col justify-between">
            <div className="space-y-6">
              
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256] block mb-1">
                  CENTRAL HEADQUARTERS
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#14283B] mb-2">
                  {contactSettings.cityState ? `${contactSettings.cityState.split('/')[0].split(',')[0].trim()} Office` : 'Executive Office'}
                </h3>
                <p className="text-xs text-[#777777] leading-relaxed">
                  Headquarters coordinating nationwide social initiatives, media affairs, youth development and enterprise activities.
                </p>
              </div>

              {/* Location Badge */}
              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#ebdcc9]">
                <div className="flex items-start gap-2.5">
                  <Building2 className="w-4 h-4 text-[#BD9256] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-[#14283B] block">
                      {locationLabel}
                    </span>
                    <span className="text-[11px] text-[#888888] italic block mt-0.5">
                      Visiting hours: {contactSettings.officeHours || 'Monday – Saturday: 10:00 AM – 6:00 PM IST'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transit & Commute Highlights */}
              <div className="space-y-3">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#14283B] block">
                  Transit &amp; Accessibility
                </span>

                <div className="flex items-center gap-3 text-xs text-[#555555]">
                  <div className="w-7 h-7 rounded-md bg-[#FAF8F5] border border-[#ebdcc9] flex items-center justify-center shrink-0 text-[#BD9256]">
                    <Train className="w-3.5 h-3.5" />
                  </div>
                  <span>Delhi Metro network connectivity across central lines</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#555555]">
                  <div className="w-7 h-7 rounded-md bg-[#FAF8F5] border border-[#ebdcc9] flex items-center justify-center shrink-0 text-[#BD9256]">
                    <Car className="w-3.5 h-3.5" />
                  </div>
                  <span>Direct road connectivity from IGI Airport &amp; Central Delhi</span>
                </div>
              </div>

            </div>

            {/* Get Directions CTA Button */}
            <div className="pt-6 border-t border-[#f0e6d8] mt-6">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#14283B] hover:bg-[#1e3852] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors duration-200"
              >
                <Navigation className="w-4 h-4 text-[#BD9256]" />
                <span>Get Directions</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

