import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styleSheets/HomePage.css"; // Import your CSS file

function HomePage() {
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
    <div className="home-container">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">RM DESIGN STUDIO</h1>
          <p className="hero-subtitle">תכנון יצירתי. עיצוב מדויק. קורסים פרקטיים.</p>
          <div className="button-group">
            <Link to="/projects" className="hero-button transparent-border">
              <span className="button-icon">👁️</span> צפה בפרויקטים
            </Link>
            <Link to="/form" className="hero-button transparent-border">
              <span className="button-icon">🎓</span> הרשמה לקורסים
            </Link>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span className="scroll-dot"></span>
          <span className="scroll-dot"></span>
          <span className="scroll-dot"></span>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section no-box">


  <div className="paragraph-list centered fade-in">

    <div className="feature-paragraph no-border">
      <h3>פרויקטים בליווי אישי</h3>
      <p>
        במהלך השנים ליוויתי מגוון רחב של פרויקטים – מדירות מגורים ועד חללים מסחריים, משרדים וקליניקות.
        כל פרויקט מתחיל מהקשבה – וממשיך בתכנון שמדויק לצרכים, לאורח החיים ולאווירה שרוצים ליצור.
        אני מאמינה שעיצוב טוב נולד מהחיבור בין פונקציונליות לאסתטיקה, ומתוך זה אני יוצרת.
      </p>
      <Link to="/projects" className="cta-button tertiary-btn">קרא עוד</Link>
    </div>

    <div className="feature-paragraph no-border">
      <h3>קורסים מקצועיים ב־Revit</h3>
      <p>
        אני מאמינה שידע מקצועי צריך להיות גם ברור, גם מעשי, וגם נותן כלים אמיתיים לעבודה.
        לכן פיתחתי קורסים שמלמדים Revit שלב אחר שלב – מההתחלה ועד לרמה מתקדמת.
        הקורסים מתאימים לסטודנטים, מעצבים ואדריכלים שרוצים לעבוד נכון, לחסוך זמן, ולבנות תיק עבודות איכותי.
        בשיעורים תלמדו איך למדל, לתכנן, להוציא תוכניות, ולעבוד בצורה מקצועית ומדויקת – עם ליווי אישי לאורך כל הדרך.
      </p>
      <Link to="/form" className="cta-button tertiary-btn">קרא עוד</Link>
    </div>

    <div className="feature-paragraph no-border">
      <h3>שימוש בטכנולוגיות מתקדמות</h3>
      <p>
        אני משתמשת בטכנולוגיות חדשניות כמו הדמיות פוטוריאליסטיות, מודלים תלת־ממדיים, תכנון בסביבת BIM,
        וסיורים וירטואליים – כלים אלה מאפשרים לי להמחיש ללקוחות את התוצאה הסופית בצורה חיה, מדויקת ומקצועית.
        ולתכנן פתרונות שמשלבים פונקציונליות וטכנולוגיה מתקדמת.
      </p>
      <Link to="/about" className="cta-button tertiary-btn">קרא עוד</Link>
    </div>

  </div>
</section>


      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card fade-in">
          <span className="benefits-badge" style={{ background: '#ffd700', color: '#3e2723' }}>
            מהרו להירשם – המקומות מוגבלים!
          </span>
          <h3 className="cta-text">מוכנים להתחיל קריירה בעיצוב?</h3>
          <p className="cta-description">
            אני מאמינה שעיצוב נכון מתחיל בהקשבה. בעבודה שלי אני מלווה לקוחות מהשלב הרעיוני ועד לביצוע,
            ומתוך הניסיון שצברתי אני גם מעבירה קורסים מעשיים לסטודנטים ולאנשי מקצוע שרוצים לשלוט ב-Revit ולהתמקצע בתחום.
          </p>
          <div className="button-group">
            <Link to="/form" className="cta-button secondary-btn">
              הרשם עכשיו
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="section-heading fade-in">
          <h2>כל עיצוב מתחיל בסיפור שלכם</h2>
        </div>
        <div className="about-content fade-in">
          <p>
            אנחנו מעצבים עבור אנשים. הגישה שלנו לתכנון ועיצוב חללים נובעת מהבנה של הצרכים,
            הרצונות והחלומות של כל אדם, חברה או עסק. אנו משתמשים בעקרונות ובמושגים קיימים מעולם העיצוב
            ומתאימים אותם לתרבות המקומית ולחיים היומיומיים.
          </p>
          <p>
            הגישה שלנו מבוססת על מחקר מעמיק, הקשבה לצרכי הלקוח ופתרונות יצירתיים המותאמים אישית.
          </p>
          <Link to="/about" className="cta-button CONT-btn transparent-border">
            הכירו אותנו יותר
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-heading fade-in">
          <hr className="my-10 border-t border-gray-200" />
          <h2>לקוחות מספרים</h2>
          <p>החוויות וההמלצות</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card fade-in">
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">
              העבודה עם RM דיזיין שינתה לחלוטין את חוויית העבודה במשרד שלנו. קיבלנו חלל פונקציונלי ויפה שמשפר את התפוקה.
            </p>
            <div className="testimonial-author">
              <div>
                <div className="testimonial-author-name">דניאל כהן</div>
                <div className="testimonial-author-role">מנכ"ל, טק-סולושנס</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card fade-in">
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">
              הקורס של RM Revit פתח לי דלתות רבות בשוק העבודה. הליווי האישי והתרגולים המעשיים נתנו לי את כל הכלים להצליח.
            </p>
            <div className="testimonial-author">
              <div>
                <div className="testimonial-author-name">מיכל לוי</div>
                <div className="testimonial-author-role">בוגרת קורס Revit</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card fade-in">
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">
              הדירה שלנו קיבלה חיים חדשים אחרי העיצוב מחדש. הצוות הקשיב לכל הבקשות שלנו וידע לתת מענה יצירתי ומדויק.
            </p>
            <div className="testimonial-author">
              <div>
                <div className="testimonial-author-name">אבי ואסנת מזרחי</div>
                <div className="testimonial-author-role">סטודנטית בקורס ריוויט מקצועי</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="footer-rasha">
        <div className="footer-card">
          <img className="footer-image" src="/images/rasha.jpg" alt="ראשה מנסור" />
          <div className="footer-social">
            <a href="https://www.instagram.com/rmdesignstudio0" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram.png" alt="Instagram" />
            </a>
            <a href="https://www.linkedin.com/in/rasha-mansour-731184204" target="_blank" rel="noopener noreferrer">
              <img src="/icons/linkedin.png" alt="LinkedIn" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;