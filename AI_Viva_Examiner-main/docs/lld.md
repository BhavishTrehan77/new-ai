# Low-Level Design (LLD): VivaSphere

## 1. Document Overview
This document provides details on the components, files, data schemas, object attributes, and execution flows for **VivaSphere**. It serves as a guide for developers working on the codebase.

---

## 2. Module & File Breakdown

```
c:/Users/kavya/OneDrive/Desktop/making/
├── index.html          # SPA Markup
├── styles.css          # Design Token CSS variables & CSS Component classes
├── app.js              # Central State & DOM Event Coordinator
├── examiner.js         # Gemini API Integration & Offline Simulator
└── visualizers.js      # Topic Visualization Rendering Engines
```

---

## 3. Class & API Specifications

### 3.1. Main Coordinator (`app.js`)
Manages state synchronization between visualizers, inputs, scoreboard elements, and DOM panels.

#### State Variables
- `activeView` (String): Tracks current SPA panel (`'study'` or `'viva'`).
- `activeTopic` (String): Current active topic (`'closures'`, `'hoisting'`, `'eventloop'`, `'promises'`, `'git'`).
- `totalScore` (Number): User's cumulative score delta.
- `currentStreak` (Number): Count of consecutive correct answers.

#### Functions
- `init()`: Called on DOMContentLoaded. Checks API key state, binds visualizer defaults, updates system prompts, and registers events.
- `bindEvents()`: Binds event listeners to buttons, nav items, prompt config forms, tabs, textareas, and window clicks.
- `switchView(viewName)`: Toggles active classes for `#view-study` and `#view-viva`.
- `setApiStatus(isConnected)`: Updates headers and labels to denote Simulated or Gemini API mode.
- `updateSystemPromptView()`: Refreshes the prompt text container using `Examiner.getSystemPrompt()`.
- `startVivaSession()`: Resets logs, disables navigation settings, starts the AI session via `Examiner.startSession()`, and renders the first question.
- `resetVivaSession()`: Reverts scoreboards to zero and clears prompt configurations.
- `getHint()`: Appends current question hint to the conversation panel.
- `sendUserMessage()`: Pulls values from the chat textarea, feeds them to `Examiner.submitAnswer()`, and handles updates.
- `handleScore(delta)`: Computes score, changes scoreboard class animations (e.g. green for positive, red for negative).

---

### 3.2. AI Examiner Module (`examiner.js`)
Encapsulates Gemini API connections, system prompts, history formatting, and simulation configurations.

#### Object Attributes
- `apiKey` (String): User's Gemini API key.
- `vivaTopic` (String): Current subject focus.
- `vivaDifficulty` (String): Tone modifier.
- `customInstructions` (String): Additional rules appended to system prompts.
- `history` (Array): Array of message objects formatted in Gemini API schema: `[{ role: 'user' | 'model', parts: [{ text: '...' }] }]`.
- `vivaActive` (Boolean): Flag representing session lifecycle status.
- `currentQuestion` (String): Cache of the current question.
- `currentHint` (String): Cache of the current hint.

#### Core Methods
- `getSystemPrompt()`: Dynamically constructs LLM instructions from tone and topic presets.
- `getSchema()`: Returns the JSON Schema validation definition for Gemini Structured Outputs.
- `startSession()`: Resets history and fires initial request.
- `submitAnswer(answerText)`: Appends answer to history and calls `sendApiRequest` or `simulateResponse`.
- `sendApiRequest(userInput)`:
  - Calls: `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}`.
  - Enforces `generationConfig.responseMimeType = "application/json"` and `generationConfig.responseSchema`.
  - Captures raw response and updates history state.
- `simulateResponse(trigger, userInput)`: Evaluates user answers against regex keyword arrays (`['lexical', 'tdz', 'microtask', 'pointers']`) locally, scoring and structuring mock response payloads.

---

### 3.3. Topic Visualizers (`visualizers.js`)
Maintains sandboxed environments and renders interactive steps for the study view.

#### Sandbox States
Stores parameters for each simulation context:
- **Closures**: `step`, `stack` (execution array), `heap` (variables tracking scope), `console` (log buffer).
- **Hoisting**: `step`, `phase` (`'compilation'` or `'execution'`), `memory` (mapping variable initialization states).
- **Event Loop**: `step`, `stack`, `webapis` (timers), `microtasks` (promises), `macrotasks` (callback routines).
- **Promises**: `step`, `callbackLogs`, `promiseLogs`.
- **Git**: `history` (nodes representing commits), `branches` (refs pointers), `head` (active branch name).

#### Main Controls
- `init(topicId, containerEl, explanationEl)`: Populates container structures, explanation divs, and binds visualizer-specific handlers.
- `reset(topicId)`: Restores sandbox states to default step indices.
- `step(topicId)`: Triggers internal state transitions, updates step counters, and redraws components.
- `updateUI(topicId)`: Renders HTML segments:
  - Calls `drawGitTree()` for Git timelines.
  - Redraws boxes, tables, loops, and lists dynamically.

---

## 4. Structured Output JSON Specification
The Gemini API returns structured JSON matching the following schema definition:

```json
{
  "type": "OBJECT",
  "properties": {
    "feedback": {
      "type": "STRING",
      "description": "Analysis of the candidate's previous response. Highlight what they got right, and point out mistakes or missing terminology."
    },
    "question": {
      "type": "STRING",
      "description": "The next targeted technical question for the viva."
    },
    "scoreDelta": {
      "type": "INTEGER",
      "description": "Points to add: 1 for a good correct response, 0 for incomplete/neutral, -1 for totally incorrect or nonsense answer."
    },
    "topicFocus": {
      "type": "STRING",
      "description": "The specific sub-concept targeted by this next question."
    },
    "conceptsChecked": {
      "type": "ARRAY",
      "items": { "type": "STRING" },
      "description": "A list of critical technical terms or keywords mentioned by the candidate in their answer."
    },
    "hint": {
      "type": "STRING",
      "description": "A helpful hint if they struggle or ask for assistance."
    }
  },
  "required": [
    "feedback", 
    "question", 
    "scoreDelta", 
    "topicFocus", 
    "conceptsChecked", 
    "hint"
  ]
}
```

Example JSON Response:
```json
{
  "feedback": "Great explanation! You correctly mentioned that closures capture reference scopes.",
  "question": "How do closures help prevent global namespace pollution?",
  "scoreDelta": 1,
  "topicFocus": "Closures / Encapsulation",
  "conceptsChecked": ["lexical environment", "scope retention"],
  "hint": "Think about wrapping variables in immediately invoked function expressions (IIFEs) or module classes."
}
```
