import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube, Facebook, Music, Gamepad2, Twitch, Globe, ChevronDown, Linkedin } from "lucide-react";
import { useStore } from "../store";
import { translations, LanguageCode } from "../translations";

export default function Footer() {
  const setAdmin = useStore(state => state.setAdmin);
  const { language, setLanguage, themeSettings } = useStore();
  const t = translations[language];

  return (
    <footer className="bg-transparent text-gray-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-8 border-b border-white/10 mt-10">
          <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0 font-bold text-sm tracking-wider uppercase">
            <Link to="/support" className="hover:text-white transition-colors">{t.contact}</Link>
            <Link to="/corporate" className="hover:text-white transition-colors">{t.careers}</Link>
            <Link to="/corporate" className="hover:text-white transition-colors">{t.community}</Link>
          </div>
          
          <div className="relative group">
            <button className="flex items-center gap-2 border border-gray-600 rounded px-4 py-2 hover:border-white transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-bold uppercase">{language}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-[var(--color-secondary)] border border-gray-700 rounded shadow-xl overflow-hidden min-w-[120px]">
              {[
                { code: "pt", label: "Português" },
                { code: "en", label: "English" },
                { code: "es", label: "Español" },
                { code: "fr", label: "Français" },
                { code: "de", label: "Deutsch" },
              ].map(lang => (
                <button 
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as LanguageCode)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 ${language === lang.code ? 'text-[var(--color-primary)] font-bold' : 'text-gray-300'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center text-xs gap-6">
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/corporate" className="hover:text-white transition-colors">{t.corporate}</Link>
            <Link to="/legal" className="hover:text-white transition-colors">{t.privacy}</Link>
            <Link to="/legal" className="hover:text-white transition-colors">{t.cookieSettings}</Link>
            <Link to="/legal" className="hover:text-white transition-colors">{t.cookiePolicy}</Link>
            <Link to="/legal" className="hover:text-white transition-colors">{t.legal}</Link>
          </div>

          <div className="flex items-center gap-6">
            {themeSettings?.socialLinks?.instagram && <a href={themeSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>}
            {themeSettings?.socialLinks?.x && <a href={themeSettings.socialLinks.x} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>}
            {themeSettings?.socialLinks?.linkedin && <a href={themeSettings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>}
            {themeSettings?.socialLinks?.youtube && <a href={themeSettings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>}
            {themeSettings?.socialLinks?.facebook && <a href={themeSettings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>}
            {themeSettings?.socialLinks?.tiktok && <a href={themeSettings.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Music className="w-5 h-5" /></a>}
            {themeSettings?.socialLinks?.discord && <a href={themeSettings.socialLinks.discord} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Gamepad2 className="w-5 h-5" /></a>}
            {themeSettings?.socialLinks?.twitch && <a href={themeSettings.socialLinks.twitch} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Twitch className="w-5 h-5" /></a>}
          </div>
        </div>

        <div className="flex justify-between items-center mt-8 text-xs text-gray-600">
          <div className="flex items-center gap-2 md:gap-8">
            <div className="flex items-center gap-2">
              <span className="cursor-default select-none">
                Stormyx Interactive
              </span>
            </div>
            <div className="hidden md:flex gap-4">
              <span>Portugal</span>
              <span>Lisboa</span>
            </div>
          </div>
          <span className="font-mono"></span>
        </div>
      </div>
    </footer>
  );
}
