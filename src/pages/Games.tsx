import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store";
import { translations } from "../translations";
import { motion } from "motion/react";
import { PlatformIcon } from "../components/PlatformIcon";
import { Search } from "lucide-react";

export default function Games() {
  const { games, language, themeSettings } = useStore();
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGames = useMemo(() => {
    if (!searchTerm.trim()) return games;
    const lower = searchTerm.toLowerCase();
    return games.filter(
      (g) =>
        g.name.toLowerCase().includes(lower) ||
        g.shortDesc.toLowerCase().includes(lower) ||
        g.platforms.some((p) => p.toLowerCase().includes(lower))
    );
  }, [games, searchTerm]);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black uppercase tracking-widest"
        >
          {t.games}
        </motion.h1>
        
        {themeSettings?.showGamesSearch !== false && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full md:w-96 group"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
            <input
              type="text"
              placeholder={t.searchPlaceholder || "Search games..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 text-white rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all shadow-inner placeholder:text-gray-500"
            />
          </motion.div>
        )}
      </div>
      
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredGames.map((game, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={game.id}
            >
              <Link to={`/games/${game.id}`} className="group block overflow-hidden rounded-xl bg-black border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_20px_var(--color-primary)] hover:border-[var(--color-primary)]/50">
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img src={game.coverImage || "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop"} alt={game.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  {game.status !== 'venda' && (
                    <div className="absolute top-4 left-4 bg-[var(--color-accent)] text-black text-xs font-bold px-3 py-1 rounded uppercase tracking-wider shadow-lg">
                      {game.status === 'pre-venda' ? 'Pré-venda' : 'Anúncio'}
                    </div>
                  )}
                </div>
                <div className="p-5 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h3 className="font-bold text-lg mb-2 truncate uppercase relative z-10">{game.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 relative z-10">{game.shortDesc}</p>
                  <div className="flex justify-between items-center relative z-10">
                    <span className="font-mono font-bold text-[var(--color-primary)]">
                      {game.status !== 'anuncio' ? `€${game.price.toFixed(2)}` : ''}
                    </span>
                    <div className="flex gap-2 text-gray-400">
                      {game.platforms.slice(0, 3).map(p => (
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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-black/20 backdrop-blur-sm"
        >
          <Search className="w-12 h-12 text-gray-600 mb-4" />
          <p className="text-xl font-bold uppercase tracking-widest text-gray-400">
            {searchTerm ? "Nenhum jogo encontrado." : t.noGames}
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-4 text-[var(--color-primary)] hover:underline text-sm font-bold uppercase tracking-wider"
            >
              Limpar Pesquisa
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
