# Low-Level Design (LLD)

## 1. Introduction

The AI Viva Examiner is implemented as a modular web application.

The main responsibilities are divided into:

```text
app.js
examiner.js
visualizers.js
index.html
styles.css
```

Each module has a specific responsibility so that UI handling, viva logic, visualization logic, and styling remain separated.

---

# 2. Project Structure

```text
AI-Viva-Examiner/
│
├── index.html
├── styles.css
├── app.js
├── examiner.js
├── visualizers.js
├── page.jsx
├── package.json
├── package-lock.json
├── eslint.config.js
│
└── docs/
    ├── prd.md
    ├── hld.md
    └── lld.md
```

---

# 3. Module Design

## 3.1 index.html

`index.html` contains the main application structure.

Responsibilities:

* Navigation.
* Study Lab container.
* Viva Arena container.
* Topic selection.
* Difficulty selection.
* Chat interface.
* Visualizer container.
* API-key configuration.
* Score display.
* Streak display.
* System prompt display.

The HTML mainly defines the structure while JavaScript controls the application behaviour.

---

# 4. styles.css

`styles.css` is responsible for the visual presentation.

Responsibilities:

* Layout.
* Typography.
* Colors.
* Buttons.
* Cards.
* Navigation.
* Chat messages.
* Visualizer components.
* Responsive behaviour.
* Status indicators.

The styling layer does not contain application logic.

---

# 5. app.js

`app.js` is the main application controller.

It connects the user interface with the Examiner and Visualizers modules.

## Responsibilities

```text
Application Initialization
Navigation
DOM Event Handling
Topic Selection
Visualizer Initialization
Viva Session Management
Answer Submission
Hint Requests
Score Updates
API Key UI
UI Rendering
```

---

# 6. DOM References

During initialization, the application obtains references to important DOM elements.

Examples include:

```text
studyView
vivaView
visualizerStage
explanationContent
chatMessages
chatInput
sendButton
startSessionButton
resetButton
hintButton
difficultySelect
topicSelect
systemPromptDisplay
scoreDisplay
streakDisplay
```

Keeping references to frequently used elements avoids repeatedly searching the DOM.

---

# 7. Navigation Logic

The application contains two major views:

```text
Study Lab
Viva Arena
```

Navigation works approximately as:

```text
User clicks navigation button
          |
          v
Event handler
          |
          v
Change active view
          |
          v
Update active navigation state
          |
          v
Display selected section
```

No complete page reload is required.

---

# 8. Examiner Module

The Examiner module is implemented in:

```text
examiner.js
```

It contains the logic responsible for conducting the viva.

The module maintains information such as:

```text
apiKey
vivaTopic
vivaDifficulty
customInstructions
history
vivaActive
currentQuestion
currentHint
```

---

# 9. Examiner Methods

The Examiner module provides functionality conceptually represented by methods such as:

```text
getSystemPrompt()
getSchema()
startSession()
submitAnswer(answerText)
sendApiRequest(userInput)
displayRawJson(jsonText)
simulateResponse(trigger, userInput)
```

---

# 10. getSystemPrompt()

The system prompt defines the behaviour of the AI examiner.

It is constructed using:

```text
Examiner Role
+
Selected Topic
+
Difficulty
+
Custom Instructions
+
Response Requirements
```

Example:

```text
You are a technical JavaScript examiner.

Topic:
Closures

Difficulty:
Medium

Additional Instructions:
Ask practical interview questions.

Return a structured response.
```

The final prompt is displayed in the application for transparency and prompt-engineering demonstration.

---

# 11. getSchema()

The schema defines the expected structure of the examiner response.

Conceptually:

```javascript
{
    question: String,
    feedback: String,
    scoreDelta: Number,
    topicFocus: String,
    conceptsChecked: Array,
    hint: String
}
```

This makes the AI response predictable for the frontend.

---

# 12. Viva Session Lifecycle

The viva follows a state-based lifecycle.

```text
IDLE
 |
 | Start
 v
STARTING
 |
 | Question received
 v
WAITING_FOR_ANSWER
 |
 | Submit answer
 v
EVALUATING
 |
 v
FEEDBACK
 |
 v
NEXT QUESTION
 |
 v
WAITING_FOR_ANSWER
```

Resetting the session returns the application to:

```text
IDLE
```

---

# 13. startSession()

When the user starts a viva:

```text
Start Button
      |
      v
Read topic
      |
      v
Read difficulty
      |
      v
Read custom instructions
      |
      v
Initialize history
      |
      v
Set vivaActive = true
      |
      v
Generate first question
```

If Gemini is available, the first question is generated using Gemini.

Otherwise, the simulation engine generates the first question.

---

# 14. submitAnswer()

