# Role & Project Scope
You are an expert full-stack engineer and AI systems architect. Build a production-ready, fully responsive Next.js (App Router) web app named **"Crack it"**, an AI-driven technical mock interview platform with Progressive Web App (PWA) support.

## 1. Intro Animation Choreography (Framer Motion)
On root mount (`/`), render a centered minimalist canvas executing this exact sequential animation:
1. Show `"Do you have an interview?"` -> slides up and fades out.
2. Show `"Are you worried?"` -> slides up and fades out.
3. Show `"Do you feel you are not ready?"` -> slides up and fades out.
4. Show `"Lets Mock it"`.
5. Word `"Mock"` translates up and fades out while `"Crack"` takes its place, forming `"Lets Crack it"`.
6. `"Lets "` fades out; `"Crack it"` animates smoothly with layoutId from screen center to the top-left corner (`text-2xl font-bold tracking-tight`).
7. Center area clears cleanly, revealing the setup form with a smooth fade-in.

## 2. Onboarding Setup Form
Render two input fields:
1. **Tech Stack Selection:** Multi-select pills/badges: `Java`, `JavaScript`, `TypeScript`, `NodeJS`, `.NET`, `Angular`, `React`, `NextJS`, `Python`, `Go`, `SQL/Databases`.
2. **Years of Experience:** Integer-only input field (`min="1"`, `max="15"`).
3. **Action:** "Start Mock Interview" button. Clicking triggers a high-polish loader state: *"Getting your test ready..."*.

## 3. Multi-Agent AI System Architecture (20 Questions)
Implement a robust backend API route (`/api/interview`) powered by Gemini 1.5 Flash using strict JSON schema output.

Structure the flow around three specialized agent personas/skills:
- **Agent 1: Question Crafter:**
  - Strictly avoids coding/syntax tests. Focuses purely on: Object-Oriented Principles, Threading/Multithreading, Concurrency, Memory Management, Event Loop internals, System Reliability, Error Propagation, and Architectural Trade-offs ("How would you achieve X under constraint Y?").
  - Calibrates question depth to candidate YoE (1–3: foundational internals; 4–7: concurrency, thread safety, microservices patterns; 8–15: distributed consensus, high-scale bottlenecks, zero-downtime migrations).
- **Agent 2: Answer Evaluator & Follow-Up Driver:**
  - Evaluates user response against technical depth.
  - If the answer is vague or misses edge cases, issues a 1-turn follow-up probe before incrementing the question counter.
  - Keeps the interview capped at 20 conceptual questions total.
- **Agent 3: Feedback & Gap Analyst:**
  - After Question 20, ingests the full transcript.
  - Outputs a structured breakdown:
    - Overall readiness rating (0–100%).
    - **Strong Areas** (topics where answers showed deep architectural grasp).
    - **Areas to Improve** (specific gaps in concurrency, resilience, or design).
    - **Targeted Action Items** for real interview preparation.

## 4. UI/UX & Native PWA Standards
- Mobile-first layout with clean typography, dark/light theme support, and a fixed bottom response bar.
- Question counter (`Question X of 20`), progress bar, and active domain tag.
- Textarea with auto-resize, character counter, and a microphone icon wired to browser `webkitSpeechRecognition` / `SpeechRecognition` for voice dictation.
- PWA configuration: `manifest.json`, service worker registration, and viewport tags optimized for standalone mobile mode.

Deliver complete, working TypeScript code across all components, API routes, and agent prompt templates.