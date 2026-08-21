# High-Level Design (HLD)

## 1. System Overview

The AI Viva Examiner is a web-based interactive learning and assessment application.

The system has two major modules:

1. **Study Lab** — helps users understand JavaScript and Git concepts through interactive visualizations.
2. **Viva Arena** — simulates a technical viva using Gemini AI or a local simulation engine.

The application is designed to work even without an external AI API by providing a fallback simulation mode.

---

# 2. High-Level Architecture

```text
                         USER
                           |
                           v
              +-------------------------+
              |      Web Browser        |
              +------------+------------+
                           |
                           v
              +-------------------------+
              |    Presentation Layer   |
              |                         |
              |  Study Lab              |
              |  Viva Arena             |
              |  Navigation             |
              |  Chat Interface         |
              +------------+------------+
                           |
                           v
              +-------------------------+
              |   Application Layer     |
              |                         |
              |  app.js                 |
              |  Examiner Module        |
              |  Visualizer Module      |
              +------+-------------+----+
                     |             |
             +-------+             +--------+
             |                              |
             v                              v
   +-------------------+          +-------------------+
   | Simulation Engine |          |    Gemini API     |
   |                   |          |                   |
   | Offline Viva     |          | AI Examiner       |
   | Evaluation       |          | Questions         |
   +-------------------+          | Feedback          |
                                  +-------------------+
```

---

# 3. Major Components

## 3.1 Presentation Layer

The presentation layer is responsible for displaying the application's interface.

Main files:

```text
index.html
styles.css
```

Responsibilities:

* Display navigation.
* Display Study Lab.
* Display Viva Arena.
* Display topic selection.
* Display difficulty selection.
* Display chat interface.
* Display visualizations.
* Display score and streak.
* Display feedback.
* Display API-key configuration.

---

# 4. Application Controller

The main application controller is implemented in:

```text
app.js
```

It acts as the central coordinator between the UI and application modules.

Responsibilities:

* Initialize the application.
* Handle user events.
* Switch between Study Lab and Viva Arena.
* Manage selected topics.
* Initialize visualizers.
* Start viva sessions.
* Submit answers.
* Request hints.
* Reset sessions.
* Update UI elements.
* Display examiner responses.

---

# 5. Examiner Module

The examiner functionality is implemented in:

```text
examiner.js
```

The Examiner module is responsible for the complete viva lifecycle.

It manages:

```text
API Key
Viva Topic
Difficulty
Custom Instructions
Conversation History
Current Question
Current Hint
Viva State
```

Main responsibilities:

* Build examiner prompts.
* Start viva sessions.
* Submit answers.
* Communicate with Gemini.
* Parse structured responses.
* Generate feedback.
* Generate hints.
* Maintain score information.
* Run simulation mode.

---

# 6. Visualizer Module

The visualization system is implemented in:

```text
visualizers.js
```

The module provides interactive visualizations for programming concepts.

Supported concepts include:

```text
Closures
Hoisting
Event Loop
Promises vs Callbacks
Async/Await
Git Workflow
```

Each visualizer maintains its own state and updates the UI step-by-step.

---

# 7. Gemini API Integration

The application optionally communicates with the Gemini API.

The communication flow is:

```text
Student Answer
      |
      v
Examiner Module
      |
      v
Build Prompt
      |
      v
Gemini API Request
      |
      v
Gemini Response
      |
      v
Parse Structured Response
      |
      v
Update Viva UI
```

The AI response is expected to contain structured information such as:

```text
question
feedback
scoreDelta
topicFocus
conceptsChecked
hint
```

This allows the frontend to consistently process the examiner response.

---

# 8. Simulation Architecture

The application provides a local simulation engine when Gemini is unavailable.

```text
Student Answer
      |
      v
Simulation Engine
      |
      v
Normalize Answer
      |
      v
Check Topic Keywords
      |
      v
Calculate Answer Quality
      |
      v
Generate Feedback
      |
      v
Generate Score Delta
      |
      v
Generate Next Question
```

The simulation engine is mainly rule-based and topic-specific.

For example, a Closure question may check concepts such as:

```text
lexical scope
closure
outer function
inner function
state
encapsulation
```

---

# 9. Study Lab Flow

```text
User Opens Application
          |
          v
       Study Lab
          |
          v
    Select a Topic
          |
          v
   Initialize Visualizer
          |
          v
   Display Initial State
          |
          v
    User Clicks Next
          |
          v
   Update Runtime State
          |
          v
     Render State
          |
          v
   Display Explanation
```

The visualizer behaves like a small state machine where each step represents a change in program execution.

---

# 10. Viva Arena Flow

```text
User Opens Viva Arena
          |
          v
    Select Topic
          |
          v
   Select Difficulty
          |
          v
 Custom Instructions
          |
          v
     Start Viva
          |
          v
  Generate Question
          |
          v
   User Answers
          |
          v
     Evaluation
       /      \
      /        \
 Gemini API   Simulation
      \        /
       \      /
        \    /
       Result
          |
          v
 Feedback + Score
          |
          v
    Next Question
```

---

# 11. Application State

The application maintains state related to both visualization and viva sessions.

### Viva State

```text
vivaTopic
vivaDifficulty
customInstructions
vivaActive
currentQuestion
currentHint
history
score
streak
```

