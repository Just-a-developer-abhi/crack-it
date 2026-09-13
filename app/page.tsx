"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

export default function Home() {
  const [stage, setStage] = useState<InterviewStage>("intro");
  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean>(false);

  // Mode and Tier
  const [mode, setMode] = useState<InterviewMode>("ai");
  const [userRole, setUserRole] = useState<UserRole>("free");
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

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
    } catch (err) {
      console.error("Failed to start interview:", err);
      // Fallback transition
      setStage("in_progress");
    }
  };

  // Handle user answer submission (Initial or Follow-up)
  const handleSubmitAnswer = async (answerText: string) => {
    if (!currentTurn || !currentQuestion || isEvaluating) return;

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
        }
      } catch (err) {
        console.error("Evaluation error:", err);
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
        }
      } catch (err) {
        console.error("Follow-up evaluation error:", err);
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  // Skip / Pass Current Question
  const handleSkipQuestion = async () => {
    if (!currentTurn) return;

    const skippedTurn: InterviewTurn = {
      ...currentTurn,
      isSkipped: true,
      completed: true,
      initialAnswer: currentTurn.initialAnswer || "Candidate passed on this question.",
      evaluation: {
        score: 4,
        isFollowUpNeeded: false,
        briefFeedback: "Question passed by candidate.",
        keyPointsCovered: [],
        missedNuances: ["Skipped conceptual challenge"],
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
      }
    } catch (err) {
      console.error("Next question craft error:", err);
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
      }
    } catch (err) {
      console.error("Next question craft error:", err);
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
    <main className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 1. Intro Animation Choreography */}
      {!hasCompletedIntro && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}

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

      {/* Global API Key Guide Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </main>
  );
}
