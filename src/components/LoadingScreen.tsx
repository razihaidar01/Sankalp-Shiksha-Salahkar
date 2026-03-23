import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const tagline = "Unlock Your Potential Through Education";

export const LoadingScreen = () => {
  const [visible, setVisible] = useState(true);
  const [showTagline, setShowTagline] = useState(false);
  const [wipe, setWipe] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTagline(true), 900);
    const t2 = setTimeout(() => setWipe(true), 2200);
    const t3 = setTimeout(() => setVisible(false), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-card overflow-hidden"
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
        >
          <motion.div
            className="absolute w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, hsla(235,85%,60%,0.12) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center gap-5"
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-6 rounded-full"
                style={{ background: "radial-gradient(circle, hsla(27,100%,50%,0.15) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <img
                src={logo}
                alt="SSS"
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain relative z-10 drop-shadow-xl"
              />
            </div>

            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl sm:text-2xl font-black text-primary tracking-tight"
            >
              संकल्प शिक्षा सलाहकार
            </motion.span>
          </motion.div>

          <div className="mt-6 h-8 flex items-center px-4">
            {showTagline && (
              <div className="flex flex-wrap justify-center text-sm sm:text-base text-muted-foreground tracking-wide">
                {tagline.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.028, duration: 0.3, ease: "easeOut" }}
                  >
                    {char === " " ? " " : char}
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"
            initial={{ width: "0%" }}
            animate={{ width: wipe ? "100%" : "70%" }}
            transition={{ duration: wipe ? 0.4 : 2, ease: wipe ? "easeIn" : "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
