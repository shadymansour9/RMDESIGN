import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import Loader from "./components/Loader.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AnalyticsPageView from "./components/AnalyticsPageView.jsx";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CompetitionPage from "./pages/CompetitionPage";
import ProjectsPage from "./pages/ProjectsPage";
import FormPage from "./pages/FormPage";
import ProjectGallery from "./pages/ProjectGallery";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

import "./App.css";

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] } },
};

const Page = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><HomePage /></Page>} />
        <Route path="/about" element={<Page><AboutPage /></Page>} />
        <Route path="/competition" element={<Page><CompetitionPage /></Page>} />
        <Route path="/projects" element={<Page><ProjectsPage /></Page>} />
        <Route path="/projects/:id" element={<Page><ProjectGallery /></Page>} />
        <Route path="/form" element={<Page><FormPage /></Page>} />
        {/* Catch-all MUST stay last so it doesn't swallow other routes */}
        <Route path="*" element={<Page><NotFoundPage /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * Wraps the public marketing site in the navigation/motion chrome.
 * /login and /admin are rendered without any chrome (clean editor surface).
 */
function PublicSite() {
  return (
    <>
      <Loader />
      <ScrollToTop />
      <SmoothScroll />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <AnimatedRoutes />
    </>
  );
}

function App() {
  return (
    <Router>
      {/* Mounted at the root so it tracks every route across both
          PublicSite and the admin pages. */}
      <AnalyticsPageView />
      <Routes>
        {/* Admin chrome-less routes — listed BEFORE the catch-all PublicSite */}
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: everything else falls into the public marketing site,
            which then handles its own 404 internally. MUST be last. */}
        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </Router>
  );
}

export default App;
