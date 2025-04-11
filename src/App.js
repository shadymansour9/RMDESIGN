import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop.jsx"; // 👈 ייבוא חדש

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CompetitionPage from "./pages/CompetitionPage";
import ProjectsPage from "./pages/ProjectsPage";
import FormPage from "./pages/FormPage";
import "./App.css";
import ProjectGallery from "./pages/ProjectGallery";



function App() {
  return (
    <Router>
      <ScrollToTop /> {/* 👈 גלילה לראש הדף */}
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/competition" element={<CompetitionPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectGallery />} />
        <Route path="/form" element={<FormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
