import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import "./CountdownTimer.css";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const pad = (n) => String(n).padStart(2, "0");

function calcParts(target) {
  const diff = Math.max(0, target - Date.now());
  return {
    diff,
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
  };
}

/**
 * Live countdown to a target ISO date.
 * Hides itself when disabled, when no date is set, or when the target has passed.
 *
 * variant: "hero" (default, dark glass for hero overlays)
 *        | "panel" (light, for use inside white panels)
 */
export default function CountdownTimer({ targetISO, enabled, label, lang = "en", variant = "hero" }) {
  const targetMs = useMemo(() => {
    if (!targetISO) return null;
    const t = Date.parse(targetISO);
    return Number.isFinite(t) ? t : null;
  }, [targetISO]);

  const [parts, setParts] = useState(() =>
    targetMs ? calcParts(targetMs) : null
  );

  useEffect(() => {
    if (!targetMs) {
      setParts(null);
      return undefined;
    }
    setParts(calcParts(targetMs));
    const id = setInterval(() => setParts(calcParts(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (!enabled || !targetMs || !parts || parts.diff <= 0) return null;

  const segments = [
    { value: parts.days, key: "d", label: lang === "he" ? "ימים" : "Days" },
    { value: parts.hours, key: "h", label: lang === "he" ? "שעות" : "Hours" },
    { value: parts.minutes, key: "m", label: lang === "he" ? "דקות" : "Minutes" },
    { value: parts.seconds, key: "s", label: lang === "he" ? "שניות" : "Seconds" },
  ];

  return (
    <motion.div
      className={`rm-countdown rm-countdown--${variant}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {label && <span className="rm-countdown__label">{label}</span>}
      <div className="rm-countdown__grid">
        {segments.map((seg) => (
          <div className="rm-countdown__unit" key={seg.key}>
            <span className="rm-countdown__num">{pad(seg.value)}</span>
            <span className="rm-countdown__sublabel">{seg.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
