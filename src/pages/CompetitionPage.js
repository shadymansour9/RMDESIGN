import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styleSheets/CompetitionPage.css";

function CompetitionPage() {
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

  return (
    <div className="competition-page-container">
      <Navbar />

      {/* Hero Section */}
      <section className="competition-hero fade-in">
        <div className="hero-content">
          <div className="award-badge">מקום שני בתחרות עיצוב בינלאומית🏅</div>
          <h1>זקריאת אל נאסרה</h1>
          <p className="hero-subtitle">
            מרכז קהילתי תרבותי המשמר זיכרון דורות בנצרת
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="competition-content">
        {/* Project Overview */}
        <section className="project-overview fade-in">
          <div className="content-grid">
            <div className="text-content">
              <h2>פרויקט מצטיין</h2>
              <p className="highlight-text">
                פרויקט זקריאת אל נאסרה זכה במקום השני בתחרות Inspireli Awards 2021 
                בקטגוריית עיצוב ציבורי וקהילתי.
              </p>
              <p>
                המרכז התרבותי ממוקם בלב השוק העתיק של נצרת, ומשלב בין שימור המורשת 
                הערבית-נוצרית לבין עיצוב מודרני ופונקציונלי.
              </p>
            </div>
            <div className="image-content">
              <video controls width="100%" poster="/images/zakriyat-cover.jpg">
                <source src="/videos/zakriyat.mp4" type="video/mp4" />
                הדפדפן שלך לא תומך בווידאו.
              </video>
            </div>
          </div>
        </section>

        {/* Design Concept */}
        <section className="design-concept fade-in">
          <h2>קונספט עיצובי</h2>
          <div className="concept-grid">
            <div className="concept-card brown-accent">
              <div className="card-icon">🕰️</div>
              <h3>שימור היסטורי</h3>
              <p>שימור הארכיטקטורה העות'מאנית המקורית</p>
            </div>
            <div className="concept-card gold-accent">
              <div className="card-icon">🤝</div>
              <h3>חיבור קהילתי</h3>
              <p>יצירת מרחב משותף לדורות שונים</p>
            </div>
            <div className="concept-card beige-accent">
              <div className="card-icon">🎨</div>
              <h3>אמנות מקומית</h3>
              <p>שילוב עבודות אמנים מקומיים בעיצוב</p>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="project-details fade-in">
          <div className="details-grid">
            <div className="detail-card">
              <h3>מיקום הפרויקט</h3>
              <p>השוק העתיק, נצרת</p>
              <p>שטח: 850 מ"ר</p>
              <p>שנת ביצוע: 2021</p>
            </div>
            <div className="detail-card">
              <h3>תכולה עיצובית</h3>
              <ul>
                <li>גלריה קהילתית</li>
                <li>ספרייה היסטורית</li>
                <li>חלל מופעים</li>
                <li>בית קפה מסורתי</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="gallery-section fade-in">
          <h2>תמונות מהפרויקט</h2>
          <p className="gallery-intro">
            הפרויקט מציג שילוב בין עבר והווה — בין מבנים היסטוריים בני מאות שנים לבין עיצוב עכשווי 
            ופתרונות מודרניים שמתכתבים עם התרבות המקומית. כל פרט בפרויקט מבטא זהות מקומית לצד חזון עיצובי עתידני.
          </p>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img src="/images/zak1.jpg" alt="מבט חיצוני" />
            </div>
            <div className="gallery-item">
              <img src="/images/zak2.jpg" alt="פנים המבנה" />
            </div>
            <div className="gallery-item">
              <img src="/images/zak3.jpg" alt="חלל הגלריה" />
            </div>
            <div className="gallery-item">
              <img src="/images/zak4.jpg" alt="פרט עיצובי" />
            </div>
          </div>
        </section>

        {/* Project Narrative */}
        <section className="project-narrative fade-in">
          <div className="narrative-content">
            <h2>הסבר נוסף על הפרויקט</h2>
            <p>
              השם "זקריאת אל נאסרה" נגזר מהשפה הערבית ומשמעותו "זיכרון תרבותי". 
              הפרויקט שואב השראה מהמסורת הקולינרית הערבית ומההיסטוריה העשירה של נצרת כעיר רב-תרבותית.
            </p>
            <p>
              העיצוב משלב בין אלמנטים מסורתיים כמו קשתות אבן ופסיפסים לבין 
              טכנולוגיות מתקדמות של תאורה אינטראקטיבית ומערכות מולטימדיה.
            </p>
          </div>
        </section>
      </div>

      {/* Footer - full width outside content */}
      <div className="footer-rasha">
        <div className="footer-card">
          <img src="/images/rasha.jpg" alt="ראשה מנסור" className="footer-image" />
          <div className="footer-social">
            <a href="https://www.linkedin.com/in/YOUR_PROFILE" target="_blank" rel="noopener noreferrer">
              <img src="/icons/linkedin.png" alt="LinkedIn" />
            </a>
            <a href="https://www.instagram.com/YOUR_USERNAME" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram.png" alt="Instagram" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompetitionPage;
