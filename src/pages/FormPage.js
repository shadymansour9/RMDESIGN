import React, { useRef, useState, useEffect } from "react";
import emailjs from "emailjs-com";
import Navbar from "../components/Navbar";
import "../styleSheets/FormPage.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// ❌ אל תייבא את הסטייל המובנה כדי שלא יתנגש עם העיצוב שלך
// import "react-tabs/style/react-tabs.css";

function FormPage() {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // ✅ סנכרון בין Tabs ל-Select
  const courses = [
    { id: "revit-reality", label: "Revit Reality" },
    { id: "revit-office-dna", label: "Revit Office DNA" },
    { id: "revit-careers", label: "Revit for Careers" },
    { id: "revit-personal-project", label: "Revit Personal Project" },
  ];

  const [selectedCourse, setSelectedCourse] = useState(courses[0].id);

  useEffect(() => {
    const fadeElements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );

    fadeElements.forEach((el) => observer.observe(el));
    return () => fadeElements.forEach((el) => observer.unobserve(el));
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .sendForm(
        "service_9mrmmoh",
        "template_geaa5dw",
        form.current,
        "0-GZndZldpzAWnM2X"
      )
      .then(() => {
        setSubmitStatus("success");

        // תבנית נוספת (אם צריך)
        emailjs.sendForm(
          "service_9mrmmoh",
          "template_140wet8",
          form.current,
          "0-GZndZldpzAWnM2X"
        );

        // שליחה ל-Google Sheets
        const formData = new FormData(form.current);
        fetch(
          "https://script.google.com/macros/s/AKfycbxzEmofjEwPOj0Zgll_Sfz7VNGQgjSxUQ2LANeS8InikL5FGoZJKvpyVWqJOMjnaYUXjw/exec",
          {
            method: "POST",
            mode: "no-cors",
            body: formData,
          }
        );

        form.current.reset();
        // אחרי reset חשוב להשאיר את הקורס הנבחר
        // (כי select יישאר controlled)
      })
      .catch((error) => {
        setSubmitStatus("error");
        console.error("שגיאה:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => setSubmitStatus(null), 5000);
      });
  };

  const selectedIndex = Math.max(
    0,
    courses.findIndex((c) => c.id === selectedCourse)
  );

  return (
    <div className="form-page-container">
      <Navbar />

      <section className="form-hero fade-in">
        <div className="hero-content">
          <h1>הרשמה לקורסי Revit מקצועיים</h1>
          <p className="hero-subtitle">
            פתח קריירה בעיצוב ואדריכלות עם קורסים מעשיים בליווי מקצועי צמוד
          </p>
        </div>
      </section>

      <div className="form-content">
        {/* 1) פירוט הקורסים */}
        <div className="course-info fade-in">
          <h2 className="info-heading">בוא/י נגלה יחד מה הקורס שמתאים לך באמת:</h2>

          <Tabs
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedCourse(courses[index].id)}
          >
            <TabList className="courses-tabs">
              {courses.map((c) => (
                <Tab key={c.id}>{c.label}</Tab>
              ))}
            </TabList>

            {/* 1) Revit Reality */}
            <TabPanel>
              <h3>קורס Revit Reality למתקדמים – עבודה כמו במשרד אמיתי</h3>
              <p>
                הקורס בנוי כדי ללמד עבודה מקצועית על פרויקטים אמיתיים, בדומה לאופן
                העבודה במשרדי תכנון ואדריכלות.
              </p>
              <p>📆 <strong>14 מפגשים</strong></p>
              <p>🕐 <strong>כל מפגש באורך שעתיים</strong></p>

              <p>מה תלמדו בקורס?</p>
              <ul>
                <li>בניית מודל Revit חכם שמשרת תהליך קבלת החלטות</li>
                <li>עבודה נכונה עם שלבים (Phases), חומרים ופרטים</li>
                <li>חיבור המודל ל-Lumion כחלק מתהליך העבודה</li>
                <li>יצירת הדמיות שמסבירות את הפרויקט בצורה ברורה</li>
                <li>הצגת פרויקט משכנעת ללקוחות, קבלנים וצוותים</li>
                <li>עבודה לפי חשיבה משרדית וסטנדרטים מקצועיים</li>
              </ul>

              <strong><p>למי הקורס מתאים?</p></strong>
              <ul>
                <li>למי שכבר שולט ב-Revit ורוצה לעבוד ברמה גבוהה יותר</li>
                <li>למי שעבר קורס Revit Career ומעוניין להעמיק בעבודה על פרויקט</li>
                <li>למי שרוצה לחבר בין תכנון, הדמיה וקבלת החלטות</li>
                <li>לאדריכלים, אדריכלי פנים וסטודנטים מתקדמים</li>
              </ul>
            </TabPanel>

            {/* 2) Revit Office DNA */}
            <TabPanel>
              <h3>שירות הטמעת Revit למשרדי אדריכלות</h3>
              <p>
                השירות מיועד למשרדי אדריכלות ואדריכלות פנים המעוניינים לעבוד ב־
                <strong> Revit </strong>
                בצורה אחידה, מסודרת ויעילה, בהתאם לאופי המשרד, סוג הפרויקטים
                והסטנדרטים הפנימיים שלו.
              </p>

              <p>
                במסגרת השירות נבנית למשרד <strong>תבנית Revit מותאמת אישית</strong>,
                המשקפת את שיטת העבודה האמיתית של המשרד ומאפשרת עבודה עקבית
                ונכונה לאורך כל הפרויקט.
              </p>

              <p>מה כולל השירות?</p>
              <ul>
                <li>בניית תבנית Revit משרדית מותאמת אישית</li>
                <li>יצירת משפחות Revit ייעודיות לפי צורכי המשרד</li>
                <li>הגדרת פרמטרים, תצוגות, פילטרים וסטנדרטים</li>
                <li>הטמעת שיטת עבודה ברורה לצוות המשרד</li>
                <li>ייעול תהליכי עבודה, חיסכון בזמן וצמצום טעויות</li>
              </ul>

              <p>
                המטרה אינה רק “לבנות תבנית”, אלא ליצור
                <strong> תשתית עבודה מקצועית </strong>
                שהצוות יודע להשתמש בה נכון – בכל פרויקט מחדש.
              </p>
            </TabPanel>

            {/* 3) Revit for Careers */}
            <TabPanel>
              <h3>Revit for Careers – רוויט לקריירה</h3>
              <p>
                זה הקורס שמחבר בין שליטה טכנית לחשיבה תכנונית אמיתית –
                ומכין אותך לעבודה בשטח או במשרד.
              </p>
              <p>📆 <strong>12 מפגשים</strong></p>
              <p>🕐 <strong>כל מפגש נמשך שעתיים</strong></p>

              <p>מה נלמד בקורס?</p>
              <ul>
                <li>פתיחת פרויקט מאפס: קירות, פתחים, רצפות ותקרות</li>
                <li>שרטוט ריהוט, תכניות ריצוף, תקרה, חשמל ועמדה</li>
                <li>מידות, תגיות, טבלאות וסט תכניות מקצועי</li>
                <li>עבודה נכונה עם גיליונות, קנ"מ וגרפיקה ברמה משרדית</li>
              </ul>

              <p>
                <strong>
                  בסיום הקורס תצא עם ביטחון, תיק עבודות ויכולת להשתלב בעבודה בתחום.
                </strong>
              </p>
            </TabPanel>

            {/* 4) Revit Personal Project */}
            <TabPanel>
              <h3>ליווי אישי לפרויקט גמר</h3>
              <p>
                ליווי אישי שמוודא שתסיים את הפרויקט עם תוצאה שאתה באמת גאה בה.
              </p>
              <p>📌 שני מסלולים לבחירה:</p>
              <ul>
                <li>מסלול קצר – 4 שבועות ליווי</li>
                <li>מסלול מלא – 8 שבועות ליווי</li>
              </ul>

              <p>מה תקבל?</p>
              <ul>
                <li>פגישות שבועיות אישיות (זום/פרונטלי)</li>
                <li>עזרה בתכנון, הדמיות, סט תכניות והכנה לפרזנטציה</li>
                <li>תיקונים, חידודים וליווי מלא עד ההגשה</li>
                <li>זמינות שוטפת בווטסאפ</li>
              </ul>

              <strong><p>למי זה מתאים?</p></strong>
              <ul>
                <li>לסטודנטים שרוצים תמיכה אמיתית לאורך כל הדרך – גם בתוכן וגם ברגש</li>
                <li>למי שרוצה להגיש עבודה מקצועית, בטוחה ומדויקת</li>
              </ul>
            </TabPanel>
          </Tabs>
        </div>

        {/* 2) טופס הרשמה */}
        <div className="form-wrapper fade-in">
          <form ref={form} onSubmit={sendEmail} className="registration-form">
            <div className="form-group">
              <label htmlFor="name">שם מלא</label>
              <input id="name" type="text" name="name" required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="email">אימייל</label>
              <input id="email" type="email" name="email" required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="phone">טלפון</label>
              <input id="phone" type="tel" name="phone" required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="course">בחר קורס</label>
              <select
                id="course"
                name="course"
                className="form-input"
                required
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">הודעה נוספת</label>
              <textarea id="message" name="message" rows="4" className="form-input" />
            </div>

            <button type="submit" className="cta-button primary-btn" disabled={isSubmitting}>
              {isSubmitting ? "שולח..." : "שלח טופס הרשמה"}
            </button>

            {submitStatus === "success" && (
              <div className="status-message success fade-in">
                <span>✓</span> הטופס נשלח בהצלחה! ניצור איתך קשר בהקדם
              </div>
            )}

            {submitStatus === "error" && (
              <div className="status-message error fade-in">
                <span>✗</span> אירעה שגיאה בשליחה, אנא נסה שוב
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="footer-rasha">
        <div className="footer-card">
          <img src="/images/rasha.jpg" alt="ראשה מנסור" className="footer-image" />
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

export default FormPage;
