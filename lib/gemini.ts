import { GoogleGenAI, Type } from "@google/genai";
import {
  QuestionItem,
  EvaluationResult,
  FeedbackReport,
  InterviewTurn,
  TechStack,
} from "./types";
import {
  getMockQuestion,
  evaluateMockAnswer,
  generateMockFeedback,
} from "./mock-data";

function getGeminiClient(customApiKey?: string): {
  ai: GoogleGenAI | null;
  model: string;
} {
  const apiKey =
    customApiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return { ai: null, model: "gemini-2.5-flash" };
  }

  const model =
    process.env.GEMINI_MODEL || "gemini-2.5-flash";

  return {
    ai: new GoogleGenAI({ apiKey }),
    model,
  };
}

/**
 * Agent 1: Question Crafter
 * Strictly avoids coding/syntax tests.
 * Calibrates depth based on Candidate YoE (1-3, 4-7, 8-15).
 */
export async function craftQuestion(params: {
  questionNumber: number;
  candidateYoE: number;
  selectedTechStacks: TechStack[];
  previousDomains: string[];
  customApiKey?: string;
  mode?: "ai" | "offline";
}): Promise<QuestionItem> {
  const { questionNumber, candidateYoE, selectedTechStacks, previousDomains, customApiKey, mode } =
    params;

  if (mode === "offline") {
    return getMockQuestion(questionNumber, candidateYoE, selectedTechStacks, previousDomains);
  }

  const { ai, model } = getGeminiClient(customApiKey);

  if (!ai) {
    console.warn("No Gemini API key configured. Using intelligent question crafter fallback.");
    return getMockQuestion(questionNumber, candidateYoE, selectedTechStacks, previousDomains);
  }

  let yoeGuidance = "";
  if (candidateYoE <= 3) {
    yoeGuidance =
      "Candidate YoE: 1-3 (Junior). Focus on foundational runtime internals: Event Loop phases (microtask vs macrotask starvation), Stack vs Heap allocation, Generational Garbage Collection roots, OOP polymorphism / encapsulation edge-cases, Promise error propagation.";
  } else if (candidateYoE <= 7) {
    yoeGuidance =
      "Candidate YoE: 4-7 (Mid-Level). Focus on concurrency, thread safety, race conditions, memory barriers/visibility, connection pooling limits, stream backpressure, idempotency guarantees, circuit breaker failure cascades.";
  } else {
    yoeGuidance =
      "Candidate YoE: 8-15 (Senior/Staff). Focus on distributed consensus (Raft/Paxos leader elections & split-brain), high-scale bottlenecks (P99 tail latency, off-heap zero-copy memory buffers), zero-downtime migrations under high write loads, CAP theorem trade-offs in multi-region setups, CQRS / Event Sourcing operational complications.";
  }

  const prompt = `You are Agent 1: The Expert Technical Interviewer for "Crack it".
You are an experienced Staff Engineer / Tech Lead conducting a real-world technical conversation.
The candidate has ${candidateYoE} Years of Experience and works with: ${selectedTechStacks.join(", ")}.
Previously covered topics in this session: ${
    previousDomains.length > 0 ? previousDomains.join(", ") : "None"
  }.
Current question number: ${questionNumber} of 20.

${yoeGuidance}

CRITICAL RULES FOR ASKING QUESTIONS LIKE A REAL HUMAN INTERVIEWER:
1. SPEAK LIKE A HUMAN, NOT AN ACADEMIC EXAM: Frame the question conversationally, often using a realistic system scenario (e.g., "Suppose we're building a checkout service where...", "In your experience, when would you choose...", "Imagine one of your microservices starts...").
2. DO NOT ASK NESTED OR COMPOUND QUESTIONS: Never pack multiple sub-questions into one prompt (e.g. NEVER ask "Compare A and B. Under what threshold does it fail, and how do you mitigate it?"). Ask ONE clear, focused question.
3. LEAVE EDGE-CASES FOR THE FOLLOW-UP: Keep this initial question clean and direct. Agent 2 (the follow-up driver) will naturally drill into edge cases, contention thresholds, or failure modes after the candidate answers.
4. STRICTLY NO CODING/SYNTAX: Focus purely on architectural principles, concurrency, memory, event loop, system reliability, error propagation, and trade-offs.
5. PROVIDE A HINT: A subtle, 1-2 sentence non-spoiler conceptual clue to help a candidate who gets stuck.
6. Return JSON matching the schema.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            domain: {
              type: Type.STRING,
              description:
                "The core conceptual domain (e.g., Concurrency & Synchronization, Memory Management & GC, Event Loop & Async Internals, System Reliability & Resilience, etc.)",
            },
            questionText: {
              type: Type.STRING,
              description:
                "The conceptual architectural question text testing internal mechanics and trade-offs.",
            },
            focusArea: {
              type: Type.STRING,
              description:
                "Specific sub-topic or mechanism targeted by this question.",
            },
            hint: {
              type: Type.STRING,
              description:
                "A 1-2 sentence non-spoiling conceptual hint or architectural clue.",
            },
          },
          required: ["domain", "questionText", "focusArea", "hint"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      id: `q-${questionNumber}-${Date.now()}`,
      questionNumber,
      domain: parsed.domain || "Architectural Trade-offs & Scalability",
      questionText: parsed.questionText,
      techStackContext: selectedTechStacks,
      targetYoE: candidateYoE,
      focusArea: parsed.focusArea || "Internal Mechanics",
      hint: parsed.hint || "Consider the trade-offs between consistency, latency, and resource contention.",
    };
  } catch (error) {
    console.error("Gemini craftQuestion error, falling back to mock:", error);
    return getMockQuestion(questionNumber, candidateYoE, selectedTechStacks, previousDomains);
  }
}

/**
 * Agent 2: Answer Evaluator & Follow-Up Driver
 * Evaluates candidate response against technical depth.
 * If answer is vague or misses edge cases, issues a 1-turn follow-up probe.
 */
export async function evaluateAnswer(params: {
  question: QuestionItem;
  answer: string;
  candidateYoE: number;
  isFollowUpTurn: boolean;
  priorAnswer?: string;
  customApiKey?: string;
  mode?: "ai" | "offline";
}): Promise<EvaluationResult> {
  const { question, answer, candidateYoE, isFollowUpTurn, priorAnswer, customApiKey, mode } = params;

  if (mode === "offline") {
    return evaluateMockAnswer(question, answer, isFollowUpTurn);
  }

  const { ai, model } = getGeminiClient(customApiKey);

  if (!ai) {
    console.warn("No Gemini API key configured. Using intelligent answer evaluator fallback.");
    return evaluateMockAnswer(question, answer, isFollowUpTurn);
  }

  const prompt = `You are Agent 2: Answer Evaluator & Follow-Up Driver for "Crack it".
Question asked: "${question.questionText}"
Target Domain: ${question.domain}
Focus Area: ${question.focusArea}
Candidate YoE: ${candidateYoE}
Is this a follow-up turn? ${isFollowUpTurn ? "YES (Final turn for this question, do NOT request another follow-up)" : "NO (First response)"}
${priorAnswer ? `Candidate's Initial Response: "${priorAnswer}"` : ""}
Candidate's Current Answer: "${answer}"

EVALUATION CRITERIA:
1. Assess technical depth, precision of internal mechanics, edge-case coverage, and trade-off awareness.
2. If this is NOT a follow-up turn (isFollowUpTurn is false) AND the candidate's answer is brief, missing critical edge cases, or needs deeper probing, set isFollowUpNeeded to true.
3. FOLLOW-UP QUESTION STYLE: Phrase the follow-up question like a human interviewer digging deeper into their response (e.g. "That makes sense for low contention. But what happens during a traffic burst where 10,000 requests hit that exact same row? How would your solution handle that?"). Keep it to ONE natural, targeted probe.
4. If this is already a follow-up turn (isFollowUpTurn is true), you MUST set isFollowUpNeeded to false.
5. Score from 1 to 10 based on candidate YoE calibration.
6. Provide concise briefFeedback (1-2 sentences), keyPointsCovered (1-3 bullets), and missedNuances (1-3 bullets).`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "Score from 1 to 10 evaluating technical depth",
            },
            isFollowUpNeeded: {
              type: Type.BOOLEAN,
              description:
                "True if answer misses edge cases and this is turn 1; false if solid or already a follow-up turn",
            },
            followUpQuestion: {
              type: Type.STRING,
              description:
                "Targeted 1-turn follow-up probe if needed, or empty string",
            },
            briefFeedback: {
              type: Type.STRING,
              description:
                "Concise 1-2 sentence assessment highlighting strengths and gaps",
            },
            keyPointsCovered: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key architectural aspects the candidate addressed well",
            },
            missedNuances: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Crucial mechanics, concurrency invariants, or failure modes omitted",
            },
          },
          required: [
            "score",
            "isFollowUpNeeded",
            "briefFeedback",
            "keyPointsCovered",
            "missedNuances",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      score: parsed.score || 7,
      isFollowUpNeeded: isFollowUpTurn ? false : Boolean(parsed.isFollowUpNeeded),
      followUpQuestion: parsed.followUpQuestion || undefined,
      briefFeedback: parsed.briefFeedback || "Evaluated response depth.",
      keyPointsCovered: parsed.keyPointsCovered || [],
      missedNuances: parsed.missedNuances || [],
    };
  } catch (error) {
    console.error("Gemini evaluateAnswer error, falling back to mock:", error);
    return evaluateMockAnswer(question, answer, isFollowUpTurn);
  }
}

/**
 * Agent 3: Feedback & Gap Analyst
 * Ingests full transcript after Question 20 (or completion).
 * Outputs structured breakdown with readiness score, strong areas, areas to improve, and targeted action items.
 */
export async function generateFeedback(params: {
  turns: InterviewTurn[];
  candidateYoE: number;
  selectedTechStacks: TechStack[];
  customApiKey?: string;
  mode?: "ai" | "offline";
}): Promise<FeedbackReport> {
  const { turns, candidateYoE, selectedTechStacks, customApiKey, mode } = params;

  if (mode === "offline") {
    return generateMockFeedback(turns, candidateYoE, selectedTechStacks);
  }

  const { ai, model } = getGeminiClient(customApiKey);

  if (!ai) {
    console.warn("No Gemini API key configured. Using intelligent feedback analyst fallback.");
    return generateMockFeedback(turns, candidateYoE, selectedTechStacks);
  }

  const transcriptSummary = turns.map((t, idx) => ({
    qNum: idx + 1,
    domain: t.domain,
    question: t.questionText,
    answer: t.initialAnswer || "",
    followUpQuestion: t.followUpQuestion || null,
    followUpAnswer: t.followUpAnswer || null,
    score: t.evaluation?.score || 7,
    keyPoints: t.evaluation?.keyPointsCovered || [],
    missed: t.evaluation?.missedNuances || [],
  }));

  const prompt = `You are Agent 3: Feedback & Gap Analyst for "Crack it".
The candidate has completed their technical mock interview (${turns.length} questions).
Candidate YoE: ${candidateYoE}
Tech Stacks: ${selectedTechStacks.join(", ")}

Full Interview Transcript:
${JSON.stringify(transcriptSummary, null, 2)}

TASK:
Ingest the full transcript and generate an exhaustive, actionable architectural feedback breakdown:
1. overallReadinessScore: 0 to 100 integer rating representing hiring readiness for their YoE.
2. summaryVerdict: A candid, authoritative 2-3 sentence executive assessment.
3. strongAreas: Array of 2-4 topics where their answers exhibited deep architectural grasp, including specific evidence from their answers.
4. areasToImprove: Array of 2-4 topics with identified conceptual gaps and why it matters in real production systems/senior interviews.
5. targetedActionItems: Array of 2-4 prioritized actionable preparation steps, each with specific concepts or resources to study.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallReadinessScore: {
              type: Type.INTEGER,
              description: "Overall readiness rating (0-100%)",
            },
            summaryVerdict: {
              type: Type.STRING,
              description: "Executive summary assessment of candidate readiness",
            },
            strongAreas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  evidence: { type: Type.STRING },
                  masteryLevel: { type: Type.STRING },
                },
                required: ["topic", "evidence", "masteryLevel"],
              },
            },
            areasToImprove: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  gap: { type: Type.STRING },
                  whyItMatters: { type: Type.STRING },
                },
                required: ["topic", "gap", "whyItMatters"],
              },
            },
            targetedActionItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  resourcesOrConcepts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["category", "recommendation", "resourcesOrConcepts"],
              },
            },
          },
          required: [
            "overallReadinessScore",
            "summaryVerdict",
            "strongAreas",
            "areasToImprove",
            "targetedActionItems",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      overallReadinessScore: parsed.overallReadinessScore || 80,
      summaryVerdict: parsed.summaryVerdict || "Strong performance across core technical areas.",
      strongAreas: parsed.strongAreas || [],
      areasToImprove: parsed.areasToImprove || [],
      targetedActionItems: parsed.targetedActionItems || [],
      candidateYoE,
      selectedTechStacks,
      totalQuestionsAnswered: turns.length,
    };
  } catch (error) {
    console.error("Gemini generateFeedback error, falling back to mock:", error);
    return generateMockFeedback(turns, candidateYoE, selectedTechStacks);
  }
}