### Visualizer State

Each visualizer maintains its own state.

For example:

```text
step
stack
heap
console
maxSteps
```

for runtime-based visualizations.

---

# 12. Data Flow

## Study Lab Data Flow

```text
Selected Topic
      |
      v
Visualizer State
      |
      v
Execution Step
      |
      v
Rendered Runtime State
      |
      v
Explanation
```

## Viva Data Flow

```text
Topic + Difficulty + Instructions
              |
              v
        System Prompt
              |
              v
        Examiner Engine
          /          \
         /            \
    Gemini API      Simulation
         \            /
          \          /
           v        v
          Examiner Result
                 |
                 v
       Feedback + Score + Question
```

---

# 13. API Key Storage

The current application uses browser `localStorage` for API-key persistence.

Conceptually:

```text
User enters API key
       |
       v
Examiner API key
       |
       v
localStorage
```

The key can later be removed using the application's clear/reset functionality.

### Security Consideration

Storing API keys in browser storage is suitable for a local educational/demo application but is not recommended for a production application.

For production, the API key should be stored on a backend server.

---

# 14. Production Security Architecture

A production version should use:

```text
              Browser
                 |
              HTTPS
                 |
                 v
          Backend API
                 |
        Server-side Secret
                 |
                 v
            Gemini API
```

Advantages:

* API key is not exposed to the browser.
* Server can authenticate users.
* Rate limiting can be implemented.
* Requests can be validated.
* AI responses can be validated before reaching the client.

---

# 15. Error Handling

The application should gracefully handle:

* Missing API key.
* Invalid API key.
* Gemini API errors.
* Network failures.
* Invalid AI responses.
* Empty answers.
* Invalid configuration.
* Session reset.

If Gemini cannot be used, the application can switch to simulation mode.

---

# 16. Reliability

The main reliability feature is the fallback simulation engine.

```text
          Viva Request
               |
               v
        Gemini Available?
          /          \
        YES           NO
         |             |
         v             v
    Gemini API     Simulation
         |             |
         +------+------+
                |
                v
          Viva Response
```

This prevents the application from becoming completely unusable when the external AI service is unavailable.

---

# 17. Deployment Architecture

The current application can be deployed as a static web application.

```text
                Internet
                    |
                    v
             Static Hosting
                    |
          +---------+---------+
          |         |         |
          v         v         v
      index.html  app.js  styles.css
                    |
                    v
              Browser Runtime
                    |
                    v
              Optional Gemini
```

Possible static hosting platforms include:

* Vercel.
* Netlify.
* GitHub Pages.

---

# 18. Technology Stack

## Frontend

```text
HTML
CSS
JavaScript
DOM API
```

## AI

```text
Google Gemini API
```

## Storage

```text
Browser localStorage
```

## Optional Demonstration

```text
React
Framer Motion
```

## Development Tools

```text
Node.js
npm
ESLint
Git
GitHub
```

---

# 19. Scalability

The current application is designed primarily for individual users.

For a larger production system, the architecture can be extended to:

```text
                    Users
                      |
                      v
                Load Balancer
                      |
                      v
              Backend Application
                 /     |      \
                /      |       \
               v       v        v
             Auth    Viva     Analytics
               |     Engine       |
               |       |          |
               +-------+----------+
                       |
                       v
                    Database
                       |
                       v
                   AI Gateway
                       |
                       v
                   Gemini API
```

A production system could introduce:

* User authentication.
* Database.
* Viva history.
* Redis.
* Analytics.
* Rate limiting.
* Teacher dashboards.

---

# 20. Future Architecture

The future version can follow this architecture:

```text
+----------------------+
| Web / Mobile Client  |
+----------+-----------+
           |
           v
+----------------------+
| Backend REST API     |
+----------+-----------+
           |
    +------+------+
    |      |      |
    v      v      v
  Auth   Viva   Analytics
    |      |      |
    +------+------+
           |
           v
      PostgreSQL/
       MongoDB
           |
           v
      AI Gateway
           |
           v
       Gemini API
```

This architecture would allow the system to support:

* Multiple users.
* Persistent user accounts.
* Viva history.
* Personalized questions.
* Performance analytics.
* Teacher/admin accounts.
* Secure API integration.

---

# 21. Architectural Decisions

## Why a modular architecture?

The project contains multiple independent responsibilities such as visualization, AI examination, and UI management. Separating these responsibilities makes the application easier to understand and maintain.

## Why simulation mode?

The application should not completely depend on an external AI service. Simulation mode provides a working fallback.

## Why structured AI responses?

Structured responses make it easier for the frontend to reliably process:

```text
Question
Feedback
Score
Topic
Concepts
Hint
```

## Why separate visualizers?

Different programming concepts require different runtime models. Separate visualizer logic keeps the implementation organized and makes adding new topics easier.

---

# 22. Conclusion

The AI Viva Examiner uses a modular client-side architecture consisting of a presentation layer, application controller, examiner engine, simulation engine, and visualization engine.

The system provides an interactive learning workflow where students can first understand a programming concept visually and then test their knowledge through an AI-powered viva.

The architecture is intentionally lightweight for educational use while providing a clear path toward a production system with backend services, authentication, database persistence, analytics, and secure AI integration.
