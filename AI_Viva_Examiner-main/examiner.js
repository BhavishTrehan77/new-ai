// Examiner module for VivaSphere
// Manages prompts, structured output schemas, Gemini API calls, and simulated mode

const Examiner = {
  apiKey: localStorage.getItem('gemini_api_key') || '',
  vivaTopic: 'all',
  vivaDifficulty: 'balanced',
  customInstructions: '',
  history: [], // Chat history in Gemini format: [{role: 'user'|'model', parts: [{text: '...'}]}]
  vivaActive: false,
  currentQuestion: '',
  currentHint: '',

  // System Prompts based on configuration (Prompt Engineering Demo)
  getSystemPrompt() {
    const toneMap = {
      friendly: "You are a friendly tech mentor. Keep questions encouraging, clear, and beginner-friendly. Give warm, constructive feedback.",
      balanced: "You are a professional tech interviewer. Keep questions direct, practical, and balanced. Evaluate like a standard code review.",
      strict: "You are a strict, nitpicky computer science professor. Challenge the user's edge cases, query precise terms, and score critically.",
      socratic: "You are a Socratic tutor. Do not answer questions directly. Probe the candidate's core concepts with thought-provoking questions."
    };

    const topicMap = {
      all: "Focus on testing core concepts including: JavaScript Closures, Hoisting, the Event Loop, Promises vs Callbacks, and Git Workflow practices.",
      closures: "Focus exclusively on JavaScript Closures. Ask about lexical environments, execution context scope retention, and private variable encapsulation.",
      hoisting: "Focus exclusively on JavaScript Hoisting. Test their knowledge on compilation vs execution phase, var/let/const hoisting, and the Temporal Dead Zone (TDZ).",
      eventloop: "Focus exclusively on the JavaScript Event Loop. Test Call Stack execution order, Web APIs timer offloading, and Microtask vs Macrotask Queue prioritization.",
      promises: "Focus exclusively on Callbacks vs Promises. Ask about Callback Hell, the Pyramid of Doom, Promise states, async-await readability, and error propagation.",
      git: "Focus exclusively on Git Workflows. Query branching strategies, local vs remote state, HEAD pointers, fast-forward vs merge commits, and conflicts."
    };

    let base = `${toneMap[this.vivaDifficulty]}
${topicMap[this.vivaTopic]}

YOUR CORE RULES:
1. Ask exactly ONE technical question at a time.
2. Under no circumstances should you generate code blocks longer than 5 lines.
3. Review their previous answer. Analyze correctness and determine if key concepts were mentioned.
4. Output your response strictly in the requested JSON structured schema. Do not output anything outside JSON.`;

    if (this.customInstructions.trim()) {
      base += `\nADDITIONAL INSTRUCTION: ${this.customInstructions}`;
    }

    return base;
  },

  // Structured Output Schema definition (Structured Outputs Demo)
  getSchema() {
    return {
      type: "OBJECT",
      properties: {
        feedback: {
          type: "STRING",
          description: "Analysis of the candidate's previous response. Highlight what they got right, and point out mistakes or missing terminology."
        },
        question: {
          type: "STRING",
          description: "The next targeted technical question for the viva."
        },
        scoreDelta: {
          type: "INTEGER",
          description: "Points to add: 1 for a good correct response, 0 for incomplete/neutral, -1 for totally incorrect or nonsense answer."
        },
        topicFocus: {
          type: "STRING",
          description: "The specific sub-concept targeted by this next question."
        },
        conceptsChecked: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "A list of critical technical terms or keywords mentioned by the candidate in their answer."
        },
        hint: {
          type: "STRING",
          description: "A helpful hint if they struggle or ask for assistance."
        }
      },
      required: ["feedback", "question", "scoreDelta", "topicFocus", "conceptsChecked", "hint"]
    };
  },

  // Initialize viva session
  startSession() {
    this.vivaActive = true;
    this.history = [];
    
    // Initial question generator
    if (this.apiKey) {
      return this.sendApiRequest("Hello, I am ready to begin the viva exam. Please ask me the first question.");
    } else {
      return this.simulateResponse("viva-start");
    }
  },

  // Send candidate answer to AI
  submitAnswer(answerText) {
    if (!this.vivaActive) return Promise.reject("No active viva session.");

    // Record user history
    this.history.push({
      role: 'user',
      parts: [{ text: answerText }]
    });

    if (this.apiKey) {
      return this.sendApiRequest(answerText);
    } else {
      return this.simulateResponse("user-reply", answerText);
    }
  },

  // Real API request to Gemini
  async sendApiRequest(userInput) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    
    const requestBody = {
      contents: this.history,
      systemInstruction: {
        parts: [{ text: this.getSystemPrompt() }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: this.getSchema()
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "HTTP request failed");
      }

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Update UI panels with raw structured output
      this.displayRawJson(textResponse);
      
      const parsed = JSON.parse(textResponse);
      
      // Update local history
      this.history.push({
        role: 'model',
        parts: [{ text: textResponse }]
      });

      this.currentQuestion = parsed.question;
      this.currentHint = parsed.hint;

      return parsed;
    } catch (e) {
      console.error(e);
      throw new Error(`API Error: ${e.message}. Falling back to simulation is recommended.`);
    }
  },

  // Update structured output visualizer
  displayRawJson(jsonText) {
    const responseEl = document.getElementById('json-response-view');
    if (responseEl) {
      try {
        const obj = JSON.parse(jsonText);
        responseEl.innerHTML = JSON.stringify(obj, null, 2);
      } catch (err) {
        responseEl.innerHTML = jsonText; // Show raw text if not JSON
      }
    }
  },

  // Offline high-quality simulation mode
  simulateResponse(trigger, userInput = '') {
    return new Promise((resolve) => {
      setTimeout(() => {
        let responseObj = {};
        
        if (trigger === "viva-start") {
          const topic = this.vivaTopic;
          let initialQ = "Let's begin the viva. Can you explain what a JavaScript closure is and why we might want to use one?";
          
          if (topic === 'hoisting') {
            initialQ = "Let's start. Can you explain what hoisting is in JavaScript, and what value a variable declared with 'var' has before its initialization line is hit?";
          } else if (topic === 'eventloop') {
            initialQ = "Welcome. Please explain what the Call Stack in the JavaScript Event Loop is, and how it handles asynchronous operations.";
          } else if (topic === 'promises') {
            initialQ = "Welcome to the viva. In asynchronous JavaScript, what is 'Callback Hell' (or the Pyramid of Doom) and how do Promises solve it?";
          } else if (topic === 'git') {
            initialQ = "Let's start the git portion. What is a commit in Git, and what does it mean when we checkout a branch?";
          }
          
          responseObj = {
            feedback: "Initialization successful. Starting viva.",
            question: initialQ,
            scoreDelta: 0,
            topicFocus: topic === 'all' ? 'Closures' : topic,
            conceptsChecked: [],
            hint: "Think about functions returning functions, or lexical variables escaping parent executions."
          };
        } else {
          // Simulation logic based on keywords
          const userLower = userInput.toLowerCase();
          const turn = this.history.filter(h => h.role === 'user').length;
          const topic = this.vivaTopic;

          let score = 0;
          let feedback = "";
          let nextQ = "";
          let nextFocus = "";
          let hint = "";
          let checked = [];

          // Evaluation checking keywords
          if (topic === 'closures' || (topic === 'all' && turn === 1)) {
            // Evaluated closures answer
            const keywords = ['lexical', 'environment', 'outer', 'inner', 'return', 'state', 'variables', 'encapsulation', 'private'];
            keywords.forEach(k => { if (userLower.includes(k)) checked.push(k); });

            if (checked.length >= 3) {
              score = 1;
              feedback = "Excellent explanation of closures. You correctly identified lexical environments and scoping.";
            } else if (checked.length > 0) {
              score = 0;
              feedback = "Decent start, but try to mention terms like 'lexical environment' or 'encapsulation' for a full explanation of closures.";
            } else {
              score = -1;
              feedback = "Incorrect or incomplete explanation of closures. A closure is a function that retains access to its lexical scope.";
            }

            nextQ = "Great. Let's move to Hoisting. What is the 'Temporal Dead Zone' (TDZ) and how does it affect variables declared with 'let' and 'const'?";
            nextFocus = "Hoisting / TDZ";
            hint = "Think about variables being loaded into memory during compilation but remaining uninitialized.";
          } 
          else if (topic === 'hoisting' || (topic === 'all' && turn === 2)) {
            // Evaluated hoisting answer
            const keywords = ['compilation', 'creation', 'execution', 'undefined', 'tdz', 'temporal dead zone', 'let', 'const', 'var', 'uninitialized'];
            keywords.forEach(k => { if (userLower.includes(k)) checked.push(k); });

            if (checked.length >= 3) {
              score = 1;
              feedback = "Perfect. You described variables in the Temporal Dead Zone being uninitialized during the compilation phase.";
            } else {
              score = 0;
              feedback = "Partial understanding. Note that let/const are hoisted but are uninitialized, triggering the TDZ, unlike var.";
            }

            nextQ = "Now explain the Event Loop: what is the difference in priority between the Microtask Queue and the Macrotask (Callback) Queue?";
            nextFocus = "Event Loop / Queues";
            hint = "Recall that Promises write to the microtask queue, while setTimeout writes to the callback/macrotask queue.";
          }
          else if (topic === 'eventloop' || (topic === 'all' && turn === 3)) {
            // Evaluated event loop
            const keywords = ['microtask', 'macrotask', 'stack', 'queue', 'promise', 'settimeout', 'priority', 'empty', 'loop'];
            keywords.forEach(k => { if (userLower.includes(k)) checked.push(k); });

            if (checked.length >= 3) {
              score = 1;
              feedback = "Spot on! Microtasks have absolute priority over macrotasks and are emptied first once the call stack is cleared.";
            } else {
              score = 0;
              feedback = "Acceptable. Keep in mind the event loop checks microtasks (promises) before moving to the callback queue (timers).";
            }

            nextQ = "Let's check Promises vs Callbacks. Why are async/await functions preferred over chaining multiple '.then()' blocks?";
            nextFocus = "Promises / Async-Await";
            hint = "Focus on readability, error handling syntax (try/catch), and linear flow.";
          }
          else if (topic === 'promises' || (topic === 'all' && turn === 4)) {
            // Evaluated promises vs callbacks
            const keywords = ['readability', 'read', 'flat', 'linear', 'nesting', 'try', 'catch', 'then', 'chaining', 'error'];
            keywords.forEach(k => { if (userLower.includes(k)) checked.push(k); });

            if (checked.length >= 2) {
              score = 1;
              feedback = "Correct! Async/await flattens nested chains and makes error handling unified with standard try/catch blocks.";
            } else {
              score = 0;
              feedback = "Good, but note that async/await provides a synchronous look and better try/catch error handling.";
            }

            nextQ = "Finally, let's talk Git. In git workflows, what is the difference between a merge commit and a fast-forward merge?";
            nextFocus = "Git Merge Workflows";
            hint = "A fast-forward merge just moves the pointer, while a merge commit creates a new node combining two historical paths.";
          }
          else {
            // Final Git or ending review
            const keywords = ['pointer', 'commit', 'branch', 'history', 'rebase', 'node', 'conflict'];
            keywords.forEach(k => { if (userLower.includes(k)) checked.push(k); });

            if (checked.length >= 2) {
              score = 1;
              feedback = "Correct. Fast-forward just moves branch pointers, whereas a merge commit explicitly records history merging.";
            } else {
              score = 0;
              feedback = "Decent. A fast-forward merge moves HEAD directly if there are no diverting commits.";
            }

            nextQ = "Congratulations, you have completed the tech viva! Feel free to review your visualizer Study Lab or restart the session.";
            nextFocus = "End of Exam";
            hint = "Reset the viva to test another topic.";
            this.vivaActive = false; // complete
          }

          responseObj = {
            feedback: feedback,
            question: nextQ,
            scoreDelta: score,
            topicFocus: nextFocus,
            conceptsChecked: checked,
            hint: hint
          };
        }

        // Record history
        this.history.push({
          role: 'model',
          parts: [{ text: JSON.stringify(responseObj) }]
        });

        this.currentQuestion = responseObj.question;
        this.currentHint = responseObj.hint;

        // Display raw mock JSON structured response
        this.displayRawJson(JSON.stringify(responseObj, null, 2));

        resolve(responseObj);
      }, 800);
    });
  }
};

window.Examiner = Examiner;
