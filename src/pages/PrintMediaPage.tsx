import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { usePrintMedia } from '../hooks/useCMSContent.ts';

const categories = ['All', 'National Daily', 'Magazine', 'Press Feature', 'Regional'];

interface PrintMediaPageProps {
  onNavigateBack?: () => void;
}

export const PrintMediaPage: React.FC<PrintMediaPageProps> = ({ onNavigateBack }) => {
  const { data: remoteData, loading } = usePrintMedia(true);
  const activeData: PrintMediaItem[] = remoteData as PrintMediaItem[];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Print Media Coverage | Devendra Kumar Jha (Deven Jha)';
  }, []);

  const filteredItems = activeData.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const titleMatch = Boolean(item.title && item.title.toLowerCase().includes(q));
    const pubMatch = Boolean(item.publication && item.publication.toLowerCase().includes(q));
    const descMatch = Boolean(item.description && item.description.toLowerCase().includes(q));
    return matchesCategory && (titleMatch || pubMatch || descMatch);
  });

  return (
    <div className="bg-[#FFFFFF] animate-fadeIn min-h-screen">
      
      {/* Editorial Header Banner */}
      <section className="bg-gradient-to-b from-[#14283B] to-[#0e1c2b] text-white pt-12 pb-16 border-b border-[#243d57] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#BD9256]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Back button */}
          <Link
            to="/media-coverage"
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#BD9256] hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Media Overview</span>
          </Link>

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
      <section className="py-6 bg-[#F8F6F0] border-b border-[#ebdcc9] sticky top-[60px] sm:top-[72px] z-30 shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-[#14283B] uppercase tracking-wider mr-2 hidden sm:inline-flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#BD9256]" />
                Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#14283B] text-white shadow-sm'
                      : 'bg-white text-[#555555] hover:bg-[#ebdcc9] hover:text-[#14283B] border border-[#d6c7b3]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clippings, news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#d6c7b3] rounded-full text-xs text-[#14283B] placeholder-gray-400 focus:outline-none focus:border-[#BD9256] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Main Clippings Grid */}
      <section className="py-14 sm:py-18 bg-[#FFFFFF]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Results Counter */}
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#ebdcc9]">
            <span className="text-xs font-semibold text-[#777777]">
              Showing <strong className="text-[#14283B]">{filteredItems.length}</strong> Press Clippings
            </span>
            <span className="text-xs text-[#777777] italic hidden sm:inline">
              Click any clipping to open full-resolution inspection view
            </span>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-xl overflow-hidden border border-[#e2d6c5] p-4 animate-pulse">
                  <div className="aspect-[4/3] bg-[#ede5d8] rounded-lg mb-4" />
                  <div className="h-4 bg-[#ede5d8] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#ede5d8] rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredItems.length === 0 ? (
            <div className="py-20 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-[#ebdcc9]">
              <FileText className="w-12 h-12 text-[#BD9256] mx-auto mb-3 opacity-60" />
              <h3 className="font-serif text-lg font-bold text-[#14283B] mb-1">
                No matching clippings found
              </h3>
              <p className="text-xs text-[#777777] max-w-sm mx-auto mb-4">
                We couldn&apos;t find any newspaper clippings matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#BD9256] text-white text-xs font-semibold rounded cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : !loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.slice(0, visibleCount).map((item, index) => {
                const hasDetails = Boolean(
                  item.title?.trim() ||
                  item.publication?.trim() ||
                  item.date?.trim() ||
                  item.category?.trim() ||
                  item.description?.trim()
                );

                return (
                  <div
                    key={item.id}
                    onClick={() => setLightboxIndex(index)}
                    className="group bg-white rounded-xl overflow-hidden border border-[#e2d6c5] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-[#BD9256]"
                  >
                    {/* Newspaper Clipping Image Frame */}
                    <div className="relative aspect-[4/3] bg-[#f2ecdf] overflow-hidden border-b border-[#ebdcc9]">
                      <img
                        src={item.image || item.imageUrl}
                        alt={item.title || 'Press Clipping'}
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

                      {/* Top publication badge (only rendered if non-empty) */}
                      {item.publication?.trim() && (
                        <div className="absolute top-3 left-3 bg-[#14283B]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow-sm">
                          {item.publication}
                        </div>
                      )}
                    </div>

                    {/* Clipping Details */}
                    <div className="p-5 flex flex-col justify-between flex-1">
                      {hasDetails ? (
                        <div>
                          {(item.category?.trim() || item.date?.trim()) && (
                            <div className="flex items-center justify-between text-xs text-[#777777] mb-2">
                              {item.category?.trim() && (
                                <span className="font-semibold text-[#BD9256]">
                                  {item.category}
                                </span>
                              )}
                              {item.date?.trim() && (
                                <span className="flex items-center gap-1 ml-auto">
                                  <Calendar className="w-3 h-3 text-[#BD9256]" />
                                  {item.date}
                                </span>
                              )}
                            </div>
                          )}

                          {item.title?.trim() && (
                            <h3 className="font-serif font-bold text-[16px] text-[#14283B] group-hover:text-[#BD9256] transition-colors leading-snug mb-2 line-clamp-2">
                              {item.title}
                            </h3>
                          )}

                          {item.description?.trim() && (
                            <p className="text-xs text-[#64748b] leading-relaxed line-clamp-3 mb-4">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="py-1">
                          <span className="text-[11px] text-slate-400 italic">
                            Archival Press Clipping
                          </span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-[#f0e8dc] flex items-center justify-between text-xs font-semibold text-[#BD9256]">
                        <span>Click to view clipping</span>
                        <Eye className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
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
