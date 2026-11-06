import React, { useState, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';

export interface LanguageOption {
  code: string;
  name: string;
  native: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
];

/**
 * Determine currently active language code from Google Translate cookies or select combo.
 */
export function getActiveLanguage(): string {
  if (typeof document === 'undefined') return 'en';
  try {
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (combo && combo.value) {
      return combo.value;
    }
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1]) {
      return match[1];
    }
  } catch {
    // Ignore restricted storage errors
  }
  return 'en';
}

/**
 * Programmatically switch language by updating Google Translate's select combo & cookies.
 * Works across both desktop and mobile without creating duplicate instances.
 */
export function setLanguage(langCode: string): void {
  try {
    const isEnglish = langCode === 'en' || !langCode;

    // 1. Try to set value on Google Translate combo element
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (combo) {
      combo.value = isEnglish ? '' : langCode;
      combo.dispatchEvent(new Event('change'));
      combo.dispatchEvent(new Event('input'));
    }

    // 2. Set or clear googtrans cookies for persistent translation
    const host = window.location.hostname;
    const cookiePath = '/';
    if (isEnglish) {
      // Clear cookie to revert back to original English
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
      if (host) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath}; domain=${host};`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath}; domain=.${host};`;
      }
    } else {
      const cookieVal = `/en/${langCode}`;
      const expires = 'Fri, 31 Dec 9999 23:59:59 GMT';
      document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=${cookiePath};`;
      if (host) {
        document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=${cookiePath}; domain=${host};`;
        document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=${cookiePath}; domain=.${host};`;
      }
    }

    // 3. Fallback verification:
    // If the combo was missing or did not alter the DOM, reload with cookie to ensure 100% translation
    setTimeout(() => {
      const isTranslated =
        document.documentElement.classList.contains('translated-ltr') ||
        document.documentElement.classList.contains('translated-rtl') ||
        document.body.classList.contains('translated-ltr');

      if (!isEnglish && !isTranslated) {
        window.location.reload();
      } else if (isEnglish && isTranslated) {
        window.location.reload();
      }
    }, 250);
  } catch (err) {
    console.warn('Language switch notice:', err);
  }
}

interface LanguageSwitcherProps {
  variant?: 'mobile-drawer' | 'footer' | 'compact';
  className?: string;
  onLanguageChanged?: (langCode: string) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'mobile-drawer',
  className = '',
  onLanguageChanged,
}) => {
  const [activeLang, setActiveLang] = useState<string>('en');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    setActiveLang(getActiveLanguage());

    // Listen for changes from other widgets or Google Translate
    const interval = setInterval(() => {
      const current = getActiveLanguage();
      setActiveLang((prev) => (prev !== current ? current : prev));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleSelectLanguage = (code: string) => {
    setActiveLang(code);
    setLanguage(code);
    if (onLanguageChanged) {
      onLanguageChanged(code);
    }
  };

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === activeLang) || SUPPORTED_LANGUAGES[0];

  // 1. Mobile Navigation Drawer Layout (Expandable accordion)
  if (variant === 'mobile-drawer') {
    return (
      <div className={`border-b border-gray-100 pb-2 select-none ${className}`}>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-2 text-left font-semibold text-[#2d3748] hover:text-[#a87932] transition-colors cursor-pointer"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#a87932] shrink-0" />
            <span className="text-[14px]">Language</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#a87932] bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#ebdcc9] shrink-0">
            <span>{currentLangObj.native}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {isExpanded && (
          <div className="pt-2 pb-1 space-y-2.5 animate-fadeIn">
            {/* Quick language pills */}
            <div className="flex flex-wrap gap-1.5">
              {SUPPORTED_LANGUAGES.slice(0, 5).map((l) => {
                const isSelected = activeLang === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleSelectLanguage(l.code)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#b8863b] text-white shadow-xs font-semibold'
                        : 'bg-white text-[#475569] border border-[#e2d9cc] hover:border-[#b8863b]'
                    }`}
                  >
                    {l.native}
                  </button>
                );
              })}
            </div>

            {/* Complete Language Grid */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {SUPPORTED_LANGUAGES.map((l) => {
                const isSelected = activeLang === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleSelectLanguage(l.code)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#b8863b]/10 text-[#a87932] font-bold border border-[#b8863b]/30'
                        : 'bg-[#faf8f5] text-slate-700 hover:bg-[#f3ede3] border border-[#ebdcc9]'
                    }`}
                  >
                    <span className="truncate">{l.native}</span>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-1">({l.name})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Footer Layout (Dark Navy theme)
  if (variant === 'footer') {
    return (
      <div className={`relative inline-block ${className}`}>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#142233] hover:bg-[#18293d] border border-[#23354c] hover:border-[#b8863b]/70 rounded text-[11px] text-gray-300 transition-colors">
          <Globe className="w-3 h-3 text-[#b8863b] shrink-0" />
          <select
            value={activeLang}
            onChange={(e) => handleSelectLanguage(e.target.value)}
            className="bg-transparent text-gray-200 text-[11px] cursor-pointer focus:outline-none pr-1"
            aria-label="Select footer language"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-[#0e1927] text-gray-100">
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  // 3. Compact inline layout
  return (
    <div className={`inline-flex items-center gap-1.5 text-xs ${className}`}>
      <Globe className="w-3.5 h-3.5 text-[#b8863b]" />
      <select
        value={activeLang}
        onChange={(e) => handleSelectLanguage(e.target.value)}
        className="bg-white border border-[#e2d9cc] rounded px-2 py-1 text-xs cursor-pointer focus:outline-none"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.native}
          </option>
        ))}
      </select>
    </div>
  );
};
