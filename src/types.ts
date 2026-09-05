export interface Game {
  id: string;
  name: string;
  coverImage: string;
  gallery: string[];
  shortDesc: string;
  longDesc: string;
  platforms: string[]; // "pc", "playstation", "xbox", "switch"
  price: number;
  status: "venda" | "pre-venda" | "anuncio";
  buyLink: string;
  trailerUrl?: string;
  order: number;
}

export interface News {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
}

export interface Video {
  id: string;
  title: string;
  embedLink: string;
  thumbnail: string;
  order: number;
}

export interface Download {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: "clothing" | "accessories";
  buyLink: string;
  trailerUrl?: string;
  order: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  order: number;
}

export interface ThemeSettings {
  primaryColor: string; // Default: "#1d4ed8" (blue)
  secondaryColor: string; // Default: "#0f172a" (slate/black)
  accentColor: string; // Default: "#eab308" (yellow)
  tertiaryColor: string; // Additional color
  quaternaryColor: string; // Additional color
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  contactEmail: string;
  launcherLink: string;
  logoUrl: string;
  logoSize?: number;
  socialLinks: {
    instagram: string;
    x: string;
    youtube: string;
    facebook: string;
    tiktok: string;
    discord: string;
    twitch: string;
    linkedin?: string;
  };
  tabVisibility?: {
    games: boolean;
    newswire: boolean;
    videos: boolean;
    downloads: boolean;
    store: boolean;
    support: boolean;
  };
  showGamesSearch?: boolean;
}
