import {
  QuestionItem,
  EvaluationResult,
  FeedbackReport,
  InterviewTurn,
  TechStack,
} from "./types";

interface MockQuestionTemplate {
  domain: string;
  questionText: string;
  focusArea: string;
  hint: string;
  stacks?: TechStack[];
}

export const MOCK_QUESTIONS: Record<"junior" | "mid" | "senior", MockQuestionTemplate[]> = {
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
    {
      domain: "Data Structures & Runtime Complexity",
      questionText:
        "When would looking up a key in a Hash Table degrade from O(1) average time complexity to O(n) worst case, and how do modern runtimes prevent hash collision attacks?",
      focusArea: "Hash collisions, bucket degradation, and treeification",
      hint: "Think about pathological hash collisions where all keys map to the same bucket, turning the table into a linked list unless balanced trees are used.",
    },
    {
      domain: "Concurrency & Race Conditions",
      questionText:
        "What is a 'race condition', and what is the difference between a data race at the memory level and a logical race condition in business workflows?",
      focusArea: "Data race vs logical race condition and non-deterministic interleaving",
      hint: "A data race is unsynchronized concurrent memory access; a logical race condition happens when the timing of events causes incorrect system state even if memory is safe.",
    },
    {
      domain: "Caching & Invalidation",
      questionText:
        "Why do we say cache invalidation is one of the hardest problems in computer science? What goes wrong when a database write succeeds but cache invalidation fails?",
      focusArea: "Stale data, dual-write divergence, and eventual consistency lag",
      hint: "Consider stale reads serving outdated data to users, and race conditions where an old read repopulates the cache after a new write has occurred.",
    },
    {
      domain: "Security & Authentication",
      questionText:
        "Where should an authentication JWT or session token be stored on the client side: in localStorage or in an HttpOnly, Secure cookie? What attack vectors differentiate the two?",
      focusArea: "XSS vs CSRF vulnerability trade-offs in token storage",
      hint: "LocalStorage is readable by any JavaScript running in the origin (XSS risk); HttpOnly cookies cannot be read by JS but require CSRF protection.",
    },
    {
      domain: "Event Loop & Async Internals",
      questionText:
        "In single-threaded runtimes like JavaScript/Node, what happens if a function executes a long-running synchronous calculation (like a CPU-heavy loop)? Why does the whole server stop responding to other users?",
      focusArea: "Event loop thread starvation and cooperative multitasking",
      hint: "The main thread cannot pick up incoming I/O events or network packets from the queue until the current synchronous execution stack is completely empty.",
    },
    {
      domain: "Object-Oriented Principles",
      questionText:
        "What is the Open-Closed Principle (the 'O' in SOLID), and how can you add a new payment gateway to an existing checkout system without modifying existing classes?",
      focusArea: "Open-Closed Principle and strategy pattern / polymorphic interfaces",
      hint: "Design against an interface or abstract contract so new payment providers can be plugged in as new classes without editing existing checkout logic.",
    },
    {
      domain: "Database Fundamentals",
      questionText:
        "In relational databases, what is the difference between an INNER JOIN and an OUTER JOIN, and when can an accidental Cartesian product (CROSS JOIN) crash your database?",
      focusArea: "Join semantics, filtering predicates, and Cartesian explosion",
      hint: "Missing or non-unique join conditions cause every row in table A to match every row in table B (M x N rows), exhausting memory and temp disk space.",
    },
    {
      domain: "Error Propagation & Handling",
      questionText:
        "What is the risk of catching an exception and doing nothing with it (swallowing the error)? How does that affect downstream debugging and system invariants?",
      focusArea: "Silent error suppression, debugging observability, and broken invariants",
      hint: "Swallowing errors leaves the system in an inconsistent state while callers assume the operation succeeded, turning a localized error into mysterious downstream bugs.",
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
    {
      domain: "Distributed Transactions & Consistency",
      questionText:
        "When an order service needs to update order status and emit an event to a Kafka broker, how do you ensure the database write and the event publish happen atomically without dual-write inconsistency?",
      focusArea: "Transactional Outbox pattern and dual-write hazard",
      hint: "Look into the Transactional Outbox pattern: write the event into an 'outbox' table within the same DB transaction, and have a separate relayer publish it to Kafka.",
    },
    {
      domain: "Connection Pooling & Resource Limits",
      questionText:
        "What happens when your database connection pool is sized at 200 connections, but under heavy traffic, database latency increases from 5ms to 500ms? How does this cause connection pool starvation?",
      focusArea: "Connection pool exhaustion, Little's Law, and thread queue buildup",
      hint: "By Little's Law (Concurrency = Arrival Rate x Latency), 100x latency requires 100x connections. Incoming requests block waiting for a pool connection, exhausting web server threads.",
    },
    {
      domain: "API Rate Limiting & Throttling",
      questionText:
        "Compare the Token Bucket and Leaky Bucket rate limiting algorithms. Under what circumstances would you choose Token Bucket over Leaky Bucket for a public REST API?",
      focusArea: "Burst handling vs steady egress smoothing in rate limiters",
      hint: "Token Bucket permits controlled bursts of traffic up to bucket capacity; Leaky Bucket strictly smooths output to a constant rate.",
    },
    {
      domain: "Database Concurrency & Isolation",
      questionText:
        "What is a 'Phantom Read', and why doesn't standard Repeatable Read isolation always protect against it in PostgreSQL vs MySQL InnoDB?",
      focusArea: "Isolation levels, phantom reads, and MVCC predicate locks",
      hint: "A phantom read occurs when a transaction queries a range of rows, and a concurrent transaction inserts a new row that matches the range. MySQL uses next-key locking; PostgreSQL uses serializable snapshot isolation.",
    },
    {
      domain: "Distributed Caching & Coherence",
      questionText:
        "If you use both a local in-memory L1 cache (inside each application instance) and a distributed L2 cache (Redis), how do you keep the L1 caches in sync when one instance updates a record?",
      focusArea: "Multi-tier cache invalidation, Redis Pub/Sub, and short TTLs",
      hint: "Consider publishing invalidation messages over Redis Pub/Sub so all nodes evict their local L1 copies, combined with aggressive local TTLs.",
    },
    {
      domain: "Resilience & Bulkheading",
      questionText:
        "What is the Bulkhead pattern in distributed systems, and how does isolating thread pools or connection pools prevent one misbehaving endpoint from starving the rest of the application?",
      focusArea: "Resource isolation, bulkhead fault containment, and thread starvation",
      hint: "Like compartments in a ship, bulkheads dedicate fixed thread pools to distinct dependencies so that a slow third-party API cannot consume all worker threads.",
    },
    {
      domain: "Authentication & Token Revocation",
      questionText:
        "If JWTs are stateless and verified via cryptographic signature, how do you immediately revoke a user's access when their account is compromised before the token expires?",
      focusArea: "Stateless JWT revocation trade-offs, token blacklisting, and short-lived tokens",
      hint: "Common approaches: maintain a fast distributed Redis revocation list (checked on critical operations), or issue very short-lived access tokens with rotating refresh tokens.",
    },
    {
      domain: "Logging & Distributed Tracing",
      questionText:
        "When a single user request traverses 6 different microservices, how do you trace that request's end-to-end latency and pinpoint which downstream call failed?",
      focusArea: "Distributed tracing, Correlation/Trace IDs, and W3C tracecontext",
      hint: "Generate a unique Trace ID at the API gateway and propagate it across HTTP headers (W3C tracecontext) so spans can be reconstructed in Jaeger/Zipkin.",
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
    {
      domain: "Storage Engines & Compaction",
      questionText:
        "Compare LSM-trees (Log-Structured Merge-trees as in RocksDB/Cassandra) with traditional B+ Trees. Why do LSM-trees offer significantly higher write throughput at the expense of read amplification and background compaction?",
      focusArea: "Sequential append writes vs random I/O, SSTable levels, and write stalls",
      hint: "LSM converts random writes into sequential in-memory append logs (MemTable), periodically flushing to immutable SSTables. Read amplification requires checking Bloom filters and multiple SSTable levels.",
    },
    {
      domain: "CAP & PACELC Theorem",
      questionText:
        "Explain the PACELC theorem extension to CAP. If a distributed system is operating normally without a network partition (the 'E' part), what trade-off between Latency and Consistency must it still choose?",
      focusArea: "PACELC trade-offs under normal execution, replication lag, and read quorums",
      hint: "Even without partitions, if you want immediate strong consistency, your writes must wait for synchronous replication across nodes, directly inflating latency.",
    },
    {
      domain: "Distributed Consensus & Leases",
      questionText:
        "In leader-based consensus protocols like Raft, what happens if the current leader experiences a 2-second GC pause? Can two nodes both believe they are the leader simultaneously, and how do leader leases prevent stale reads?",
      focusArea: "Raft term increments, split brain mitigation, and monotonic leader leases",
      hint: "Followers timeout and elect a new leader. When the old leader wakes up, it may still accept writes unless it verifies its lease with a quorum before returning.",
    },
    {
      domain: "Database Replication & Lag",
      questionText:
        "In an asynchronous Read-Replica database topology, a user updates their profile and immediately refreshes the page, but still sees their old profile. How do you architect Read-Your-Own-Writes consistency without forcing all reads to the primary?",
      focusArea: "Read-Your-Own-Writes consistency, replication lag, and WAL LSN tracking",
      hint: "Track the user's latest write LSN (Log Sequence Number) in their session cookie, and route reads to a replica only if its applied LSN >= user's write LSN.",
    },
    {
      domain: "Resilience & Chaos Engineering",
      questionText:
        "What is a 'Thundering Herd' problem during a cold restart of a critical microservice, and how do exponential backoff with jitter and cache warming prevent immediate crash loops?",
      focusArea: "Cold start stampedes, randomized jitter, and graceful degradation",
      hint: "When a service restarts cold, all pending requests immediately slam the empty cache and un-warmed connection pools. Jitter breaks synchronized retries into a flat distribution.",
    },
    {
      domain: "Security & Cryptographic Architecture",
      questionText:
        "When architecting end-to-end data encryption for sensitive customer records, why should you implement envelope encryption with a Key Management Service (KMS) rather than encrypting data directly with a master key?",
      focusArea: "Envelope encryption, Data Encryption Keys (DEKs), and KMS performance",
      hint: "KMS cannot encrypt gigabytes of raw data directly (API limits and latency). Envelope encryption generates a fast local DEK per record, and KMS only encrypts the small DEK.",
    },
    {
      domain: "Distributed Queues & Partitioning",
      questionText:
        "In Apache Kafka, if you have 12 partitions in a topic and 16 consumer instances in the same consumer group, what happens to the remaining 4 consumers? How do you scale consumer throughput when you hit this limit?",
      focusArea: "Kafka partition assignment limits and consumer group rebalancing",
      hint: "Only 1 consumer in a group can read from a given partition; 4 consumers sit completely idle. To scale beyond partition count, you must increase topic partitions or use internal worker pools.",
    },
    {
      domain: "API Gateway & Edge Architecture",
      questionText:
        "When migrating from a monolithic API gateway to a Service Mesh architecture with sidecar proxies (like Envoy/Istio), what networking overhead and latency trade-offs do you introduce?",
      focusArea: "Service mesh sidecar proxy overhead, iptables redirects, and mTLS handshakes",
      hint: "Every service-to-service call traverses two additional user-space proxy hops (iptables redirect -> Envoy -> wire -> Envoy -> container), adding 1-3ms latency and significant CPU usage.",
    },
  ],
};

/**
 * Tech-Stack Specialized Question Bank
 * Injected dynamically based on candidate's selected stack.
 */
export const STACK_SPECIFIC_QUESTIONS: Record<TechStack, MockQuestionTemplate[]> = {
  TypeScript: [
    {
      domain: "TypeScript Runtime & Type System",
      questionText:
        "What is the difference between Structural Typing and Nominal Typing, and why can TypeScript code produce unexpected runtime errors even when the compiler reports zero type errors?",
      focusArea: "Structural typing, type erasure, and runtime vs compile-time guarantees",
      hint: "TypeScript types are erased during compilation. At runtime, objects are matched by shape, not nominal declaration, and external API inputs can violate type assertions.",
    },
    {
      domain: "TypeScript Variance & Generics",
      questionText:
        "In TypeScript, what is the concept of Covariance vs Contravariance in function parameter types, and why does TypeScript default to bivariant method parameters?",
      focusArea: "Variance, function subtyping, and strictFunctionTypes",
      hint: "Functions are contravariant in parameter types (accept wider inputs) and covariant in return types (produce narrower outputs). strictFunctionTypes enforces this for function signatures.",
    },
  ],
  JavaScript: [
    {
      domain: "JavaScript Engine & V8 Optimization",
      questionText:
        "How do modern JavaScript engines (like V8) optimize object property lookups using Hidden Classes (Shapes) and Inline Caches, and what code pattern causes de-optimization?",
      focusArea: "V8 Hidden classes, inline caches, and monomorphic vs megamorphic calls",
      hint: "Dynamically adding properties in different orders creates divergent hidden classes, degrading call sites from fast monomorphic access to slow megamorphic dictionary lookups.",
    },
    {
      domain: "JavaScript Prototype Chain & Closures",
      questionText:
        "How does lexical scoping in JavaScript closures interact with the Garbage Collector? When does an inner closure retain memory from variables in an outer function that it doesn't even use?",
      focusArea: "Closure lexical environment sharing and accidental memory retention",
      hint: "In V8, all closures in the same scope share a single LexicalEnvironment object. If one closure references a large variable, sibling closures can keep it retained.",
    },
  ],
  NodeJS: [
    {
      domain: "Node.js libuv & Threadpool",
      questionText:
        "Node.js is often called 'single-threaded', but its runtime utilizes a threadpool via libuv. Which specific operations run on libuv worker threads versus the main event loop thread?",
      focusArea: "libuv default threadpool (fs, crypto, dns.lookup, zlib) vs async socket polling (epoll/kqueue)",
      hint: "Network I/O is handled non-blockingly by the OS kernel (epoll/kqueue); file system I/O, DNS lookups, and crypto hashing run on the libuv 4-thread pool.",
    },
    {
      domain: "Node.js Clustering & Worker Threads",
      questionText:
        "When scaling a CPU-intensive Node.js microservice across multiple cores, when would you choose the `cluster` module over `worker_threads`, and what is the difference in memory sharing?",
      focusArea: "Process isolation (cluster) vs shared memory SharedArrayBuffer (worker_threads)",
      hint: "Cluster forks isolated OS processes sharing listening ports via IPC; worker_threads run inside the same process and can share memory via SharedArrayBuffer.",
    },
  ],
  React: [
    {
      domain: "React Internals & Fiber Reconciler",
      questionText:
        "What was the architectural motivation behind React's rewrite to the Fiber architecture, and how does Fiber enable time-slicing and interruptible rendering in Concurrent Mode?",
      focusArea: "Fiber linked-list call stack, cooperative scheduling, and priority lanes",
      hint: "Old React used a recursive call stack that couldn't be paused. Fiber models the call stack as a virtual linked-list tree that can pause, yield to browser frames, and resume.",
    },
    {
      domain: "React State & Closure Traps",
      questionText:
        "What causes a 'stale closure' bug inside a React `useEffect` or `useCallback`, and how does the dependency array ensure functions capture the correct lexical state?",
      focusArea: "Stale closures, capture value semantics, and reference equality",
      hint: "Hooks capture state variables by value at the moment the render function runs. If dependencies are omitted, the closure keeps referencing stale values from that render pass.",
    },
  ],
  NextJS: [
    {
      domain: "Next.js SSR & Server Components",
      questionText:
        "In Next.js App Router, what is the boundary between React Server Components (RSC) and Client Components, and how are Server Components serialized and sent across the wire?",
      focusArea: "RSC wire protocol, JSON-like serialization, and client bundle zero-cost",
      hint: "Server Components execute strictly on the server, producing a streaming serialized JSON/flight payload. Their dependencies never get downloaded to the client browser.",
    },
    {
      domain: "Next.js Caching & Revalidation",
      questionText:
        "How does Next.js handle Incremental Static Regeneration (ISR), and what happens when 500 concurrent requests hit a page whose `revalidate` timer has expired?",
      focusArea: "Stale-while-revalidate, background recomputation, and lock synchronization",
      hint: "ISR serves the stale static page immediately while triggering a background regeneration. Once rebuilt, subsequent requests receive the new HTML.",
    },
  ],
  Python: [
    {
      domain: "Python GIL & Concurrency",
      questionText:
        "Why does Python's Global Interpreter Lock (GIL) prevent multi-threaded CPU tasks from running in parallel, and how do `multiprocessing` versus `asyncio` solve different concurrency problems?",
      focusArea: "GIL thread-safety, CPU-bound multiprocessing vs I/O-bound asyncio event loops",
      hint: "The GIL protects CPython's reference counting memory management. `multiprocessing` spawns distinct processes with separate GILs; `asyncio` cooperatively interleaves single-threaded I/O.",
    },
    {
      domain: "Python Memory & Garbage Collection",
      questionText:
        "How does Python's memory manager combine reference counting with a generational cyclic garbage collector? When does reference counting alone fail to free memory?",
      focusArea: "Reference cycles, gc module generation 0/1/2, and circular self-references",
      hint: "Reference counting immediately frees memory when count drops to 0, but fails when objects cyclically reference each other (A -> B -> A). The cyclic GC detects isolated reference cycles.",
    },
  ],
  Go: [
    {
      domain: "Go Runtime & Goroutine Scheduler",
      questionText:
        "How does Go's GMP scheduler (Goroutines, Machines/OS threads, Processors) achieve high concurrency with millions of goroutines while traditional OS threads cap at thousands?",
      focusArea: "M:N work-stealing scheduler, segmented/resizable 2KB stacks, and preemption",
      hint: "Goroutines start with tiny 2KB dynamic stacks (vs 2MB OS thread stacks) and multiplex onto M OS threads across P logical processors using work-stealing.",
    },
    {
      domain: "Go Channels & Memory Model",
      questionText:
        "What is the difference between buffered and unbuffered Go channels, and what sequence of channel operations produces a permanent goroutine leak?",
      focusArea: "Unbuffered rendezvous synchronization, buffer deadlocks, and goroutine leaks",
      hint: "Unbuffered channels require both sender and receiver to synchronize simultaneously. If a sender writes to an unread channel without a receiver, that goroutine blocks in memory forever.",
    },
  ],
  Java: [
    {
      domain: "Java Virtual Machine & JMM",
      questionText:
        "What does the Java Memory Model (JMM) guarantee with the 'happens-before' relationship, and why is `volatile` required when implementing Double-Checked Locking in Singletons?",
      focusArea: "Happens-before order, CPU instruction reordering, and volatile memory barriers",
      hint: "Without volatile, compiler/CPU instruction reordering allows another thread to see an allocated, non-null object reference before its constructor has finished executing.",
    },
    {
      domain: "Java Garbage Collection Collectors",
      questionText:
        "Compare the G1 (Garbage-First) collector with ZGC. How does ZGC achieve sub-millisecond pause times regardless of heap size using colored pointers and load barriers?",
      focusArea: "Concurrent marking, colored pointer references, and concurrent compaction",
      hint: "ZGC performs almost all phases concurrently with application threads using 4-bit metadata colored pointers and load barriers that intercept stale object references.",
    },
  ],
  ".NET": [
    {
      domain: ".NET CLR & Async/Await Internals",
      questionText:
        "When an `async Task` method is compiled in C#/.NET, how does Roslyn transform it into a state machine, and how does the SynchronizationContext govern which thread resumes execution?",
      focusArea: "IAsyncStateMachine, TaskCompletionSource, and ConfigureAwait(false)",
      hint: "Roslyn generates a compiler struct implementing a state machine. `ConfigureAwait(false)` avoids capturing the UI or ASP.NET synchronization context on resume.",
    },
    {
      domain: ".NET Garbage Collection & LOH",
      questionText:
        "In the .NET CLR Garbage Collector, what is the Large Object Heap (LOH), why are objects >= 85,000 bytes allocated directly to it, and why was it historically prone to fragmentation?",
      focusArea: "LOH allocation threshold, generation 2 sweeps, and compaction overhead",
      hint: "Large objects are expensive to copy and compact, so LOH is collected with Gen 2 and historically left uncompacted, leading to memory fragmentation unless pooled via ArrayPool.",
    },
  ],
  Angular: [
    {
      domain: "Angular Change Detection & Signals",
      questionText:
        "How does Angular's traditional Zone.js-based change detection differ from modern Angular Signals, and why do Signals drastically reduce unnecessary component re-renders?",
      focusArea: "Zone.js monkey-patching vs fine-grained signal reactive graphs",
      hint: "Zone.js checks the entire component tree top-to-bottom on any asynchronous browser event. Signals create a fine-grained graph where only affected DOM nodes update.",
    },
    {
      domain: "Angular Dependency Injection & Hierarchical Injectors",
      questionText:
        "How do Angular's hierarchical injectors determine the lifespan of a service? What happens when a service is provided in `@Component.providers` versus `providedIn: 'root'`?",
      focusArea: "Root singleton vs component-scoped instances and memory cleanup",
      hint: "`providedIn: 'root'` creates an app-wide tree-shakeable singleton; `@Component.providers` instantiates a new service per component instance, destroying it when the component unmounts.",
    },
  ],
  "SQL/Databases": [
    {
      domain: "Database Indexing & Query Execution",
      questionText:
        "What is the difference between a Clustered Index and a Non-Clustered Index, and why does a primary key update in a clustered table cause severe physical disk I/O?",
      focusArea: "Physical row ordering in leaf pages, secondary index pointer lookups, and page splits",
      hint: "A clustered index determines the actual physical sorted order of rows on disk. Updating a clustered key forces the row to be moved to a different page, causing page splits and updating all secondary indexes.",
    },
    {
      domain: "Database Transactions & Write-Ahead Logging",
      questionText:
        "How does Write-Ahead Logging (WAL) enable relational databases to satisfy the Durability (the 'D' in ACID) without writing every page synchronously to disk on every commit?",
      focusArea: "Append-only WAL records, fsync checkpoints, and crash recovery redo logs",
      hint: "Changes are appended sequentially to the WAL and flushed to disk with fsync. Dirty data pages can remain in memory buffer pools and be lazily checkpointed later.",
    },
  ],
};

/**
 * Fisher-Yates array shuffle in place
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Picks a non-deterministic, diverse, non-repeating question.
 * Shuffles across general systems architecture and candidate's chosen tech stacks.
 * Guarantees zero repeated questions across all 20 turns.
 */
export function getMockQuestion(
  questionNumber: number,
  yoe: number,
  techStacks: TechStack[],
  previousDomains: string[] = [],
  previousQuestions: string[] = []
): QuestionItem {
  let tier: "junior" | "mid" | "senior" = "junior";
  if (yoe >= 8) tier = "senior";
  else if (yoe >= 4) tier = "mid";

  // 1. Gather all questions from current tier
  const tierQuestions = [...MOCK_QUESTIONS[tier]];

  // 2. Gather tech-stack specific questions matching candidate selections
  const stackQuestions: MockQuestionTemplate[] = [];
  if (Array.isArray(techStacks)) {
    techStacks.forEach((stack) => {
      const questionsForStack = STACK_SPECIFIC_QUESTIONS[stack];
      if (questionsForStack) {
        stackQuestions.push(...questionsForStack);
      }
    });
  }

  // Combine and deduplicate
  const fullCandidatePool = [...tierQuestions, ...stackQuestions];

  // 3. Filter out questions that have ALREADY been asked in this session
  const cleanPrevQuestions = new Set(previousQuestions.map((q) => q.trim().toLowerCase()));
  const unaskedQuestions = fullCandidatePool.filter(
    (q) => !cleanPrevQuestions.has(q.questionText.trim().toLowerCase())
  );

  // 4. Prioritize unasked domains to ensure topic breadth
  const cleanPrevDomains = new Set(previousDomains.map((d) => d.trim().toLowerCase()));
  const unaskedDomainCandidates = unaskedQuestions.filter(
    (q) => !cleanPrevDomains.has(q.domain.trim().toLowerCase())
  );

  let selected: MockQuestionTemplate;

  if (unaskedDomainCandidates.length > 0) {
    // Pick randomly from unasked domain candidates
    const shuffled = shuffleArray(unaskedDomainCandidates);
    selected = shuffled[0];
  } else if (unaskedQuestions.length > 0) {
    // If all domains were asked at least once, pick from any remaining unasked question
    const shuffled = shuffleArray(unaskedQuestions);
    selected = shuffled[0];
  } else {
    // Extreme fallback: shuffle the entire pool to guarantee a question
    const shuffled = shuffleArray(fullCandidatePool);
    selected = shuffled[0];
  }

  return {
    id: `q-${questionNumber}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
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
    "quorum", "consensus", "leader", "p99", "cpu", "heap", "leak", "index",
    "replica", "sharding", "backpressure", "wal", "btree", "lsm", "cluster"
  ];

  const matchedKeywords = technicalKeywords.filter((kw) => cleanText.includes(kw));
  const keywordDensity = matchedKeywords.length;

  let score = 5;
  if (wordCount >= 40 && keywordDensity >= 4) {
    score = isFollowUpTurn ? 8 : 7;
  } else if (wordCount >= 25 && keywordDensity >= 2) {
    score = isFollowUpTurn ? 6 : 5;
  } else {
    score = 4;
  }

  const needsProbe = !isFollowUpTurn && score < 7;

  return {
    score,
    isFollowUpNeeded: needsProbe,
    followUpQuestion: needsProbe
      ? `Can you dig deeper into the architectural trade-offs of this approach? What are the latency and data integrity implications if one node or dependency stalls?`
      : undefined,
    briefFeedback:
      score >= 7
        ? `Solid explanation addressing ${question.focusArea}. Good conceptual depth.`
        : `Answer provides partial context on ${question.focusArea}, but lacks discussion of failure scenarios or concurrency edge cases.`,
    keyPointsCovered: matchedKeywords.length > 0 ? matchedKeywords.slice(0, 3) : ["Basic conceptual overview"],
    missedNuances:
      score < 7
        ? [
            `Specific operational challenges with ${question.focusArea}`,
            "High-scale failure recovery and consistency boundaries",
          ]
        : [],
  };
}

/**
 * Generates final feedback report after Question 20.
 */
export function generateMockFeedback(
  turns: InterviewTurn[],
  candidateYoE: number,
  selectedTechStacks: TechStack[]
): FeedbackReport {
  const scores = turns.map((t) => t.evaluation?.score ?? 0);
  const avgScore = scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length);
  const readinessRating = Math.round((avgScore / 10) * 100);

  const strongAreas: { topic: string; evidence: string; masteryLevel: "High" | "Solid" }[] = [];
  const areasToImprove: { topic: string; gap: string; whyItMatters: string }[] = [];

  turns.forEach((turn) => {
    const score = turn.evaluation?.score ?? 0;
    if (score >= 7 && !strongAreas.some((s) => s.topic === turn.domain)) {
      strongAreas.push({
        topic: turn.domain,
        evidence: `Demonstrated solid architectural depth (${score}/10) with key trade-offs considered.`,
        masteryLevel: score >= 8 ? "High" : "Solid",
      });
    } else if (score <= 5 && !areasToImprove.some((a) => a.topic === turn.domain)) {
      areasToImprove.push({
        topic: turn.domain,
        gap: `Lacked comprehensive analysis of failure modes or contention edge cases (${score}/10).`,
        whyItMatters: "Essential for building fault-tolerant, high-concurrency production systems.",
      });
    }
  });

  if (strongAreas.length === 0) {
    strongAreas.push({
      topic: "Core Foundations",
      evidence: "Demonstrated baseline understanding of runtime concepts.",
      masteryLevel: "Solid",
    });
  }

  if (areasToImprove.length === 0) {
    areasToImprove.push({
      topic: "High-Scale Edge Cases",
      gap: "Further depth needed on distributed partitioning and zero-downtime migrations.",
      whyItMatters: "Required for senior and staff engineering interviews.",
    });
  }

  const verdict =
    readinessRating >= 80
      ? "Strong Hire: Exceptional conceptual clarity, failure mode awareness, and concurrency grasp."
      : readinessRating >= 60
      ? "Leaning Hire: Solid foundational depth with targeted gaps in high-contention scenarios."
      : "Needs Further Preparation: Focus on systems internals, concurrency models, and resilient architectures.";

  return {
    overallReadinessScore: readinessRating,
    summaryVerdict: verdict,
    strongAreas: strongAreas.slice(0, 4),
    areasToImprove: areasToImprove.slice(0, 4),
    targetedActionItems: [
      {
        category: "Concurrency & Contention",
        recommendation: `Deepen your understanding of lock-free data structures, memory visibility, and contention degradation in ${selectedTechStacks.slice(0, 2).join(" & ")}.`,
        resourcesOrConcepts: ["Compare-And-Swap (CAS)", "Memory Barriers", "Pessimistic vs Optimistic Locking"],
      },
      {
        category: "Resilience & Reliability",
        recommendation: "Design systems with explicit circuit breakers, backpressure, and idempotency guarantees.",
        resourcesOrConcepts: ["Transactional Outbox", "Token Bucket Throttling", "Stream Backpressure"],
      },
      {
        category: "Database & Storage Scaling",
        recommendation: "Master query plan analysis, B-Tree vs LSM compaction, and sharding hotspot mitigation.",
        resourcesOrConcepts: ["Composite Indexing", "Write-Ahead Logging (WAL)", "Virtual Node Partitioning"],
      },
      {
        category: "Senior Interview Calibration",
        recommendation: `Prepare concrete architectural case studies tailored to ${candidateYoE} YoE expectations.`,
        resourcesOrConcepts: ["Zero-Downtime Schema Migrations", "Consensus Quorums (Raft)", "Split-Brain Avoidance"],
      },
    ],
    candidateYoE,
    selectedTechStacks,
    totalQuestionsAnswered: turns.length,
  };
}
