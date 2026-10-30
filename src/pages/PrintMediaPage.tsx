import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Newspaper,
  Calendar,
  ExternalLink,
  ArrowLeft,
  Eye,
  Maximize2,
  FileText,
} from 'lucide-react';
import { ImageLightbox, PrintMediaItem } from '../components/media/ImageLightbox.tsx';

const printMediaData: PrintMediaItem[] = [
  {
    id: 'dainik-jagran-1',
    image: '/images/media-dainik-jagran.png',
    title: 'Social Leader Deven Jha Inspires Youth in Community Service Drive',
    publication: 'Dainik Jagran National',
    date: '12 Mar 2024',
    category: 'National Daily',
    description:
      'Coverage highlighting the expansion of grassroots education and winter relief distributions organized under People\'s Association across North India.',
    clippingSnippet: 'दैनिक जागरण: युवाओं को समाज सेवा और आत्मनिर्भरता की राह दिखाते देवेन्द्र कुमार झा।',
  },
  {
    id: 'times-of-india-1',
    image: '/images/media-toi.png',
    title: "People's Association Expands Mission Across 15 States",
    publication: 'The Times of India (Delhi)',
    date: '08 Feb 2024',
    category: 'National Daily',
    description:
      'Feature report detailing Deven Jha\'s two-decade dedication to underprivileged welfare, health camps, and free scholastic materials for children.',
    clippingSnippet: 'The Times of India: Driving social cohesion and educational equality from Delhi to 15 states.',
  },
  {
    id: 'india-today-1',
    image: '/images/media-india-today.png',
    title: 'Architect of Ground-Level Social Transformation',
    publication: 'India Today Magazine',
    date: '25 Jan 2024',
    category: 'Magazine',
    description:
      'An in-depth special feature profiling Devendra Kumar Jha (Deven Jha) — his journey from Madhubani, Bihar to heading multi-state humanitarian missions.',
    clippingSnippet: 'India Today: Leadership with a human touch — bridging opportunity gaps for youth.',
  },
  {
    id: 'dainik-jagran-2',
    image: '/images/media-dainik-jagran.png',
    title: 'Special Initiative on Child Nutrition & Free Education Support',
    publication: 'Dainik Jagran Special',
    date: '18 Nov 2023',
    category: 'National Daily',
    description:
      'Public acknowledgement of rural outreach campaigns providing essential nutrition kits and books to children in underserved villages.',
    clippingSnippet: 'दैनिक जागरण: बच्चों के उज्ज्वल भविष्य के लिए नि:शुल्क शिक्षा सामग्री वितरण।',
  },
  {
    id: 'times-of-india-2',
    image: '/images/media-toi.png',
    title: 'Grassroots Social Welfare Summit & Community Honours',
    publication: 'The Times of India City',
    date: '04 Oct 2023',
    category: 'National Daily',
    description:
      'Report on the national civic convention honoring social organizers, highlighting Deven Jha\'s keynote address on sustainable NGO collaboration.',
    clippingSnippet: 'Times City: Mobilizing civic volunteers for emergency relief and healthcare access.',
  },
  {
    id: 'india-today-2',
    image: '/images/media-india-today.png',
    title: 'Bridging Communities Through Media & Service',
    publication: 'India Today Feature',
    date: '15 Aug 2023',
    category: 'Magazine',
    description:
      'Editorial analysis exploring the synergy between Janta Live public journalism and People\'s Association humanitarian drives.',
    clippingSnippet: 'India Today: Empowering citizens by giving voice to the voiceless.',
  },
];

const categories = ['All', 'National Daily', 'Magazine', 'Press Feature'];

interface PrintMediaPageProps {
  onNavigateBack: () => void;
}

export const PrintMediaPage: React.FC<PrintMediaPageProps> = ({ onNavigateBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Print Media Coverage | Devendra Kumar Jha (Deven Jha)';
  }, []);

  const filteredItems = printMediaData.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.publication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#FFFFFF] animate-fadeIn min-h-screen">
      
      {/* Editorial Header Banner */}
      <section className="bg-gradient-to-b from-[#14283B] to-[#0e1c2b] text-white pt-12 pb-16 border-b border-[#243d57] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#BD9256]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Back button */}
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#BD9256] hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Media Overview</span>
          </button>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#BD9256]/20 border border-[#BD9256]/40 rounded-full mb-3">
              <Newspaper className="w-3.5 h-3.5 text-[#BD9256]" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#BD9256] uppercase">
                NEWSPAPER &amp; MAGAZINE ARCHIVES
              </span>
            </div>

            <h1 className="font-serif text-[32px] sm:text-[42px] lg:text-[48px] font-bold text-white leading-tight mb-3">
              Print Media <span className="font-serif italic text-[#BD9256]">Coverage</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
              Stories, publications and recognition in leading national dailies and magazines, chronicling over two decades of social service and public engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="sticky top-[72px] z-30 bg-[#F8F6F0] border-b border-[#ebdcc9] py-4 shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#14283B] text-white shadow-xs'
                      : 'bg-white text-[#4a5568] hover:bg-[#e8ded0] border border-[#d9ccb9]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search publication, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#d9ccb9] rounded-lg focus:outline-none focus:border-[#BD9256] text-[#14283B]"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center bg-[#F8F6F0] rounded-xl border border-[#ebdcc9] p-8">
              <FileText className="w-12 h-12 text-[#BD9256] mx-auto mb-3 opacity-60" />
              <h3 className="font-serif text-lg font-bold text-[#14283B] mb-1">
                No matching clippings found
              </h3>
              <p className="text-xs text-[#777777] mb-4">
                Try adjusting your search terms or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#BD9256] text-white text-xs font-semibold rounded"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.slice(0, visibleCount).map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group bg-white rounded-xl overflow-hidden border border-[#e2d6c5] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-[#BD9256]"
                >
                  {/* Newspaper Clipping Image Frame */}
                  <div className="relative aspect-[4/3] bg-[#f2ecdf] overflow-hidden border-b border-[#ebdcc9]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="px-3.5 py-2 bg-white/95 backdrop-blur-xs rounded-full shadow-lg flex items-center gap-2 text-xs font-bold text-[#14283B]">
                        <Maximize2 className="w-3.5 h-3.5 text-[#BD9256]" />
                        <span>View Full Clipping</span>
                      </div>
                    </div>

                    {/* Top publication badge */}
                    <div className="absolute top-3 left-3 bg-[#14283B]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow-sm">
                      {item.publication}
                    </div>
                  </div>

                  {/* Clipping Details */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#777777] mb-2">
                        <span className="font-semibold text-[#BD9256]">
                          {item.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#BD9256]" />
                          {item.date}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-[16px] text-[#14283B] group-hover:text-[#BD9256] transition-colors leading-snug mb-2 line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-xs text-[#64748b] leading-relaxed line-clamp-3 mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#f0e8dc] flex items-center justify-between text-xs font-semibold text-[#BD9256]">
                      <span>Click to view clipping</span>
                      <Eye className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < filteredItems.length && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-7 py-3 bg-[#F8F6F0] hover:bg-[#ebdcc9] text-[#14283B] font-semibold text-xs rounded-lg border border-[#d9ccb9] transition cursor-pointer"
              >
                Load More Clippings
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Full-Screen Interactive Lightbox */}
      <ImageLightbox
        items={filteredItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

    </div>
  );
};
