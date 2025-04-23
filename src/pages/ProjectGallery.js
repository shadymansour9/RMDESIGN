// src/pages/ProjectGallery.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ImageModal from "../components/ImageModal";
import "../styleSheets/ProjectGallery.css";

const galleryImages = {
  1: ["/images/A1.jpg", "/images/A2.jpg", "/images/A3.jpg", "/images/A4.jpg", "/images/A5.jpg", "/images/A6.jpg", "/images/A7.jpg"],
  2: ["/images/A.jpg", "/images/BB.jpg", "/images/CC.jpg", "/images/DD.jpg"],
  3: [
    "/images/3.jpg", "/images/4.4.jpg", "/images/4.jpg", "/images/44.jpg",
    "/images/444.jpg", "/images/4444.jpg", "/images/44444.jpg", "/images/444444.jpg",
    { type: "video", src: "/videos/123.mp4" }
  ],
  4: ["/images/mansour1.jpg", "/images/mansour2.jpg", "/images/mansour3.jpg"],
  5: ["/images/A.1.jpg", "/images/B.1.jpg", "/images/C.1.jpg", "/images/D.1.jpg", "/images/E.jpg", "/images/F.jpg", "/images/G.jpg", "/images/H.jpg", "/images/I.jpg", "/images/J.jpg"],
  6: ["/images/LobbyOfficeDesign.jpg"]
};

const projectDetails = {
  1: { title: "E.H House", description: "Area - 180  sqr" },
  2: { title: "Lawyer's Office", description: "Area - 30  sqr" },
  3: { title: "Engineer Office", description: "Area - 100  sqr" },
  4: { title: "Mansour's House", description: "Area - 220  sqr" },
  5: { title: "N-restaurant", description: "Area - 200  sqr" },
  6: { title: "Lobby Office Design", description: "Area - 400  sqr" }
};

function ProjectGallery() {
  const { id } = useParams();
  const images = galleryImages[id] || [];
  const project = projectDetails[id];

  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="project-gallery-container">
      <Navbar />
      <div className="gallery-header">
        <h1>{project?.title || "פרויקט"}</h1>
        <p className="gallery-description">{project?.description || "אין מידע זמין לפרויקט זה."}</p>
      </div>

      <div className="gallery-grid">
        {images.map((item, index) =>
          typeof item === "string" ? (
            <img
              key={index}
              src={item}
              alt={`project-${id}-${index}`}
              onClick={() => openModal(index)}
            />
          ) : item.type === "video" ? (
            <video
              key={index}
              controls
              style={{ maxWidth: "100%", borderRadius: "12px", marginBottom: "1.5rem" }}
              onClick={() => openModal(index)}
            >
              <source src={item.src} type="video/mp4" />
              הדפדפן שלך לא תומך בווידאו.
            </video>
          ) : null
        )}
      </div>

      <ImageModal
        isOpen={modalOpen}
        image={images[currentIndex]}
        onClose={closeModal}
        onNext={goToNext}
        onPrev={goToPrev}
      />
    </div>
  );
}

export default ProjectGallery;
