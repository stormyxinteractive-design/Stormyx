/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState, useRef } from "react";
import { HashRouter as Router } from "react-router-dom";
import { Pencil } from "lucide-react";
import { useStore } from "./store";
import { trackEvent } from "./analytics";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import CookieBanner from "./components/CookieBanner";
import AnimatedRoutes from "./AnimatedRoutes";
import InteractiveBackground from "./components/InteractiveBackground";
import ScrollProgress from "./components/ScrollProgress";
import WelcomeModal from "./components/WelcomeModal";

function ScrollToEditButton() {
  const [show, setShow] = useState(false);
  const setAdmin = useStore((state) => state.setAdmin);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      
      if (isBottom) {
        if (!timeoutRef.current) {
          timeoutRef.current = setTimeout(() => {
            setShow(true);
          }, 3000); // 3 seconds at bottom
        }
      } else {
        setShow(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => setAdmin(true)}
      className="fixed bottom-4 left-4 z-[90] p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-500 backdrop-blur group opacity-100 scale-100"
      title="Edit Website"
    >
      <Pencil className="w-4 h-4 text-white opacity-50 group-hover:opacity-100" />
    </button>
  );
}

export default function App() {
  const initializeListeners = useStore((state) => state.initializeListeners);
  const themeSettings = useStore((state) => state.themeSettings);
  const highContrast = useStore((state) => state.highContrast);
  const setAdmin = useStore((state) => state.setAdmin);


  useEffect(() => {
    if (!sessionStorage.getItem("stormyx_visited")) {
      sessionStorage.setItem("stormyx_visited", "true");
      trackEvent("visits");
    }
  }, []);

  useEffect(() => {
    const cleanup = initializeListeners();
    return cleanup;
  }, [initializeListeners]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.style.setProperty('--color-primary', '#ffff00');
      document.documentElement.style.setProperty('--color-secondary', '#000000');
      document.documentElement.style.setProperty('--color-accent', '#ffffff');
      document.documentElement.style.setProperty('--color-tertiary', '#00ffff');
      document.documentElement.style.setProperty('--color-quaternary', '#ff00ff');
    } else if (themeSettings) {
      document.documentElement.style.setProperty('--color-primary', themeSettings.primaryColor);
      document.documentElement.style.setProperty('--color-secondary', themeSettings.secondaryColor);
      document.documentElement.style.setProperty('--color-accent', themeSettings.accentColor);
      document.documentElement.style.setProperty('--color-tertiary', themeSettings.tertiaryColor || "#db2777");
      document.documentElement.style.setProperty('--color-quaternary', themeSettings.quaternaryColor || "#10b981");
    }
  }, [themeSettings, highContrast]);

  return (
    <Router>
      <div className="min-h-screen bg-[var(--color-secondary)] text-white font-sans flex flex-col relative overflow-x-hidden">
        
        <ScrollProgress />
        <InteractiveBackground />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>

        <CookieBanner />
        <WelcomeModal />
        <AdminPanel />
        <ScrollToEditButton />
      </div>
    </Router>
  );
}
