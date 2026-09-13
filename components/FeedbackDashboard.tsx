"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { FeedbackReport } from "@/lib/types";
import {
  Award,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Share2,
  Download,
  Layers,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface FeedbackDashboardProps {
  report: FeedbackReport;
  onRestart: () => void;
}

export const FeedbackDashboard: React.FC<FeedbackDashboardProps> = ({
  report,
  onRestart,
}) => {
  useEffect(() => {
    // Trigger celebratory confetti if readiness is solid
    if (report.overallReadinessScore >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (_) {}
    }
  }, [report.overallReadinessScore]);

  const score = report.overallReadinessScore;
  const scoreColor =
    score >= 85
      ? "text-emerald-400 stroke-emerald-500"
      : score >= 70
      ? "text-cyan-400 stroke-cyan-500"
      : "text-amber-400 stroke-amber-500";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 text-center relative overflow-hidden"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-4 border border-emerald-500/20">
          <Award size={16} />
          <span>Agent 3: Feedback & Gap Analysis Complete</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
          Technical Interview Readiness Report
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Comprehensive evaluation across {report.totalQuestionsAnswered} deep conceptual challenges calibrated for {report.candidateYoE} Years of Experience.
        </p>

        {/* Readiness Score Ring */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="rgba(51, 65, 85, 0.4)"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeLinecap="round"
                className={scoreColor}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{
                  strokeDashoffset: 251.2 - (251.2 * score) / 100,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-4xl sm:text-5xl font-extrabold font-mono ${scoreColor}`}>
                {score}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Readiness
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Clock size={13} className="text-emerald-400" />
              <span>{report.candidateYoE} YoE Calibrated</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Layers size={13} className="text-cyan-400" />
              <span>{report.selectedTechStacks.join(", ")}</span>
            </span>
          </div>
        </div>

        {/* Executive Verdict */}
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed italic">
          &ldquo;{report.summaryVerdict}&rdquo;
        </div>
      </motion.div>

      {/* Grid: Strong Areas & Areas to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Areas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl glass-panel p-6 border border-slate-800 space-y-4"
        >
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base pb-2 border-b border-slate-800/80">
            <CheckCircle size={20} />
            <h2>Strong Areas (Demonstrated Grasp)</h2>
          </div>

          <div className="space-y-3.5">
            {report.strongAreas.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/30 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-emerald-300">
                    {item.topic}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.masteryLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.evidence}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Areas to Improve */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl glass-panel p-6 border border-slate-800 space-y-4"
        >
          <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base pb-2 border-b border-slate-800/80">
            <AlertTriangle size={20} />
            <h2>Areas to Improve (Conceptual Gaps)</h2>
          </div>

          <div className="space-y-3.5">
            {report.areasToImprove.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/30 space-y-1.5"
              >
                <h3 className="text-sm font-semibold text-amber-300">
                  {item.topic}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Identified Gap:</strong> {item.gap}
                </p>
                <p className="text-xs text-amber-200/80 leading-relaxed pt-1 border-t border-amber-900/40">
                  <span className="font-semibold">Why it matters:</span> {item.whyItMatters}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Targeted Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-4"
      >
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base pb-2 border-b border-slate-800/80">
          <Lightbulb size={20} />
          <h2>Targeted Action Items for Interview Prep</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.targetedActionItems.map((action, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5"
            >
              <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {action.category}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {action.recommendation}
              </p>
              {action.resourcesOrConcepts.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 block mb-1">Focus Concepts:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {action.resourcesOrConcepts.map((res, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 border border-slate-700/60"
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-300 text-xs font-semibold transition"
        >
          <Download size={16} />
          <span>Save / Export Report</span>
        </button>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <RefreshCw size={18} />
          <span>Start New Mock Interview</span>
        </button>
      </div>
    </div>
  );
};

