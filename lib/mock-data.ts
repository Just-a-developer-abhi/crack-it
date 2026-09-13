import {
  QuestionItem,
  EvaluationResult,
  FeedbackReport,
  InterviewTurn,
  TechStack,
} from "./types";

export const MOCK_QUESTIONS: Record<
  "junior" | "mid" | "senior",
  Array<{ domain: string; questionText: string; focusArea: string; hint: string }>
> = {
  junior: [
    {
      domain: "Event Loop & Async Internals",
      questionText:
        "If you queue a Promise resolve, a setTimeout with 0 milliseconds, and some synchronous console.logs, in what order do they actually execute, and why?",
      focusArea: "Microtask queue vs timer macrotask scheduling priority",
      hint: "Think about microtasks versus macrotasks. What queue does the engine empty before picking the next event loop tick?",
    },
    {
      domain: "Memory Management & GC",
      questionText:
        "Have you ever run into a memory leak in an app you worked on? What are the most common patterns in code that cause objects to stay retained in memory instead of being garbage collected?",
      focusArea: "Root references, closures, and event listener retention",
      hint: "Consider objects attached to global scopes, uncleared event listeners, or closures holding references to large enclosing scopes.",
    },
    {
      domain: "Object-Oriented Principles",
      questionText:
        "We often hear the advice 'favor composition over inheritance'. In your experience, what's an example where deep class inheritance caused problems, and how would composition solve it?",
      focusArea: "Composition vs inheritance and polymorphic contracts",
      hint: "Think about the fragile base class problem—when changing a parent class breaks subclasses in unexpected ways.",
    },
    {
      domain: "Error Propagation & Handling",
      questionText:
        "In an asynchronous backend flow, if one background operation inside a request fails, should the entire request fail fast or continue with partial data? How do you make that decision?",
      focusArea: "Fail-fast vs graceful degradation in async workflows",
      hint: "Consider whether the missing data is critical to data consistency (e.g. billing) versus optional enhancement (e.g. recommendation widget).",
    },
    {
      domain: "Threading & Multithreading",
      questionText:
        "Suppose two threads read and write to a shared boolean flag without any synchronization or atomic primitives. Can one thread keep seeing the old value indefinitely? Why does that happen?",
      focusArea: "CPU cache coherency and memory visibility",
      hint: "Think about CPU L1/L2 hardware caches and compiler reordering. Without a memory barrier or volatile/atomic flag, changes in one core's cache aren't flushed.",
    },
  ],
  mid: [
    {
      domain: "Concurrency & Synchronization",
      questionText:
        "Let's say we're building an e-commerce inventory service where thousands of users are competing for the last item during a flash sale. Would you use optimistic concurrency (version checks) or pessimistic locking (row locks) here, and why?",
      focusArea: "Optimistic vs pessimistic locking under write contention",
      hint: "Consider what happens to retry loops when contention is near 100%. Does optimistic locking waste CPU aborting and retrying transactions?",
    },
    {
      domain: "System Reliability & Resilience",
      questionText:
        "Imagine one of your downstream microservices starts timing out and throwing 500 errors. How do you prevent that failure from cascading and bringing down your entire application?",
      focusArea: "Circuit breakers, timeouts, and cascading failure prevention",
      hint: "Think about Circuit Breaker patterns, bounded thread/connection pools, and fallback responses.",
    },
    {
      domain: "Memory Management & GC",
      questionText:
        "If your production service starts experiencing random latency spikes every few minutes and you suspect garbage collection pauses, how would you investigate and reduce those spikes?",
      focusArea: "GC pause diagnosis, object allocation rate, and memory profiling",
      hint: "Look at heap allocation rates, short-lived object generation in request hot paths, and memory profiling tools.",
    },
    {
      domain: "Event Loop & Async Internals",
      questionText:
        "Suppose you're streaming a large file from a fast network socket directly into a slow disk writer. If the disk can't keep up, what happens to your process memory, and how do you handle that backpressure?",
      focusArea: "Stream backpressure, buffering limits, and flow control",
      hint: "Without backpressure, unwritten chunks buffer in RAM until the process runs out of memory (OOM). Look into stream pause/resume and drain events.",
    },
    {
      domain: "Architectural Trade-offs & Scalability",
      questionText:
        "A user submits a payment, but the network connection times out before the client receives the confirmation. The user immediately clicks 'Pay' again. How do you ensure they are never charged twice?",
      focusArea: "Idempotency keys, atomic state checks, and retry safety",
      hint: "Think about client-generated idempotency keys, atomic state transitions in the database, and distributed locks during processing.",
    },
  ],
  senior: [
    {
      domain: "Architectural Trade-offs & Scalability",
      questionText:
        "If a network partition cuts off communication between nodes in a distributed database cluster, how does the system decide which nodes can still accept writes, and how do we prevent split-brain data corruption?",
      focusArea: "Distributed consensus, quorum requirements, and split-brain avoidance",
      hint: "Think about Quorum math (N/2 + 1) and leader election leases. If a minority partition cannot form a quorum, what must it do with incoming writes?",
    },
    {
      domain: "System Reliability & Resilience",
      questionText:
        "We need to migrate and split a high-volume database table receiving 20,000 writes per second into a new schema without taking any downtime or dropping queries. How would you architect this migration?",
      focusArea: "Expand and contract pattern, dual writing, and zero-downtime migrations",
      hint: "Consider the Expand & Contract pattern: add new columns, start dual-writing, backfill historical data in batches, verify parity, and switch reads.",
    },
    {
      domain: "Concurrency & Synchronization",
      questionText:
        "When designing high-throughput lock-free data structures using Compare-And-Swap (CAS), what subtle issues—like the ABA problem—can occur, and how do you solve them without putting locks back in?",
      focusArea: "Lock-free structures, CAS loops, and ABA mitigation",
      hint: "The ABA problem happens when a pointer changes from A to B and back to A, tricking CAS into succeeding. Look into versioned/tagged pointers or hazard pointers.",
    },
    {
      domain: "Memory Management & GC",
      questionText:
        "Suppose we have a trading or telemetry service that must process a million events per second with sub-5ms P99 latency, and GC pauses are breaching our SLA. What architectural strategies would you use to eliminate or bypass GC overhead?",
      focusArea: "Off-heap memory allocation, buffer pooling, and zero-copy pipelines",
      hint: "Think about off-heap byte buffers (direct memory), object pooling / ring buffers (Disruptor pattern), and pre-allocated memory arenas.",
    },
    {
      domain: "Architectural Trade-offs & Scalability",
      questionText:
        "A team wants to replace a traditional relational CRUD database with Event Sourcing and CQRS for a critical service. Before giving the green light, what operational challenges or trade-offs would you warn them about?",
      focusArea: "Event sourcing operational complexity, projection lag, and schema evolution",
      hint: "Consider eventual consistency lag in read projections, immutable event schema evolution/upcasting, and rebuild times for historical event logs.",
    },
  ],
};

