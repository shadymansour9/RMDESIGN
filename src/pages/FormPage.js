import React, { useRef, useState, useEffect } from "react";
import emailjs from "emailjs-com";
import Navbar from "../components/Navbar";
import "../styleSheets/FormPage.css";

function FormPage() {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .sendForm("service_9mrmmoh", "template_geaa5dw", form.current, "0-GZndZldpzAWnM2X")
      .then(() => {
        setSubmitStatus("success");

        // שליחת מייל נוסף
        emailjs.sendForm("service_9mrmmoh", "template_140wet8", form.current, "0-GZndZldpzAWnM2X");

        // שליחה ל־Google Sheets
        const formData = new FormData(form.current);
        fetch("https://script.google.com/macros/s/AKfycbxzEmofjEwPOj0Zgll_Sfz7VNGQgjSxUQ2LANeS8InikL5FGoZJKvpyVWqJOMjnaYUXjw/exec", {
          method: "POST",
          mode: "no-cors", // ✅ מוסיף כדי לעקוף את ה-CORS
          body: formData,
        })
        .then(() => {
          console.log("✅ נשלח ל־Google Sheets");
        })
        .catch((err) => {
          console.warn("⚠️ לא ניתן לוודא את התשובה (no-cors):", err);
        });
        

        // איפוס הטופס
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
                <option value="beginners">קורס ריווט מקצועי</option>
                <option value="advanced">קורס ריווט הדמיות</option>
                <option value="workshop">ליווי בפרויקט גמר</option>
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
          <h2 className="info-heading">איזה קורס מתאים לך:</h2>

          <div className="course-card brown-accent">
            <h3>קורס ריווט מקצועי</h3>
            <ul>
              <li>📆 12 מפגשים שבועיים</li>
              <li>🕒 2 שעות כל מפגש</li>
              <li>👥 ליווי אישי צמוד</li>
            </ul>
          </div>

          <div className="course-card gold-accent">
            <h3>קורס ריווט הדמיות</h3>
            <ul>
              <li>📆 6 מפגשים שבועיים</li>
              <li>🕒 2 שעות כל מפגש</li>
              <li>🏆 פרויקט גמר מעשי</li>
            </ul>
          </div>

          <div className="course-card beige-accent">
            <h3>ליווי בפרויקט גמר</h3>
            <ul>
              <li>📆 4 מפגשים מרוכזים</li>
              <li>🕒 6 שעות כל מפגש</li>
              <li>💡 התמחות בנושא ספציפי</li>
              <li>📚 חומרי לימוד מתקדמים</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Section */}
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
