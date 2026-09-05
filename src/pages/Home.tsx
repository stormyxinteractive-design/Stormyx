import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { translations } from "../translations";
import { trackEvent } from "../analytics";
import { PlatformIcon } from "../components/PlatformIcon";
import VideoModal from "../components/VideoModal";

export default function Home() {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, 300]);
  const textParallaxY = useTransform(scrollY, [0, 1000], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const { games, news, themeSettings, language } = useStore();
  const t = translations[language];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState("");

  // We can use a couple of featured games as slides, or fallback to default
  const slides = games.filter(g => g.coverImage).slice(0, 3).map(g => ({
    id: g.id,
    image: g.coverImage,
    title: g.name,
    subtitle: g.shortDesc,
    btn1: t.moreInfo,
    btn2: t.buyNow,
    link1: `/games/${g.id}`,
    link2: g.buyLink || `/games/${g.id}`, status: g.status, trailerUrl: g.trailerUrl
  }));

  // Fallback if no games
  if (slides.length === 0) {
    slides.push({
      id: "default",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2940&auto=format&fit=crop",
      title: themeSettings?.heroTitle || "STORMYX INTERACTIVE",
      subtitle: themeSettings?.heroSubtitle || "Welcome",
      btn1: t.exploreCatalog,
      btn2: t.store,
      link1: "/games",
      link2: "/store",
      status: "venda",
      trailerUrl: ""
    });
  }

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="w-full flex flex-col -mt-16">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] md:h-screen overflow-hidden bg-black group">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)] via-black/60 to-black/20 z-10 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)] via-transparent to-transparent z-10"></div>
            <motion.img 
              style={{ y: parallaxY }}
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop" }} 
              src={slides[currentSlide].image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2940&auto=format&fit=crop"} 
              alt={slides[currentSlide].title} 
              className="w-full h-[120%] object-cover -top-[10%] relative"
            />
            
            <motion.div style={{ y: textParallaxY, opacity: heroOpacity }} className="absolute inset-0 z-20 flex items-center justify-center pt-24 px-4">
              <div className="text-center max-w-5xl px-4">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-6 inline-block"
                >
                  {slides[currentSlide].status && slides[currentSlide].status !== 'venda' && (
                    <span className="bg-[var(--color-primary)] text-white text-sm font-bold px-5 py-2 rounded-full uppercase tracking-widest shadow-[0_0_20px_var(--color-primary)] backdrop-blur-md">
                      {slides[currentSlide].status === 'pre-venda' ? 'Pré-venda' : 'Anúncio'}
                    </span>
                  )}
                </motion.div>
                <motion.h1 
                  initial={{ y: 40, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-7xl md:text-9xl font-black tracking-tighter text-white uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] mb-6 leading-none"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xl md:text-3xl font-medium text-gray-300 mb-12 tracking-wide drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] max-w-3xl mx-auto"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row gap-6 justify-center"
                >
                  <Link to={slides[currentSlide].link1} onClick={() => trackEvent("clicks_learnmore")} className="relative group overflow-hidden bg-white text-black font-black uppercase tracking-widest px-10 py-5 rounded-full hover:text-white transition-all duration-500 transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_var(--color-primary)]">
                    <span className="relative z-10">{slides[currentSlide].btn1}</span>
                    <div className="absolute inset-0 h-full w-0 bg-[var(--color-primary)] transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                  </Link>
                  {slides[currentSlide].trailerUrl && (
                    <button 
                      onClick={() => { setActiveTrailer(slides[currentSlide].trailerUrl); setIsModalOpen(true); setIsPlaying(false); }}
                      className="relative group overflow-hidden bg-black/40 backdrop-blur-md border border-white/20 text-white font-black uppercase tracking-widest px-8 py-5 rounded-full transition-all duration-500 transform hover:scale-105 flex items-center justify-center gap-3 hover:border-white/50"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span className="relative z-10">Trailer</span>
                      <div className="absolute inset-0 h-full w-0 bg-white/10 transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                    </button>
                  )}
                  {slides[currentSlide].status !== 'anuncio' && (
                    <Link to={slides[currentSlide].link2} onClick={() => trackEvent(slides[currentSlide].status === "pre-venda" ? "clicks_preorder" : "clicks_buy")} className="relative group overflow-hidden bg-transparent border-2 border-white/50 text-white font-black uppercase tracking-widest px-10 py-5 rounded-full hover:border-[var(--color-tertiary)] transition-all duration-500 transform hover:scale-105">
                      <span className="relative z-10 group-hover:text-white">{slides[currentSlide].status === 'pre-venda' ? 'Pré-venda' : slides[currentSlide].btn2}</span>
                      <div className="absolute inset-0 h-full w-0 bg-[var(--color-tertiary)]/20 transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute bottom-10 left-0 w-full z-30 px-8 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-gray-300 transition-colors">
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-12 h-1 rounded-full transition-all ${currentSlide === idx ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={prevSlide} className="bg-black/50 hover:bg-black p-3 rounded-full text-white backdrop-blur-sm border border-white/10 transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="bg-black/50 hover:bg-black p-3 rounded-full text-white backdrop-blur-sm border border-white/10 transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Transition Blur */}
      <div className="w-full h-48 bg-gradient-to-b from-transparent via-[var(--color-secondary)] to-[var(--color-secondary)] -mt-48 relative z-10 backdrop-blur-[4px] pointer-events-none"></div>

      {/* Featured Games */}
      <section className="relative z-20 pt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-between items-end mb-12 lg:px-8"
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white drop-shadow-md">{t.featuredGames}</h2>
          <Link to="/games" className="text-[var(--color-primary)] font-bold hover:text-white transition-colors uppercase text-sm tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10">{t.viewAll}</Link>
        </motion.div>
        
        {games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:px-8">
            {games.slice(0, 4).map((game, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={game.id}
              >
                <Link to={`/games/${game.id}`} className="group block overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_20px_var(--color-primary)] hover:border-[var(--color-primary)]/60">
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop" }} src={game.coverImage || "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop"} alt={game.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100 brightness-90 group-hover:brightness-110" />
                    {game.status !== 'venda' && (
                      <div className="absolute top-4 left-4 backdrop-blur-md bg-black/40 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        {game.status === 'pre-venda' ? 'Pré-venda' : 'Anúncio'}
                      </div>
                    )}
                  </div>
                  <div className="p-5 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-tertiary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="font-bold text-lg mb-2 truncate uppercase relative z-10">{game.name}</h3>
                    <div className="flex justify-between items-center relative z-10">
                      <span className="font-mono font-bold">
                        {game.status !== 'anuncio' ? `€${game.price.toFixed(2)}` : ''}
                      </span>
                      <div className="flex gap-2 text-gray-400">
                        {(game.platforms || []).slice(0, 3).map(p => (
                          <span key={p}><PlatformIcon platform={p} className="w-4 h-4" /></span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 border border-dashed border-gray-700 rounded-2xl">
            <p>{t.noGames}</p>
          </div>
        )}
      </section>

      {/* Latest News */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 w-full border-t border-white/5 bg-transparent">
        <div className="max-w-[1920px] mx-auto lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white drop-shadow-md mb-12"
          >
            {t.newswire}
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {news.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Link to={`/news/${news[0].id}`} className="group flex flex-col h-full bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-white/20">
                  <div className="aspect-[16/9] lg:flex-1 overflow-hidden relative">
                    <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop" }} src={news[0].image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop"} alt={news[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"></div>
                  </div>
                  <div className="p-8 md:p-10 z-10 -mt-16 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]">
                    <div className="text-xs font-bold px-2 py-1 rounded bg-white/10 uppercase tracking-widest inline-block mb-4">Featured</div>
                    <h3 className="text-3xl md:text-5xl font-black uppercase leading-[1.1] mb-6">
                      {news[0].title}
                    </h3>
                    <p className="text-gray-400 text-sm font-mono">{news[0].date}</p>
                  </div>
                </Link>
              </motion.div>
            )}

            {news.length > 1 && (
              <div className="flex flex-col gap-6">
                {news.slice(1, 4).map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    key={item.id}
                  >
                    <Link to={`/news/${item.id}`} className="group flex flex-col sm:flex-row h-full rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/5 p-2 -m-2">
                      <div className="w-full sm:w-[45%] aspect-video overflow-hidden rounded-lg relative shadow-lg">
                        <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop" }} src={item.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop"} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="w-full sm:w-[55%] p-4 sm:p-6 flex flex-col justify-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Update</span>
                        <h3 className="text-xl md:text-2xl font-bold uppercase leading-tight mb-4 group-hover:text-[var(--color-primary)] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm font-mono mt-auto">{item.date}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <VideoModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setIsPlaying(true); }} videoUrl={activeTrailer} />
    </div>
  );
}