export function getMockQuestion(
  questionNumber: number,
  yoe: number,
  techStacks: TechStack[],
  previousDomains: string[]
): QuestionItem {
  let tier: "junior" | "mid" | "senior" = "junior";
  if (yoe >= 8) tier = "senior";
  else if (yoe >= 4) tier = "mid";

  const pool = MOCK_QUESTIONS[tier];
  // Pick one not yet used if possible
  const available = pool.filter((q) => !previousDomains.includes(q.domain));
  const selected = available.length > 0 ? available[0] : pool[(questionNumber - 1) % pool.length];

  return {
    id: `q-${questionNumber}-${Date.now()}`,
    questionNumber,
    domain: selected.domain,
    questionText: selected.questionText,
    techStackContext: techStacks,
    targetYoE: yoe,
    focusArea: selected.focusArea,
    hint: selected.hint,
  };
}

export function evaluateMockAnswer(
  question: QuestionItem,
  answer: string,
  isFollowUpTurn: boolean
): EvaluationResult {
  const wordCount = answer.trim().split(/\s+/).length;

  if (wordCount < 18 && !isFollowUpTurn) {
    return {
      score: 5,
      isFollowUpNeeded: true,
      followUpQuestion:
        "That's a good starting point. But how does this behave under heavy concurrent traffic when multiple callers try to perform this operation at the exact same millisecond? What failure modes or bottlenecks could emerge?",
      briefFeedback:
        "Good initial thought, but let's dig into concurrent edge cases and failure modes.",
      keyPointsCovered: ["Identified core principle"],
      missedNuances: [
        "Concurrent race conditions and high contention",
        "Resource exhaustion or contention bottlenecks",
      ],
    };
  }

  const score = Math.min(10, Math.max(7, Math.floor(wordCount / 10) + 6));

  return {
    score,
    isFollowUpNeeded: false,
    briefFeedback:
      score >= 8
        ? "Excellent architectural depth! You clearly demonstrated internal mechanics and trade-off considerations."
        : "Solid conceptual grasp. You touched on the main mechanisms and operational impacts.",
    keyPointsCovered: [
      "Core operational mechanics",
      "System stability implications",
      "Architectural trade-offs",
    ],
    missedNuances:
      score < 8
        ? [
            "Could delve deeper into CPU memory barriers or kernel-level queue draining",
          ]
        : [],
  };
}

