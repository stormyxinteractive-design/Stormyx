const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const importLines = `import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";`;

code = code.replace(/import \{ useState \} from "react";\nimport \{ Link \} from "react-router-dom";/, importLines);

const useStoreLine = `const { language, themeSettings, games, news } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");`;

code = code.replace(/const \{ language, themeSettings \} = useStore\(\);/, useStoreLine);

const searchContent = `
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
                          <button key={game.id} onClick={() => { navigate(\`/games/\${game.id}\`); setShowSearch(false); setSearchQuery(""); }} className="flex items-center gap-4 p-2 hover:bg-white/10 rounded-lg text-left transition-colors">
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
                          <button key={item.id} onClick={() => { navigate(\`/news/\${item.id}\`); setShowSearch(false); setSearchQuery(""); }} className="flex items-center gap-4 p-2 hover:bg-white/10 rounded-lg text-left transition-colors">
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
`;

code = code.replace(/<motion\.div[\s\S]*?<\/motion\.div>/, searchContent.trim());

fs.writeFileSync('src/components/Navbar.tsx', code);
