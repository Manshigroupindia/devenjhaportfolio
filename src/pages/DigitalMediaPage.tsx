import React, { useState, useEffect } from 'react';
import {
  Search,
  Tv,
  Calendar,
  Play,
  ArrowLeft,
  Clock,
  Sparkles,
  ExternalLink,
  Film,
} from 'lucide-react';
import { VideoPlayerModal, DigitalMediaItem } from '../components/media/VideoPlayerModal.tsx';

const digitalMediaData: DigitalMediaItem[] = [
  {
    id: 'aaj-tak-1',
    youtubeId: 'live_stream',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=jantalivenews',
    thumbnail: '/images/media-aaj-tak.png',
    title: 'Aaj Tak Special: Grassroots Social Leadership & Youth Empowerment',
    channel: 'Aaj Tak Digital',
    date: '14 Jun 2024',
    category: 'Television Interview',
    duration: '24:18',
    description:
      'Devendra Kumar Jha discusses two decades of community mobilization, youth motivation, and the importance of civic philanthropy in modern India.',
  },
  {
    id: 'janta-live-1',
    youtubeId: 'janta-live-report',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=jantalivenews',
    thumbnail: '/images/media-banner.png',
    title: "Janta Live Broadcast: People's Association National Expansion",
    channel: 'Janta Live News',
    date: '28 Mar 2024',
    category: 'Digital Broadcast',
    duration: '18:45',
    description:
      'Live coverage of People\'s Association state coordinators meeting, reviewing free educational relief drives and rural health camps.',
  },
  {
    id: 'janta-live-2',
    youtubeId: 'janta-live-service',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=jantalivenews',
    thumbnail: '/images/about-group.png',
    title: 'Special Documentary: From Madhubani to 15 States of Compassion',
    channel: 'Janta Live Production',
    date: '15 Jan 2024',
    category: 'Documentary',
    duration: '32:10',
    description:
      'Documentary chronicling Deven Jha\'s early days in Delhi in 2004, the founding of People\'s Association in 2016, and ongoing relief programs.',
  },
  {
    id: 'tv-news-1',
    youtubeId: 'national-welfare-dialogue',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=jantalivenews',
    thumbnail: '/images/appointment-banner.png',
    title: 'National Panel Discussion: Role of Media in Amplifying NGO Initiatives',
    channel: 'Janta Live News Desk',
    date: '05 Nov 2023',
    category: 'News Coverage',
    duration: '21:30',
    description:
      'A roundtable conversation on empowering rural journalism and connecting welfare initiatives with corporate social responsibility.',
  },
  {
    id: 'aaj-tak-2',
    youtubeId: 'winter-relief-coverage',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=jantalivenews',
    thumbnail: '/images/media-aaj-tak.png',
    title: 'Special Telecast: Winter Warmth Drive for 10,000 Families',
    channel: 'Aaj Tak Digital Feature',
    date: '20 Dec 2023',
    category: 'Television Interview',
    duration: '15:20',
    description:
      'Ground footage and interviews during the mass blanket and winter jacket distribution conducted in urban slums and rural centers.',
  },
  {
    id: 'janta-live-3',
    youtubeId: 'education-initiative-interview',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=jantalivenews',
    thumbnail: '/images/about-portrait.png',
    title: 'One-on-One Interview: Education as the Greatest Equalizer',
    channel: 'Janta Live Exclusive',
    date: '02 Sep 2023',
    category: 'Digital Broadcast',
    duration: '27:50',
    description:
      'Deven Jha shares his philosophy on establishing free study centers and providing educational assistance to children from vulnerable backgrounds.',
  },
];

const categories = ['All', 'Television Interview', 'Digital Broadcast', 'News Coverage', 'Documentary'];

interface DigitalMediaPageProps {
  onNavigateBack: () => void;
}

export const DigitalMediaPage: React.FC<DigitalMediaPageProps> = ({ onNavigateBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<DigitalMediaItem | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Digital Media & Interviews | Devendra Kumar Jha (Deven Jha)';
  }, []);

  const filteredVideos = digitalMediaData.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
              <Tv className="w-3.5 h-3.5 text-[#BD9256]" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#BD9256] uppercase">
                TELEVISION &amp; DIGITAL BROADCASTS
              </span>
            </div>

            <h1 className="font-serif text-[32px] sm:text-[42px] lg:text-[48px] font-bold text-white leading-tight mb-3">
              Digital Media &amp; <span className="font-serif italic text-[#BD9256]">Interviews</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
              Watch interviews, television appearances and digital media coverage. All videos play directly on our platform with zero external redirection.
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
                placeholder="Search interview, channel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#d9ccb9] rounded-lg focus:outline-none focus:border-[#BD9256] text-[#14283B]"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Video Cards Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredVideos.length === 0 ? (
            <div className="py-16 text-center bg-[#F8F6F0] rounded-xl border border-[#ebdcc9] p-8">
              <Film className="w-12 h-12 text-[#BD9256] mx-auto mb-3 opacity-60" />
              <h3 className="font-serif text-lg font-bold text-[#14283B] mb-1">
                No matching videos found
              </h3>
              <p className="text-xs text-[#777777] mb-4">
                Try adjusting your search query or category filter.
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
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className="group bg-white rounded-xl overflow-hidden border border-[#e2d6c5] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-[#BD9256]"
                >
                  {/* Thumbnail with 16:9 Aspect Ratio & Play Overlay */}
                  <div className="relative aspect-video bg-[#0d1826] overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />

                    {/* Dark gradient backdrop */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

                    {/* Central Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#BD9256] text-white shadow-xl flex items-center justify-center transform group-hover:scale-115 transition-transform duration-300">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{video.duration}</span>
                    </div>

                    {/* Top Channel Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-[#14283B]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded border border-[#BD9256]/30">
                      {video.channel}
                    </div>
                  </div>

                  {/* Video Details */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#777777] mb-2">
                        <span className="font-semibold text-[#BD9256]">
                          {video.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#BD9256]" />
                          {video.date}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-[16px] text-[#14283B] group-hover:text-[#BD9256] transition-colors leading-snug mb-2 line-clamp-2">
                        {video.title}
                      </h3>

                      <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2 mb-4">
                        {video.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#f0e8dc] flex items-center justify-between text-xs font-semibold text-[#BD9256]">
                      <span className="flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 fill-[#BD9256]" />
                        <span>Watch Video on Site</span>
                      </span>
                      <span className="text-gray-400 text-[11px]">HD Playback</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Embedded YouTube Video Player Modal */}
      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />

    </div>
  );
};

