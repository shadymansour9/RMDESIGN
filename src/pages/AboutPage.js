import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styleSheets/AboutPage.css";

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

        {/* Studio Philosophy */}
        <section className="studio-story fade-in">
          <h2 className="studio-heading">הפילוסופיה העיצובית שלנו</h2>

          <div className="studio-split-box">
            <div className="split-item split-hebrew">
              <p>
                רם דיזיין הינו סטודיו לעיצוב הממוקם בחיפה המתמחה בעיקר בעיצוב משרדים ובפרויקטים למגורים ומסחריים.
                הסטודיו מציע לקוחותיו פתרונות חדשניים חכמים. מדובר בשילוב בין עיצוב פנים, גרפיקה, עיצוב מוצר וטכנולוגיה מתקדמת שקושרת את הכל ביחד.
              </p>
              <p>
                בסטודיו שלנו, האסתטיקה והפונקציונליות הולכות יד ביד. אנו מאמינים כי עיצוב נכון מתחיל בהבנה עמוקה של צרכי הלקוח ומסתיים ביצירה שמביאה השראה.
              </p>
            </div>
            <div className="split-item split-english">
              <p>
                RM Design is a design studio located in Haifa that specializes mainly in office design as well as residential and commercial projects.
                The Studio offers its variety of clients smart innovative solutions. It is about the combination between interior design, graphics, product design and advanced technology which ties it all together.
              </p>
              <p>
                In our studio, aesthetics and functionality go hand in hand. We believe that good design begins with a deep understanding of the client’s needs and ends with a creation that inspires.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
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

        {/* About Rasha */}
        <section className="about-rasha fade-in">
          <div className="rasha-card">
            <div className="rasha-image">
              <img src="/images/rasha.jpg" alt="ראשה מנסור" />
            </div>

            <div className="rasha-info">
              {/* Social Icons */}
              <div className="rasha-social">
                <a href="https://www.instagram.com/rmdesignstudio0" target="_blank" rel="noopener noreferrer">
                  <img src="/icons/instagram.png" alt="Instagram" />
                </a>
                <a href="https://www.linkedin.com/in/YOUR_PROFILE" target="_blank" rel="noopener noreferrer">
                  <img src="/icons/linkedin.png" alt="LinkedIn" />
                </a>
              </div>

              {/* Bio */}
              <h3>רשא מנסור</h3>
              <p>מייסדת הסטודיו</p>
              <p className="rasha-bio">
                בעלת ניסיון של 4 שנים בעיצוב פנים ואדריכלות. מלמדת קורסים בתחום כבר שנה וחצי מתוך אהבה למקצוע ולחינוך.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default AboutPage;