The answer submission process is:

```text
User enters answer
       |
       v
Validate answer
       |
       v
Add answer to history
       |
       v
Check API availability
      / \
     /   \
   YES    NO
    |      |
    v      v
 Gemini  Simulation
    \      /
     \    /
      v  v
Evaluation Result
       |
       v
Update Score
       |
       v
Display Feedback
       |
       v
Generate Next Question
```

---

# 15. Gemini API Flow

When an API key exists:

```text
submitAnswer()
      |
      v
sendApiRequest()
      |
      v
Construct request body
      |
      v
Send HTTPS request
      |
      v
Gemini API
      |
      v
Receive response
      |
      v
Parse response
      |
      v
Return examiner result
```

The application then updates the UI using the returned result.

---

# 16. Conversation History

The examiner maintains conversation history so that the AI can understand previous questions and answers.

Conceptual structure:

```javascript
[
    {
        role: "user",
        parts: [
            { text: "Question or answer" }
        ]
    },
    {
        role: "model",
        parts: [
            { text: "Examiner response" }
        ]
    }
]
```

This allows the viva to behave like a continuous conversation instead of independent questions.

---

# 17. Simulation Engine

The simulation engine is used when Gemini is unavailable.

The method:

```text
simulateResponse(trigger, userInput)
```

performs topic-specific evaluation.

Process:

```text
User Answer
    |
    v
Convert to lowercase
    |
    v
Identify expected concepts
    |
    v
Search answer for keywords
    |
    v
Calculate matched concepts
    |
    v
Determine answer quality
    |
    v
Generate feedback
    |
    v
Generate score change
    |
    v
Generate next question
```

---

# 18. Example Simulation Logic

For a Closure question, the expected concepts may include:

```text
closure
lexical scope
outer function
inner function
state
encapsulation
```

If the answer contains several relevant concepts, the simulation can classify it as a stronger answer.

Example:

```text
Strong Answer
     |
     v
Positive Feedback
     |
     v
Positive Score Delta
```

A weak answer can result in:

```text
Weak Answer
     |
     v
Improvement Feedback
     |
     v
Negative or Zero Score Delta
```

---

# 19. Scoring

The viva maintains a score and streak.

A conceptual scoring model is:

```text
Strong Answer  → +1
Partial Answer →  0
Weak Answer    → -1
```

The AI mode can return the exact `scoreDelta` through the structured response.

The frontend then updates the score.

---

# 20. Hint System

The user can request a hint for the current question.

Flow:

```text
User clicks Hint
       |
       v
Examiner
       |
       v
Generate / retrieve hint
       |
       v
Display hint
```

The hint is topic-specific and intended to guide the student without directly giving the complete answer.

---

# 21. Visualizers Module

The visualizer implementation is contained in:

```text
visualizers.js
```

The module manages different programming concept visualizations.

Supported visualizers include:

```text
Closures
Hoisting
Event Loop
Promises vs Callbacks
Async/Await
Git Workflow
```

---

# 22. Visualizer Interface

Each visualizer follows a similar lifecycle:

```text
Initialize
    |
    v
Create State
    |
    v
Render Initial State
    |
    v
Next Step
    |
    v
Update State
    |
    v
Render Updated State
```

This allows the user to understand how the underlying concept changes during execution.

---

# 23. Closure Visualizer

The Closure visualizer can maintain state such as:

```javascript
{
    step: 0,
    stack: [],
    heap: {},
    console: [],
    maxSteps: 5
}
```

The state represents:

* Function execution.
* Variable storage.
* Lexical environment.
* Returned inner function.
* Access to preserved variables.

---

# 24. Hoisting Visualizer

The Hoisting visualizer maintains information such as:

```javascript
{
    step: 0,
    phase: "creation",
    memory: {},
    console: [],
    maxSteps: 5
}
```

The visualization demonstrates:

```text
Creation Phase
      |
      v
Declarations
      |
      v
Memory Allocation
      |
      v
Execution Phase
      |
      v
Console Output
```

---

# 25. Event Loop Visualizer

The Event Loop visualizer represents:

```javascript
{
    step: 0,
    stack: [],
    webapis: [],
    microtasks: [],
    macrotasks: [],
    console: [],
    spinning: false,
    maxSteps: 8
}
```

It demonstrates the relationship between:

```text
Call Stack
Web APIs
Microtask Queue
Macrotask Queue
Event Loop
```

---

# 26. Promise vs Callback Visualizer

The Promise/Callback visualizer maintains separate execution information for:

```text
Callbacks
Promises
Console Output
Current Execution Step
```

It allows the user to compare asynchronous execution behaviour.

---

# 27. Git Visualizer

The Git visualizer represents Git history and branches.

Example state:

