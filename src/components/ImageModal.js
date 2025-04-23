// src/components/ImageModal.js
import React from "react";
import "./ImageModal.css";

function ImageModal({ isOpen, image, onClose, onPrev, onNext }) {
  if (!isOpen || !image) return null;

  const isVideo = typeof image === "object" && image.type === "video";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <button className="modal-prev" onClick={onPrev}>←</button>

        {isVideo ? (
          <video controls autoPlay>
            <source src={image.src} type="video/mp4" />
            הדפדפן שלך לא תומך בווידאו.
          </video>
        ) : (
          <img src={image} alt="תמונה מוגדלת" />
        )}

        <button className="modal-next" onClick={onNext}>→</button>
      </div>
    </div>
  );
}

export default ImageModal;
