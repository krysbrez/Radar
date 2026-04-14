import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingFeedback from "./components/FloatingFeedback";

import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import CategoryPage from "./pages/CategoryPage";
import CategoryArticlePage from "./pages/CategoryArticlePage";
import ArchivPage from "./pages/ArchivPage";
import KnowHowPage from "./pages/KnowHowPage";
import KnowHowListPage from "./pages/KnowHowListPage";
import KryptoPage from "./pages/KryptoPage";
import ForexPage from "./pages/ForexPage";
import StaticPage from "./pages/StaticPage";
import SrovnavacBrokeruPage from "./pages/SrovnavacBrokeruPage";
import SlovnikPage from "./pages/SlovnikPage";
import KalkulackyPage from "./pages/KalkulackyPage";
import JakZacitPage from "./pages/JakZacitPage";
import AkciePage from "./pages/AkciePage";
import NemovitostiPage from "./pages/NemovitostiPage";
import AutaPage from "./pages/AutaPage";
import MilionariPage from "./pages/MilionariPage";
import IpoPage from "./pages/IpoPage";
import DanePage from "./pages/DanePage";
import TymPage from "./pages/TymPage";
import HlidacPage from "./pages/HlidacPage";
import MujRadarPage from "./pages/MujRadarPage";
import ONasPage from "./pages/ONasPage";
import InzercePage from "./pages/InzercePage";
import KontaktPage from "./pages/KontaktPage";
import NewsletterPage from "./pages/NewsletterPage";

// Scroll to top on route change, handle hash anchors
function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);
  return null;
}

function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Content offset: navbar + calmer breathing room */}
      <main className="pt-[84px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clanek/:id" element={<ArticlePage />} />
          <Route path="/kategorie/:id" element={<CategoryPage />} />
          <Route path="/kategorie/:catId/clanek/:articleId" element={<CategoryArticlePage />} />
          <Route path="/archiv" element={<ArchivPage />} />
          <Route path="/knowhow" element={<KnowHowListPage />} />
          <Route path="/knowhow/:id" element={<KnowHowPage />} />
          <Route path="/akcie" element={<AkciePage />} />
          <Route path="/krypto" element={<KryptoPage />} />
          <Route path="/forex" element={<ForexPage />} />
          <Route path="/nemovitosti" element={<NemovitostiPage />} />
          <Route path="/auta" element={<AutaPage />} />
          {/* Footer / static pages */}
          <Route path="/o-nas" element={<ONasPage />} />
          <Route path="/tym" element={<TymPage />} />
          <Route path="/inzerce" element={<InzercePage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/kontakt" element={<KontaktPage />} />
          <Route path="/podminky" element={<StaticPage pageKey="podminky" />} />
          <Route path="/soukromi" element={<StaticPage pageKey="soukromi" />} />
          <Route path="/cookies" element={<StaticPage pageKey="cookies" />} />
          <Route path="/rizika" element={<StaticPage pageKey="rizika" />} />
          <Route path="/srovnavac-brokeru" element={<SrovnavacBrokeruPage />} />
          <Route path="/slovnik" element={<SlovnikPage />} />
          <Route path="/kalkulacky" element={<KalkulackyPage />} />
          <Route path="/jak-zacit" element={<JakZacitPage />} />
          <Route path="/dane" element={<DanePage />} />
          <Route path="/milionari" element={<MilionariPage />} />
          <Route path="/ipo" element={<IpoPage />} />
          <Route path="/hlidac" element={<HlidacPage />} />
          <Route path="/muj-radar" element={<MujRadarPage />} />
          {/* Fallback */}
          <Route path="*" element={<PlaceholderPage />} />
        </Routes>
      </main>

      <Footer />
      <FloatingFeedback />
    </div>
  );
}

function PlaceholderPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl mb-4">📡</p>
      <h1 className="text-2xl font-black text-primary font-headline mb-2">Stránka se připravuje</h1>
      <p className="text-on-surface-variant mb-6">Radar pracuje na obsahu. Brzy!</p>
      <a href="/" className="gradient-primary text-white px-6 py-2.5 rounded-full font-bold font-headline text-sm">
        ← Zpět na hlavní stránku
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Layout />
    </BrowserRouter>
  );
}
