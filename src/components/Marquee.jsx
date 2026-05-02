import { motion } from "framer-motion";
import "./Marquee.css";

/**
 * Infinite horizontal marquee. Pass children once — duplicated under the hood.
 */
export default function Marquee({ children, speed = 30, reverse = false, className = "" }) {
  const items = Array.from({ length: 6 });
  return (
    <div className={`rm-marquee ${className}`} aria-hidden>
      <motion.div
        className="rm-marquee__track"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {items.map((_, i) => (
          <span className="rm-marquee__item" key={i}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
