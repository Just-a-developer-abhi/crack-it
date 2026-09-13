"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import {
  TechStack,
  QuestionItem,
  InterviewTurn,
  FeedbackReport,
  InterviewStage,
  InterviewMode,
  UserRole,
} from "@/lib/types";
import { recordMockStarted, getUserRole } from "@/lib/rate-limit";
import { IntroAnimation } from "@/components/IntroAnimation";
import { Header } from "@/components/Header";
import { OnboardingForm } from "@/components/OnboardingForm";
import { InterviewScreen } from "@/components/InterviewScreen";
import { BottomResponseBar } from "@/components/BottomResponseBar";
import { FeedbackDashboard } from "@/components/FeedbackDashboard";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [stage, setStage] = useState<InterviewStage>("intro");
  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean>(false);

  // Mode and Tier
  const [mode, setMode] = useState<InterviewMode>("ai");
  const [userRole, setUserRole] = useState<UserRole>("free");
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Setup form states
  const [selectedTechStacks, setSelectedTechStacks] = useState<TechStack[]>([
    "TypeScript",
    "NodeJS",
    "React",
  ]);
  const [candidateYoE, setCandidateYoE] = useState<number>(5);

  // Session states
  const [turns, setTurns] = useState<InterviewTurn[]>([]);
  const [currentTurn, setCurrentTurn] = useState<InterviewTurn | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isCrafting, setIsCrafting] = useState<boolean>(false);
  const [feedbackReport, setFeedbackReport] = useState<FeedbackReport | null>(null);

  // Gemini API key state (stored in localStorage)
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem("crack-it-gemini-key");
      if (storedKey) setApiKey(storedKey);
      setUserRole(getUserRole());
    } catch (_) {}
  }, []);

  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    try {
      if (newKey) {
        localStorage.setItem("crack-it-gemini-key", newKey);
      } else {
        localStorage.removeItem("crack-it-gemini-key");
      }
    } catch (_) {}
  };

  const handleIntroComplete = () => {
    setHasCompletedIntro(true);
    setStage("onboarding");
  };

  // Start the interview
  const handleStartInterview = async (config: {
    selectedTechStacks: TechStack[];
    candidateYoE: number;
    mode: InterviewMode;
  }) => {
    setSelectedTechStacks(config.selectedTechStacks);
    setCandidateYoE(config.candidateYoE);
    setMode(config.mode);
    setStage("loading");

    // Track daily usage
    recordMockStarted();

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "craft",
          questionNumber: 1,
          candidateYoE: config.candidateYoE,
          selectedTechStacks: config.selectedTechStacks,
          previousDomains: [],
          previousQuestions: [],
          apiKey,
          mode: config.mode,
        }),
      });

      const data = await res.json();
      if (data.success && data.question) {
        const firstQ: QuestionItem = data.question;
        setCurrentQuestion(firstQ);
        setCurrentTurn({
          id: firstQ.id,
          questionNumber: 1,
          domain: firstQ.domain,
          questionText: firstQ.questionText,
          hint: firstQ.hint,
          completed: false,
        });
        setTurns([]);
        setStage("in_progress");
      } else {
        throw new Error(data.error || "Failed to craft question 1");
      }
    } catch (err: any) {
      console.error("Failed to start interview:", err);
      setApiError(
        err?.message ||
          "Failed to start AI interview. Please check your Gemini API key or switch to Offline Practice Mode."
      );
      setStage("onboarding");
    }
  };

  // Handle user answer submission (Initial or Follow-up)
  const handleSubmitAnswer = async (answerText: string) => {
    if (!currentTurn || !currentQuestion || isEvaluating) return;

    // Check if candidate explicitly passes or expresses zero knowledge
    const cleanAnswer = answerText.trim().toLowerCase();
    const isExplicitPass =
      cleanAnswer === "pass" ||
      cleanAnswer === "skip" ||
      cleanAnswer === "i don't know" ||
      cleanAnswer === "i dont know" ||
      cleanAnswer === "no idea" ||
      cleanAnswer === "idk" ||
      cleanAnswer === "pass this question";

    if (isExplicitPass && !currentTurn.initialAnswer) {
      // Route directly through strict 0-score skip
      await handleSkipQuestion();
      return;
    }

    // Turn 1: Initial Answer
    if (!currentTurn.initialAnswer) {
      const updatedTurn: InterviewTurn = {
        ...currentTurn,
        initialAnswer: answerText,
      };
      setCurrentTurn(updatedTurn);
      setIsEvaluating(true);

      try {
        const res = await fetch("/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "evaluate",
            question: currentQuestion,
            answer: answerText,
            candidateYoE,
            isFollowUpTurn: false,
            apiKey,
            mode,
          }),
        });

        const data = await res.json();
        if (data.success && data.evaluation) {
          const evalResult = data.evaluation;
          if (evalResult.isFollowUpNeeded && evalResult.followUpQuestion) {
            // Trigger 1-turn follow up probe
            setCurrentTurn({
              ...updatedTurn,
              followUpQuestion: evalResult.followUpQuestion,
              completed: false,
            });
          } else {
            // Answer was comprehensive or didn't need follow-up
            setCurrentTurn({
              ...updatedTurn,
              evaluation: evalResult,
              completed: true,
            });
          }
        } else {
          setApiError(data.error || "Evaluation failed. Please check your API key or network.");
        }
      } catch (err: any) {
        console.error("Evaluation error:", err);
        setApiError(err?.message || "Failed to evaluate answer.");
      } finally {
        setIsEvaluating(false);
      }
    }
    // Turn 2: Follow-up Answer
    else if (currentTurn.followUpQuestion && !currentTurn.followUpAnswer) {
      const updatedTurn: InterviewTurn = {
        ...currentTurn,
        followUpAnswer: answerText,
      };
      setCurrentTurn(updatedTurn);
      setIsEvaluating(true);

      try {
        const res = await fetch("/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "evaluate",
            question: currentQuestion,
            answer: answerText,
            priorAnswer: currentTurn.initialAnswer,
            candidateYoE,
            isFollowUpTurn: true,
            apiKey,
            mode,
          }),
        });

        const data = await res.json();
        if (data.success && data.evaluation) {
          setCurrentTurn({
            ...updatedTurn,
            evaluation: data.evaluation,
            completed: true,
          });
        } else {
          setApiError(data.error || "Follow-up evaluation failed.");
        }
      } catch (err: any) {
        console.error("Follow-up evaluation error:", err);
        setApiError(err?.message || "Failed to evaluate follow-up answer.");
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  // Skip / Pass Current Question (Strict 0/10 Score)
  const handleSkipQuestion = async () => {
    if (!currentTurn) return;

    const skippedTurn: InterviewTurn = {
      ...currentTurn,
      isSkipped: true,
      completed: true,
      initialAnswer: currentTurn.initialAnswer || "Candidate passed on this question.",
      evaluation: {
        score: 0,
        isFollowUpNeeded: false,
        briefFeedback: "Question passed by candidate (0/10 points).",
        keyPointsCovered: [],
        missedNuances: ["Skipped conceptual challenge without technical explanation"],
      },
    };

    const allTurns = [...turns, skippedTurn];
    setTurns(allTurns);

    const nextQNum = currentTurn.questionNumber + 1;
    if (nextQNum > 20) {
      await triggerFeedbackReport(allTurns);
      return;
    }

    setIsCrafting(true);
    setCurrentTurn(null);

    const previousDomains = allTurns.map((t) => t.domain);
    const previousQuestions = allTurns.map((t) => t.questionText);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "craft",
          questionNumber: nextQNum,
          candidateYoE,
          selectedTechStacks,
          previousDomains,
          previousQuestions,
          apiKey,
          mode,
        }),
      });

      const data = await res.json();
      if (data.success && data.question) {
        const nextQ: QuestionItem = data.question;
        setCurrentQuestion(nextQ);
        setCurrentTurn({
          id: nextQ.id,
          questionNumber: nextQNum,
          domain: nextQ.domain,
          questionText: nextQ.questionText,
          hint: nextQ.hint,
          completed: false,
        });
      } else {
        setApiError(data.error || `Failed to formulate question ${nextQNum}`);
      }
    } catch (err: any) {
      console.error("Next question craft error:", err);
      setApiError(err?.message || "Failed to craft question.");
    } finally {
      setIsCrafting(false);
    }
  };

  // Move to next question or trigger final feedback
  const handleNextQuestion = async () => {
    if (!currentTurn) return;

    const allTurns = [...turns, currentTurn];
    setTurns(allTurns);

    const nextQNum = currentTurn.questionNumber + 1;

    // Check if finished 20 questions
    if (nextQNum > 20) {
      await triggerFeedbackReport(allTurns);
      return;
    }

    // Otherwise craft next question
    setIsCrafting(true);
    setCurrentTurn(null);

    const previousDomains = allTurns.map((t) => t.domain);
    const previousQuestions = allTurns.map((t) => t.questionText);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "craft",
          questionNumber: nextQNum,
          candidateYoE,
          selectedTechStacks,
          previousDomains,
          previousQuestions,
          apiKey,
          mode,
        }),
      });

      const data = await res.json();
      if (data.success && data.question) {
        const nextQ: QuestionItem = data.question;
        setCurrentQuestion(nextQ);
        setCurrentTurn({
          id: nextQ.id,
          questionNumber: nextQNum,
          domain: nextQ.domain,
          questionText: nextQ.questionText,
          hint: nextQ.hint,
          completed: false,
        });
      } else {
        setApiError(data.error || `Failed to formulate question ${nextQNum}`);
      }
    } catch (err: any) {
      console.error("Next question craft error:", err);
      setApiError(err?.message || "Failed to craft question.");
    } finally {
      setIsCrafting(false);
    }
  };

  // Generate final gap analysis & readiness report
  const triggerFeedbackReport = async (allTurns: InterviewTurn[]) => {
    setStage("loading");

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "feedback",
          turns: allTurns,
          candidateYoE,
          selectedTechStacks,
          apiKey,
          mode,
        }),
      });

      const data = await res.json();
      if (data.success && data.report) {
        setFeedbackReport(data.report);
        setStage("feedback");
      }
    } catch (err) {
      console.error("Feedback generation error:", err);
    }
  };

  // Restart interview
  const handleRestart = () => {
    setTurns([]);
    setCurrentTurn(null);
    setCurrentQuestion(null);
    setFeedbackReport(null);
    setStage("onboarding");
  };

  const isFollowUpActive =
    Boolean(currentTurn?.followUpQuestion && !currentTurn?.followUpAnswer);

  return (
    <LayoutGroup id="crack-it-brand">
      <main className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative selection:bg-emerald-500/30 selection:text-emerald-300">
        {/* 1. Intro Animation Choreography */}
        <AnimatePresence>
          {!hasCompletedIntro && (
            <IntroAnimation key="intro-flow" onComplete={handleIntroComplete} />
          )}
        </AnimatePresence>

        {/* Persistent Header */}
        {hasCompletedIntro && (
          <Header
          showLogo={true}
          questionNumber={
            stage === "in_progress" ? currentTurn?.questionNumber : undefined
          }
          totalQuestions={20}
          domain={stage === "in_progress" ? currentTurn?.domain : undefined}
          onReset={stage !== "onboarding" ? handleRestart : undefined}
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
          mode={mode}
          userRole={userRole}
        />
      )}

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Onboarding Setup Form & Loader */}
        {(stage === "onboarding" || stage === "loading") && (
          <OnboardingForm
            onStartInterview={handleStartInterview}
            isLoading={stage === "loading"}
            apiKey={apiKey}
            onOpenApiKeyModal={() => setIsKeyModalOpen(true)}
          />
        )}

        {/* Active Interview Session */}
        {stage === "in_progress" && (
          <>
            <InterviewScreen
              currentQuestion={currentQuestion}
              turns={turns}
              currentTurn={currentTurn}
              isEvaluating={isEvaluating}
              isCrafting={isCrafting}
              totalQuestions={20}
              candidateYoE={candidateYoE}
              selectedTechStacks={selectedTechStacks}
              onNextQuestion={handleNextQuestion}
              onSkipQuestion={handleSkipQuestion}
              mode={mode}
              onFinishEarly={
                turns.length >= 1
                  ? () => triggerFeedbackReport([...turns, ...(currentTurn ? [currentTurn] : [])])
                  : undefined
              }
            />

            {/* Fixed Bottom Response Bar */}
            <BottomResponseBar
              onSubmit={handleSubmitAnswer}
              onSkip={handleSkipQuestion}
              disabled={
                isEvaluating ||
                isCrafting ||
                Boolean(currentTurn?.completed)
              }
              isFollowUp={isFollowUpActive}
              placeholder={
                isFollowUpActive
                  ? "Respond to the follow-up probe: address missing nuances and failure modes..."
                  : "Type your architectural explanation or click the mic for voice dictation..."
              }
            />
          </>
        )}

        {/* Feedback & Gap Analysis Dashboard */}
        {stage === "feedback" && feedbackReport && (
          <FeedbackDashboard
            report={feedbackReport}
            onRestart={handleRestart}
          />
        )}
      </div>

      {/* API Error Dialog Modal */}
      {apiError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-rose-800/60 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400 font-bold text-base">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <span>Service Notification</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {apiError}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setApiError(null);
                  setIsKeyModalOpen(true);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition text-center"
              >
                Set Up Free AI Key
              </button>
              <button
                type="button"
                onClick={() => {
                  setApiError(null);
                  setMode("offline");
                  handleRestart();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition text-center"
              >
                Switch to Offline Mode
              </button>
              <button
                type="button"
                onClick={() => setApiError(null)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition text-center"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global API Key Guide Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
      </main>
    </LayoutGroup>
  );
}
