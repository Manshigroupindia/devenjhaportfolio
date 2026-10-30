import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Maximize2,
  Play,
  Clock,
  Tv,
  Image as ImageIcon,
  ArrowRight,
} from 'lucide-react';
import {
  GalleryCategoryKey,
  GalleryImageItem,
  GalleryVideoItem,
} from '../../types/gallery.ts';
import {
  GALLERY_CATEGORIES,
  GALLERY_IMAGES,
  GALLERY_VIDEOS,
} from '../../data/galleryData.ts';
import { GalleryHero } from './GalleryHero.tsx';
import { GalleryLightbox } from './GalleryLightbox.tsx';
import { VideoPlayerModal, DigitalMediaItem } from '../media/VideoPlayerModal.tsx';

interface GalleryPageLayoutProps {
  category: GalleryCategoryKey;
  onSelectCategory: (key: GalleryCategoryKey) => void;
  onNavigateHome: () => void;
}

export const GalleryPageLayout: React.FC<GalleryPageLayoutProps> = ({
  category,
  onSelectCategory,
  onNavigateHome,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<DigitalMediaItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const meta = GALLERY_CATEGORIES[category];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `${meta.heading} | Gallery | Devendra Kumar Jha (Deven Jha)`;
  }, [category, meta.heading]);

  const isVideoCategory = category === 'videos';
  const currentImages: GalleryImageItem[] = !isVideoCategory
    ? GALLERY_IMAGES[category] || []
    : [];
  const currentVideos: GalleryVideoItem[] = isVideoCategory ? GALLERY_VIDEOS : [];

  return (
    <div className="bg-[#FFFFFF] animate-fadeIn min-h-screen flex flex-col justify-between">
      <div>
        {/* Category Hero Banner with Switcher */}
        <GalleryHero
          currentCategory={category}
          onSelectCategory={onSelectCategory}
          onNavigateHome={onNavigateHome}
        />

        {/* Gallery Content Area */}
        <section className="py-12 sm:py-16">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* 1. VIDEOS GALLERY */}
            {isVideoCategory && (
              <div>
                {currentVideos.length === 0 ? (
                  <div className="py-20 text-center bg-[#F8F6F0] rounded-2xl border border-[#ebdcc9] p-8 max-w-xl mx-auto">
                    <ImageIcon className="w-12 h-12 text-[#BD9256] mx-auto mb-3 opacity-60" />
                    <h3 className="font-serif text-xl font-bold text-[#14283B] mb-2">
                      No Videos in this Archive Yet
                    </h3>
                    <p className="text-xs sm:text-sm text-[#777777] mb-6">
                      Archival recordings and public footage are currently being cataloged.
                    </p>
                    <button
                      onClick={() => onSelectCategory('awards')}
                      className="px-5 py-2.5 bg-[#BD9256] text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      Explore Awards &amp; Recognitions
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {currentVideos.slice(0, visibleCount).map((vid) => (
                      <div
                        key={vid.id}
                        onClick={() =>
                          setActiveVideo({
                            id: vid.id,
                            youtubeId: 'stream',
                            embedUrl: vid.embedUrl,
                            thumbnail: vid.thumbnail,
                            title: vid.title,
                            channel: vid.channel || 'Janta Live',
                            date: vid.date || 'Recent',
                            category: 'Digital Broadcast',
                            duration: vid.duration || '20:00',
                            description: vid.description,
                          })
                        }
                        className="group bg-white rounded-xl overflow-hidden border border-[#e2d6c5] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-[#BD9256]"
                      >
                        {/* 16:9 Thumbnail with Play overlay */}
                        <div className="relative aspect-video bg-[#0d1826] overflow-hidden">
                          <img
                            src={vid.thumbnail}
                            alt={vid.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                          {/* Central Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#BD9256] text-white shadow-xl flex items-center justify-center transform group-hover:scale-115 transition-transform duration-300">
                              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5" />
                            </div>
                          </div>

                          {/* Badges */}
                          {vid.duration && (
                            <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{vid.duration}</span>
                            </div>
                          )}

                          {vid.channel && (
                            <div className="absolute top-2.5 left-2.5 bg-[#14283B]/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded border border-[#BD9256]/30">
                              {vid.channel}
                            </div>
                          )}
                        </div>

                        {/* Video Content */}
                        <div className="p-5 flex flex-col justify-between flex-1">
                          <div>
                            {vid.date && (
                              <div className="flex items-center gap-1.5 text-xs text-[#777777] mb-2">
                                <Calendar className="w-3 h-3 text-[#BD9256]" />
                                <span>{vid.date}</span>
                              </div>
                            )}

                            <h3 className="font-serif font-bold text-[16px] text-[#14283B] group-hover:text-[#BD9256] transition-colors leading-snug mb-2 line-clamp-2">
                              {vid.title}
                            </h3>

                            <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2 mb-4">
                              {vid.description}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#f0e8dc] flex items-center justify-between text-xs font-semibold text-[#BD9256]">
                            <span className="flex items-center gap-1.5">
                              <Play className="w-3.5 h-3.5 fill-[#BD9256]" />
                              <span>Watch on Site</span>
                            </span>
                            <span className="text-gray-400 text-[11px]">HD Video</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. IMAGE GALLERY (Masonry & Responsive Grid) */}
            {!isVideoCategory && (
              <div>
                {currentImages.length === 0 ? (
                  <div className="py-20 text-center bg-[#F8F6F0] rounded-2xl border border-[#ebdcc9] p-8 max-w-xl mx-auto">
                    <ImageIcon className="w-12 h-12 text-[#BD9256] mx-auto mb-3 opacity-60" />
                    <h3 className="font-serif text-xl font-bold text-[#14283B] mb-2">
                      Photographs Coming Soon
                    </h3>
                    <p className="text-xs sm:text-sm text-[#777777] mb-6">
                      Official archival photographs for this section are being verified and uploaded.
                    </p>
                    <button
                      onClick={() => onSelectCategory('personal')}
                      className="px-5 py-2.5 bg-[#BD9256] text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      View Personal Moments
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {currentImages.slice(0, visibleCount).map((item, index) => (
                      <div
                        key={item.id}
                        onClick={() => setLightboxIndex(index)}
                        className="group bg-white rounded-xl overflow-hidden border border-[#e2d6c5] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-[#BD9256]"
                      >
                        {/* Image Frame with original quality preservation */}
                        <div className="relative bg-[#f5ede2] overflow-hidden border-b border-[#ebdcc9] aspect-[4/3] flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Hover overlay badge */}
                          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="px-3.5 py-2 bg-white/95 backdrop-blur-xs rounded-full shadow-lg flex items-center gap-2 text-xs font-bold text-[#14283B]">
                              <Maximize2 className="w-3.5 h-3.5 text-[#BD9256]" />
                              <span>View Full Size</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Meta */}
                        <div className="p-5 flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex items-center justify-between text-xs text-[#777777] mb-2">
                              {item.date && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-[#BD9256]" />
                                  {item.date}
                                </span>
                              )}
                              {item.location && (
                                <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                  <MapPin className="w-3 h-3 text-[#BD9256]" />
                                  {item.location}
                                </span>
                              )}
                            </div>

                            <h3 className="font-serif font-bold text-[16px] text-[#14283B] group-hover:text-[#BD9256] transition-colors leading-snug mb-1 line-clamp-2">
                              {item.title}
                            </h3>

                            {item.subtitle && (
                              <span className="text-[11.5px] font-semibold text-[#BD9256] block mb-2 line-clamp-1">
                                {item.subtitle}
                              </span>
                            )}

                            <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2 mb-4">
                              {item.description}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#f0e8dc] flex items-center justify-between text-xs font-semibold text-[#BD9256]">
                            <span>Open in Lightbox</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Load More Button */}
            {!isVideoCategory && visibleCount < currentImages.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-7 py-3 bg-[#F8F6F0] hover:bg-[#ebdcc9] text-[#14283B] font-semibold text-xs rounded-lg border border-[#d9ccb9] transition cursor-pointer"
                >
                  Load More Photographs
                </button>
              </div>
            )}

          </div>
        </section>
      </div>

      {/* Lightbox for Image viewing */}
      <GalleryLightbox
        items={currentImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

      {/* Embedded Video Modal */}
      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
};

