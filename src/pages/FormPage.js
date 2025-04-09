import React, { useRef, useState, useEffect } from "react";
import emailjs from "emailjs-com";
import Navbar from "../components/Navbar";

function FormPage() {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Animation effects
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
      .sendForm(
        "service_9mrmmoh",
        "template_geaa5dw",
        form.current,
        "0-GZndZldpzAWnM2X"
      )
      .then((result) => {
        setSubmitStatus("success");
        emailjs.sendForm(
          "service_9mrmmoh",
          "template_140wet8",
          form.current,
          "0-GZndZldpzAWnM2X"
        );
        form.current.reset();
      })
      .catch((error) => {
        setSubmitStatus("error");
        console.error("שגיאה:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
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
              <input
                id="name"
                type="text"
                name="name"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">אימייל</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">טלפון</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="course">בחר קורס</label>
              <select id="course" name="course" required className="form-input">
                <option value="">-- בחר קורס --</option>
                <option value="beginners">קורס Revit למתחילים</option>
                <option value="advanced">קורס Revit למתקדמים</option>
                <option value="workshop">סדנאות מקצועיות</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">הודעה נוספת</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="form-input"
              />
            </div>

            <button
              type="submit"
              className="cta-button primary-btn"
              disabled={isSubmitting}
            >
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
          <h2 className="info-heading">מידע על הקורסים</h2>
          <div className="course-card brown-accent">
            <h3>קורס Revit למתחילים</h3>
            <ul>
              <li>📆 12 מפגשים שבועיים</li>
              <li>🕒 3 שעות כל מפגש</li>
              <li>🎓 תעודה מקצועית</li>
              <li>👥 ליווי אישי צמוד</li>
            </ul>
          </div>

          <div className="course-card gold-accent">
            <h3>קורס Revit למתקדמים</h3>
            <ul>
              <li>📆 8 מפגשים שבועיים</li>
              <li>🕒 4 שעות כל מפגש</li>
              <li>🏆 פרויקט גמר מעשי</li>
              <li>💼 הכוונה תעסוקתית</li>
            </ul>
          </div>

          <div className="course-card beige-accent">
            <h3>סדנאות מקצועיות</h3>
            <ul>
              <li>📆 4 מפגשים מרוכזים</li>
              <li>🕒 6 שעות כל מפגש</li>
              <li>💡 התמחות בנושא ספציפי</li>
              <li>📚 חומרי לימוד מתקדמים</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormPage;