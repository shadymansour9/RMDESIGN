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
          <h2 className="studio-heading">About Our Studio</h2>

          <div className="studio-split-box">
            <div className="split-item split-hebrew">
              <p>
              רמ דיזיין הינו סטודיו לעיצוב הממוקם בחיפה המתמחה בעיקר בעיצוב משרדים ובפרויקטים למגורים ומסחרים. הסטודיו מציע לקוחותיו פתרונות חדשניים חכמים. מדובר בשילוב בין עיצוב פנים, גרפיקה, עיצוב מוצר וטכנולוגיה מתקדמת שקושרת את הכל ביחד.
              </p>
              <p>
              אנו מאמינים שעיצוב אינטליגנטי הוא תוצאה של מחקר, דיאלוג עם לקוחות ובעלי עניין, ונגזרת של מאמץ צוות.
מעיצוב פרמטרי, טכנולוגיית BIM וטכנולוגיות VR 3D- אנו מפתחים מושגים למציאות ולחללים בלתי נשכחים.

עבורנו כל פרויקט הוא אתגר מרגש וכל לקוח הוא עולם של חלומות וצרכים. אנו מביאים את הידע שלנו, יחד עם מושגים ומודלים של עיצוב מרחבי העולם על מנת לעזור לצרכים, רצונות וחלומות להתעורר לחיים.

רמ דיזיין הוקמה על ידי רשא מנסור, בוגרת הפקולטה לעיצוב במכון הטכנולוגי חולון B.Design.
              </p>
            </div>
            <div className="split-item split-english">
              <p>
              RM Design is a design studio located in Haifa  that specializes mainly in office design as well as residential and commercial projects. The Studio offers its variety of clients smart innovative solutions. It is about the combination between  interior design, graphics, product design and advanced technology which ties it all together.
              </p>
              <p>
              We believe an intelligent design is a result of research, dialogue with clients and stakeholders, and a derivative of a team effort.
From parametric design, BIM technology, and 3D VR technologies- we develop concepts into reality, and unforgettable spaces.

For Us every project is an exciting challenge and every client is a world of dreams and needs. We bring our knowledge, along with concepts and models of design from around the world in order to help needs, desires and dreams come alive.

RM Design was established by Rasha Mansour, a graduate of the Faculty of Design at the Holon Institute of Technology B.Design.
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
              <h3>עיצוב מסחרי</h3>
              
            </div>
            <div className="service-card gold-accent">
              <div className="card-icon">🏡</div>
              <h3>עיצוב מגורים</h3>
              
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
                <a href="https://www.linkedin.com/in/rasha-mansour-731184204" target="_blank" rel="noopener noreferrer">
                  <img src="/icons/linkedin.png" alt="LinkedIn" />
                </a>
              </div>

              {/* Bio */}
              <h3>רשא מנסור</h3>
              <p>מייסדת הסטודיו</p>
              <p className="rasha-bio">
                בעלת ניסיון של 6 שנים בעיצוב פנים .
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default AboutPage;
