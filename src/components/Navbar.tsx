import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X, Globe, PhoneCall } from 'lucide-react';
import { ReusableSocialGrid } from './common/ReusableSocialGrid.tsx';

export type PageType =
  | 'home'
  | 'about'
  | 'media'
  | 'media-print'
  | 'media-digital'
  | 'gallery-awards'
  | 'gallery-celebrities'
  | 'gallery-social'
  | 'gallery-invitations'
  | 'gallery-videos'
  | 'gallery-personal'
  | 'contact';

interface NavbarProps {
  currentPage?: PageType;
  onNavigate?: (page: PageType) => void;
  onOpenAppointment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage = 'home',
  onNavigate,
  onOpenAppointment,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleLinkClick = (page: PageType, hash?: string) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    if (onNavigate) {
      onNavigate(page);
    }
    if (hash) {
      setTimeout(() => {
        const elem = document.querySelector(hash);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const isMediaActive =
    currentPage === 'media' ||
    currentPage === 'media-print' ||
    currentPage === 'media-digital';

  const isGalleryActive = currentPage.startsWith('gallery-');

  return (
    <header
      ref={dropdownRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#ebdcc9]'
          : 'bg-[#faf8f5]/90 backdrop-blur-sm border-b border-[#f0e8db]'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex flex-col group cursor-pointer text-left"
          >
            <span className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0d1826] tracking-[0.08em] group-hover:text-[#a87932] transition-colors leading-tight">
              DEVEN JHA
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] font-semibold tracking-[0.18em] text-[#64748b] uppercase mt-[1px]">
              SOCIAL WORKER | ENTREPRENEUR | LEADER
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-[13.5px] font-medium text-[#2d3748]">
            {/* Home */}
            <button
              onClick={() => handleLinkClick('home')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                currentPage === 'home'
                  ? 'text-[#a87932] font-semibold border-b-2 border-[#a87932]'
                  : 'hover:text-[#a87932]'
              }`}
            >
              Home
            </button>

            {/* About Us */}
            <button
              onClick={() => handleLinkClick('about')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                currentPage === 'about'
                  ? 'text-[#a87932] font-semibold border-b-2 border-[#a87932]'
                  : 'hover:text-[#a87932]'
              }`}
            >
              About Us
            </button>

            {/* Media Coverage Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('media')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleLinkClick('media')}
                className={`flex items-center gap-1 px-3 py-1.5 transition-colors focus:outline-none cursor-pointer ${
                  isMediaActive
                    ? 'text-[#a87932] font-semibold border-b-2 border-[#a87932]'
                    : 'hover:text-[#a87932]'
                }`}
              >
                <span>Media Coverage</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-200" />
              </button>

              {activeDropdown === 'media' && (
                <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-lg border border-[#ede5d8] py-2 z-50 animate-fadeIn">
                  <button
                    onClick={() => handleLinkClick('media')}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer font-medium"
                  >
                    Media Overview Hub
                  </button>
                  <button
                    onClick={() => handleLinkClick('media-print')}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Print Media (Newspapers)
                  </button>
                  <button
                    onClick={() => handleLinkClick('media-digital')}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Digital &amp; TV Interviews
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Dropdown (6 Dedicated Categories) */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('gallery')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleLinkClick('gallery-awards')}
                className={`flex items-center gap-1 px-3 py-1.5 transition-colors focus:outline-none cursor-pointer ${
                  isGalleryActive
                    ? 'text-[#a87932] font-semibold border-b-2 border-[#a87932]'
                    : 'hover:text-[#a87932]'
                }`}
              >
                <span>Gallery</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-200" />
              </button>

              {activeDropdown === 'gallery' && (
                <div className="absolute top-full left-0 w-60 bg-white rounded-lg shadow-lg border border-[#ede5d8] py-2 z-50 animate-fadeIn">
                  <button
                    onClick={() => handleLinkClick('gallery-awards')}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#faf7f0] transition-colors cursor-pointer ${
                      currentPage === 'gallery-awards'
                        ? 'text-[#a87932] font-bold bg-[#faf7f0]'
                        : 'text-[#334155] hover:text-[#a87932]'
                    }`}
                  >
                    1. Awards
                  </button>
                  <button
                    onClick={() => handleLinkClick('gallery-celebrities')}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#faf7f0] transition-colors cursor-pointer ${
                      currentPage === 'gallery-celebrities'
                        ? 'text-[#a87932] font-bold bg-[#faf7f0]'
                        : 'text-[#334155] hover:text-[#a87932]'
                    }`}
                  >
                    2. Pictures With Celebrities
                  </button>
                  <button
                    onClick={() => handleLinkClick('gallery-social')}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#faf7f0] transition-colors cursor-pointer ${
                      currentPage === 'gallery-social'
                        ? 'text-[#a87932] font-bold bg-[#faf7f0]'
                        : 'text-[#334155] hover:text-[#a87932]'
                    }`}
                  >
                    3. Social Events
                  </button>
                  <button
                    onClick={() => handleLinkClick('gallery-invitations')}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#faf7f0] transition-colors cursor-pointer ${
                      currentPage === 'gallery-invitations'
                        ? 'text-[#a87932] font-bold bg-[#faf7f0]'
                        : 'text-[#334155] hover:text-[#a87932]'
                    }`}
                  >
                    4. Program Invitations
                  </button>
                  <button
                    onClick={() => handleLinkClick('gallery-videos')}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#faf7f0] transition-colors cursor-pointer ${
                      currentPage === 'gallery-videos'
                        ? 'text-[#a87932] font-bold bg-[#faf7f0]'
                        : 'text-[#334155] hover:text-[#a87932]'
                    }`}
                  >
                    5. Videos
                  </button>
                  <button
                    onClick={() => handleLinkClick('gallery-personal')}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#faf7f0] transition-colors cursor-pointer ${
                      currentPage === 'gallery-personal'
                        ? 'text-[#a87932] font-bold bg-[#faf7f0]'
                        : 'text-[#334155] hover:text-[#a87932]'
                    }`}
                  >
                    6. Personal Pictures
                  </button>
                </div>
              )}
            </div>

            {/* Connect Me Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('connect')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => toggleDropdown('connect')}
                aria-haspopup="true"
                aria-expanded={activeDropdown === 'connect'}
                className="flex items-center gap-1 px-3 py-1.5 hover:text-[#a87932] transition-colors focus:outline-none cursor-pointer"
              >
                <span>Connect Me</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-200" />
              </button>

              {activeDropdown === 'connect' && (
                <div className="absolute top-full right-0 lg:left-0 z-50 pt-2 animate-fadeIn">
                  <ReusableSocialGrid
                    variant="dropdown"
                    onItemClick={() => setActiveDropdown(null)}
                  />
                </div>
              )}
            </div>

            {/* Contact Us */}
            <button
              onClick={() => handleLinkClick('contact')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                currentPage === 'contact'
                  ? 'text-[#a87932] font-semibold border-b-2 border-[#a87932]'
                  : 'hover:text-[#a87932]'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Right actions: Google Translate & Appointment CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Google Translate Wrapper */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f5ede2]/60 hover:bg-[#f5ede2] border border-[#e4d6c4] rounded-md transition-all text-xs font-medium text-[#4a5568]">
              <Globe className="w-3.5 h-3.5 text-[#a87932]" />
              <div id="google_translate_element" className="translate-widget" />
            </div>

            {/* Appointment Button */}
            <button
              onClick={onOpenAppointment}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#b8863b] hover:bg-[#a37430] active:scale-[0.98] text-white text-[13px] font-medium tracking-wide rounded-md shadow-sm transition-all duration-200 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Take an Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenAppointment}
              className="px-2.5 py-1.5 bg-[#b8863b] text-white text-xs font-medium rounded-md shadow-sm"
            >
              Appointment
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#334155] hover:text-[#a87932] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#ebdcc9] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <button
            onClick={() => handleLinkClick('home')}
            className={`block w-full text-left py-2 font-semibold border-b border-gray-100 ${
              currentPage === 'home' ? 'text-[#a87932]' : 'text-[#2d3748]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleLinkClick('about')}
            className={`block w-full text-left py-2 font-semibold border-b border-gray-100 ${
              currentPage === 'about' ? 'text-[#a87932]' : 'text-[#2d3748]'
            }`}
          >
            About Us
          </button>
          
          {/* Media Coverage */}
          <button
            onClick={() => handleLinkClick('media')}
            className={`block w-full text-left py-2 font-semibold border-b border-gray-100 ${
              isMediaActive ? 'text-[#a87932]' : 'text-[#2d3748]'
            }`}
          >
            Media Coverage
          </button>
          <div className="pl-4 space-y-1.5 border-b border-gray-100 pb-2">
            <button
              onClick={() => handleLinkClick('media-print')}
              className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
            >
              • Print Media (Newspapers)
            </button>
            <button
              onClick={() => handleLinkClick('media-digital')}
              className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
            >
              • Digital &amp; TV Interviews
            </button>
          </div>

          {/* Gallery with 6 items */}
          <div className="border-b border-gray-100 pb-2">
            <span className="block py-2 font-semibold text-[#14283B]">
              Gallery Archives
            </span>
            <div className="pl-4 space-y-1.5">
              <button
                onClick={() => handleLinkClick('gallery-awards')}
                className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
              >
                1. Awards
              </button>
              <button
                onClick={() => handleLinkClick('gallery-celebrities')}
                className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
              >
                2. Pictures With Celebrities
              </button>
              <button
                onClick={() => handleLinkClick('gallery-social')}
                className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
              >
                3. Social Events
              </button>
              <button
                onClick={() => handleLinkClick('gallery-invitations')}
                className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
              >
                4. Program Invitations
              </button>
              <button
                onClick={() => handleLinkClick('gallery-videos')}
                className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
              >
                5. Videos
              </button>
              <button
                onClick={() => handleLinkClick('gallery-personal')}
                className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
              >
                6. Personal Pictures
              </button>
            </div>
          </div>

          {/* Mobile Connect Me Section */}
          <div className="border-b border-gray-100 pb-3 pt-1">
            <ReusableSocialGrid
              variant="mobile"
              onItemClick={() => setMobileMenuOpen(false)}
            />
          </div>

          <button
            onClick={() => handleLinkClick('contact')}
            className={`block w-full text-left py-2 font-medium border-b border-gray-100 ${
              currentPage === 'contact'
                ? 'text-[#a87932] font-bold'
                : 'text-[#2d3748] hover:text-[#a87932]'
            }`}
          >
            Contact Us
          </button>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAppointment();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#b8863b] text-white font-medium text-sm rounded-md shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Take an Appointment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
