import { NextRequest, NextResponse } from "next/server";
import {
  craftQuestion,
  evaluateAnswer,
  generateFeedback,
} from "@/lib/gemini";
import { QuestionItem, InterviewTurn, TechStack } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "craft") {
      const {
        questionNumber,
        candidateYoE,
        selectedTechStacks,
        previousDomains = [],
        apiKey,
        mode = "ai",
      } = body;

      if (!questionNumber || !candidateYoE || !selectedTechStacks) {
        return NextResponse.json(
          { error: "Missing required fields: questionNumber, candidateYoE, selectedTechStacks" },
          { status: 400 }
        );
      }

      const question = await craftQuestion({
        questionNumber: Number(questionNumber),
        candidateYoE: Number(candidateYoE),
        selectedTechStacks: selectedTechStacks as TechStack[],
        previousDomains: previousDomains as string[],
        customApiKey: apiKey,
        mode,
      });

      return NextResponse.json({ success: true, question });
    }

    if (action === "evaluate") {
      const {
        question,
        answer,
        candidateYoE,
        isFollowUpTurn = false,
        priorAnswer,
        apiKey,
        mode = "ai",
      } = body;

      if (!question || typeof answer !== "string" || !candidateYoE) {
        return NextResponse.json(
          { error: "Missing required fields: question, answer, candidateYoE" },
          { status: 400 }
        );
      }

      const evaluation = await evaluateAnswer({
        question: question as QuestionItem,
        answer: answer.trim(),
        candidateYoE: Number(candidateYoE),
        isFollowUpTurn: Boolean(isFollowUpTurn),
        priorAnswer,
        customApiKey: apiKey,
        mode,
      });

      return NextResponse.json({ success: true, evaluation });
    }

    if (action === "feedback") {
      const {
        turns,
        candidateYoE,
        selectedTechStacks,
        apiKey,
        mode = "ai",
      } = body;

      if (!turns || !Array.isArray(turns) || !candidateYoE) {
        return NextResponse.json(
          { error: "Missing required fields: turns, candidateYoE" },
          { status: 400 }
        );
      }

      const report = await generateFeedback({
        turns: turns as InterviewTurn[],
        candidateYoE: Number(candidateYoE),
        selectedTechStacks: (selectedTechStacks || []) as TechStack[],
        customApiKey: apiKey,
        mode,
      });

      return NextResponse.json({ success: true, report });
    }

    return NextResponse.json(
      { error: `Unknown action: "${action}". Valid actions are: craft, evaluate, feedback.` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("API /api/interview error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error in multi-agent pipeline" },
      { status: 500 }
    );
  }
}

