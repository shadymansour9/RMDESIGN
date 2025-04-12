import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styleSheets/ProjectGallery.css";

// גלריית תמונות לפי ID
const galleryImages = {
    1: [
        "/images/A1.jpg",
        "/images/A2.jpg",
        "/images/A3.jpg",
        "/images/A4.jpg",
        "/images/A5.jpg",
        "/images/A6.jpg",
        "/images/A7.jpg"
      ],
      

  2: [
    "/images/A.jpg",
    "/images/BB.jpg",
    "/images/CC.jpg",
    "/images/DD.jpg"
  ],

  3: [
    
    "/images/3.jpg",
    "/images/4.4.jpg",
    "/images/4.jpg",
    "/images/44.jpg",
    "/images/444.jpg",
    "/images/4444.jpg",
    "/images/44444.jpg",
    "/images/444444.jpg",
    { type: "video", src: "/videos/123.mp4" }
  ],

  4: [
    "/images/mansour1.jpg",
    "/images/mansour2.jpg",
    "/images/mansour3.jpg",
    "/images/mansour4.jpg"
  ],

  5: [
    "/images/A.1.jpg",
    "/images/B.1.jpg",
    "/images/C.1.jpg",
    "/images/D.1.jpg",
    "/images/E.jpg",
    "/images/F.jpg",
    "/images/G.jpg",
    "/images/H.jpg",
    "/images/I.jpg",
    "/images/J.jpg"
  ],
  
  6: ["/images/LobbyOfficeDesign.jpg"]
};

// הסברים טקסטואליים לכל פרויקט
const projectDetails = {
  1: {
    title: "E.H House",
    description: "שימור מבנה ציבורי בנצרת, עיצוב מודרני עם השראה מההיסטוריה המקומית."
  },
  2: {
    title: "Lawyer's Office",
    description: "עיצוב משרד מודרני עבור חברת עורכי דין עם דגש על תאורה טבעית ואסתטיקה מקצועית."
  },
  3: {
    title: "Engineer Office",
    description: "עיצוב פנים לפנטהאוז עם קווים נקיים ונוף לים התיכון."
  },
  4: {
    title: "Mansour's House",
    description: "פרויקט מגורים חדשני המשלב עיצוב חכם עם חוויית משתמש מרגשת."
  },
  5: {
    title: "N-restaurant",
    description: "עיצוב חלל קולינרי אינטימי באווירה בוטיקית."
  },
  6: {
    title: "Lobby Office Design",
    description: "שיפוץ לובי משרדי בסגנון מינימליסטי נקי ועדכני."
  }
};

function ProjectGallery() {
  const { id } = useParams();
  const images = galleryImages[id] || [];
  const project = projectDetails[id];

  return (
    <div className="project-gallery-container">
      <Navbar />
      <div className="gallery-header">
        <h1>{project?.title || "פרויקט"}</h1>
        <p className="gallery-description">{project?.description || "אין מידע זמין לפרויקט זה."}</p>
      </div>

      <div className="gallery-grid">
        {images.length === 0 ? (
          <p>אין תמונות זמינות לפרויקט זה.</p>
        ) : (
          images.map((item, index) =>
            typeof item === "string" ? (
              <img key={index} src={item} alt={`project-${id}-${index}`} />
            ) : item.type === "video" ? (
              <video
                key={index}
                controls
                style={{ maxWidth: "100%", borderRadius: "12px", marginBottom: "1.5rem" }}
              >
                <source src={item.src} type="video/mp4" />
                הדפדפן שלך לא תומך בניגון וידאו.
              </video>
            ) : null
          )
        )}
      </div>
    </div>
  );
}

export default ProjectGallery;
