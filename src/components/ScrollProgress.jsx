import { motion, useScroll, useSpring } from "framer-motion";
import "./ScrollProgress.css";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="rm-scroll-progress" aria-hidden>
      <motion.div className="rm-scroll-progress__bar" style={{ scaleY }} />
    </div>
  );
}
