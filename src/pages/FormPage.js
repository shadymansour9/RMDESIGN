import React, { useRef, useState, useEffect } from "react";
import emailjs from "emailjs-com";
import Navbar from "../components/Navbar";
import "../styleSheets/FormPage.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

function FormPage() {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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
    return () => fadeElements.forEach((el) => observer.unobserve(el));
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .sendForm("service_9mrmmoh", "template_geaa5dw", form.current, "0-GZndZldpzAWnM2X")
      .then(() => {
        setSubmitStatus("success");
        emailjs.sendForm("service_9mrmmoh", "template_140wet8", form.current, "0-GZndZldpzAWnM2X");

        const formData = new FormData(form.current);
        fetch("https://script.google.com/macros/s/AKfycbxzEmofjEwPOj0Zgll_Sfz7VNGQgjSxUQ2LANeS8InikL5FGoZJKvpyVWqJOMjnaYUXjw/exec", {
          method: "POST",
          mode: "no-cors",
          body: formData,
        });

        form.current.reset();
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
              <select id="course" name="course" required className="form-input">
                <option value="">-- בחר קורס --</option>
                <option value="revit-beginner">קורס רוויט</option>
                <option value="revit-advanced">קורס רוויט למתקדמים</option>
                <option value="lumion">קורס הדמיות בלומיון</option>
                <option value="final-project">ליווי אישי לפרויקט גמר</option>
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

        <div className="course-info fade-in">
          <h2 className="info-heading">בוא/י נגלה יחד מה הקורס שמתאים לך באמת:</h2>
          <Tabs>
            <TabList>
              <Tab>קורס רוויט</Tab>
              <Tab>רוויט למתקדמים</Tab>
              <Tab>בלומיון</Tab>
              <Tab>פרויקט גמר</Tab>
            </TabList>

            <TabPanel>
  <h3>🧱 קורס רוויט</h3>
  <p>זה הקורס היחיד שמחבר בין שליטה טכנית לחשיבה תכנונית אמיתית – ומכין אותך לעבודה בשטח או במשרד.</p>
  <p>📆 מספר שיעורים: <strong>12 מפגשים של שעתיים</strong></p>

  <p>📚 מה תלמד?</p>
  <ul>
    <li>🧱 פתיחת פרויקט מאפס: קירות, פתחים, רצפות ותקרות</li>
    <li>🪑 שרטוט ריהוט, תכניות ריצוף, תקרה, חשמל ועמדה</li>
    <li>📏 מידות, תגיות, טבלאות וסט תכניות מקצועי</li>
    <li>📐 עבודה נכונה עם גיליונות, קנ"מ וגרפיקה ברמה משרדית</li>
  </ul>

  <p>🎓 בסיום הקורס תצא עם ביטחון, תיק עבודות ויכולת להשתלב בעבודה בתחום.</p>
</TabPanel>

<TabPanel>
  <h3>🏗️ 2. קורס רוויט למתקדמים – לעבוד כמו משרד אמיתי</h3>
  <p>הקורס הזה נבנה כדי לעזור לך לנהל פרויקטים בצורה מקצועית – כמו במשרד.</p>
  <p>📆 מספר שיעורים: <strong>6 מפגשים של שעתיים</strong></p>

  <p>📚 מה תלמד?</p>
  <ul>
    <li>🧩 יצירת משפחות עם פרמטרים מותאמים</li>
    <li>🧮 ניהול תצוגות, פילטרים, טמפלטים ותבניות משרד</li>
    <li>📊 טבלאות כמויות, תגיות אוטומטיות וגרפיקה חכמה</li>
    <li>📐 הוצאה מסודרת של סט תכניות ברמה מקצועית</li>
  </ul>

  <p>👤 למי זה מתאים?</p>
  <ul>
    <li>למי שכבר שולט ברוויט ורוצה לעבוד מהר, מסודר, ובצורה שמוכנה לשלב הבא.</li>
    <li>הקורס יעניק לך יכולת להתמודד עם דרישות אמיתיות של משרדים ולקוחות, ולהתקדם מקצועית.</li>
  </ul>
</TabPanel>

<TabPanel>
  <h3>🎥 3. קורס הדמיות בלומיון</h3>
  <p>בקורס הזה תלמד ליצור הדמיות וסרטונים מקצועיים שימחישו את הפרויקט שלך בצורה מרשימה.</p>
  <p>📆 מספר שיעורים: <strong>6 מפגשים של שעתיים</strong></p>

  <p>📚 מה תלמד?</p>
  <ul>
    <li>🌇 בניית סצנות עם חומרים, תאורה ואווירה</li>
    <li>📸 צילום הדמיות באיכות גבוהה</li>
    <li>🎬 יצירת סרטון תלת־ממדי עם תנועה, אנשים, צמחייה ואפקטים</li>
  </ul>

  <p>👤 למי זה מתאים?</p>
  <ul>
    <li>למי שרוצה לקחת את ההצגה הוויזואלית של הפרויקט לרמה מקצועית – ולשווק את עצמו בצורה מרשימה.</li>
    <li>תצא מהקורס עם סט הדמיות וסרטון שישדרגו את תיק העבודות שלך – וישמשו אותך מול לקוחות, משרדים או מרצים.</li>
  </ul>
</TabPanel>

<TabPanel>
  <h3>🎯 4. ליווי אישי לפרויקט גמר</h3>
  <p>👥 אני כאן כדי ללוות אותך אישית – ולוודא שתסיים את הפרויקט עם תוצאה שאתה באמת גאה בה.</p>
  <p>📌 שני מסלולים לבחירה:</p>
  <ul>
    <li>🔹 מסלול קצר – 4 שבועות ליווי</li>
    <li>🔸 מסלול מלא – 8 שבועות ליווי</li>
  </ul>

  <p>📚 מה תקבל?</p>
  <ul>
    <li>🤝 פגישות שבועיות אישיות (זום/פרונטלי)</li>
    <li>📝 עזרה בתכנון, הדמיות, סט תכניות והכנה לפרזנטציה</li>
    <li>🛠️ תיקונים, חידודים וליווי מלא עד ההגשה</li>
    <li>💬 זמינות שוטפת בווטסאפ</li>
  </ul>

  <p>👤 למי זה מתאים?</p>
  <ul>
    <li>לסטודנטים שרוצים תמיכה אמיתית לאורך כל הדרך – גם בתוכן וגם ברגש.</li>
    <li>זה הליווי שיאפשר לך להגיש עבודה מקצועית, בטוחה, ולקבל עליה את ההערכה שאתה ראוי לה.</li>
  </ul>
</TabPanel>

          </Tabs>
        </div>
      </div>

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

export default FormPage;