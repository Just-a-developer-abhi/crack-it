export type TechStack =
  | "Java"
  | "JavaScript"
  | "TypeScript"
  | "NodeJS"
  | ".NET"
  | "Angular"
  | "React"
  | "NextJS"
  | "Python"
  | "Go"
  | "SQL/Databases";

export const AVAILABLE_TECH_STACKS: TechStack[] = [
  "Java",
  "JavaScript",
  "TypeScript",
  "NodeJS",
  ".NET",
  "Angular",
  "React",
  "NextJS",
  "Python",
  "Go",
  "SQL/Databases",
];

export type ConceptualDomain =
  | "Object-Oriented Principles"
  | "Threading & Multithreading"
  | "Concurrency & Synchronization"
  | "Memory Management & GC"
  | "Event Loop & Async Internals"
  | "System Reliability & Resilience"
  | "Error Propagation & Handling"
  | "Architectural Trade-offs & Scalability";

export type InterviewMode = "ai" | "offline";
export type UserRole = "free" | "pro";

export interface QuestionItem {
  id: string;
  questionNumber: number;
  domain: string;
  questionText: string;
  techStackContext: TechStack[];
  targetYoE: number;
  focusArea: string;
  hint?: string;
}

export interface EvaluationResult {
  score: number; // 1 to 10
  isFollowUpNeeded: boolean;
  followUpQuestion?: string;
  briefFeedback: string;
  keyPointsCovered: string[];
  missedNuances: string[];
}

export interface InterviewTurn {
  id: string;
  questionNumber: number;
  domain: string;
  questionText: string;
  hint?: string;
  hintRevealed?: boolean;
  initialAnswer?: string;
  followUpQuestion?: string;
  followUpAnswer?: string;
  evaluation?: EvaluationResult;
  completed: boolean;
  isSkipped?: boolean;
  timeSpentSeconds?: number;
}

export interface StrongAreaItem {
  topic: string;
  evidence: string;
  masteryLevel: "High" | "Solid";
}

export interface AreaToImproveItem {
  topic: string;
  gap: string;
  whyItMatters: string;
}

export interface TargetedActionItem {
  category: string;
  recommendation: string;
  resourcesOrConcepts: string[];
}

export interface FeedbackReport {
  overallReadinessScore: number; // 0 - 100
  summaryVerdict: string;
  strongAreas: StrongAreaItem[];
  areasToImprove: AreaToImproveItem[];
  targetedActionItems: TargetedActionItem[];
  candidateYoE: number;
  selectedTechStacks: TechStack[];
  totalQuestionsAnswered: number;
}

export type InterviewStage =
  | "intro"
  | "onboarding"
  | "loading"
  | "in_progress"
  | "feedback";

