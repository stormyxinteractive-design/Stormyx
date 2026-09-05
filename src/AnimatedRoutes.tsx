import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";

import Home from "./pages/Home";
import Games from "./pages/Games";
import GameDetails from "./pages/GameDetails";
import Newswire from "./pages/Newswire";
import NewsDetails from "./pages/NewsDetails";
import Videos from "./pages/Videos";
import Downloads from "./pages/Downloads";
import Store from "./pages/Store";
import Support from "./pages/Support";
import Corporate from "./pages/Corporate";
import Legal from "./pages/Legal";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import PageWrapper from "./components/PageWrapper";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/games" element={<PageWrapper><Games /></PageWrapper>} />
        <Route path="/games/:id" element={<PageWrapper><GameDetails /></PageWrapper>} />
        <Route path="/news" element={<PageWrapper><Newswire /></PageWrapper>} />
        <Route path="/news/:id" element={<PageWrapper><NewsDetails /></PageWrapper>} />
        <Route path="/videos" element={<PageWrapper><Videos /></PageWrapper>} />
        <Route path="/downloads" element={<PageWrapper><Downloads /></PageWrapper>} />
        <Route path="/store" element={<PageWrapper><Store /></PageWrapper>} />
        <Route path="/support" element={<PageWrapper><Support /></PageWrapper>} />
        <Route path="/corporate" element={<PageWrapper><Corporate /></PageWrapper>} />
        <Route path="/legal" element={<PageWrapper><Legal /></PageWrapper>} />
        <Route path="/careers" element={<PageWrapper><Careers /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}
