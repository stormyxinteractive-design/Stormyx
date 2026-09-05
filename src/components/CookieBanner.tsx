import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 text-white z-50 p-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-gray-300">
          We use cookies to ensure that we give you the best experience on our website. By continuing to use this site, you agree to our <a href="/legal" className="text-white underline">Cookie Policy</a>.
        </div>
        <div className="flex gap-4">
          <button onClick={handleAccept} className="bg-[var(--color-primary)] hover:opacity-90 text-white px-6 py-2 font-bold rounded uppercase tracking-wider text-sm transition-colors">
            Accept All
          </button>
          <button onClick={() => setShow(false)} className="text-gray-400 hover:text-white p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
