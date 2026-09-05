import React, { useState, useEffect } from "react";
import { useStore } from "../store";
import { X, Save, Plus, Trash, Image as ImageIcon } from "lucide-react";
import { db, storage } from "../firebase";
import { doc, setDoc, deleteDoc, collection, getDocs, query, orderBy, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Game, News, Video, Download, FAQ, ThemeSettings, Product } from "../types";

export default function AdminPanel() {
  const { isAdmin, setAdmin, games, news, videos, downloads, products, faqs, jobs, themeSettings, language } = useStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState("games");
  const [uploading, setUploading] = useState(false);

  // Local state for editing
  const [localTheme, setLocalTheme] = useState(themeSettings);
  const [localGames, setLocalGames] = useState<Game[]>([]);
  const [localNews, setLocalNews] = useState<News[]>([]);
  const [localVideos, setLocalVideos] = useState<Video[]>([]);
  const [localDownloads, setLocalDownloads] = useState<Download[]>([]);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [localFaqs, setLocalFaqs] = useState<FAQ[]>([]);
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>({ visits: 0, logins: 0, clicks_buy: 0, clicks_preorder: 0, clicks_learnmore: 0 });

  useEffect(() => { if (themeSettings) setLocalTheme(themeSettings); }, [themeSettings]);
  useEffect(() => { setLocalGames(games); }, [games]);
  useEffect(() => { setLocalNews(news); }, [news]);
  useEffect(() => { setLocalVideos(videos); }, [videos]);
  useEffect(() => { setLocalDownloads(downloads); }, [downloads]);
  useEffect(() => { setLocalProducts(products); }, [products]);
  useEffect(() => { setLocalFaqs(faqs); }, [faqs]);


  useEffect(() => {
    if (activeTab === "analytics") {
      const unsub = onSnapshot(doc(db, "analytics", "global"), (docSnapshot) => {
        if (docSnapshot.exists()) {
          setAnalyticsData(docSnapshot.data());
        }
      });
      return () => unsub();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "messages") {
      const fetchMessages = async () => {
        try {
          const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
          const snapshot = await getDocs(q);
          setLocalMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
          console.error(e);
        }
      };
      fetchMessages();
    }
  }, [activeTab]);

  if (!isAdmin) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "247329€;#!") {
      setUnlocked(true);
      setError("");
    } else {
      setError("Código inválido / Invalid code");
    }
  };

  const closePanel = () => {
    setAdmin(false);
    setUnlocked(false);
    setCode("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const metadata = {
        contentDisposition: file.type.startsWith("image/") ? "inline" : `attachment; filename="${file.name}"`
      };
      await uploadBytes(storageRef, file, metadata);
      const url = await getDownloadURL(storageRef);
      callback(url);
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const saveDoc = async (col: string, item: any) => {
    await setDoc(doc(db, col, item.id), item);
    alert("Saved successfully!");
  };

  const removeDoc = async (col: string, id: string) => {
    await deleteDoc(doc(db, col, id));
    if (col === 'games') setLocalGames(prev => prev.filter(x => x.id !== id));
    if (col === 'news') setLocalNews(prev => prev.filter(x => x.id !== id));
    if (col === 'videos') setLocalVideos(prev => prev.filter(x => x.id !== id));
    if (col === 'downloads') setLocalDownloads(prev => prev.filter(x => x.id !== id));
    if (col === 'products') setLocalProducts(prev => prev.filter(x => x.id !== id));
    if (col === 'faqs') setLocalFaqs(prev => prev.filter(x => x.id !== id));
    if (col === 'messages') setLocalMessages(prev => prev.filter(x => x.id !== id));
  };

  const tabs = [
    { id: "games", label: "Games" },
    { id: "news", label: "News" },
    { id: "videos", label: "Videos" },
    { id: "downloads", label: "Downloads" },
    { id: "products", label: "Store" },
    { id: "faqs", label: "FAQs" },
    { id: "jobs", label: "Careers (Jobs)" },
    { id: "theme", label: "Theme & General" },
    { id: "messages", label: "Messages" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 pointer-events-auto" onClick={(e) => { if(e.target === e.currentTarget) closePanel(); }}>
      <div className="bg-[var(--color-secondary)] w-full max-w-5xl h-[80vh] overflow-hidden rounded-xl border border-white/10 shadow-2xl relative flex flex-col">
        <button onClick={closePanel} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white z-10">
          <X className="w-6 h-6" />
        </button>

        {!unlocked ? (
          <div className="p-12 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-white uppercase tracking-widest">Admin Access</h2>
            <form onSubmit={handleUnlock} className="flex flex-col gap-4 w-full max-w-sm">
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter access code"
                className="bg-black/50 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)]"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white font-bold py-3 rounded uppercase tracking-wider transition-colors">
                Unlock
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-1 h-full overflow-hidden">
            <div className="flex-1 p-8 overflow-y-auto relative">
              <div className="mb-8 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-black text-white uppercase tracking-wider">{tabs.find(t => t.id === activeTab)?.label}</h2>
              </div>

            {['games', 'news', 'videos', 'downloads', 'products', 'faqs'].includes(activeTab) && localTheme && (
              <div className="mb-6 flex justify-end">
                <label className="flex items-center gap-3 cursor-pointer bg-gray-900/50 px-4 py-3 rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors">
                  <span className="text-gray-300 font-bold uppercase text-xs tracking-wider">Show in Navbar</span>
                  <input
                    type="checkbox"
                    checked={
                      localTheme.tabVisibility?.[
                        (activeTab === 'products' ? 'store' : activeTab === 'news' ? 'newswire' : activeTab === 'faqs' ? 'support' : activeTab) as keyof typeof localTheme.tabVisibility
                      ] ?? true
                    }
                    onChange={(e) => {
                      const tabKey = activeTab === 'products' ? 'store' : activeTab === 'news' ? 'newswire' : activeTab === 'faqs' ? 'support' : activeTab;
                      const newVisibility = {
                        ...(localTheme.tabVisibility || { games: true, newswire: true, videos: true, downloads: true, store: true, support: true }),
                        [tabKey]: e.target.checked
                      };
                      setLocalTheme({ ...localTheme, tabVisibility: newVisibility });
                      saveDoc("settings", { id: "theme", ...localTheme, tabVisibility: newVisibility });
                    }}
                    className="w-5 h-5 accent-[var(--color-primary)]"
                  />
                </label>
              </div>
            )}

            {/* THEME & GENERAL */}
            
            {activeTab === "analytics" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-black/80 backdrop-blur p-6 rounded-xl border border-gray-800 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Total Visitors</h3>
                    <p className="text-4xl font-black text-white relative z-10">{analyticsData.visits || 0}</p>
                  </div>
                  
                  <div className="bg-black/80 backdrop-blur p-6 rounded-xl border border-gray-800 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-tertiary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Registered / Logins</h3>
                    <p className="text-4xl font-black text-white relative z-10">{analyticsData.logins || 0}</p>
                    <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5 relative z-10 overflow-hidden">
                      <div className="bg-[var(--color-tertiary)] h-1.5 rounded-full" style={{ width: `${Math.min(((analyticsData.logins || 0) / Math.max(analyticsData.visits || 1, 1)) * 100, 100)}%` }}></div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold relative z-10">{((analyticsData.logins || 0) / Math.max(analyticsData.visits || 1, 1) * 100).toFixed(1)}% Conversion</p>
                  </div>

                  <div className="bg-black/80 backdrop-blur p-6 rounded-xl border border-gray-800 relative overflow-hidden group md:col-span-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Total Purchase Intent (Buy + Pre-order)</h3>
                    <div className="flex items-end gap-4 relative z-10">
                      <p className="text-4xl font-black text-white">{(analyticsData.clicks_buy || 0) + (analyticsData.clicks_preorder || 0)}</p>
                      <p className="text-sm font-bold text-green-400 mb-1">+{(analyticsData.clicks_buy || 0)} Sales / +{(analyticsData.clicks_preorder || 0)} Pre-orders</p>
                    </div>
                    <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5 relative z-10 overflow-hidden">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min((((analyticsData.clicks_buy || 0) + (analyticsData.clicks_preorder || 0)) / Math.max(analyticsData.visits || 1, 1)) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/80 backdrop-blur p-8 rounded-xl border border-gray-800">
                  <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-8">Interaction Funnel</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                        <span className="text-gray-400">Discover (Learn More Clicks)</span>
                        <span className="text-white">{analyticsData.clicks_learnmore || 0}</span>
                      </div>
                      <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                        <div className="bg-[var(--color-primary)] h-3 rounded-full transition-all duration-1000" style={{ width: `${Math.min(((analyticsData.clicks_learnmore || 0) / Math.max(analyticsData.visits || 1, 1)) * 100, 100)}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                        <span className="text-gray-400">Commitment (Pre-order Clicks)</span>
                        <span className="text-white">{analyticsData.clicks_preorder || 0}</span>
                      </div>
                      <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                        <div className="bg-yellow-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${Math.min(((analyticsData.clicks_preorder || 0) / Math.max(analyticsData.visits || 1, 1)) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                        <span className="text-gray-400">Conversion (Buy Clicks)</span>
                        <span className="text-white">{analyticsData.clicks_buy || 0}</span>
                      </div>
                      <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                        <div className="bg-green-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${Math.min(((analyticsData.clicks_buy || 0) / Math.max(analyticsData.visits || 1, 1)) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "theme" && localTheme && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Primary Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={localTheme.primaryColor} onChange={e => setLocalTheme({...localTheme, primaryColor: e.target.value})} className="w-10 h-10 rounded cursor-pointer" />
                      <input type="text" value={localTheme.primaryColor} onChange={e => setLocalTheme({...localTheme, primaryColor: e.target.value})} className="bg-black border border-gray-700 rounded px-3 flex-1 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Secondary (Bg) Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={localTheme.secondaryColor} onChange={e => setLocalTheme({...localTheme, secondaryColor: e.target.value})} className="w-10 h-10 rounded cursor-pointer" />
                      <input type="text" value={localTheme.secondaryColor} onChange={e => setLocalTheme({...localTheme, secondaryColor: e.target.value})} className="bg-black border border-gray-700 rounded px-3 flex-1 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Accent Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={localTheme.accentColor} onChange={e => setLocalTheme({...localTheme, accentColor: e.target.value})} className="w-10 h-10 rounded cursor-pointer" />
                      <input type="text" value={localTheme.accentColor} onChange={e => setLocalTheme({...localTheme, accentColor: e.target.value})} className="bg-black border border-gray-700 rounded px-3 flex-1 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Tertiary Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={localTheme.tertiaryColor || "#db2777"} onChange={e => setLocalTheme({...localTheme, tertiaryColor: e.target.value})} className="w-10 h-10 rounded cursor-pointer" />
                      <input type="text" value={localTheme.tertiaryColor || "#db2777"} onChange={e => setLocalTheme({...localTheme, tertiaryColor: e.target.value})} className="bg-black border border-gray-700 rounded px-3 flex-1 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Quaternary Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={localTheme.quaternaryColor || "#10b981"} onChange={e => setLocalTheme({...localTheme, quaternaryColor: e.target.value})} className="w-10 h-10 rounded cursor-pointer" />
                      <input type="text" value={localTheme.quaternaryColor || "#10b981"} onChange={e => setLocalTheme({...localTheme, quaternaryColor: e.target.value})} className="bg-black border border-gray-700 rounded px-3 flex-1 text-white" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Hero Title</label>
                  <input type="text" value={localTheme.heroTitle} onChange={e => setLocalTheme({...localTheme, heroTitle: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Hero Subtitle</label>
                  <input type="text" value={localTheme.heroSubtitle} onChange={e => setLocalTheme({...localTheme, heroSubtitle: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">About Us Text</label>
                  <textarea value={localTheme.aboutText} onChange={e => setLocalTheme({...localTheme, aboutText: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white h-32"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Contact Email</label>
                  <input type="email" value={localTheme.contactEmail} onChange={e => setLocalTheme({...localTheme, contactEmail: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Launcher Download Link</label>
                    <input type="text" value={localTheme.launcherLink || ""} onChange={e => setLocalTheme({...localTheme, launcherLink: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white" placeholder="Direct URL or upload" />
                  </div>
                  <div className="pt-7">
                    <label className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 cursor-pointer rounded px-4 py-2 h-10 w-32 border border-gray-700 mt-1">
                      <ImageIcon className="w-5 h-5 mr-2" /> {uploading ? '...' : 'Upload'}
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setLocalTheme({...localTheme, launcherLink: url}))} />
                    </label>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Logo Image URL</label>
                    <input type="text" value={localTheme.logoUrl || ""} onChange={e => setLocalTheme({...localTheme, logoUrl: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white" />
                  </div>
                  <div className="pt-7">
                    <label className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 cursor-pointer rounded px-4 py-2 h-10 w-32 border border-gray-700 mt-1">
                      <ImageIcon className="w-5 h-5 mr-2" /> {uploading ? '...' : 'Upload'}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setLocalTheme({...localTheme, logoUrl: url}))} />
                    </label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase flex justify-between">
                    <span>Logo Size</span>
                    <span className="text-[var(--color-primary)]">{localTheme.logoSize || 32}px</span>
                  </label>
                  <input 
                    type="range" 
                    min="16" 
                    max="100" 
                    value={localTheme.logoSize || 32} 
                    onChange={e => setLocalTheme({...localTheme, logoSize: parseInt(e.target.value)})}
                    className="w-full accent-[var(--color-primary)]"
                  />
                </div>

                <div className="mt-8 border-t border-gray-800 pt-8 mb-8">
                  <h3 className="text-xl font-bold mb-4 text-white uppercase">Features</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localTheme.showGamesSearch ?? true}
                      onChange={(e) => setLocalTheme({ ...localTheme, showGamesSearch: e.target.checked })}
                      className="w-5 h-5 accent-[var(--color-primary)]"
                    />
                    <span className="text-gray-300 font-bold uppercase text-sm">Show Games Search Bar</span>
                  </label>
                </div>

                <button onClick={() => saveDoc("settings", { id: "theme", ...localTheme })} className="bg-[var(--color-primary)] text-white font-bold py-3 px-8 rounded flex items-center gap-2 uppercase hover:opacity-90">
                  <Save className="w-5 h-5" /> Save Theme & General
                </button>
              </div>
            )}

            {/* GAMES */}
            {activeTab === "games" && (
              <div>
                <button onClick={() => {
                  const newId = Date.now().toString();
                  const newGame: Game = { id: newId, name: "New Game", coverImage: "", gallery: [], shortDesc: "", longDesc: "", platforms: [], price: 59.99, status: "venda", buyLink: "", trailerUrl: "", order: localGames.length };
                  setDoc(doc(db, "games", newId), newGame);
                }} className="mb-6 bg-[var(--color-primary)] text-white px-4 py-2 rounded flex items-center gap-2 font-bold uppercase text-sm">
                  <Plus className="w-4 h-4" /> Add Game
                </button>
                <div className="space-y-6">
                  {localGames.map((game, index) => (
                    <div key={game.id} className="bg-black/50 p-6 rounded-xl border border-gray-800 relative">
                      <button onClick={() => removeDoc("games", game.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded">
                        <Trash className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Name</label>
                          <input type="text" value={game.name} onChange={(e) => { const n = [...localGames]; n[index].name = e.target.value; setLocalGames(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Price (€)</label>
                          <input type="number" value={game.price} onChange={(e) => { const n = [...localGames]; n[index].price = parseFloat(e.target.value); setLocalGames(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                        </div>
                        <div className="md:col-span-2 flex gap-4">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Cover Image URL</label>
                            <input type="text" value={game.coverImage} onChange={(e) => { const n = [...localGames]; n[index].coverImage = e.target.value; setLocalGames(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Upload Image</label>
                            <label className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 cursor-pointer rounded px-4 py-2 h-10 w-32 border border-gray-700">
                              <ImageIcon className="w-5 h-5 mr-2" /> {uploading ? '...' : 'Upload'}
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => { const n = [...localGames]; n[index].coverImage = url; setLocalGames(n); })} />
                            </label>
                          </div>
                        </div>

                        
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Trailer Video URL (YouTube or Direct)</label>
                          <input type="text" value={game.trailerUrl || ""} onChange={(e) => { const n = [...localGames]; n[index].trailerUrl = e.target.value; setLocalGames(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" placeholder="https://www.youtube.com/watch?v=..." />
                        </div>

                        {/* Gallery Section */}
                        <div className="md:col-span-2 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                          <div className="flex justify-between items-center mb-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase">Gallery Images</label>
                            <button type="button" onClick={() => {
                              const n = [...localGames];
                              n[index].gallery = [...(n[index].gallery || []), ""];
                              setLocalGames(n);
                            }} className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 cursor-pointer rounded px-4 py-2 h-8 text-xs font-bold border border-gray-700 uppercase">
                              <Plus className="w-4 h-4 mr-2" /> Add Image URL
                            </button>
                          </div>
                          {game.gallery && game.gallery.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {game.gallery.map((imgUrl, imgIdx) => (
                                <div key={imgIdx} className="flex flex-col gap-2">
                                  <div className="flex gap-2">
                                    <input 
                                      type="text"
                                      value={imgUrl}
                                      onChange={(e) => {
                                        const n = [...localGames];
                                        n[index].gallery[imgIdx] = e.target.value;
                                        setLocalGames(n);
                                      }}
                                      placeholder="Paste Image URL here"
                                      className="flex-1 bg-black/50 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                                    />
                                    <button type="button" onClick={() => { const n = [...localGames]; n[index].gallery = n[index].gallery.filter((_, i) => i !== imgIdx); setLocalGames(n); }} className="bg-red-500/80 hover:bg-red-500 p-1 rounded text-white flex-shrink-0">
                                      <Trash className="w-3 h-3" />
                                    </button>
                                  </div>
                                  {imgUrl && (
                                    <div className="relative aspect-video rounded overflow-hidden border border-gray-700 group">
                                      <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop" }} src={imgUrl} className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500">No images in gallery.</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Short Description</label>
                          <textarea value={game.shortDesc} onChange={(e) => { const n = [...localGames]; n[index].shortDesc = e.target.value; setLocalGames(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white h-20" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Long Description</label>
                          <textarea value={game.longDesc} onChange={(e) => { const n = [...localGames]; n[index].longDesc = e.target.value; setLocalGames(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white h-32" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Buy Link URL</label>
                          <input type="text" value={game.buyLink} onChange={(e) => { const n = [...localGames]; n[index].buyLink = e.target.value; setLocalGames(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Platforms</label>
                          <div className="flex flex-wrap gap-4">
                            {['PC', 'Android', 'iOS', 'PlayStation', 'Xbox'].map(platform => (
                              <label key={platform} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={(game.platforms || []).includes(platform) || (platform === "PC" && (game.platforms || []).includes("pc"))}
                                  onChange={(e) => {
                                    const n = [...localGames];
                                    if (e.target.checked) {
                                      n[index].platforms = [...(n[index].platforms || []), platform];
                                    } else {
                                      n[index].platforms = (n[index].platforms || []).filter(p => p !== platform && p !== platform.toLowerCase());
                                    }
                                    setLocalGames(n);
                                  }}
                                  className="w-4 h-4 accent-[var(--color-primary)]"
                                />
                                <span className="text-gray-300 text-sm font-bold uppercase">{platform}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Status</label>
                          <select value={game.status} onChange={(e) => { const n = [...localGames]; n[index].status = e.target.value as any; setLocalGames(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white">
                            <option value="venda">Venda (Sale)</option>
                            <option value="pre-venda">Pré-venda (Pre-sale)</option>
                            <option value="anuncio">Anúncio (Announcement)</option>
                          </select>
                        </div>
                      </div>
                      <button onClick={() => saveDoc("games", game)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold uppercase">Save Game</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEWS */}
            {activeTab === "news" && (
              <div>
                <button onClick={() => {
                  const newId = Date.now().toString();
                  const newNews: News = { id: newId, title: "New Article", date: new Date().toISOString().split('T')[0], image: "", excerpt: "", content: "" };
                  setDoc(doc(db, "news", newId), newNews);
                }} className="mb-6 bg-[var(--color-primary)] text-white px-4 py-2 rounded flex items-center gap-2 font-bold uppercase text-sm">
                  <Plus className="w-4 h-4" /> Add News
                </button>
                <div className="space-y-6">
                  {localNews.map((n, index) => (
                    <div key={n.id} className="bg-black/50 p-6 rounded-xl border border-gray-800 relative">
                      <button onClick={() => removeDoc("news", n.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded"><Trash className="w-5 h-5" /></button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Title</label>
                          <input type="text" value={n.title} onChange={(e) => { const arr = [...localNews]; arr[index].title = e.target.value; setLocalNews(arr); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Date</label>
                          <input type="date" value={n.date} onChange={(e) => { const arr = [...localNews]; arr[index].date = e.target.value; setLocalNews(arr); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                        </div>
                        <div className="md:col-span-2 flex gap-4">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Image URL</label>
                            <input type="text" value={n.image} onChange={(e) => { const arr = [...localNews]; arr[index].image = e.target.value; setLocalNews(arr); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Upload Image</label>
                            <label className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 cursor-pointer rounded px-4 py-2 h-10 w-32 border border-gray-700">
                              <ImageIcon className="w-5 h-5 mr-2" /> {uploading ? '...' : 'Upload'}
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => { const arr = [...localNews]; arr[index].image = url; setLocalNews(arr); })} />
                            </label>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Content</label>
                          <textarea value={n.content} onChange={(e) => { const arr = [...localNews]; arr[index].content = e.target.value; setLocalNews(arr); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white h-24" />
                        </div>
                      </div>
                      <button onClick={() => saveDoc("news", n)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold uppercase">Save News</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIDEOS */}
            {activeTab === "videos" && (
              <div>
                <button onClick={() => {
                  const newId = Date.now().toString();
                  const newVideo: Video = { id: newId, title: "New Video", embedLink: "", thumbnail: "", order: localVideos.length };
                  setDoc(doc(db, "videos", newId), newVideo);
                }} className="mb-6 bg-[var(--color-primary)] text-white px-4 py-2 rounded flex items-center gap-2 font-bold uppercase text-sm">
                  <Plus className="w-4 h-4" /> Add Video
                </button>
                <div className="space-y-6">
                  {localVideos.map((v, index) => (
                    <div key={v.id} className="bg-black/50 p-6 rounded-xl border border-gray-800 relative">
                      <button onClick={() => removeDoc("videos", v.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded"><Trash className="w-5 h-5" /></button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Title</label>
                          <input type="text" value={v.title} onChange={(e) => { const arr = [...localVideos]; arr[index].title = e.target.value; setLocalVideos(arr); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Embed/YouTube Link</label>
                          <input type="text" value={v.embedLink} onChange={(e) => { const arr = [...localVideos]; arr[index].embedLink = e.target.value; setLocalVideos(arr); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                        </div>
                        <div className="md:col-span-2 flex gap-4">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Thumbnail URL</label>
                            <input type="text" value={v.thumbnail} onChange={(e) => { const arr = [...localVideos]; arr[index].thumbnail = e.target.value; setLocalVideos(arr); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                          </div>
                           <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Upload Image</label>
                            <label className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 cursor-pointer rounded px-4 py-2 h-10 w-32 border border-gray-700">
                              <ImageIcon className="w-5 h-5 mr-2" /> {uploading ? '...' : 'Upload'}
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => { const arr = [...localVideos]; arr[index].thumbnail = url; setLocalVideos(arr); })} />
                            </label>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => saveDoc("videos", v)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold uppercase">Save Video</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PRODUCTS */}
            {activeTab === "products" && (
              <div>
                <button onClick={() => {
                  const newId = Date.now().toString();
                  const newProduct: Product = { id: newId, name: "New Product", image: "", price: 29.99, category: "clothing", buyLink: "", order: localProducts.length };
                  setDoc(doc(db, "products", newId), newProduct);
                }} className="mb-6 bg-[var(--color-primary)] text-white px-4 py-2 rounded flex items-center gap-2 font-bold uppercase text-sm">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
                <div className="space-y-4">
                  {localProducts.map((product, index) => (
                    <div key={product.id} className="bg-black/50 p-6 rounded-xl border border-gray-800 relative">
                      <button onClick={() => removeDoc("products", product.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded">
                        <Trash className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Name</label>
                          <input type="text" value={product.name} onChange={(e) => { const n = [...localProducts]; n[index].name = e.target.value; setLocalProducts(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Price (€)</label>
                          <input type="number" value={product.price} onChange={(e) => { const n = [...localProducts]; n[index].price = parseFloat(e.target.value); setLocalProducts(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Category</label>
                          <select value={product.category} onChange={(e) => { const n = [...localProducts]; n[index].category = e.target.value as "clothing"|"accessories"; setLocalProducts(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white">
                            <option value="clothing">Clothing (Vestuário)</option>
                            <option value="accessories">Accessories (Acessórios)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Order</label>
                          <input type="number" value={product.order} onChange={(e) => { const n = [...localProducts]; n[index].order = parseInt(e.target.value); setLocalProducts(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Buy Link</label>
                          <input type="text" value={product.buyLink} onChange={(e) => { const n = [...localProducts]; n[index].buyLink = e.target.value; setLocalProducts(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                        </div>
                        <div className="md:col-span-2 flex gap-4">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Product Image URL</label>
                            <input type="text" value={product.image} onChange={(e) => { const n = [...localProducts]; n[index].image = e.target.value; setLocalProducts(n); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Upload Image</label>
                            <label className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 cursor-pointer rounded px-4 py-2 h-10 w-32 border border-gray-700">
                              <ImageIcon className="w-5 h-5 mr-2" /> {uploading ? '...' : 'Upload'}
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => { const n = [...localProducts]; n[index].image = url; setLocalProducts(n); })} />
                            </label>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => saveDoc("products", product)} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-bold uppercase flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQS */}
            

            {activeTab === "jobs" && (
              <div>
                <button onClick={() => {
                  const newId = Date.now().toString();
                  const newJob = { id: newId, title: "New Job", department: "", location: "", type: "", description: "", order: jobs.length };
                  setDoc(doc(db, "jobs", newId), newJob);
                }} className="mb-6 bg-[var(--color-primary)] text-white px-4 py-2 rounded flex items-center gap-2 font-bold uppercase text-sm">
                  <Plus className="w-4 h-4" /> Add Job
                </button>
                <div className="space-y-6">
                  {jobs.map((job, index) => (
                    <div key={job.id} className="bg-black/50 p-6 rounded-xl border border-gray-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold uppercase text-[var(--color-primary)]">Job {index + 1}</h4>
                        <button onClick={() => removeDoc("jobs", job.id)} className="text-red-500 hover:text-red-400 p-2"><Trash className="w-5 h-5" /></button>
                      </div>
                      <input value={job.title} onChange={(e) => {
                        const copy = [...jobs];
                        copy[index].title = e.target.value;
                        setDoc(doc(db, "jobs", job.id), copy[index]);
                      }} className="w-full bg-black border border-gray-800 rounded p-2 text-white" placeholder="Title" />
                      
                      <div className="grid grid-cols-3 gap-4">
                        <input value={job.department} onChange={(e) => {
                          const copy = [...jobs];
                          copy[index].department = e.target.value;
                          setDoc(doc(db, "jobs", job.id), copy[index]);
                        }} className="w-full bg-black border border-gray-800 rounded p-2 text-white" placeholder="Department" />
                        <input value={job.location} onChange={(e) => {
                          const copy = [...jobs];
                          copy[index].location = e.target.value;
                          setDoc(doc(db, "jobs", job.id), copy[index]);
                        }} className="w-full bg-black border border-gray-800 rounded p-2 text-white" placeholder="Location" />
                        <input value={job.type} onChange={(e) => {
                          const copy = [...jobs];
                          copy[index].type = e.target.value;
                          setDoc(doc(db, "jobs", job.id), copy[index]);
                        }} className="w-full bg-black border border-gray-800 rounded p-2 text-white" placeholder="Type" />
                      </div>
                      
                      <textarea value={job.description} onChange={(e) => {
                        const copy = [...jobs];
                        copy[index].description = e.target.value;
                        setDoc(doc(db, "jobs", job.id), copy[index]);
                      }} rows={4} className="w-full bg-black border border-gray-800 rounded p-2 text-white font-mono text-sm" placeholder="Description" />
                      
                      <input type="number" value={job.order} onChange={(e) => {
                        const copy = [...jobs];
                        copy[index].order = Number(e.target.value);
                        setDoc(doc(db, "jobs", job.id), copy[index]);
                      }} className="w-full bg-black border border-gray-800 rounded p-2 text-white" placeholder="Order" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "faqs" && (
              <div>
                <button onClick={() => {
                  const newId = Date.now().toString();
                  const newFaq: FAQ = { id: newId, question: "New Question?", answer: "New Answer" };
                  setDoc(doc(db, "faqs", newId), newFaq);
                }} className="mb-6 bg-[var(--color-primary)] text-white px-4 py-2 rounded flex items-center gap-2 font-bold uppercase text-sm">
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
                <div className="space-y-6">
                  {localFaqs.map((f, index) => (
                    <div key={f.id} className="bg-black/50 p-6 rounded-xl border border-gray-800 relative">
                      <button onClick={() => removeDoc("faqs", f.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded"><Trash className="w-5 h-5" /></button>
                      <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Question</label>
                          <input type="text" value={f.question} onChange={(e) => { const arr = [...localFaqs]; arr[index].question = e.target.value; setLocalFaqs(arr); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Answer</label>
                          <textarea value={f.answer} onChange={(e) => { const arr = [...localFaqs]; arr[index].answer = e.target.value; setLocalFaqs(arr); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white h-24" />
                        </div>
                      </div>
                      <button onClick={() => saveDoc("faqs", f)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold uppercase">Save FAQ</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* DOWNLOADS */}
            {activeTab === "downloads" && (
              <div>
                <button onClick={() => {
                  const newId = Date.now().toString();
                  const newDl: Download = { id: newId, name: "New Download", description: "", link: "" };
                  setDoc(doc(db, "downloads", newId), newDl);
                }} className="mb-6 bg-[var(--color-primary)] text-white px-4 py-2 rounded flex items-center gap-2 font-bold uppercase text-sm">
                  <Plus className="w-4 h-4" /> Add Download
                </button>
                <div className="space-y-6">
                  {localDownloads.map((dl, index) => (
                    <div key={dl.id} className="bg-black/50 p-6 rounded-xl border border-gray-800 relative">
                      <button onClick={() => removeDoc("downloads", dl.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded"><Trash className="w-5 h-5" /></button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Name</label>
                          <input type="text" value={dl.name} onChange={(e) => { const arr = [...localDownloads]; arr[index].name = e.target.value; setLocalDownloads(arr); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                        </div>
                        <div className="md:col-span-2 flex gap-4">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Direct URL (Download)</label>
                            <input type="text" value={dl.link} onChange={(e) => { const arr = [...localDownloads]; arr[index].link = e.target.value; setLocalDownloads(arr); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Description</label>
                          <textarea value={dl.description} onChange={(e) => { const arr = [...localDownloads]; arr[index].description = e.target.value; setLocalDownloads(arr); }} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white h-20" />
                        </div>
                      </div>
                      <button onClick={() => saveDoc("downloads", dl)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold uppercase">Save Download</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-6">
                {localMessages.length > 0 ? (
                  localMessages.map((msg) => (
                    <div key={msg.id} className={`bg-black/50 p-6 rounded-xl border ${msg.subject?.includes('⭐ JOB APPLICATION') ? 'border-[var(--color-primary)]/50 shadow-[0_0_15px_var(--color-primary)]' : 'border-gray-800'} relative`}>
                      <button onClick={() => removeDoc("messages", msg.id).then(() => setLocalMessages(localMessages.filter(m => m.id !== msg.id)))} className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded"><Trash className="w-5 h-5" /></button>
                      <div className="mb-2">
                        <h3 className={`font-bold text-lg ${msg.subject?.includes('⭐ JOB APPLICATION') ? 'text-[var(--color-primary)] drop-shadow-[0_0_8px_var(--color-primary)]' : 'text-white'}`}>{msg.subject}</h3>
                        <p className="text-sm text-gray-400 uppercase tracking-widest">From: {msg.name} ({msg.email})</p>
                        <p className="text-xs text-gray-500 mt-1">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : (msg.date ? new Date(msg.date).toLocaleString() : 'No date')}</p>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap mt-4 bg-black/50 p-4 rounded border border-gray-800">{msg.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 text-gray-500 border border-gray-800 border-dashed rounded-xl">
                    <p>No messages received yet.</p>
                  </div>
                )}
              </div>
            )}
            
            </div>
            
            <div className="w-72 border-l border-white/10 bg-black/40 p-6 flex flex-col gap-2 overflow-y-auto shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Dashboard Menu</h3>
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)} 
                  className={`text-left uppercase tracking-wider font-bold text-sm px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === tab.id ? "bg-[var(--color-primary)] text-white shadow-[0_0_15px_var(--color-primary)]/40 translate-x-1" : "text-gray-400 hover:text-white hover:bg-white/10"}`}
                >
                  {tab.label}
                </button>
              ))}
              <div className="mt-auto pt-6 border-t border-white/10">
                <p className="text-[10px] text-gray-600 font-mono uppercase text-center">Stormyx System v1.2</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
