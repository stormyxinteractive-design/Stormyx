import { useState } from "react";
import Lightbox from "../components/Lightbox";
import { useParams } from "react-router-dom";
import { useStore } from "../store";
import { translations } from "../translations";
import { PlatformIcon } from "../components/PlatformIcon";
import VideoModal from "../components/VideoModal";
import { Play } from "lucide-react";
import { trackEvent } from "../analytics";

export default function GameDetails() {
  const { id } = useParams();
  const { games, language } = useStore();
  const t = translations[language];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const game = games.find(g => g.id === id);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!game) return (
    <div className="pt-32 pb-16 px-4 text-center text-white min-h-screen">
      <h1 className="text-3xl font-bold uppercase">{t.noGamesFound}</h1>
    </div>
  );

  return (
    <div className="w-full flex flex-col -mt-16 bg-[var(--color-secondary)] min-h-screen">
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)] via-black/40 to-transparent z-10 pointer-events-none"></div>
        <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop" }} 
          src={game.coverImage || "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop"} 
          alt={game.name} 
          onClick={() => setLightboxImage(game.coverImage || "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop")}
          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-16 px-4 sm:px-6 lg:px-12 max-w-[1920px] mx-auto w-full pointer-events-none">
          <div className="pointer-events-auto">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase drop-shadow-2xl mb-4">
              {game.name}
            </h1>
            <div className="flex gap-4 items-center">
              {game.status !== 'anuncio' && (
                <span className="font-mono text-2xl font-bold text-[var(--color-primary)]">€{game.price.toFixed(2)}</span>
              )}
              {game.status !== 'venda' && (
                <span className="bg-[var(--color-accent)] text-black text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                  {game.status === 'pre-venda' ? 'Pré-venda' : 'Anúncio'}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-12 max-w-[1920px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-white border-b border-white/10 pb-2">{t.aboutGame}</h2>
            <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
              {game.longDesc || game.shortDesc}
            </div>
          </div>
          
          {game.gallery && game.gallery.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-white border-b border-white/10 pb-2">Galeria</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {game.gallery.map((img, idx) => (
                  <div key={idx} className="aspect-video rounded-xl overflow-hidden shadow-lg border border-white/5">
                    <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop" }} onClick={() => setLightboxImage(img)} src={img} alt={`${game.name} - Imagem ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-black/40 p-8 rounded-2xl border border-white/5 h-fit backdrop-blur-sm shadow-xl sticky top-24">
          <h3 className="text-lg font-bold uppercase tracking-wider mb-4 text-white">{t.gameInfo}</h3>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-gray-800 pb-2 items-center">
              <span className="text-gray-500 uppercase font-bold">{t.platforms}</span>
              <span className="flex items-center gap-2 text-white">
                {(game.platforms || []).map(p => (
                  <span key={p} className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded text-xs font-bold" title={p}>
                    <PlatformIcon platform={p} className="w-3 h-3" /> {p}
                  </span>
                ))}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500 uppercase font-bold">{t.developer}</span>
              <span className="text-white text-right">Stormyx Interactive</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500 uppercase font-bold">{t.publisher}</span>
              <span className="text-white text-right">Stormyx Interactive</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <a 
              href={game.buyLink || "#"} 
              onClick={() => trackEvent(game.status === "pre-venda" ? "clicks_preorder" : game.status === "anuncio" ? "clicks_learnmore" : "clicks_buy")} 
              target="_blank" rel="noopener noreferrer"
              className="block w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white font-bold uppercase tracking-widest text-center py-4 rounded transition-colors"
            >
              {game.status === 'pre-venda' ? t.preOrderNow : game.status === 'anuncio' ? 'Saiba Mais' : t.buyNow}
            </a>
            {game.trailerUrl && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest text-center py-4 rounded transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" /> Watch Trailer
              </button>
            )}
          </div>
        </div>
      </section>
      <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoUrl={game.trailerUrl || ""} />
    </div>
  );
}