```javascript
{
    history: [],
    branches: {},
    head: null,
    terminalHistory: [],
    commitCount: 0
}
```

It can demonstrate operations such as:

```text
Commit
Branch
Checkout
Merge
Push
```

---

# 28. Visualizer State Transition

The general transition model is:

```text
Current State
      |
      | Next Step
      v
Calculate Transition
      |
      v
New State
      |
      v
Render New State
```

This makes the visualizer similar to a small deterministic state machine.

---

# 29. API Key Management

The application stores the API key locally using:

```javascript
localStorage
```

Conceptual key:

```text
gemini_api_key
```

Save flow:

```text
Input Key
   |
   v
Validate
   |
   v
Examiner.apiKey
   |
   v
localStorage
```

Clear flow:

```text
Clear Key
   |
   v
Examiner.apiKey = ""
   |
   v
localStorage.removeItem(...)
```

---

# 30. Error Handling

The application handles common errors such as:

### Empty Answer

```text
Empty Answer
    |
    v
Validation Error
    |
    v
Ask User To Enter Answer
```

### API Failure

```text
Gemini Request
      |
      v
Request Failed
      |
      v
Fallback Simulation
```

### Invalid Response

```text
Gemini Response
      |
      v
Parse Response
      |
      v
Invalid Structure
      |
      v
Handle Error
```

---

# 31. Data Model

The examiner result follows a common structure:

```javascript
{
    question: String,

    feedback: String,

    scoreDelta: Number,

    topicFocus: String,

    conceptsChecked: [
        String
    ],

    hint: String
}
```

This common format allows both Gemini and simulation mode to provide results that the UI can process in the same way.

---

# 32. Module Dependency

The module relationship can be represented as:

```text
                index.html
                    |
                    v
                  app.js
                 /      \
                /        \
               v          v
          examiner.js   visualizers.js
               |
               v
           Gemini API
```

`styles.css` provides styling for the complete interface.

---

# 33. Event Handling

Important user events include:

```text
Navigation Click
Topic Change
Difficulty Change
Start Viva
Submit Answer
Request Hint
Reset Viva
Next Visualizer Step
Save API Key
Clear API Key
```

Each event is handled by the application controller and then routed to the appropriate module.

---

# 34. Separation of Responsibilities

The application follows separation of concerns.

### app.js

```text
UI + Event Coordination
```

### examiner.js

```text
Viva + AI + Simulation Logic
```

### visualizers.js

```text
Concept Visualization Logic
```

### index.html

```text
Application Structure
```

### styles.css

```text
Presentation
```

This separation makes the project easier to maintain and extend.

---

# 35. Adding a New Visualizer

To add a new concept:

```text
1. Add topic option.
2. Create visualizer state.
3. Define execution steps.
4. Define state transitions.
5. Create renderer.
6. Add explanation.
7. Connect visualizer to app.js.
8. Add simulation rules if viva support is required.
```

---

# 36. Adding a New Viva Topic

To add a new viva topic:

```text
1. Add topic to topic configuration.
2. Add topic to examiner prompt.
3. Define expected concepts.
4. Define simulation keywords.
5. Add default questions.
6. Add hints.
7. Add follow-up questions.
```

---

# 37. Security Considerations

The current implementation is intended for educational/demo usage.

Because the Gemini API key is entered in the browser, it should not be treated as secure production secret storage.

A production implementation should move the AI request to a backend:

```text
Frontend
   |
   v
Backend
   |
   v
Gemini API
```

The backend should store the Gemini key in environment variables.

---

# 38. Performance Considerations

The application is lightweight because:

* No database is required.
* Most operations happen locally.
* Visualizers use in-memory state.
* DOM updates are performed only when state changes.
* AI requests are only made during viva interactions.

The main external performance dependency is Gemini API response latency.

---

# 39. Testing Considerations

The following areas should be tested:

### UI Testing

* Navigation.
* Topic selection.
* Visualizer controls.
* Viva controls.
* Score display.

### Examiner Testing

* Session creation.
* Answer submission.
* Hint generation.
* Reset functionality.
* Simulation mode.
* Gemini mode.

### Visualizer Testing

* Initial state.
* Every step.
* Final state.
* Reset.
* Topic switching.

### Error Testing

* Missing API key.
* Invalid API key.
* Network failure.
* Empty answer.
* Invalid AI response.

---

# 40. Conclusion

The Low-Level Design divides the AI Viva Examiner into independent modules for UI control, AI examination, simulation, and concept visualization.

The main application controller coordinates these modules while the Examiner handles viva-specific logic and the Visualizers handle programming concept demonstrations.

This modular structure makes the project easier to debug, maintain, test, and extend with new JavaScript concepts and future AI-powered features.
