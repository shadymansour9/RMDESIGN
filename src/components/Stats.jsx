import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import "./Stats.css";

function Counter({ value, suffix = "", duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function Stats({ items = [], eyebrow, title }) {
  return (
    <section className="rm-stats">
      <div className="rm-container">
        <motion.div
          className="rm-stats__head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow && <span className="rm-eyebrow rm-eyebrow--light">{eyebrow}</span>}
          {title && <h2 className="rm-stats__title">{title}</h2>}
        </motion.div>

        <div className="rm-stats__grid">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              className="rm-stats__item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            >
              <div className="rm-stats__value">
                <Counter value={item.value} suffix={item.suffix || ""} />
              </div>
              <div className="rm-stats__label">{item.label}</div>
              {item.caption && <div className="rm-stats__caption">{item.caption}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
