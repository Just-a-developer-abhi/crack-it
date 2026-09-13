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
    {
      domain: "Network & HTTP Protocols",
      questionText:
        "When a browser makes an API call over HTTPS, at a high level, what happens during the TLS handshake before actual HTTP data can be transmitted?",
      focusArea: "TLS handshake, certificate validation, and symmetric key exchange",
      hint: "Think about asymmetric encryption for certificate verification and secret exchange, followed by fast symmetric encryption for payload data.",
    },
    {
      domain: "Database Fundamentals",
      questionText:
        "Why does querying an indexed database column become significantly slower if we wrap that column in a function like `WHERE LOWER(email) = '...'`?",
      focusArea: "B-Tree index traversal vs full index/table scan",
      hint: "B-Tree indexes are sorted by the raw column values. Applying a function invalidates direct tree lookups unless an expression/functional index exists.",
    },
    {
      domain: "API Design & Contracts",
      questionText:
        "What is the semantic difference between HTTP PUT and HTTP PATCH, and why does idempotency matter when designing a resource update endpoint?",
      focusArea: "Full replacement vs partial update semantics and idempotency",
      hint: "PUT is designed as a complete document replacement (idempotent), whereas PATCH represents a set of instructions/modifications.",
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
    {
      domain: "Caching Strategies & Invalidation",
      questionText:
        "When implementing a write-through or cache-aside cache in Redis with high read traffic, how do you protect your primary SQL database from a Cache Stampede when a key expires?",
      focusArea: "Cache stampede mitigation, probabilistic early expiration, and mutex locks",
      hint: "Consider single-flight mutex locking (only 1 worker queries DB on cache miss) or XFetch probabilistic early recomputation.",
    },
    {
      domain: "Message Queues & Processing",
      questionText:
        "In a message queue consumer group, what is the trade-off between committing message offsets immediately upon receipt versus committing only after downstream DB writes succeed?",
      focusArea: "At-least-once vs at-most-once delivery semantics and consumer replay",
      hint: "Committing early guarantees at-most-once (potential data loss on crash); committing late guarantees at-least-once (requires consumer idempotency).",
    },
    {
      domain: "Database Indexing & Query Execution",
      questionText:
        "In a table with 50 million rows, what is the difference between a Composite Index on `(user_id, created_at)` versus two separate indexes on `user_id` and `created_at`?",
      focusArea: "Index prefix order, covering indexes, and bitmap index scans",
      hint: "A composite index sorts by user_id first, then created_at. It enables range scans for a specific user without merging separate index trees.",
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
    {
      domain: "Distributed Transactions & Consistency",
      questionText:
        "Why is Two-Phase Commit (2PC) considered an anti-pattern in modern distributed microservices, and how does the Saga Orchestration pattern mitigate its blocking bottlenecks?",
      focusArea: "2PC coordinator lock-holding vs compensating transactions in Sagas",
      hint: "In 2PC, any coordinator or participant network stall holds database locks open across services. Sagas rely on local transactions with compensating rollbacks.",
    },
    {
      domain: "High-Scale Traffic & Rate Limiting",
      questionText:
        "When implementing a globally distributed rate limiter protecting APIs across 5 geographic regions, what consistency vs latency trade-off do you make when synchronizing token bucket counts?",
      focusArea: "Local batching, sliding window counters, and eventual cross-region sync",
      hint: "Synchronizing every request synchronously across regions adds 100ms+ cross-region latency. Look into local token allocation with asynchronous batch reconciliation.",
    },
    {
      domain: "Data Partitioning & Sharding",
      questionText:
        "When designing a database sharding strategy for a multi-tenant enterprise SaaS platform, how do you handle hot tenant partitions (e.g. one tenant generating 60% of all platform traffic)?",
      focusArea: "Consistent hashing, virtual nodes, and dedicated tenant isolation",
      hint: "A naive tenant_id shard key causes massive hotspotting. Consider compound shard keys or routing whale tenants to dedicated isolated clusters.",
    },
  ],
};

