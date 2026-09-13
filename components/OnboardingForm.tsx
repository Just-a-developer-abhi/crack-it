"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AVAILABLE_TECH_STACKS,
  TechStack,
  InterviewMode,
} from "@/lib/types";
import { checkDailyAllowance } from "@/lib/rate-limit";
import {
  Check,
  Sparkles,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Bot,
  WifiOff,
  Key,
  AlertCircle,
  Zap,
} from "lucide-react";

interface OnboardingFormProps {
  onStartInterview: (config: {
    selectedTechStacks: TechStack[];
    candidateYoE: number;
    mode: InterviewMode;
  }) => void;
  isLoading: boolean;
  apiKey?: string;
  onOpenApiKeyModal?: () => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  onStartInterview,
  isLoading,
  apiKey = "",
  onOpenApiKeyModal,
}) => {
  const [selectedStacks, setSelectedStacks] = useState<TechStack[]>([
    "TypeScript",
    "NodeJS",
    "React",
  ]);
  const [yoe, setYoe] = useState<number>(5);
  const [mode, setMode] = useState<InterviewMode>("ai");
  const [hasServerKey, setHasServerKey] = useState<boolean>(false);
  const [isCheckingServerKey, setIsCheckingServerKey] = useState<boolean>(true);

  React.useEffect(() => {
    fetch("/api/interview")
      .then((res) => res.json())
      .then((data) => {
        setHasServerKey(Boolean(data.hasServerKey));
      })
      .catch(() => {
        setHasServerKey(false);
      })
      .finally(() => {
        setIsCheckingServerKey(false);
      });
  }, []);

  const hasKeyForAi = Boolean(apiKey && apiKey.trim().length > 5) || hasServerKey;
  const allowance = checkDailyAllowance(Boolean(apiKey), mode);

  const toggleStack = (stack: TechStack) => {
    if (selectedStacks.includes(stack)) {
      if (selectedStacks.length === 1) return; // Keep at least one
      setSelectedStacks(selectedStacks.filter((s) => s !== stack));
    } else {
      setSelectedStacks([...selectedStacks, stack]);
    }
  };

  const handleSelectAll = () => {
    setSelectedStacks([...AVAILABLE_TECH_STACKS]);
  };

  const handleClear = () => {
    setSelectedStacks(["TypeScript"]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStacks.length === 0 || yoe < 1 || yoe > 15) return;
    if (mode === "ai" && !hasKeyForAi) {
      if (onOpenApiKeyModal) onOpenApiKeyModal();
      return;
    }
    if (!allowance.allowed) return;

    onStartInterview({
      selectedTechStacks: selectedStacks,
      candidateYoE: yoe,
      mode,
    });
  };

  const getYoELabel = (val: number) => {
    if (val <= 3) {
      return {
        level: "Junior (1-3 YoE)",
        desc: "Foundational Internals, Event Loop, GC Roots & OOP Contracts",
        color: "text-sky-400 border-sky-500/30 bg-sky-500/10",
      };
    }
    if (val <= 7) {
      return {
        level: "Mid-Level (4-7 YoE)",
        desc: "Concurrency, Thread Safety, Connection Pooling & Microservices Resilience",
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      };
    }
    return {
      level: "Senior / Staff (8-15 YoE)",
      desc: "Distributed Consensus, Zero-Downtime Migrations & High-Scale Bottlenecks",
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    };
  };

  const currentLevel = getYoELabel(yoe);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center min-h-[420px] p-8 rounded-3xl glass-panel text-center relative overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center animate-pulse">
                <Cpu className="w-10 h-10 text-emerald-400 animate-spin" style={{ animationDuration: "6s" }} />
              </div>
              <div className="absolute inset-0 rounded-full border border-emerald-400/40 animate-ping" style={{ animationDuration: "2.5s" }} />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-100 mb-2">
              Getting your test ready...
            </h2>
            <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              {mode === "ai" ? "Agent 1 (Question Crafter)" : "Offline Question Engine"} is calibrating 20 architectural & conceptual probes for{" "}
              <strong className="text-emerald-400 font-semibold">{yoe} YoE</strong> across{" "}
              <strong className="text-slate-200 font-medium">
                {selectedStacks.slice(0, 3).join(", ")}
                {selectedStacks.length > 3 ? ` +${selectedStacks.length - 3} more` : ""}
              </strong>
              .
            </p>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <Sparkles size={16} className="text-emerald-400 shrink-0" />
              <span>Zero syntax tests. Pure systems depth, concurrency & resilience.</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form-state"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl glass-panel p-6 sm:p-10 border border-slate-800/80 shadow-2xl relative"
          >
            {/* Header / Intro */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-3">
                <Sparkles size={14} />
                <span>AI Technical Mock Interview</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
                Tailor Your Interview Session
              </h1>
              <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                Configure your target domain stack, seniority level, and interview mode.
              </p>
            </div>

            {/* Mode Switcher: AI Mode vs Offline Practice Mode */}
            <div className="mb-8 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row gap-1.5">
              <button
                type="button"
                onClick={() => setMode("ai")}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-semibold transition-all ${
                  mode === "ai"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Bot size={16} />
                <div className="text-left">
                  <div className="font-bold">Live AI Mode (Gemini)</div>
                  <div className={`text-[10px] ${mode === "ai" ? "text-slate-900" : "text-slate-500"}`}>
                    Dynamic probes & real-time evaluations
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("offline")}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-semibold transition-all ${
                  mode === "offline"
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <WifiOff size={16} />
                <div className="text-left">
                  <div className="font-bold">Offline Practice Mode</div>
                  <div className={`text-[10px] ${mode === "offline" ? "text-slate-900" : "text-slate-500"}`}>
                    Curated real-world question bank • Unlimited
                  </div>
                </div>
              </button>
            </div>

            {/* Missing API Key Warning for AI Mode */}
            {mode === "ai" && !hasKeyForAi && !isCheckingServerKey && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 space-y-2.5 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertCircle size={16} />
                  <span>Gemini API Key Required for Live AI Mode</span>
                </div>
                <p className="leading-relaxed">
                  Live AI Mode requires a Google Gemini API key to craft dynamic questions and evaluate your architectural explanations. You can enter your free key or switch to Offline Practice Mode with no key needed.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {onOpenApiKeyModal && (
                    <button
                      type="button"
                      onClick={onOpenApiKeyModal}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
                    >
                      Set Up Free Gemini Key (Takes 60s)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMode("offline")}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                  >
                    Switch to Offline Practice Mode
                  </button>
                </div>
              </div>
            )}

            {/* Rate limit status / banner */}
            {!allowance.allowed ? (
              <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/50 text-xs text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertCircle size={16} />
                  <span>Daily Free Mock Limit Reached (1/1 Used)</span>
                </div>
                <p className="leading-relaxed">
                  Free users can start 1 AI mock per calendar day. To continue practicing right now:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {onOpenApiKeyModal && (
                    <button
                      type="button"
                      onClick={onOpenApiKeyModal}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
                    >
                      Set Up Free Gemini Key (Unlimited)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMode("offline")}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                  >
                    Switch to Offline Practice Mode
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6 flex items-center justify-between text-xs px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Zap size={13} className="text-emerald-400" />
                  <span>{allowance.reason}</span>
                </span>
                {!apiKey && mode === "ai" && onOpenApiKeyModal && (
                  <button
                    type="button"
                    onClick={onOpenApiKeyModal}
                    className="text-emerald-400 hover:underline font-medium"
                  >
                    Unlock unlimited with your key &rarr;
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Tech Stack Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <Layers size={16} className="text-emerald-400" />
                    <span>Tech Stack Selection</span>
                    <span className="text-xs text-slate-500 font-normal">
                      ({selectedStacks.length} selected)
                    </span>
                  </label>
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-slate-400 hover:text-emerald-400 transition"
                    >
                      Select All
                    </button>
                    <span className="text-slate-700">•</span>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-slate-400 hover:text-rose-400 transition"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {AVAILABLE_TECH_STACKS.map((stack) => {
                    const isSelected = selectedStacks.includes(stack);
                    return (
                      <button
                        key={stack}
                        type="button"
                        onClick={() => toggleStack(stack)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border text-left ${
                          isSelected
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10"
                            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                        }`}
                      >
                        <span className="truncate">{stack}</span>
                        {isSelected && (
                          <Check size={14} className="text-emerald-400 shrink-0 ml-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Years of Experience */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <Clock size={16} className="text-emerald-400" />
                    <span>Years of Experience (YoE)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={yoe}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) {
                          setYoe(Math.max(1, Math.min(15, val)));
                        }
                      }}
                      className="w-16 px-2.5 py-1 text-center font-bold text-sm rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-slate-400">Years</span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={yoe}
                  onChange={(e) => setYoe(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                <div className="flex justify-between text-[11px] text-slate-500 px-1">
                  <span>1 yr</span>
                  <span>5 yrs</span>
                  <span>10 yrs</span>
                  <span>15 yrs</span>
                </div>

                {/* Calibration Banner */}
                <div
                  className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 transition-colors ${currentLevel.color}`}
                >
                  <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block">{currentLevel.level}</strong>
                    <span className="opacity-90 leading-tight block mt-0.5">
                      {currentLevel.desc}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Start Mock Interview Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={selectedStacks.length === 0 || !allowance.allowed}
                  className={`w-full group flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 shadow-xl active:scale-[0.99] ${
                    mode === "ai" && !hasKeyForAi
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <span>
                    {mode === "ai" && !hasKeyForAi
                      ? "Set Up AI Key to Start (or Switch to Offline)"
                      : mode === "ai"
                      ? "Start Live AI Mock Interview"
                      : "Start Offline Practice Interview"}
                  </span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-2.5">
                  20 conceptual challenges • Voice dictation & audio read-aloud • 60s timers & hints
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
