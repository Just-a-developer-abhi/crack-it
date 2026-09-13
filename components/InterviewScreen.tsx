"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QuestionItem,
  InterviewTurn,
  TechStack,
  InterviewMode,
} from "@/lib/types";
import { speakText, stopSpeaking, isSpeechSynthesisSupported } from "@/lib/speech";
import {
  Sparkles,
  User,
  Bot,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Volume2,
  VolumeX,
  Clock,
  Pause,
  Play,
  Plus,
  Lightbulb,
  SkipForward,
} from "lucide-react";

interface InterviewScreenProps {
  currentQuestion: QuestionItem | null;
  turns: InterviewTurn[];
  currentTurn: InterviewTurn | null;
  isEvaluating: boolean;
  isCrafting: boolean;
  totalQuestions?: number;
  candidateYoE: number;
  selectedTechStacks: TechStack[];
  onNextQuestion: () => void;
  onSkipQuestion?: () => void;
  onFinishEarly?: () => void;
  mode?: InterviewMode;
}

export const InterviewScreen: React.FC<InterviewScreenProps> = ({
  currentQuestion,
  turns,
  currentTurn,
  isEvaluating,
  isCrafting,
  totalQuestions = 20,
  candidateYoE,
  selectedTechStacks,
  onNextQuestion,
  onSkipQuestion,
  onFinishEarly,
  mode = "ai",
}) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  // Audio Read-Aloud state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // 60-Second Question Timer state
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Hint state
  const [isHintRevealed, setIsHintRevealed] = useState<boolean>(false);

  const currentQNum = currentQuestion?.questionNumber || 1;
  const progressPercent = Math.round(((currentQNum - 1) / totalQuestions) * 100);

  // Reset timer, hint, and speech whenever question changes
  useEffect(() => {
    setTimeLeft(60);
    setIsTimerRunning(true);
    setIsHintRevealed(false);
    stopSpeaking();
    setIsSpeaking(false);
  }, [currentTurn?.id]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Timer interval
  useEffect(() => {
    if (!isTimerRunning || currentTurn?.completed) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, currentTurn?.completed]);

  // Auto-scroll when new turn, answer, or probe arrives
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentTurn, turns, isEvaluating, isCrafting]);

  const handleToggleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, {
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const handleAdd30s = () => {
    setTimeLeft((prev) => prev + 30);
    if (!isTimerRunning) setIsTimerRunning(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-36">
      {/* Top Sticky Progress & Domain Bar */}
      <div className="sticky top-16 z-20 py-3 bg-slate-950/85 backdrop-blur-md mb-6 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 text-sm">
              Question {currentQNum} <span className="text-slate-500 font-normal">of {totalQuestions}</span>
            </span>
            <span className="text-slate-600">•</span>
            {currentQuestion?.domain && (
              <span className="px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {currentQuestion.domain}
              </span>
            )}
            {mode === "offline" && (
              <span className="px-2 py-0.5 rounded-full font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px]">
                Offline
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* 60s Question Timer Widget */}
            {!currentTurn?.completed && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-colors ${
                  timeLeft <= 15
                    ? "bg-rose-950/40 text-rose-400 border-rose-800/50 animate-pulse"
                    : "bg-slate-900 text-slate-300 border-slate-800"
                }`}
              >
                <Clock size={13} className={timeLeft <= 15 ? "text-rose-400" : "text-emerald-400"} />
                <span>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </span>

                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  title={isTimerRunning ? "Pause Timer" : "Resume Timer"}
                  className="p-1 rounded text-slate-400 hover:text-slate-200"
                >
                  {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
                </button>

                <button
                  type="button"
                  onClick={handleAdd30s}
                  title="Add 30 seconds"
                  className="p-1 rounded text-slate-400 hover:text-emerald-400 flex items-center gap-0.5 text-[10px]"
                >
                  <Plus size={10} />
                  <span>30s</span>
                </button>
              </div>
            )}

            {turns.length >= 2 && onFinishEarly && (
              <button
                onClick={onFinishEarly}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition"
              >
                Finish Early
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="space-y-6">
        {/* Previous Completed Turns */}
        {turns.map((turn, index) => (
          <div key={turn.id || index} className="space-y-4 pt-4 border-t border-slate-800/60 first:border-0 first:pt-0">
            {/* Question Card */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Bot size={18} />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">
                    {mode === "ai" ? "Agent 1: Question Crafter" : "Interviewer"}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Q{turn.questionNumber} • {turn.domain}
                  </span>
                  {turn.isSkipped && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-amber-400 border border-amber-800/30">
                      Skipped / Passed
                    </span>
                  )}
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm sm:text-base leading-relaxed">
                  {turn.questionText}
                </div>
              </div>
            </div>

            {/* Candidate's Initial Answer */}
            {turn.initialAnswer && !turn.isSkipped && (
              <div className="flex items-start gap-3 justify-end pl-8">
                <div className="flex-1 space-y-1 text-right">
                  <span className="text-xs font-semibold text-slate-400">You (Candidate)</span>
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-slate-100 text-sm leading-relaxed text-left">
                    {turn.initialAnswer}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User size={18} />
                </div>
              </div>
            )}

            {/* 1-Turn Follow-Up Probe if triggered */}
            {turn.followUpQuestion && (
              <div className="flex items-start gap-3 pl-4 sm:pl-8">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <AlertTriangle size={18} />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-amber-400">
                      {mode === "ai" ? "Agent 2: Answer Evaluator" : "Follow-Up"}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                      Depth Probe
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-900/40 text-slate-100 text-sm leading-relaxed">
                    {turn.followUpQuestion}
                  </div>
                </div>
              </div>
            )}

            {/* Candidate's Follow-Up Answer */}
            {turn.followUpAnswer && (
              <div className="flex items-start gap-3 justify-end pl-8">
                <div className="flex-1 space-y-1 text-right">
                  <span className="text-xs font-semibold text-slate-400">You (Follow-Up Response)</span>
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-slate-100 text-sm leading-relaxed text-left">
                    {turn.followUpAnswer}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User size={18} />
                </div>
              </div>
            )}

            {/* Turn Evaluation Summary */}
            {turn.evaluation && !turn.isSkipped && (
              <div className="ml-11 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">
                    Depth Evaluation: {turn.evaluation.briefFeedback}
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-mono font-bold text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Score: {turn.evaluation.score}/10
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Current Active Turn */}
        {currentTurn && (
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            {/* Active Question Card with Audio & Action Controls */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Bot size={18} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-300">
                      {mode === "ai" ? "Agent 1: Question Crafter" : "Interviewer"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Q{currentTurn.questionNumber} • {currentTurn.domain}
                    </span>
                  </div>

                  {/* Question Action Controls: Read Aloud, Hint, Skip */}
                  <div className="flex items-center gap-1.5 text-xs">
                    {/* Read Aloud Button (TTS) */}
                    {isSpeechSynthesisSupported() && (
                      <button
                        type="button"
                        onClick={() => handleToggleSpeak(currentTurn.questionText)}
                        title={isSpeaking ? "Stop Reading" : "Read Question Aloud"}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition ${
                          isSpeaking
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse"
                            : "bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800"
                        }`}
                      >
                        {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        <span className="text-[11px] hidden sm:inline">
                          {isSpeaking ? "Stop" : "Listen"}
                        </span>
                      </button>
                    )}

                    {/* Hint Button */}
                    {(currentTurn.hint || currentQuestion?.hint) && (
                      <button
                        type="button"
                        onClick={() => setIsHintRevealed(!isHintRevealed)}
                        title="Get a subtle conceptual hint"
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition ${
                          isHintRevealed
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-slate-900 text-slate-400 hover:text-amber-400 border-slate-800"
                        }`}
                      >
                        <Lightbulb size={14} />
                        <span className="text-[11px] hidden sm:inline">Hint</span>
                      </button>
                    )}

                    {/* Skip / Pass Button */}
                    {onSkipQuestion && !currentTurn.completed && (
                      <button
                        type="button"
                        onClick={onSkipQuestion}
                        title="Pass on this question and proceed"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-800 transition text-[11px]"
                      >
                        <SkipForward size={14} />
                        <span className="hidden sm:inline">Pass</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-750 text-slate-100 text-sm sm:text-base leading-relaxed shadow-lg">
                  {currentTurn.questionText}
                </div>

                {/* Conceptual Hint Reveal Box */}
                {isHintRevealed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-2.5"
                  >
                    <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block text-amber-300 mb-0.5">
                        Interviewer Hint:
                      </strong>
                      <span>{currentTurn.hint || currentQuestion?.hint}</span>
                    </div>
                  </motion.div>
                )}

                {/* Low time warning banner if timer expired */}
                {timeLeft === 0 && !currentTurn.completed && (
                  <div className="text-[11px] text-amber-400 flex items-center gap-1.5 px-2">
                    <Clock size={12} />
                    <span>Time target reached. Feel free to conclude and submit your response!</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Candidate's Initial Answer if submitted */}
            {currentTurn.initialAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 justify-end pl-8"
              >
                <div className="flex-1 space-y-1 text-right">
                  <span className="text-xs font-semibold text-slate-400">You (Candidate)</span>
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-slate-100 text-sm leading-relaxed text-left">
                    {currentTurn.initialAnswer}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User size={18} />
                </div>
              </motion.div>
            )}

            {/* 1-Turn Follow-Up Probe from Agent 2 */}
            {currentTurn.followUpQuestion && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 pl-4 sm:pl-8"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <AlertTriangle size={18} />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-amber-400">
                        {mode === "ai" ? "Agent 2: Answer Evaluator" : "Interviewer"} (Follow-Up Probe)
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                        1-Turn Depth Probe
                      </span>
                    </div>

                    {/* Speak probe aloud */}
                    {isSpeechSynthesisSupported() && (
                      <button
                        type="button"
                        onClick={() => handleToggleSpeak(currentTurn.followUpQuestion!)}
                        className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                      >
                        <Volume2 size={13} />
                        <span className="text-[11px]">Listen</span>
                      </button>
                    )}
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/95 border border-amber-800/50 text-slate-100 text-sm leading-relaxed shadow-lg">
                    {currentTurn.followUpQuestion}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Candidate's Follow-Up Answer if submitted */}
            {currentTurn.followUpAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 justify-end pl-8"
              >
                <div className="flex-1 space-y-1 text-right">
                  <span className="text-xs font-semibold text-slate-400">You (Follow-Up Response)</span>
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-slate-100 text-sm leading-relaxed text-left">
                    {currentTurn.followUpAnswer}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User size={18} />
                </div>
              </motion.div>
            )}

            {/* If completed, show score and 'Next Question' button */}
            {currentTurn.completed && currentTurn.evaluation && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">
                      Evaluator Assessment: {currentTurn.evaluation.briefFeedback}
                    </span>
                    <span className="px-2.5 py-1 rounded-full font-mono font-bold text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Score: {currentTurn.evaluation.score}/10
                    </span>
                  </div>

                  {currentTurn.evaluation.keyPointsCovered.length > 0 && (
                    <div>
                      <span className="text-[11px] font-medium text-slate-400">Key Points Demonstrated:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {currentTurn.evaluation.keyPointsCovered.map((pt, idx) => (
                          <span key={idx} className="flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span>{pt}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentTurn.evaluation.missedNuances.length > 0 && (
                    <div>
                      <span className="text-[11px] font-medium text-slate-400">Missed Nuances / Edge Cases:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {currentTurn.evaluation.missedNuances.map((nuance, idx) => (
                          <span key={idx} className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-md">
                            <AlertTriangle size={12} className="text-amber-400" />
                            <span>{nuance}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={onNextQuestion}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <span>
                      {currentTurn.questionNumber >= totalQuestions
                        ? "Finish & View Full Gap Analysis"
                        : "Proceed to Next Question"}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Evaluating State Loader */}
        {isEvaluating && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 animate-pulse">
            <Loader2 size={16} className="text-emerald-400 animate-spin" />
            <span>
              {mode === "ai"
                ? "Agent 2: Evaluating your response against architectural depth and edge cases..."
                : "Evaluating your response..."}
            </span>
          </div>
        )}

        {/* Crafting State Loader */}
        {isCrafting && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 animate-pulse">
            <Loader2 size={16} className="text-emerald-400 animate-spin" />
            <span>
              {mode === "ai"
                ? `Agent 1: Formulating question ${currentQNum} calibrated to your experience level...`
                : `Loading question ${currentQNum}...`}
            </span>
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>
    </div>
  );
};
