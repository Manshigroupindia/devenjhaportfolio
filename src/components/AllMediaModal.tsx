import React from 'react';
import { X, ExternalLink, Calendar, Newspaper, Tv, Award } from 'lucide-react';

interface AllMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const allMediaArchive = [
  {
    title: 'Dainik Jagran',
    headline: 'Social Leader Deven Jha Inspires Youth in Community Service Drive',
    date: '12 Mar 2024',
    publication: 'Dainik Jagran National Edition',
    type: 'Print Newspaper',
    image: '/images/media-dainik-jagran.png',
  },
  {
    title: 'The Times of India',
    headline: "People's Association Expands Mission Across 15 States",
    date: '08 Feb 2024',
    publication: 'Times City Delhi',
    type: 'Print Newspaper',
    image: '/images/media-toi.png',
  },
  {
    title: 'India Today',
    headline: 'Devendra Kumar Jha: Architect of Ground-Level Social Transformation',
    date: '25 Jan 2024',
    publication: 'India Today Special Feature',
    type: 'Magazine Cover',
    image: '/images/media-india-today.png',
  },
  {
    title: 'Aaj Tak Live',
    headline: 'Special Interview on Grassroots Education & Healthcare in Rural India',
    date: '14 Jun 2024',
    publication: 'Aaj Tak Digital Broadcast',
    type: 'TV Interview',
    image: '/images/media-aaj-tak.png',
  },
];

export const AllMediaModal: React.FC<AllMediaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-[#ebdcc9] overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="bg-[#0e1b2b] text-white px-6 py-4 flex items-center justify-between border-b border-[#23354c] shrink-0">
          <div>
            <span className="text-[10.5px] font-bold tracking-[0.2em] text-[#b8863b] uppercase">
              Press &amp; Publications Archive
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold">
              Media Coverage &amp; Press Features
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#faf8f5]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allMediaArchive.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-4 border border-[#e2d6c5] shadow-xs flex flex-col sm:flex-row gap-4 items-center"
              >
                <div className="w-full sm:w-32 aspect-[4/3] rounded overflow-hidden bg-[#f3ede3] shrink-0 border border-[#eee2d2]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#b8863b] bg-[#f8f2e7] px-2 py-0.5 rounded">
                      {item.type}
                    </span>
                    <span className="text-[11px] text-gray-500">{item.date}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#111c2a] leading-snug mb-1">
                    {item.headline}
                  </h4>
                  <p className="text-xs text-[#64748b]">
                    {item.publication}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0e1b2b] text-white p-5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div>
              <h4 className="font-serif text-base font-bold text-white mb-0.5">
                Media &amp; Press Inquiries
              </h4>
              <p className="text-xs text-gray-300">
                For press releases, high-resolution media kits, or interview scheduling, please get in touch with our media desk.
              </p>
            </div>
            <a
              href="mailto:info@devenjha.com?subject=Press%20Inquiry%20-%20Deven%20Jha"
              className="shrink-0 px-4 py-2 bg-[#b8863b] hover:bg-[#a37430] text-white text-xs font-semibold rounded transition"
            >
              Contact Press Team
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
