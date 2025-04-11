import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styleSheets/ProjectGallery.css"; // אל תשכח ליצור גם את הקובץ הזה

const galleryImages = {
  1: ["/images/EH1.jpg", "/images/EH2.jpg", "/images/EH3.jpg"],
  2: ["/images/office1.jpg"],
  3: ["/images/villa1.jpg"],
  4: ["/images/mansour.jpg"],
  5: ["/images/N-restaurant.jpg"],
  6: ["/images/LobbyOfficeDesign.jpg"]
};

function ProjectGallery() {
  const { id } = useParams();
  const images = galleryImages[id] || [];

  return (
    <div className="project-gallery-container">
      <Navbar />
      <h1>תמונות מהפרויקט</h1>
      <div className="gallery-grid">
        {images.length === 0 ? (
          <p>אין תמונות זמינות לפרויקט זה.</p>
        ) : (
          images.map((src, index) => (
            <img key={index} src={src} alt={`project-${id}-${index}`} />
          ))
        )}
      </div>
    </div>
  );
}

export default ProjectGallery;
