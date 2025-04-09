import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styleSheets/CompetitionPage.css"; // Import your CSS file

function CompetitionPage() {
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

  return (
    <div className="competition-page-container">
      <Navbar />
      
      {/* Hero Section */}
      <section className="competition-hero fade-in">
        <div className="hero-content">
          <div className="award-badge">מקום שני בתחרות עיצוב בינלאומית🏅</div>
          <h1>זקריאת אל נאסרה</h1>
          <p className="hero-subtitle">מרכז קהילתי תרבותי המשמר זיכרון דורות בנצרת</p>
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
              <img src="/images/zak-main.jpg" alt="פרויקט זקריאת אל נאסרה" />
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
            <h2>סיפור הפרויקט</h2>
            <p>
              השם "זקריאת אל נאסרה" נגזר מהשפה הערבית ומשמעותו "זיכרון תרבותי". 
              הפרויקט שואב השראה מהמסורת הקולינרית הערבית ומההיסטוריה העשירה 
              של נצרת כעיר רב-תרבותית.
            </p>
            <p>
              העיצוב משלב בין אלמנטים מסורתיים כמו קשתות אבן ופסיפסים לבין 
              טכנולוגיות מתקדמות של תאורה אינטראקטיבית ומערכות מולטימדיה.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CompetitionPage;