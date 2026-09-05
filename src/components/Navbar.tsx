import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, User, Eye, EyeOff } from "lucide-react";
import { loginWithGoogle, logout } from "../firebase";
import { trackEvent } from "../analytics";
import { getAuth } from "firebase/auth";
import { useStore } from "../store";
import { translations } from "../translations";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { language, themeSettings, games, news, highContrast, setHighContrast } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const t = translations[language];
  const auth = getAuth();
  const user = auth.currentUser;

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      trackEvent("logins");
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { name: t.games, path: "/games", visible: themeSettings?.tabVisibility?.games ?? true },
    { name: t.newswire, path: "/news", visible: themeSettings?.tabVisibility?.newswire ?? true },
    { name: t.videos, path: "/videos", visible: themeSettings?.tabVisibility?.videos ?? true },
    { name: t.downloads, path: "/downloads", visible: themeSettings?.tabVisibility?.downloads ?? true },
    { name: t.store, path: "/store", visible: themeSettings?.tabVisibility?.store ?? true },
    { name: t.support, path: "/support", visible: themeSettings?.tabVisibility?.support ?? true }
  ].filter(link => link.visible);

  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed w-full z-50 bg-transparent backdrop-blur-sm border-b border-white/5 transition-colors duration-300 hover:bg-black/40"
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black tracking-tighter text-white uppercase flex items-center gap-2">
              {themeSettings?.logoUrl ? (
                <img src={themeSettings.logoUrl} alt="Logo" style={{ height: themeSettings.logoSize ? `${themeSettings.logoSize}px` : '32px' }} className="object-contain" />
              ) : (
                <>
                  <span className="text-[var(--color-accent)] text-3xl leading-none">S</span>
                  <span className="hidden sm:block">Stormyx</span>
                </>
              )}
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-colors drop-shadow-md"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setHighContrast(!highContrast)}
              className="text-gray-300 hover:text-white p-2"
              title="Toggle High Contrast Mode"
            >
              {highContrast ? <EyeOff className="w-5 h-5 text-[var(--color-primary)]" /> : <Eye className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="text-gray-300 hover:text-white p-2"
            >
              <Search className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-4">
              
                <button 
                  onClick={() => { setHighContrast(!highContrast); setIsOpen(false); }} 
                  className="w-full text-center border border-gray-700 text-white font-bold uppercase tracking-wider text-sm px-5 py-3 rounded-full flex justify-center items-center gap-2 mb-4"
                >
                  {highContrast ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} {highContrast ? "Standard Contrast" : "High Contrast"}
                </button>
                {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-600" />
                    ) : (
                      <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center bg-gray-800">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded shadow-xl hidden group-hover:block">
                    <div className="px-4 py-2 border-b border-gray-700 text-sm font-bold truncate">{user.email}</div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/10">{t.logout}</button>
                  </div>
                </div>
              ) : (
                <button onClick={handleLogin} className="text-gray-300 hover:text-white p-2">
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
              >
                {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSearch && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-black/95 backdrop-blur-xl border-b border-white/10 py-4 px-4 sm:px-6 lg:px-8 flex flex-col items-center overflow-visible absolute top-full left-0 z-50 shadow-2xl"
          >
            <div className="max-w-3xl w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder || "Search games, news..."}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                autoFocus
              />
              
              {searchQuery.trim().length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-gray-900/90 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl max-h-[60vh] overflow-y-auto p-4 flex flex-col gap-6">
                  {/* Games Results */}
                  {games.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Games</h3>
                      <div className="flex flex-col gap-2">
                        {games.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())).map(game => (
                          <button key={game.id} onClick={() => { navigate(`/games/${game.id}`); setShowSearch(false); setSearchQuery(""); }} className="flex items-center gap-4 p-2 hover:bg-white/10 rounded-lg text-left transition-colors">
                            {game.coverImage && <img src={game.coverImage} className="w-12 h-16 object-cover rounded" alt="" />}
                            <div>
                              <p className="font-bold text-white">{game.name}</p>
                              <p className="text-xs text-[var(--color-primary)] uppercase">{game.status}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* News Results */}
                  {news.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">News</h3>
                      <div className="flex flex-col gap-2">
                        {news.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                          <button key={item.id} onClick={() => { navigate(`/news/${item.id}`); setShowSearch(false); setSearchQuery(""); }} className="flex items-center gap-4 p-2 hover:bg-white/10 rounded-lg text-left transition-colors">
                            {item.image && <img src={item.image} className="w-16 h-12 object-cover rounded" alt="" />}
                            <div>
                              <p className="font-bold text-white line-clamp-1">{item.title}</p>
                              <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {games.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && news.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No results found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black border-b border-white/10 absolute w-full h-[calc(100vh-64px)] flex flex-col z-50 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-4 rounded-md text-base font-bold uppercase tracking-wider text-center border-b border-white/5"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-8 px-4 flex flex-col gap-4">
                {user ? (
                  <button onClick={handleLogout} className="w-full text-center border border-gray-700 text-white font-bold uppercase tracking-wider text-sm px-5 py-3 rounded-full">
                    {t.logout}
                  </button>
                ) : (
                  <button onClick={handleLogin} className="w-full text-center border border-gray-700 text-white font-bold uppercase tracking-wider text-sm px-5 py-3 rounded-full flex justify-center items-center gap-2">
                    <User className="w-4 h-4" /> {t.login}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
