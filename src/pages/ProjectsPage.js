import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styleSheets/Projects.css"; // Import your CSS file

function ProjectsPage() {
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    return () => {
      fadeElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const projects = [
    {
      id: 1,
      title: "זקריאת אל נאסרה",
      description: "מרכז קהילתי תרבותי בנצרת - זוכה פרס עיצוב בינלאומי",
      image: "/images/zak1.jpg",
      tags: ["שימור", "קהילה", "תרבות"],
      category: "ציבורי",
      year: "2021"
    },
    {
      id: 2,
      title: "משרדי הייטק מודרניים",
      description: "עיצוב חללי עבודה חדשניים לחברת טכנולוגיה מובילה",
      image: "/images/office1.jpg",
      tags: ["משרדים", "מודרני", "טכנולוגיה"],
      category: "מסחרי",
      year: "2022"
    },
    {
      id: 3,
      title: "וילה יוקרתית בהרצליה",
      description: "עיצוב פנים לפנטהאוז עם נוף לים התיכון",
      image: "/images/villa1.jpg",
      tags: ["מגורים", "יוקרה", "חוף"],
      category: "פרטי",
      year: "2023"
    },
    {
      id: 4,
      title: "מרכז מבקרים אינטראקטיבי",
      description: "חווית מבקרים חדשנית עם טכנולוגיות VR מתקדמות",
      image: "/images/visitor-center1.jpg",
      tags: ["ציבורי", "חדשנות", "תערוכה"],
      category: "ציבורי",
      year: "2022"
    },
    {
      id: 5,
      title: "בית קפה בוטיק",
      description: "עיצוב חלל קולינרי עם אווירה אינטימית",
      image: "/images/cafe1.jpg",
      tags: ["מסעדות", "עיצוב", "בוטיק"],
      category: "מסחרי",
      year: "2021"
    },
    {
      id: 6,
      title: "דירת גג בתל אביב",
      description: "שיפוץ ועיצוב דירת פנטהאוז בסגנון מינימליסטי",
      image: "/images/penthouse1.jpg",
      tags: ["מגורים", "מינימליזם", "עירוני"],
      category: "פרטי",
      year: "2023"
    }
  ];

  return (
    <div className="projects-page-container">
      <Navbar />
      
      {/* Hero Section */}
      <section className="projects-hero fade-in">
        <div className="hero-content">
          <h1>הפרויקטים שלנו</h1>
          <p className="hero-subtitle">מבחר מעבודות העיצוב המובילות שלנו בתחומים שונים</p>
        </div>
      </section>

      {/* Projects Grid */}
      <div className="projects-content">
        <div className="projects-grid">
          {projects.map(project => (
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
                <button className="cta-button">
                  צפו בפרויקט
                  <span className="button-icon">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;