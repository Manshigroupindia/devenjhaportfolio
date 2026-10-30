import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  onOpenAppointment,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const currentPath = location.pathname;

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

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const isHomeActive = currentPath === '/';
  const isAboutActive = currentPath === '/about';
  const isMediaActive =
    currentPath.startsWith('/media-coverage') || currentPath.startsWith('/media');
  const isGalleryActive = currentPath.startsWith('/gallery');
  const isContactActive = currentPath === '/contact';

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
          {/* Logo Brand with original image.png on clean white container */}
          <Link
            to="/"
            onClick={() => {
              setMobileMenuOpen(false);
              setActiveDropdown(null);
            }}
            className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer text-left"
          >
            {/* White Logo Container */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white border border-[#ebdcc9] shadow-xs group-hover:border-[#BD9256] transition-all duration-200 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
              <img
                src="/images/logo.png"
                alt="Deven Jha Official Logo"
                className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <span className="font-serif text-[18px] sm:text-[21px] font-bold text-[#0d1826] tracking-[0.06em] group-hover:text-[#a87932] transition-colors leading-tight">
                DEVEN JHA
              </span>
              <span className="text-[7.5px] sm:text-[8.5px] font-semibold tracking-[0.16em] text-[#64748b] uppercase mt-[1px] whitespace-nowrap">
                SOCIAL WORKER | ENTREPRENEUR | LEADER
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-[13.5px] font-medium text-[#2d3748]">
            {/* Home */}
            <Link
              to="/"
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                isHomeActive
                  ? 'text-[#a87932] font-semibold border-b-2 border-[#a87932]'
                  : 'hover:text-[#a87932]'
              }`}
            >
              Home
            </Link>

            {/* About Us */}
            <Link
              to="/about"
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                isAboutActive
                  ? 'text-[#a87932] font-semibold border-b-2 border-[#a87932]'
                  : 'hover:text-[#a87932]'
              }`}
            >
              About Us
            </Link>

            {/* Media Coverage Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('media')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to="/media-coverage"
                className={`flex items-center gap-1 px-3 py-1.5 transition-colors focus:outline-none cursor-pointer ${
                  isMediaActive
                    ? 'text-[#a87932] font-semibold border-b-2 border-[#a87932]'
                    : 'hover:text-[#a87932]'
                }`}
              >
                <span>Media Coverage</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-200" />
              </Link>

              {activeDropdown === 'media' && (
                <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-lg border border-[#ede5d8] py-2 z-50 animate-fadeIn">
                  <Link
                    to="/media-coverage"
                    onClick={() => setActiveDropdown(null)}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer font-medium"
                  >
                    Media Overview Hub
                  </Link>
                  <Link
                    to="/media-coverage/print"
                    onClick={() => setActiveDropdown(null)}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Print Media (Newspapers)
                  </Link>
                  <Link
                    to="/media-coverage/digital"
                    onClick={() => setActiveDropdown(null)}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Digital &amp; TV Interviews
                  </Link>
                </div>
              )}
            </div>

            {/* Gallery Dropdown (6 Dedicated Categories) */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('gallery')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to="/gallery/awards"
                className={`flex items-center gap-1 px-3 py-1.5 transition-colors focus:outline-none cursor-pointer ${
                  isGalleryActive
                    ? 'text-[#a87932] font-semibold border-b-2 border-[#a87932]'
                    : 'hover:text-[#a87932]'
                }`}
              >
                <span>Gallery</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-200" />
              </Link>

              {activeDropdown === 'gallery' && (
                <div className="absolute top-full left-0 w-60 bg-white rounded-lg shadow-lg border border-[#ede5d8] py-2 z-50 animate-fadeIn">
                  <Link
                    to="/gallery/awards"
                    onClick={() => setActiveDropdown(null)}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#faf7f0] transition-colors cursor-pointer ${
                      currentPath === '/gallery/awards'
                        ? 'text-[#a87932] font-bold bg-[#faf7f0]'
                        : 'text-[#334155] hover:text-[#a87932]'
                    }`}
                  >
                    1. Awards
                  </Link>
                  <Link
                    to="/gallery/celebrity"
                    onClick={() => setActiveDropdown(null)}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#faf7f0] transition-colors cursor-pointer ${
                      currentPath === '/gallery/celebrity'
                        ? 'text-[#a87932] font-bold bg-[#faf7f0]'
                        : 'text-[#334155] hover:text-[#a87932]'
                    }`}
                  >
                    2. Pictures With Celebrities
                  </Link>
                  <Link
                    to="/gallery/social-events"
                    onClick={() => setActiveDropdown(null)}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#faf7f0] transition-colors cursor-pointer ${
                      currentPath === '/gallery/social-events'
                        ? 'text-[#a87932] font-bold bg-[#faf7f0]'
                        : 'text-[#334155] hover:text-[#a87932]'
                    }`}
                  >
                    3. Social Events
                  </Link>
                  <Link
                    to="/gallery/invitations"
                    onClick={() => setActiveDropdown(null)}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#faf7f0] transition-colors cursor-pointer ${
                      currentPath === '/gallery/invitations'
                        ? 'text-[#a87932] font-bold bg-[#faf7f0]'
                        : 'text-[#334155] hover:text-[#a87932]'
                    }`}
                  >
                    4. Program Invitations
                  </Link>
                  <Link
                    to="/gallery/videos"
                    onClick={() => setActiveDropdown(null)}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#faf7f0] transition-colors cursor-pointer ${
                      currentPath === '/gallery/videos'
                        ? 'text-[#a87932] font-bold bg-[#faf7f0]'
                        : 'text-[#334155] hover:text-[#a87932]'
                    }`}
                  >
                    5. Videos
                  </Link>
                  <Link
                    to="/gallery/personal"
                    onClick={() => setActiveDropdown(null)}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-[#faf7f0] transition-colors cursor-pointer ${
                      currentPath === '/gallery/personal'
                        ? 'text-[#a87932] font-bold bg-[#faf7f0]'
                        : 'text-[#334155] hover:text-[#a87932]'
                    }`}
                  >
                    6. Personal Pictures
                  </Link>
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
            <Link
              to="/contact"
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                isContactActive
                  ? 'text-[#a87932] font-semibold border-b-2 border-[#a87932]'
                  : 'hover:text-[#a87932]'
              }`}
            >
              Contact Us
            </Link>
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
              className="hidden xl:inline-flex items-center gap-2 px-5 py-2.5 bg-[#b8863b] hover:bg-[#a37430] active:scale-[0.98] text-white text-xs font-semibold rounded-md shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Take an Appointment:</span>
            </button>

            <button
              onClick={onOpenAppointment}
              className="xl:hidden inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#b8863b] hover:bg-[#a37430] text-white text-xs font-semibold rounded-md shadow-xs transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Appointment
            </button>
          </div>

          {/* Mobile Right Controls: Translate & Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenAppointment}
              className="px-2.5 py-1.5 bg-[#b8863b] text-white text-[11px] font-semibold rounded shadow-xs"
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
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left py-2 font-semibold border-b border-gray-100 ${
              isHomeActive ? 'text-[#a87932]' : 'text-[#2d3748]'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left py-2 font-semibold border-b border-gray-100 ${
              isAboutActive ? 'text-[#a87932]' : 'text-[#2d3748]'
            }`}
          >
            About Us
          </Link>
          
          {/* Media Coverage */}
          <Link
            to="/media-coverage"
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left py-2 font-semibold border-b border-gray-100 ${
              isMediaActive ? 'text-[#a87932]' : 'text-[#2d3748]'
            }`}
          >
            Media Coverage
          </Link>
          <div className="pl-4 space-y-1.5 border-b border-gray-100 pb-2">
            <Link
              to="/media-coverage/print"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
            >
              • Print Media (Newspapers)
            </Link>
            <Link
              to="/media-coverage/digital"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
            >
              • Digital &amp; TV Interviews
            </Link>
          </div>

          {/* Gallery with 6 items */}
          <div className="border-b border-gray-100 pb-2">
            <span className="block py-2 font-semibold text-[#14283B]">
              Gallery Archives
            </span>
            <div className="pl-4 space-y-1.5">
              <Link
                to="/gallery/awards"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
              >
                1. Awards
              </Link>
              <Link
                to="/gallery/celebrity"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
              >
                2. Pictures With Celebrities
              </Link>
              <Link
                to="/gallery/social-events"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
              >
                3. Social Events
              </Link>
              <Link
                to="/gallery/invitations"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
              >
                4. Program Invitations
              </Link>
              <Link
                to="/gallery/videos"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
              >
                5. Videos
              </Link>
              <Link
                to="/gallery/personal"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-1 text-xs text-[#64748b] hover:text-[#a87932]"
              >
                6. Personal Pictures
              </Link>
            </div>
          </div>

          {/* Mobile Connect Me Section */}
          <div className="border-b border-gray-100 pb-3 pt-1">
            <ReusableSocialGrid
              variant="mobile"
              onItemClick={() => setMobileMenuOpen(false)}
            />
          </div>

          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left py-2 font-medium border-b border-gray-100 ${
              isContactActive ? 'text-[#a87932] font-bold' : 'text-[#2d3748] hover:text-[#a87932]'
            }`}
          >
            Contact Us
          </Link>

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
