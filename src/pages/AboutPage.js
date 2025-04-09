import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styleSheets/AboutPage.css"; // Import your CSS file

function AboutPage() {
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
    <div className="about-page-container">
      <Navbar />
      
      {/* Hero Section */}
      <section className="about-hero fade-in">
        <div className="hero-content">
          <h1>הסטודיו שלנו</h1>
          <p className="hero-subtitle">שילוב בין מסורת לחדשנות בעיצוב פנים ואדריכלות</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="about-content">
        {/* Studio Story Section */}
        <section className="studio-story fade-in">
          <div className="content-grid">
            <div className="text-content">
              <h2>הפילוסופיה העיצובית שלנו</h2>
              <p>
                RM דיזיין נוסד מתוך אמונה עמוקה בכוחו של העיצוב לשפר את איכות החיים. 
                אנו משלבים בין ניסיון רב שנים לטכנולוגיות מתקדמות ליצירת חללים פונקציונליים 
                בעלי אמירה עיצובית ייחודית.
              </p>
              <p>
                הסטודיו מתמחה בעיצוב משרדים מודרניים, חללי מגורים יוקרתיים ופרויקטים מסחריים 
                תוך שמירה על איזון מושלם בין אסתטיקה לפרקטיות.
              </p>
            </div>
            <div className="image-content">
              <img src="/images/studio-interior.jpg" alt="פנים הסטודיו" />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section fade-in">
          <h2>תחומי התמחות</h2>
          <div className="services-grid">
            <div className="service-card brown-accent">
              <div className="card-icon">🏢</div>
              <h3>עיצוב משרדים</h3>
              <p>תכנון חללי עבודה מותאמים לצרכי החברה והעובדים</p>
            </div>
            <div className="service-card gold-accent">
              <div className="card-icon">🏡</div>
              <h3>עיצוב מגורים</h3>
              <p>עיצוב דירות ובתים פרטיים עם דגש על נוחות ואופי אישי</p>
            </div>
            <div className="service-card beige-accent">
              <div className="card-icon">🛋️</div>
              <h3>עיצוב מסחרי</h3>
              <p>תכנון חללי קמעונאות, מסעדות וחללי תצוגה ייחודיים</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section fade-in">
          <h2>הצוות שלנו</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team1.jpg" alt="ראשה מנסור" />
              </div>
              <h3>ראשה מנסור</h3>
              <p>מייסדת ומנהלת יצירתית</p>
              <p className="member-bio">בוגרת HIT עם ניסיון של 12 שנה בעיצוב פנים ואדריכלות</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team2.jpg" alt="מיכל לוי" />
              </div>
              <h3>מיכל לוי</h3>
              <p>אדריכלית ראשית</p>
              <p className="member-bio">מומחית בטכנולוגיות BIM ועיצוב פרמטרי</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team3.jpg" alt="יוסי כהן" />
              </div>
              <h3>יוסי כהן</h3>
              <p>מעצב פנים בכיר</p>
              <p className="member-bio">בעל תעודה בינלאומית בעיצוב בר קיימא</p>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="achievements-section fade-in">
          <h2>הישגים והכרה</h2>
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-icon">🏆</div>
              <h3>זכייה בפרס העיצוב הישראלי</h3>
              <p>2022 - קטגוריית עיצוב משרדים</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">📐</div>
              <h3>הסמכת BIM מובילה</h3>
              <p>הסמכה בינלאומית ממועצת ה-BIM העולמית</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🌟</div>
              <h3>דירוג 5 כוכבים</h3>
              <p>מלקוחותינו בחמש השנים האחרונות</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;