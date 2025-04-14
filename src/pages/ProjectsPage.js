import React, { useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ ייבוא קישור
import Navbar from "../components/Navbar";
import "../styleSheets/Projects.css";

function ProjectsPage() {
  useEffect(() => {
    const fadeElements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const projects = [
    {
      id: 1,
      title: "Engineer Office",
      description: "עיצוב פנים לפנטהאוז עם נוף לים התיכון",
      image: "/images/villa1.jpg",
      tags: ["חוף", "יוקרה", "מגורים"],
      category: "מסחרי",
    },
    {
      id: 2,
      title: "Lawyer's office",
      description: "עיצוב חללי עבודה חדשניים לחברת טכנולוגיה מובילה",
      image: "/images/office1.jpg",
      tags: ["משרדים", "מודרני", "טכנולוגיה"],
      category: "מסחרי",
    },
    {
      id: 3,
      title: "E.H House ",
      description: "מרכז קהילתי תרבותי בנצרת - זוכה פרס עיצוב בינלאומי",
      image: "/images/E.H.jpg",
      tags: ["שימור", "קהילה", "תרבות"],
      category: "פרטי",
      galleryText: "הפרויקט כלל שימור של מבנה היסטורי ושילוב טכנולוגיות עיצוב מודרניות, תוך שמירה על צביון קהילתי.",
    },
    {
      id: 4,
      title: "LobbyOfficeDesign",
      description: "שיפוץ ועיצוב דירת פנטהאוז בסגנון מינימליסטי",
      image: "/images/LobbyOfficeDesign.jpg",
      tags: ["עירוני", "מינימליזם", "מגורים"],
      category: "מסחרי",
    },
    {
      id: 5,
      title: "N-restaurant",
      description: "עיצוב חלל קולינרי עם אווירה אינטימית",
      image: "/images/N-restaurant.jpg",
      tags: ["בוטיק", "עיצוב", "מסעדות"],
      category: "מסחרי",
    },
    {
      id: 6,
      title: "Mansour's House",
      description: "חווית מבקרים חדשנית עם טכנולוגיות VR מתקדמות",
      image: "/images/mansour.jpg",
      tags: ["ציבורי", "חדשנות", "תערוכה"],
      category: "פרטי",
    },
  ];

  return (
    <div className="projects-page-container">
      <Navbar />

      {/* Hero Section */}
      <section className="projects-hero fade-in">
        <div className="hero-content">
          <h1>הפרויקטים שלנו</h1>
          <p className="hero-subtitle">
            מבחר מעבודות העיצוב המובילות שלנו בתחומים שונים
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <div className="projects-content">
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card fade-in">
              <div className="card-header">
                <span className="project-category">{project.category}</span>
                <span className="project-year">{project.year}</span>
              </div>
              <div className="project-image-container">
                <img src={project.image} alt={project.title} />
                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <Link to={`/projects/${project.id}`} className="cta-button">
                  צפו בפרויקט <span className="button-icon">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Rasha Section */}
      <div className="footer-rasha">
        <div className="footer-card">
          <img
            src="/images/rasha.jpg"
            alt="ראשה מנסור"
            className="footer-image"
          />
          <div className="footer-social">
            <a
              href="https://www.linkedin.com/in/rasha-mansour-731184204"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icons/linkedin.png" alt="LinkedIn" />
            </a>
            <a
              href="https://www.instagram.com/rmdesignstudio0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icons/instagram.png" alt="Instagram" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
