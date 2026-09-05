import { create } from "zustand";
import { Game, ThemeSettings, News, Video, FAQ, Download, Product, Job } from "./types";
import { db } from "./firebase";
import { collection, onSnapshot, doc, query, orderBy } from "firebase/firestore";
import { LanguageCode } from "./translations";

interface AppState {
  games: Game[];
  news: News[];
  videos: Video[];
  downloads: Download[];
  products: Product[];
  faqs: FAQ[];
  jobs: Job[];
  themeSettings: ThemeSettings | null;
  loading: boolean;
  isAdmin: boolean;
  language: LanguageCode;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  setAdmin: (isAdmin: boolean) => void;
  setLanguage: (lang: LanguageCode) => void;
  initializeListeners: () => () => void;
}

const defaultTheme: ThemeSettings = {
  primaryColor: "#facc15",
  secondaryColor: "#0a0a0a", // Lighter minimal dark color
  accentColor: "#facc15",
  tertiaryColor: "#db2777", // pink-600
  quaternaryColor: "#10b981", // emerald-500
  heroTitle: "WELCOME TO STORMYX INTERACTIVE",
  heroSubtitle: "Creating worlds that challenge reality.",
  aboutText: "Stormyx Interactive is a premier AAA game development studio...",
  contactEmail: "stormyxinteractive@gmail.com",
  launcherLink: "#",
  logoUrl: "",
  logoSize: 32,
  socialLinks: {
    instagram: "", x: "", youtube: "", facebook: "", tiktok: "", discord: "", twitch: "", linkedin: ""
  },
  tabVisibility: {
    games: true,
    newswire: true,
    videos: true,
    downloads: true,
    store: true,
    support: true
  },
  showGamesSearch: true
};

const getStoredLang = (): LanguageCode => {
  const stored = localStorage.getItem("stormyx_lang") as LanguageCode;
  if (stored && ["pt", "en", "es", "fr", "de"].includes(stored)) return stored;
  
  // Auto-detect based on browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('pt')) return 'pt';
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('fr')) return 'fr';
    if (browserLang.startsWith('de')) return 'de';
  }
  return "en";
};

export const useStore = create<AppState>((set) => ({
  games: [],
  news: [],
  videos: [],
  downloads: [],
  products: [],
  faqs: [],
  jobs: [],
  themeSettings: defaultTheme,
  loading: true,
  isAdmin: false,
  language: getStoredLang(),
  highContrast: localStorage.getItem("stormyx_hc") === "true",
  setHighContrast: (val) => {
    localStorage.setItem("stormyx_hc", val.toString());
    set({ highContrast: val });
  },
  setAdmin: (isAdmin) => set({ isAdmin }),
  setLanguage: (lang) => {
    localStorage.setItem("stormyx_lang", lang);
    set({ language: lang });
  },
  initializeListeners: () => {
    // Listen to Games
    const qGames = query(collection(db, "games"), orderBy("order", "asc"));
    const unsubscribeGames = onSnapshot(qGames, (snapshot) => {
      const gamesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
      set(state => ({ ...state, games: gamesList, loading: false }));
    });

    // Listen to News
    const qNews = query(collection(db, "news"), orderBy("date", "desc"));
    const unsubscribeNews = onSnapshot(qNews, (snapshot) => {
      const newsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
      set(state => ({ ...state, news: newsList }));
    });

    // Listen to Videos
    const qVideos = query(collection(db, "videos"), orderBy("order", "asc"));
    const unsubscribeVideos = onSnapshot(qVideos, (snapshot) => {
      const videosList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
      set(state => ({ ...state, videos: videosList }));
    });

    // Listen to Downloads
    const unsubscribeDownloads = onSnapshot(collection(db, "downloads"), (snapshot) => {
      const downloadsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Download));
      set(state => ({ ...state, downloads: downloadsList }));
    });

    // Listen to Products
    const qProducts = query(collection(db, "products"), orderBy("order", "asc"));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const productsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      set(state => ({ ...state, products: productsList }));
    });

    // Listen to FAQs
    const qJobs = query(collection(db, "jobs"), orderBy("order", "asc"));
    const unsubscribeJobs = onSnapshot(qJobs, (snapshot) => {
      const jobsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      set(state => ({ ...state, jobs: jobsList }));
    });

    const unsubscribeFaqs = onSnapshot(collection(db, "faqs"), (snapshot) => {
      const faqsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ));
      set(state => ({ ...state, faqs: faqsList }));
    });

    // Listen to Theme Settings
    const unsubscribeSettings = onSnapshot(doc(db, "settings", "theme"), (docSnap) => {
      if (docSnap.exists()) {
        set(state => ({ ...state, themeSettings: { ...defaultTheme, ...(docSnap.data() as ThemeSettings) } }));
      }
    });

    return () => {
      unsubscribeGames();
      unsubscribeNews();
      unsubscribeVideos();
      unsubscribeDownloads();
      unsubscribeProducts();
      unsubscribeFaqs();
      unsubscribeJobs();
      unsubscribeSettings();
    };
  }
}));