/**
 * Picks a random/shuffled question from the appropriate tier.
 * Ensures questions appear in a surprising, non-deterministic order.
 */
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

  // Filter questions whose domains haven't been asked in this session yet
  const available = pool.filter((q) => !previousDomains.includes(q.domain));

  // Randomize selection from available candidates to avoid repetitive order
  let selected: (typeof pool)[0];
  if (available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    selected = available[randomIndex];
  } else {
    // If all domains have been asked once, pick a random question from pool
    const randomIndex = Math.floor(Math.random() * pool.length);
    selected = pool[randomIndex];
  }

  return {
    id: `q-${questionNumber}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    questionNumber,
    domain: selected.domain,
    questionText: selected.questionText,
    techStackContext: techStacks,
    targetYoE: yoe,
    focusArea: selected.focusArea,
    hint: selected.hint,
  };
}

/**
 * Strict offline answer evaluator.
 * Strictly scores 0/10 for pass, skip, "don't know", or low-substance responses.
 * Never appraises ignorance.
 */
export function evaluateMockAnswer(
  question: QuestionItem,
  answer: string,
  isFollowUpTurn: boolean
): EvaluationResult {
  const cleanText = answer.trim().toLowerCase();
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  // Detect explicit pass, skip, ignorance, or extreme brevity
  const isPassOrIgnorance =
    /^(pass|skip|idk|i don'?t know|no idea|none|dunno|nothing|na|n\/a)\b/i.test(cleanText) ||
    cleanText === "pass" ||
    cleanText === "skip" ||
    cleanText === "i don't know" ||
    cleanText === "i dont know" ||
    cleanText === "no idea" ||
    cleanText === "idk" ||
    cleanText.length < 14;

  if (isPassOrIgnorance) {
    return {
      score: 0,
      isFollowUpNeeded: false,
      followUpQuestion: undefined,
      briefFeedback:
        "No technical substance provided. Passing or stating ignorance awards 0/10 in a technical interview.",
      keyPointsCovered: [],
      missedNuances: [
        `Failed to articulate core mechanisms of: ${question.focusArea}`,
        "No architectural reasoning, trade-off analysis, or failure mitigation provided",
      ],
    };
  }

  // If initial answer is brief (< 20 words) and not yet probed
  if (wordCount < 20 && !isFollowUpTurn) {
    return {
      score: 3,
      isFollowUpNeeded: true,
      followUpQuestion: `Your answer touches the surface, but how does this architecture behave when 10,000 concurrent requests hit this boundary in the same millisecond? What exact failure mode or contention bottleneck emerges?`,
      briefFeedback:
        "High-level intuition noted, but lacking discussion of concurrent contention and failure modes.",
      keyPointsCovered: ["Surface-level direction"],
      missedNuances: [
        `Detailed mechanics of ${question.focusArea}`,
        "High-contention failure modes and latency mitigation",
      ],
    };
  }

  // Evaluate substantive response based on technical density
  const technicalKeywords = [
    "lock", "concurrency", "thread", "atomic", "cache", "memory", "latency",
    "throughput", "retry", "queue", "partition", "event", "async", "buffer",
    "deadlock", "isolation", "transaction", "circuit", "timeout", "idempotent",
    "quorum", "consensus", "leader", "p99", "cpu", "heap", "leak", "index"
  ];

  const matchedKeywords = technicalKeywords.filter((kw) => cleanText.includes(kw));
  const keywordDensity = matchedKeywords.length;

  let score = 5;
  if (wordCount >= 40 && keywordDensity >= 4) {
    score = isFollowUpTurn ? 8 : 7;
  } else if (wordCount >= 25 && keywordDensity >= 2) {
    score = 6;
  } else {
    score = 4;
  }

  return {
    score,
    isFollowUpNeeded: false,
    briefFeedback:
      score >= 7
        ? "Solid technical articulation. You addressed core runtime mechanics and trade-offs."
        : "Moderate technical grasp. You understand the high-level pattern, but missed critical boundary constraints.",
    keyPointsCovered:
      matchedKeywords.length > 0
        ? matchedKeywords.slice(0, 3).map((kw) => `Addressed ${kw} dynamics`)
        : ["Discussed general architecture"],
    missedNuances:
      score < 7
        ? [
            `Could delve deeper into ${question.focusArea}`,
            "Explicit failure-mode recovery or contention trade-offs omitted",
          ]
        : [],
  };
}

/**
 * Post-interview summary feedback generator for offline mode.
 * Dynamically adjusts overall score based on real scores without arbitrary high minimums.
 */
export function generateMockFeedback(
  turns: InterviewTurn[],
  yoe: number,
  techStacks: TechStack[]
): FeedbackReport {
  const scores = turns
    .map((t) => t.evaluation?.score ?? 0)
    .filter((s) => typeof s === "number");

  const avgScore =
    scores.length > 0
      ? scores.reduce((acc, curr) => acc + curr, 0) / scores.length
      : 0;

  // Strict 0-100 scaling without artificial 62% baseline
  const overallReadinessScore = Math.min(
    98,
    Math.max(0, Math.round(avgScore * 10))
  );

  let summaryVerdict = "";
  if (overallReadinessScore >= 80) {
    summaryVerdict =
      "Strong Technical Rigor: You consistently articulated low-level mechanics, concurrency invariants, and trade-off considerations expected for senior engineering loops.";
  } else if (overallReadinessScore >= 60) {
    summaryVerdict =
      "Solid Foundations: You demonstrated reasonable systems awareness, but missed several critical edge cases, contention bottlenecks, and recovery mechanisms.";
  } else if (overallReadinessScore >= 35) {
    summaryVerdict =
      "Needs Deep Technical Preparation: Several questions were passed or answered without sufficient architectural depth. Focus on low-level runtime internals and concurrency primitives.";
  } else {
    summaryVerdict =
      "Unprepared: Multiple questions were skipped or answered without technical substance. Immediate study of core distributed systems, memory, and database internals is strongly advised.";
  }

  return {
    overallReadinessScore,
    summaryVerdict,
    strongAreas:
      overallReadinessScore >= 50
        ? [
            {
              topic: "Event Loop & Asynchronous Runtimes",
              evidence:
                "Demonstrated understanding of task queues, execution ordering, and non-blocking IO.",
              masteryLevel: "Solid",
            },
            {
              topic: "Architectural Trade-offs & Resilience",
              evidence:
                "Identified common resilience patterns like idempotency and backoff.",
              masteryLevel: "Solid",
            },
          ]
        : [],
    areasToImprove: [
      {
        topic: "Concurrency Invariants & Contention Bottlenecks",
        gap: "Light on lock contention thresholds, CPU memory visibility, and lock-free CAS mechanics.",
        whyItMatters:
          "Senior interviews heavily test how your architectures survive high-concurrency spikes without corrupting state or deadlocking.",
      },
      {
        topic: "Distributed Consensus & Partition Tolerances",
        gap: "Need deeper familiarity with quorum math, split-brain mitigation, and leader leases.",
        whyItMatters:
          "Mission-critical systems require clear understanding of network partitions and state recovery.",
      },
    ],
    targetedActionItems: [
      {
        category: "Deep Dives",
        recommendation:
          "Study optimistic vs pessimistic concurrency controls, CAS loops, and distributed lock mechanics (Redlock / ZooKeeper).",
        resourcesOrConcepts: [
          "Optimistic Concurrency Control Contention Limits",
          "Lock-Free Concurrent Queues & CAS",
          "Raft Consensus Protocol Internals",
        ],
      },
      {
        category: "System Design Drills",
        recommendation:
          "Practice architecting a zero-downtime database migration under 10k+ continuous write RPS.",
        resourcesOrConcepts: [
          "Expand & Contract Schema Migration Pattern",
          "Dual-Write Consistency with Shadow Verification",
          "Distributed Idempotency Keys",
        ],
      },
    ],
    candidateYoE: yoe,
    selectedTechStacks: techStacks,
    totalQuestionsAnswered: turns.length,
  };
}
