"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Key, Sparkles, RefreshCw, Zap, WifiOff, HelpCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ApiKeyModal } from "./ApiKeyModal";
import { InterviewMode, UserRole } from "@/lib/types";

interface HeaderProps {
  showLogo?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
  domain?: string;
  onReset?: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  mode?: InterviewMode;
  userRole?: UserRole;
}

export const Header: React.FC<HeaderProps> = ({
  showLogo = true,
  questionNumber,
  totalQuestions = 20,
  domain,
  onReset,
  apiKey,
  onSaveApiKey,
  mode = "ai",
  userRole = "free",
}) => {
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  const isUnlimited = Boolean(apiKey) || userRole === "pro" || mode === "offline";

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 safe-top">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Top-Left Brand Logo with layoutId */}
          <div className="flex items-center gap-3">
            {showLogo && (
              <motion.div
                layoutId="brand-logo-text"
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 24,
                }}
                className="text-2xl font-bold tracking-tight text-emerald-400 flex items-center cursor-pointer select-none"
                onClick={onReset}
              >
                <span>Crack</span>
                <span className="ml-1 text-slate-100">it</span>
                <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                  {mode === "offline" ? "Offline" : "AI Mock"}
                </span>
              </motion.div>
            )}

            {domain && (
              <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Domain:</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {domain}
                </span>
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {questionNumber && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-xs font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Question <strong className="text-emerald-400">{questionNumber}</strong> of {totalQuestions}
                </span>
              </div>
            )}

            {/* "How to set up your AI key" / Tier Status Button */}
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                apiKey
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                  : "bg-slate-900 text-slate-300 border-slate-750 hover:border-emerald-500/40 hover:text-emerald-300"
              }`}
              title="Click for step-by-step setup documentation"
            >
              <Key size={14} className={apiKey ? "text-emerald-400" : "text-amber-400"} />
              <span className="hidden md:inline">
                {apiKey ? "Your AI Key Active" : "How to set up your AI key"}
              </span>
              <span className="md:hidden">
                {apiKey ? "BYOK" : "AI Key"}
              </span>
              {isUnlimited ? (
                <span className="px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-300 hidden sm:inline-block">
                  Unlimited
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 hidden sm:inline-block">
                  1 Free/Day
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Reset / New Session */}
            {onReset && (
              <button
                onClick={onReset}
                title="Restart Session"
                className="p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-rose-300 hover:bg-slate-800 border border-slate-750 transition-colors"
              >
                <RefreshCw size={17} />
              </button>
            )}
          </div>
        </div>
      </header>

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={onSaveApiKey}
      />
    </>
  );
};
