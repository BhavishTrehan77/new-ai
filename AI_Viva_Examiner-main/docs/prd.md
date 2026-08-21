# Product Requirements Document (PRD)

## 1. Product Name

**AI Viva Examiner**

## 2. Product Overview

AI Viva Examiner is an interactive web application designed to help students prepare for technical vivas and interviews.

The application combines interactive JavaScript concept visualizations with an AI-powered viva examiner. Students can study a concept visually and then immediately test their understanding through viva questions.

The application also supports a simulation mode so that the viva functionality can work even when an AI API key is not available.

---

## 3. Problem Statement

Students often understand programming concepts theoretically but find it difficult to explain them during technical vivas.

Traditional learning resources generally provide only static explanations, while generic AI chat systems are not specifically designed to behave like technical examiners.

The AI Viva Examiner solves this problem by providing:

* Interactive concept visualization.
* Step-by-step execution explanations.
* AI-generated viva questions.
* Answer evaluation.
* Feedback and hints.
* Score tracking.
* Offline simulation when the AI API is unavailable.

---

## 4. Objectives

### Primary Objectives

1. Help students understand JavaScript concepts through visualization.
2. Simulate a technical viva environment.
3. Provide AI-based evaluation and feedback.
4. Allow students to practice questions based on selected topics.
5. Provide a fallback simulation mode without requiring an API key.

### Secondary Objectives

* Demonstrate prompt engineering.
* Demonstrate structured AI responses.
* Provide an interactive learning experience.
* Make the application simple enough to run locally.

---

## 5. Target Users

### Primary Users

* College students.
* JavaScript learners.
* Students preparing for technical vivas.
* Students preparing for frontend interviews.
* Beginners preparing for JavaScript interviews.

### Secondary Users

* Teachers.
* Mentors.
* Interviewers.
* Developers demonstrating AI-based educational applications.

---

## 6. Main Features

## 6.1 Study Lab

Study Lab allows users to select a programming concept and understand it through an interactive visualizer.

Supported concepts include:

* JavaScript Closures.
* JavaScript Hoisting.
* JavaScript Event Loop.
* Promises vs Callbacks.
* Async/Await.
* Git Workflow.

The visualizer provides:

* Source code.
* Step-by-step execution.
* Runtime state.
* Console output.
* Concept explanation.

---

## 6.2 Viva Arena

Viva Arena provides an interactive technical viva experience.

The user can:

* Select a topic.
* Select difficulty.
* Add custom examiner instructions.
* Start a viva session.
* Answer questions.
* Receive feedback.
* Request hints.
* View score.
* View answer streak.
* Continue with the next question.
* Reset the viva session.

---

## 6.3 AI Examiner

When the Gemini API is configured, the application uses AI to act as the technical examiner.

The examiner can:

* Generate technical questions.
* Evaluate student answers.
* Provide feedback.
* Identify concepts checked.
* Generate hints.
* Assign score changes.
* Ask follow-up questions.

---

## 6.4 Simulation Mode

The application also supports an offline simulation mode.

If the Gemini API key is unavailable, the system uses predefined topic-based evaluation logic.

The simulation:

1. Reads the student's answer.
2. Checks relevant keywords/concepts.
3. Determines answer quality.
4. Generates feedback.
5. Updates the score.
6. Provides a next question.
7. Provides a hint when required.

This ensures that the application remains usable without external AI access.

---

## 6.5 API Key Management

The application allows the user to:

* Enter a Gemini API key.
* Save the key locally.
* Clear the key.
* Use simulation mode when the key is unavailable.

The API key is stored using browser `localStorage` in the current implementation.

---

## 7. User Flow

### Study Flow

```text
Open Application
       ↓
Study Lab
       ↓
Select Topic
       ↓
Visualizer Loads
       ↓
Step Through Concept
       ↓
Understand Runtime Behaviour
       ↓
Quick Viva
       ↓
Viva Arena
```

### Viva Flow

```text
Open Viva Arena
       ↓
Select Topic
       ↓
Select Difficulty
       ↓
Add Instructions
       ↓
Start Viva
       ↓
Question Generated
       ↓
Student Answers
       ↓
Answer Evaluated
       ↓
Feedback + Score
       ↓
Next Question
```

---

## 8. Functional Requirements

### FR-01 — Navigation

The system shall allow users to switch between Study Lab and Viva Arena.

### FR-02 — Topic Selection

The system shall allow users to select from supported JavaScript and Git topics.

### FR-03 — Visualization

The system shall display topic-specific interactive visualizations.

### FR-04 — Viva Configuration

The system shall allow users to configure:

* Topic.
* Difficulty.
* Custom instructions.

### FR-05 — Viva Session

The system shall allow users to start, continue, and reset viva sessions.

### FR-06 — Answer Submission

The system shall allow users to submit answers to examiner questions.

### FR-07 — AI Evaluation

The system shall evaluate answers using Gemini when an API key is configured.

### FR-08 — Simulation Evaluation

The system shall evaluate answers using the local simulation engine when Gemini is unavailable.

### FR-09 — Feedback

The system shall display feedback for submitted answers.

### FR-10 — Score

The system shall update the student's score based on answer evaluation.

### FR-11 — Hint

The system shall provide topic-specific hints.

### FR-12 — Structured Response

The system shall process structured examiner responses containing information such as:

```text
question
feedback
scoreDelta
topicFocus
conceptsChecked
hint
```

---

## 9. Non-Functional Requirements

### Performance

* The application should respond quickly to user interactions.
* Topic switching should not require a full page reload.
* Visualizers should update smoothly.
* API calls should provide appropriate loading/error feedback.

### Usability

* The interface should be simple and understandable.
* Current topic and mode should be clearly visible.
* Controls should have meaningful labels.
* Errors should be displayed clearly.

### Maintainability

The application should separate:

* UI logic.
* Examiner logic.
* Visualization logic.
* Styling.

### Reliability

The application should continue working in simulation mode when the Gemini API is unavailable.

---

## 10. Out of Scope

The current version does not include:

* User authentication.
* User profiles.
* Database-backed viva history.
* Teacher dashboard.
* Multi-user classroom functionality.
* Voice-based viva.
* Automated code execution sandbox.
* Production-grade API-key security.

---

## 11. Success Criteria

The project will be considered successful if a user can:

1. Open the application.
2. Select a programming concept.
3. Understand the concept using the visualizer.
4. Start a viva for the same concept.
5. Answer technical questions.
6. Receive feedback.
7. Receive a score.
8. Continue with additional questions.
9. Use simulation mode when the AI API is unavailable.

---

## 12. Future Enhancements

Future versions may include:

* User authentication.
* Database integration.
* Viva history.
* Performance analytics.
* Adaptive difficulty.
* Voice-based viva.
* AI code evaluation.
* More JavaScript topics.
* DSA topics.
* Teacher/admin dashboard.
* Secure backend API integration.
* Personalized question generation.

---

## 13. Conclusion

AI Viva Examiner combines interactive learning with AI-powered assessment to create a practical environment for technical viva preparation.

The system is designed to help students move from **understanding a concept → visualizing it → explaining it → answering viva questions → receiving feedback**.
