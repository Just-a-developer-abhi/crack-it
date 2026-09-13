"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  // Stages:
  // 0: "Do you have an interview?"
  // 1: "Are you worried?"
  // 2: "Do you feel you are not ready?"
  // 3: "Lets Mock it"
  // 4: "Lets Crack it" ("Mock" translates up/fades out, "Crack" takes its place)
  // 5: "Lets " fades out, "Crack it" moves to top-left
  // 6: Complete
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Stage 0 -> 1
    timers.push(setTimeout(() => setStage(1), 2000));
    // Stage 1 -> 2
    timers.push(setTimeout(() => setStage(2), 4000));
    // Stage 2 -> 3
    timers.push(setTimeout(() => setStage(3), 6000));
    // Stage 3 -> 4 ("Mock" -> "Crack")
    timers.push(setTimeout(() => setStage(4), 8000));
    // Stage 4 -> 5 ("Lets " fades out, "Crack it" transitions to header)
    timers.push(setTimeout(() => setStage(5), 9800));
    // Stage 5 -> 6 (Complete & reveal setup form)
    timers.push(
      setTimeout(() => {
        setStage(6);
        onComplete();
      }, 11200)
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  const handleSkip = () => {
    setStage(6);
    onComplete();
  };

  if (stage >= 6) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Subtle Skip Option */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest px-3 py-1.5 rounded-full border border-slate-800/80 bg-slate-900/60 backdrop-blur"
      >
        Skip Intro &rarr;
      </button>

      {/* Stage 0, 1, 2 Sequential Question Prompts */}
      <div className="relative w-full max-w-xl h-24 flex items-center justify-center px-4 text-center">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.h1
              key="stage-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-200"
            >
              Do you have an interview?
            </motion.h1>
          )}

          {stage === 1 && (
            <motion.h1
              key="stage-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl font-semibold tracking-tight text-amber-300/90"
            >
              Are you worried?
            </motion.h1>
          )}

          {stage === 2 && (
            <motion.h1
              key="stage-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl font-semibold tracking-tight text-rose-400/90"
            >
              Do you feel you are not ready?
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Stages 3, 4, 5: Lets Mock it -> Lets Crack it -> Crack it */}
        {(stage === 3 || stage === 4 || stage === 5) && (
          <div
            className={`flex items-center transition-all duration-1000 ${
              stage === 5
                ? "fixed top-6 left-6 z-50"
                : "relative justify-center"
            }`}
          >
            {/* "Lets " text */}
            <motion.span
              animate={
                stage === 5
                  ? { opacity: 0, scale: 0.8, width: 0 }
                  : { opacity: 1, scale: 1 }
              }
              transition={{ duration: 0.5 }}
              className={`overflow-hidden whitespace-pre font-bold tracking-tight text-slate-300 ${
                stage === 5
                  ? "text-2xl"
                  : "text-4xl md:text-6xl"
              }`}
            >
              Lets{" "}
            </motion.span>

            {/* Container for Mock -> Crack + " it" */}
            <div className="flex items-center">
              <motion.div
                layoutId="brand-logo-text"
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 24,
                }}
                className={`font-extrabold tracking-tight flex items-center ${
                  stage === 5
                    ? "text-2xl font-bold tracking-tight text-emerald-400"
                    : "text-4xl md:text-6xl text-emerald-400"
                }`}
              >
                {/* Flipping between Mock and Crack */}
                <span className="relative inline-block overflow-hidden min-w-[2.6ch] text-center">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {stage === 3 ? (
                      <motion.span
                        key="word-mock"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -35 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="inline-block text-cyan-400"
                      >
                        Mock
                      </motion.span>
                    ) : (
                      <motion.span
                        key="word-crack"
                        initial={{ opacity: 0, y: 35 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-block text-emerald-400"
                      >
                        Crack
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <span className="ml-2">it</span>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Aesthetic minimalist background radial grid */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0,transparent_70%)]" />
    </div>
  );
};

