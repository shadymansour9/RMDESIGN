import { useEffect, useRef, useState } from "react";
import "./CustomCursor.css";

/**
 * Minimal custom cursor — a soft dot that grows on interactive elements.
 * Hidden on touch devices (relies on hover capability).
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fineHover) return undefined;
    setSupported(true);

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const lerp = (a, b, n) => (1 - n) * a + n * b;
    let raf = 0;
    const tick = () => {
      ringX = lerp(ringX, mouseX, 0.18);
      ringY = lerp(ringY, mouseY, 0.18);
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const interactiveSelector = "a, button, [data-cursor='hover'], input, textarea, select, label";
    const onOver = (e) => {
      if (e.target.closest(interactiveSelector)) {
        ring.classList.add("is-hover");
      }
    };
    const onOut = (e) => {
      if (e.target.closest(interactiveSelector)) {
        ring.classList.remove("is-hover");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!supported) return null;

  return (
    <>
      <div ref={ringRef} className="rm-cursor rm-cursor--ring" aria-hidden />
      <div ref={dotRef} className="rm-cursor rm-cursor--dot" aria-hidden />
    </>
  );
}
