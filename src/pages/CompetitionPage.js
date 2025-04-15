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
              <div className="highlight-text">
                <p>פרויקט זקריאת אל נאסרה זכה במקום השני בתחרות</p>
                <p>Inspireli Awards 2021 בקטגוריית עיצוב ציבורי וקהילתי.</p>
              </div>

              <h3>מיקום הפרויקט</h3>
              <p>השוק העתיק, נצרת</p>
              <p>שטח: 850 מ"ר</p>
              <p>שנת ביצוע: 2021</p>

              <p>
                "זקריאת אל נאסרה" הוא מרכז קהילתי תרבותי המשמר זיכרון של דורות בעיר נצרת.
                פירוש השם "זיכרון תרבותי" מהשפה הערבית ובהשראת התרבות הערבית נוצרית, דרך אוכל מסורתי ערבי וחפצים בעלי ערך וסיפור היסטורי.
                ממוקם ב"בית פאוזי עאזר" שנמצא בשוק העתיק של נצרת שהיה בעבר נקודה חשובה בהיסטוריה בשל המסחר והשגשוג הכלכלי.
                מטרת הפרויקט היא להחיות את השוק על ידי חיבור בין שימור המסורת והתרבות עם הדור הצעיר,
                דרך שימור העיצוב העות'מאני של המקום יחד עם עיצוב מודרני.
                "זקריית אל נאסרה" מציע פונקציות בילוי והכרה היסטורית כגון: תיאטראות, גלריה, ובתי קפה ברוח התרבות.
              </p>
            </div>

            <div className="image-content">
              <video controls width="100%" poster="/images/zak1.jpg">
                <source src="/videos/zakriyat.mp4" type="video/mp4" />
                הדפדפן שלך לא תומך בווידאו.
              </video>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="gallery-section fade-in">
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
      </div>

      {/* Footer */}
      <div className="footer-rasha">
        <div className="footer-card">
          <img src="/images/rasha.jpg" alt="ראשה מנסור" className="footer-image" />
          <div className="footer-social">
            <a href="https://www.linkedin.com/in/rasha-mansour-731184204" target="_blank" rel="noopener noreferrer">
              <img src="/icons/linkedin.png" alt="LinkedIn" />
            </a>
            <a href="https://www.instagram.com/rmdesignstudio0" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram.png" alt="Instagram" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompetitionPage;
