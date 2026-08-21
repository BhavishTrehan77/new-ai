# Product Requirements Document (PRD): VivaSphere

## 1. Document Overview
This document defines the product requirements, target audience, feature scope, and roadmap for **VivaSphere**—an interactive tech study lab and AI-powered viva (oral exam) preparation platform.

---

## 2. Product Vision & Value Proposition
Computer science students and frontend developers preparing for technical interviews often struggle with two main things:
1. **Visualizing Abstract Runtime Mechanics**: Concepts like JavaScript closures, variable hoisting, the event loop, and promise microtask queues are hard to grasp without visual aid.
2. **Articulating Concepts Verbally**: Coding challenges test writing ability, but tech interviews require candidates to verbally explain concepts clearly using exact technical terminology.

**VivaSphere** solves both problems. It provides a visual study environment that renders runtime steps in real-time, paired with an interactive AI Viva Examiner that scores answers, checks for keywords, and tests verbal tech skills under adjustable interview portfolios.

---

## 3. Target Audience & Personas
- **The Interview Candidate (Primary)**: Junior-to-mid level frontend developers who know basic JS/Git syntax but need practice explaining architectural concepts under pressure.
- **The Tech Student (Secondary)**: Students learning asynchronous programming and version control.
- **The Educator / Reviewer**: Tech mentors looking to demonstrate runtime execution flows visually to students.

---

## 4. Key Product Features & Functional Requirements

### 4.1. Navigation & Architecture
- **Single Page Application (SPA)**: Smooth transition between two main views:
  - **Study Lab**: Graphical sandbox for stepping through JS and Git mechanics.
  - **AI Viva Arena**: Interactive voice/text chat exam.
- **Header Actions**:
  - API Settings toggle for Gemini API key configuration.
  - Status indicator displaying whether the application is running in **Gemini API Mode** or **Simulation Mode**.

### 4.2. Feature Set 1: Study Lab (Interactive Visualizers)
The Study Lab includes interactive visualization panels for 5 core technical topics:
1. **JavaScript Closures**: Displays execution contexts, the Call Stack, Scope Chains, and Heap objects. Shows how inner functions capture references to parent execution contexts even after parent execution completes.
2. **JavaScript Hoisting**: Visualizes compile-time memory allocation versus run-time execution phase, highlighting the Temporal Dead Zone (TDZ) for `let`/`const` variables.
3. **The Event Loop**: Visualizes the Call Stack, Web APIs background processing, the Microtask Queue (Promises), and the Macrotask Queue (setTimeout/timers).
4. **Promises vs Callbacks**: A comparative timeline showing the difference in code layout, error propagation, and callback nesting.
5. **Git Workflow Graph**: Renders a dynamic, visual commit-history node graph showing commits, branches, checkout operations, and HEAD pointer movements.

**Study Lab Controls**:
- **Next Step**: Steps forward line-by-line or action-by-action through execution.
- **Reset Simulation**: Reverts state back to the initial step.
- **Viva Test (Quick Action)**: Immediately opens the AI Viva Arena pre-focused on the active topic.

### 4.3. Feature Set 2: AI Viva Arena (Prompt Engineering & Evaluation)
- **AI Examiner settings (Prompt Engineering Demonstration)**:
  - **Tone & Difficulty Selector**: Friendly Mentor (Easy), Standard Reviewer (Medium), Strict Professor (Hard), Socratic Guide (Conceptual).
  - **Focus Subject**: Focus on individual topics or a comprehensive mix of all topics.
  - **System Prompt Instructions Viewer**: Displays the system prompt currently injected into the AI, allowing users to see prompt engineering at work.
  - **Custom Instructions Input**: Permits custom rules (e.g. "Answer as a pirate").
- **Chat Interface**:
  - **Examiner Status**: Status label and glowing avatar ring indicating whether the examiner is thinking or ready.
  - **Request Hint**: Fetches a topic-specific hint to guide struggling candidates.
  - **Real-Time Scorecard**: Tracks current session score and correct answer streaks.
  - **Reset Session**: Clears history, score, and lets the user adjust settings to start a new exam.

### 4.4. Feature Set 3: Structured Outputs Pane
- **Raw JSON Response View**: Displays the actual JSON payload returned by the LLM, showing evaluation parameters (`feedback`, `question`, `scoreDelta`, `topicFocus`, `conceptsChecked`, `hint`).
- **JSON Schema Spec View**: Displays the strict schema definition constraint used to enforce JSON outputs, helping students learn integration concepts.

---

## 5. Non-Functional Requirements (NFRs)
- **Security & Privacy**: No Gemini API keys are sent to a third-party server. They must be saved locally in the browser's `localStorage` and sent directly to Google's Generative Language API endpoint.
- **Simulated Fallback Mode**: If no API key is set, the app must fall back to a simulation engine to guarantee offline usability.
- **Performance**: Transitions, updates to the graphical canvases, and message bubble loading should feel fast (animations under 300ms).
- **Responsive Layout**: Designed for desktop viewports ($1024px$ and above) given the side-by-side structured panels, with standard layout wrapping for tablets.

---

## 6. Success Metrics
1. **User Retention**: Candidates completing 3 or more full rounds of questions.
2. **Concept Mastery**: Improvement in user scores and longer answer streaks within single sessions.
3. **Zero Configuration Start**: Success rate of users running the offline simulation without requiring an API key.

---

## 7. Future Product Roadmap
- **Voice-to-Text Integration**: Allow users to verbally speak their answers rather than typing.
- **Database/Cloud Sync**: Optional cloud sign-in to persist history, scores, and track analytics over time.
- **Custom Question Sets**: Interface for team leads/companies to build custom topic sets for mock interview screens.
