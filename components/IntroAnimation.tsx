"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  // Stages:
  // 0: "Do you have an interview?"
  // 1: "Are you worried?"
  // 2: "Do you feel you are not ready?"
  // 3: "Lets Mock it" (unified slide-up)
  // 4: "Lets Crack it" ("Mock" translates up/fades out, "Crack" takes its place)
  // 5: "Crack it" ("Lets " dissolves and collapses)
  const [stage, setStage] = useState<number>(0);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const timers = timersRef.current;

    // Stage 0 -> 1
    timers.push(setTimeout(() => setStage(1), 1600));
    // Stage 1 -> 2
    timers.push(setTimeout(() => setStage(2), 3300));
    // Stage 2 -> 3 ("Lets Mock it")
    timers.push(setTimeout(() => setStage(3), 5000));
    // Stage 3 -> 4 ("Mock" -> "Crack")
    timers.push(setTimeout(() => setStage(4), 6700));
    // Stage 4 -> 5 ("Lets " collapses, leaving "Crack it")
    timers.push(setTimeout(() => setStage(5), 8000));
    // Stage 5 -> Complete handover to header & onboarding form
    timers.push(
      setTimeout(() => {
        onComplete();
      }, 8900)
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  const handleSkip = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 overflow-hidden select-none"
    >
      {/* Subtle Skip Option */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-xs text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-widest px-3 py-1.5 rounded-full border border-slate-800/80 bg-slate-900/60 backdrop-blur z-20 cursor-pointer"
      >
        Skip Intro &rarr;
      </button>

      {/* Main Animation Container */}
      <div className="relative w-full max-w-2xl min-h-[140px] flex items-center justify-center px-4 text-center">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.h1
              key="stage-0"
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -22, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-200"
            >
              Do you have an interview?
            </motion.h1>
          )}

          {stage === 1 && (
            <motion.h1
              key="stage-1"
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -22, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-amber-300/90"
            >
              Are you worried?
            </motion.h1>
          )}

          {stage === 2 && (
            <motion.h1
              key="stage-2"
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -22, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-rose-400/90"
            >
              Do you feel you are not ready?
            </motion.h1>
          )}

          {(stage === 3 || stage === 4 || stage === 5) && (
            <motion.div
              key="brand-reveal-block"
              initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight select-none"
            >
              {/* "Lets " text - fades out in stage 5 */}
              <motion.span
                animate={
                  stage >= 5
                    ? { opacity: 0, width: 0, marginRight: 0, filter: "blur(4px)" }
                    : { opacity: 1, width: "auto", marginRight: "0.25em", filter: "blur(0px)" }
                }
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden inline-block text-slate-300 whitespace-nowrap font-bold"
              >
                Lets
              </motion.span>

              {/* Brand logo container with layoutId for handover to Header */}
              <motion.div
                layoutId="brand-logo-text"
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 24,
                }}
                className="flex items-center font-extrabold tracking-tight"
              >
                {/* Word slot for Mock / Crack */}
                <span className="relative inline-grid place-items-center text-center min-w-[3.4ch]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {stage === 3 ? (
                      <motion.span
                        key="word-mock"
                        initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="col-start-1 row-start-1 text-cyan-400 font-extrabold"
                      >
                        Mock
                      </motion.span>
                    ) : (
                      <motion.span
                        key="word-crack"
                        initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="col-start-1 row-start-1 text-emerald-400 font-extrabold drop-shadow-[0_0_20px_rgba(52,211,153,0.35)]"
                      >
                        Crack
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>

                {/* "it" */}
                <span className="ml-1.5 text-slate-100 font-extrabold">it</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Aesthetic minimalist background radial grid */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0,transparent_70%)]" />
    </motion.div>
  );
};