export function generateMockFeedback(
  turns: InterviewTurn[],
  yoe: number,
  techStacks: TechStack[]
): FeedbackReport {
  const scores = turns
    .map((t) => t.evaluation?.score || 7)
    .filter((s) => typeof s === "number");

  const avgScore =
    scores.length > 0
      ? scores.reduce((acc, curr) => acc + curr, 0) / scores.length
      : 8;

  const overallReadinessScore = Math.min(
    98,
    Math.max(62, Math.round(avgScore * 9.5))
  );

  return {
    overallReadinessScore,
    summaryVerdict:
      overallReadinessScore >= 85
        ? "Strong Technical Depth: You consistently articulated low-level mechanics, concurrency caveats, and trade-off considerations expected for senior roles."
        : overallReadinessScore >= 75
        ? "Solid Foundations: You demonstrated strong core knowledge with good intuitions, with room to sharpen precise failure modes and distributed boundary constraints."
        : "Foundations in Progress: Good grasp of basic architecture, but you need deeper drilling into concurrency invariants, memory lifecycle, and resilience primitives.",
    strongAreas: [
      {
        topic: "Event Loop & Asynchronous Runtimes",
        evidence:
          "Demonstrated accurate distinction between microtask starvation, macrotask scheduling, and execution pipelines.",
        masteryLevel: "High",
      },
      {
        topic: "Architectural Trade-offs & Reliability",
        evidence:
          "Articulated backoff strategies, idempotency verification, and circuit breaking patterns cleanly.",
        masteryLevel: "High",
      },
      {
        topic: "Object-Oriented & Domain Modeling",
        evidence:
          "Strong grasp of composition vs inheritance constraints and polymorphic contract invariants.",
        masteryLevel: "Solid",
      },
    ],
    areasToImprove: [
      {
        topic: "Low-Level Concurrency & Memory Barriers",
        gap: "Light on hardware-level memory visibility, volatile semantics, and CPU cache line invalidations.",
        whyItMatters:
          "Senior technical interviews closely inspect your understanding of lock-free invariants and race condition proofs.",
      },
      {
        topic: "Distributed Failure Recovery & Split-Brain Mitigation",
        gap: "Could be more explicit about consensus quorum requirements and epoch-based fence tokens.",
        whyItMatters:
          "High-scale system design tests fail when candidates assume network partitions never corrupt state.",
      },
    ],
    targetedActionItems: [
      {
        category: "Deep Dives",
        recommendation:
          "Review lock-free synchronization primitives: Compare-And-Swap (CAS), ABA mitigations (hazard pointers), and memory ordering guarantees.",
        resourcesOrConcepts: [
          "Memory Barrier Semantics",
          "Lock-Free Concurrent Queues",
          "Raft Consensus Protocol Internals",
        ],
      },
      {
        category: "Real-world Scenario Drills",
        recommendation:
          "Practice walking through a zero-downtime database table partitioning migration under 10k+ continuous RPS.",
        resourcesOrConcepts: [
          "Expand & Contract Pattern",
          "Dual Writing with Shadow Read Verification",
          "Distributed Idempotency Keys",
        ],
      },
    ],
    candidateYoE: yoe,
    selectedTechStacks: techStacks,
    totalQuestionsAnswered: turns.length,
  };
}

