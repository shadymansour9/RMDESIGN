import { motion } from "framer-motion";
import "./RevealText.css";

/**
 * Mask-reveal heading: each word/line slides up from below a clipping mask.
 * Pass `mode="words"` (default) or `mode="lines"`.
 */
export default function RevealText({
  children,
  delay = 0,
  stagger = 0.08,
  mode = "words",
  as: Tag = "span",
  className = "",
}) {
  const text = String(children);
  const tokens = mode === "lines" ? text.split("\n") : text.split(" ");

  return (
    <Tag className={`rm-reveal ${className}`}>
      {tokens.map((tok, i) => (
        <span className="rm-reveal__mask" key={i}>
          <motion.span
            className="rm-reveal__inner"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * stagger,
            }}
          >
            {tok}
          </motion.span>
          {i < tokens.length - 1 && mode === "words" ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
