import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Loader.css";

const SESSION_KEY = "rm-intro-shown";

/**
 * First-visit brand intro. Plays once per session.
 * Black curtain → RM monogram fade in → curtain splits open vertically.
 */
export default function Loader() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(SESSION_KEY);
  });

  useEffect(() => {
    if (!show) return undefined;
    document.body.classList.add("rm-loading");
    const timer = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setShow(false);
    }, 2200);
    return () => {
      clearTimeout(timer);
      document.body.classList.remove("rm-loading");
    };
  }, [show]);

  useEffect(() => {
    if (!show) document.body.classList.remove("rm-loading");
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="rm-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="rm-loader__panel rm-loader__panel--top"
            initial={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1.0, ease: [0.83, 0, 0.17, 1], delay: 0.2 }}
          />
          <motion.div
            className="rm-loader__panel rm-loader__panel--bottom"
            initial={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 1.0, ease: [0.83, 0, 0.17, 1], delay: 0.2 }}
          />

          <div className="rm-loader__center">
            <motion.div
              className="rm-loader__monogram"
              initial={{ opacity: 0, scale: 0.85, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, scale: 1, letterSpacing: "0.4em" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>R</span>
              <span>M</span>
            </motion.div>
            <motion.div
              className="rm-loader__line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
            />
            <motion.div
              className="rm-loader__sub"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Design Studio · Haifa
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
