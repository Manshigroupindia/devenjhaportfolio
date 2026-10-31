import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { useGalleryMedia, useGalleryVideos } from '../../hooks/useCMSContent.ts';
import { GalleryHero } from './GalleryHero.tsx';
import { GalleryLightbox } from './GalleryLightbox.tsx';
import { VideoPlayerModal, DigitalMediaItem } from '../media/VideoPlayerModal.tsx';

interface GalleryPageLayoutProps {
  category: GalleryCategoryKey;
  onSelectCategory?: (key: GalleryCategoryKey) => void;
  onNavigateHome?: () => void;
}

export const GalleryPageLayout: React.FC<GalleryPageLayoutProps> = ({
  category,
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
  const { data: dbImages, loading: imagesLoading } = useGalleryMedia(category, true);
  const { data: dbVideos, loading: videosLoading } = useGalleryVideos(true);

  const currentImages: GalleryImageItem[] = !isVideoCategory
    ? (dbImages.length > 0 ? dbImages : (GALLERY_IMAGES[category] || []))
    : [];
  const currentVideos: GalleryVideoItem[] = isVideoCategory
    ? (dbVideos.length > 0 ? dbVideos : GALLERY_VIDEOS)
    : [];

  return (
    <div className="bg-[#FFFFFF] animate-fadeIn min-h-screen flex flex-col justify-between">
      <div>
        {/* Category Hero Banner with Switcher */}
        <GalleryHero currentCategory={category} />

        {/* Gallery Content Area */}
        <section className="py-12 sm:py-16">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* 1. VIDEOS GALLERY */}
            {isVideoCategory && (
              <div>
                {videosLoading && currentVideos.length === 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                      <div key={idx} className="bg-white rounded-xl overflow-hidden border border-[#e2d6c5] animate-pulse">
                        <div className="aspect-video bg-[#eee5d8]" />
                        <div className="p-5 space-y-2">
                          <div className="h-4 bg-[#eee5d8] rounded w-3/4" />
                          <div className="h-3 bg-[#f5ede2] rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : currentVideos.length === 0 ? (
                  <div className="py-20 text-center bg-[#F8F6F0] rounded-2xl border border-[#ebdcc9] p-8 max-w-xl mx-auto">
                    <ImageIcon className="w-12 h-12 text-[#BD9256] mx-auto mb-3 opacity-60" />
                    <h3 className="font-serif text-xl font-bold text-[#14283B] mb-2">
                      No Videos in this Archive Yet
                    </h3>
                    <p className="text-xs sm:text-sm text-[#777777] mb-6">
                      Archival recordings and public footage are currently being cataloged.
                    </p>
                    <Link
                      to="/gallery/awards"
                      className="inline-block px-5 py-2.5 bg-[#BD9256] text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      Explore Awards &amp; Recognitions
                    </Link>
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
                        <div className="relative aspect-video bg-[#0d1826] overflow-hidden flex items-center justify-center">
                          {vid.thumbnail ? (
                            <img
                              src={vid.thumbnail}
                              alt={vid.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Tv className="w-10 h-10 text-[#BD9256]" />
                          )}

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

                            {vid.description && (
                              <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2 mb-4">
                                {vid.description}
                              </p>
                            )}
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
                {imagesLoading && currentImages.length === 0 ? (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8">
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                      <div key={idx} className="break-inside-avoid mb-6 sm:mb-8 bg-white rounded-xl overflow-hidden border border-[#e2d6c5] animate-pulse">
                        <div className={`bg-[#eee5d8] w-full ${idx % 2 === 0 ? 'h-64' : 'h-80'}`} />
                        <div className="p-5 space-y-2">
                          <div className="h-4 bg-[#eee5d8] rounded w-3/4" />
                          <div className="h-3 bg-[#f5ede2] rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : currentImages.length === 0 ? (
                  <div className="py-20 text-center bg-[#F8F6F0] rounded-2xl border border-[#ebdcc9] p-8 max-w-xl mx-auto">
                    <ImageIcon className="w-12 h-12 text-[#BD9256] mx-auto mb-3 opacity-60" />
                    <h3 className="font-serif text-xl font-bold text-[#14283B] mb-2">
                      Photographs Coming Soon
                    </h3>
                    <p className="text-xs sm:text-sm text-[#777777] mb-6">
                      Official archival photographs for this section are being verified and uploaded.
                    </p>
                    <Link
                      to="/gallery/personal"
                      className="inline-block px-5 py-2.5 bg-[#BD9256] text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      View Personal Moments
                    </Link>
                  </div>
                ) : (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 [column-fill:_balance]">
                    {currentImages.slice(0, visibleCount).map((item, index) => {
                      const imgSrc = item.imageUrl || item.image;
                      const hasTitle = Boolean(item.title && item.title.trim() !== '' && item.title.toLowerCase() !== 'untitled');
                      const hasSubtitle = Boolean((item.caption || item.subtitle)?.trim());
                      const hasDescription = Boolean(item.description && item.description.trim() !== '');
                      const hasDateOrLocation = Boolean(item.date || item.location);
                      const hasAnyMeta = hasTitle || hasSubtitle || hasDescription || hasDateOrLocation;

                      return (
                        <div
                          key={item.id || index}
                          onClick={() => setLightboxIndex(index)}
                          className="break-inside-avoid mb-6 sm:mb-8 group bg-white rounded-xl overflow-hidden border border-[#e2d6c5] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-[#BD9256]"
                        >
                          {/* Image Frame with natural aspect ratio preservation */}
                          <div className="relative bg-[#f5ede2] overflow-hidden flex items-center justify-center">
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={item.title || 'Gallery Photograph'}
                                loading="lazy"
                                className="w-full h-auto block object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                  const parent = (e.currentTarget as HTMLElement).parentElement;
                                  if (parent) {
                                    const fallback = parent.querySelector('.img-error-fallback');
                                    if (fallback) (fallback as HTMLElement).classList.remove('hidden');
                                  }
                                }}
                              />
                            ) : null}

                            <div className={`img-error-fallback ${imgSrc ? 'hidden' : 'flex'} flex-col items-center justify-center text-center p-6 text-[#9c8975]`}>
                              <ImageIcon className="w-10 h-10 text-[#BD9256] mb-1 opacity-70" />
                              <span className="text-xs font-semibold text-[#14283B]">{item.title || 'Photograph'}</span>
                            </div>

                            {/* Hover overlay badge */}
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                              <div className="px-3.5 py-2 bg-white/95 backdrop-blur-xs rounded-full shadow-lg flex items-center gap-2 text-xs font-bold text-[#14283B]">
                                <Maximize2 className="w-3.5 h-3.5 text-[#BD9256]" />
                                <span>View Full Size</span>
                              </div>
                            </div>
                          </div>

                          {/* Card Meta */}
                          {hasAnyMeta ? (
                            <div className="p-5 flex flex-col justify-between flex-1 border-t border-[#f0e8dc]">
                              <div>
                                {hasDateOrLocation && (
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
                                )}

                                {hasTitle && (
                                  <h3 className="font-serif font-bold text-[16px] text-[#14283B] group-hover:text-[#BD9256] transition-colors leading-snug mb-1 line-clamp-2">
                                    {item.title}
                                  </h3>
                                )}

                                {hasSubtitle && (
                                  <span className="text-[11.5px] font-semibold text-[#BD9256] block mb-2 line-clamp-1">
                                    {item.caption || item.subtitle}
                                  </span>
                                )}

                                {hasDescription && (
                                  <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2 mb-3">
                                    {item.description}
                                  </p>
                                )}
                              </div>

                              <div className="pt-3 border-t border-[#f0e8dc] flex items-center justify-between text-xs font-semibold text-[#BD9256]">
                                <span>Open in Lightbox</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          ) : (
                            <div className="px-4 py-2.5 bg-[#faf7f2] border-t border-[#f0e8dc] flex items-center justify-between text-xs font-semibold text-[#BD9256]">
                              <span>Open in Lightbox</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                          )}
                        </div>
                      );
                    })}
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

