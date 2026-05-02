import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./ImageMarquee.css";

/**
 * Horizontal scrolling row of project tiles. Pauses on hover (per-item via CSS).
 * `items` = [{ id, image, title, caption, to }]
 */
export default function ImageMarquee({ items = [], speed = 50, reverse = false }) {
  if (!items.length) return null;
  // Duplicate set so the loop seamlessly wraps.
  const loop = [...items, ...items];

  return (
    <div className="rm-imarquee" aria-hidden={false}>
      <motion.div
        className="rm-imarquee__track"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {loop.map((item, i) => (
          <Link
            to={item.to || "/projects"}
            key={`${item.id}-${i}`}
            className="rm-imarquee__item"
            data-cursor="hover"
          >
            <div
              className="rm-imarquee__media"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="rm-imarquee__caption">
              <span className="rm-imarquee__title">{item.title}</span>
              {item.caption && <span className="rm-imarquee__sub">{item.caption}</span>}
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
