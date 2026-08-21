// Topic Visualizers module for VivaSphere
const Visualizers = {
  activeTopic: 'closures',
  states: {}, // holds state for current visualizer

  // Set up and render a topic visualizer
  init(topicId, containerEl, explanationEl) {
    this.activeTopic = topicId;
    this.states[topicId] = this.getInitialState(topicId);
    
    // Render the visualizer structure
    containerEl.innerHTML = this.getMarkup(topicId);
    explanationEl.innerHTML = this.getExplanation(topicId);
    
    // Bind events specific to this visualizer
    this.bindEvents(topicId);
    
    // Perform initial update
    this.updateUI(topicId);
  },

  // Reset current visualizer state
  reset(topicId) {
    this.states[topicId] = this.getInitialState(topicId);
    this.updateUI(topicId);
    
    // Clear terminal/console outputs
    const consoleEl = document.getElementById(`${topicId}-console`);
    if (consoleEl) consoleEl.innerHTML = '';
    const termOut = document.getElementById('git-terminal-output');
    if (termOut) termOut.innerHTML = 'Repository initialized. Ready.';
  },

  // Trigger next step in visualizer
  step(topicId) {
    const state = this.states[topicId];
    if (!state) return;
    
    this.performStepLogic(topicId, state);
    this.updateUI(topicId);
  },

  // Get initial state structures
  getInitialState(topicId) {
    switch (topicId) {
      case 'closures':
        return {
          step: 0,
          stack: [],
          heap: {},
          console: [],
          maxSteps: 8
        };
      case 'hoisting':
        return {
          step: 0,
          phase: 'compilation', // compilation or execution
          memory: {
            'username': 'Uninitialized (TDZ)',
            'score': 'Uninitialized (TDZ)',
            'showMsg': 'Function showMsg()'
          },
          console: [],
          maxSteps: 6
        };
      case 'eventloop':
        return {
          step: 0,
          stack: [],
          webapis: [],
          microtasks: [],
          macrotasks: [],
          console: [],
          spinning: false,
          maxSteps: 12
        };
      case 'promises':
        return {
          step: 0,
          callbackLogs: [],
          promiseLogs: [],
          callbackActiveStep: 0,
          promiseActiveStep: 0,
          maxSteps: 5
        };
      case 'git':
        return {
          history: [
            { id: 'c1', label: 'Initial Commit', branch: 'main', parent: null, x: 80, y: 120 }
          ],
          branches: { 'main': 'c1' },
          head: 'main',
          terminalHistory: ['Initialized empty Git repository in /workspace/.git/'],
          commitCount: 1
        };
    }
  },

  // HTML Markups for each visualizer
  getMarkup(topicId) {
    switch (topicId) {
      case 'closures':
        return `
          <div class="visualizer-split">
            <div class="vis-left">
              <div class="closures-sandbox">
                <div class="environment-diagram" id="closures-diagram">
                  <!-- Generated Dynamically -->
                </div>
                <div class="closures-console" id="closures-console"></div>
              </div>
              <div class="vis-controls">
                <button class="btn-control primary-control" id="btn-closures-step">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
                  Next Step
                </button>
                <button class="btn-control" id="btn-closures-reset">Reset Simulation</button>
              </div>
            </div>
            <div class="vis-right">
              <div class="code-panel-header">
                <span>counter.js</span>
                <span>Closures Demo</span>
              </div>
              <pre class="code-block" id="closures-code"><code><span class="line" data-line="1">function initCounter() {</span>
<span class="line" data-line="2">  let count = 0;</span>
<span class="line" data-line="3">  return {</span>
<span class="line" data-line="4">    add: function() {</span>
<span class="line" data-line="5">      count++;</span>
<span class="line" data-line="6">      return count;</span>
<span class="line" data-line="7">    }</span>
<span class="line" data-line="8">  };</span>
<span class="line" data-line="9">}</span>
<span class="line" data-line="10">const myCounter = initCounter();</span>
<span class="line" data-line="11">myCounter.add(); // Call 1</span>
<span class="line" data-line="12">myCounter.add(); // Call 2</span></code></pre>
            </div>
          </div>
        `;
      case 'hoisting':
        return `
          <div class="visualizer-split">
            <div class="vis-left">
              <div class="hoisting-sandbox">
                <div class="hoisting-phase-indicator" id="hoisting-phase-box">
                  <!-- Generated Dynamically -->
                </div>
                <div class="memory-table-container">
                  <h4>Memory Allocation (Call Stack Context)</h4>
                  <table class="memory-table">
                    <thead>
                      <tr>
                        <th>Identifier</th>
                        <th>Type</th>
                        <th>Value in Memory</th>
                      </tr>
                    </thead>
                    <tbody id="hoisting-memory-body">
                      <!-- Generated Dynamically -->
                    </tbody>
                  </table>
                </div>
                <div class="closures-console" id="hoisting-console" style="height: 100px;"></div>
              </div>
              <div class="vis-controls">
                <button class="btn-control primary-control" id="btn-hoisting-step">
                  Next Step
                </button>
                <button class="btn-control" id="btn-hoisting-reset">Reset</button>
              </div>
            </div>
            <div class="vis-right">
              <div class="code-panel-header">
                <span>hoisting.js</span>
                <span>Hoisting Scope</span>
              </div>
              <pre class="code-block" id="hoisting-code"><code><span class="line" data-line="1">console.log(username); // Var hoisting</span>
<span class="line" data-line="2">console.log(score);    // Let Temporal Dead Zone</span>
<span class="line" data-line="3">showMsg();             // Function hoisting</span>
<span class="line" data-line="4"></span>
<span class="line" data-line="5">var username = "Kavya";</span>
<span class="line" data-line="6">let score = 95;</span>
<span class="line" data-line="7">function showMsg() {</span>
<span class="line" data-line="8">  console.log("Hello!");</span>
<span class="line" data-line="9">}</span></code></pre>
            </div>
          </div>
        `;
      case 'eventloop':
        return `
          <div class="visualizer-split">
            <div class="vis-left">
              <div class="eventloop-sandbox">
                <div class="eventloop-grid">
                  <div class="el-box" id="el-stack-box">
                    <h4>Call Stack</h4>
                    <div class="stack-items" id="eventloop-stack"></div>
                  </div>
                  <div class="el-box" id="el-webapi-box">
                    <h4>Web APIs (Timer)</h4>
                    <div class="stack-items" id="eventloop-webapi" style="flex-direction:column;"></div>
                  </div>
                  <div class="el-box" id="el-micro-box">
                    <h4>Microtask Queue (Promises)</h4>
                    <div class="queue-items" id="eventloop-micro"></div>
                  </div>
                  <div class="el-box" id="el-macro-box" style="grid-column: span 3;">
                    <h4>Callback Queue / Macrotasks (setTimeout)</h4>
                    <div class="queue-items" id="eventloop-macro"></div>
                  </div>
                </div>
                <div class="eventloop-wheel-container">
                  <div class="el-wheel-pointer">EVENT LOOP</div>
                  <div class="eventloop-wheel" id="eventloop-wheel">🔄</div>
                </div>
                <div class="closures-console" id="eventloop-console" style="height: 80px;"></div>
              </div>
              <div class="vis-controls">
                <button class="btn-control primary-control" id="btn-eventloop-step">
                  Next Loop Iteration
                </button>
                <button class="btn-control" id="btn-eventloop-reset">Reset</button>
              </div>
            </div>
            <div class="vis-right">
              <div class="code-panel-header">
                <span>event-loop.js</span>
              </div>
              <pre class="code-block" id="eventloop-code"><code><span class="line" data-line="1">console.log("A");</span>
<span class="line" data-line="2">setTimeout(() => {</span>
<span class="line" data-line="3">  console.log("B");</span>
<span class="line" data-line="4">}, 100);</span>
<span class="line" data-line="5">Promise.resolve().then(() => {</span>
<span class="line" data-line="6">  console.log("C");</span>
<span class="line" data-line="7">});</span>
<span class="line" data-line="8">console.log("D");</span></code></pre>
            </div>
          </div>
        `;
      case 'promises':
        return `
          <div class="visualizer-split">
            <div class="vis-left">
              <div class="promises-sandbox">
                <div class="timeline-split">
                  <div class="timeline-track-card">
                    <h4>Callbacks (Callback Hell)</h4>
                    <div class="timeline-visual" id="callbacks-timeline"></div>
                  </div>
                  <div class="timeline-track-card">
                    <h4>Promises (Async / Await Flow)</h4>
                    <div class="timeline-visual" id="promises-timeline"></div>
                  </div>
                </div>
                <div class="closures-console" id="promises-console" style="height: 60px;"></div>
              </div>
              <div class="vis-controls">
                <button class="btn-control primary-control" id="btn-promises-step">
                  Step Async Code
                </button>
                <button class="btn-control" id="btn-promises-reset">Reset</button>
              </div>
            </div>
            <div class="vis-right" style="flex: 1.1;">
              <div class="code-panel-header">
                <span>Callback Hell vs Promise Chain</span>
              </div>
              <div style="display:flex; flex: 1; overflow: hidden;">
                <pre class="code-block" id="callbacks-code" style="border-right: 1px solid var(--border-light); flex: 1;"><code><span class="line" data-c-line="1">// Cascading callbacks</span>
<span class="line" data-c-line="2">getUser(id, (user) => {</span>
<span class="line" data-c-line="3">  getOrders(user.id, (ord) => {</span>
<span class="line" data-c-line="4">    getDetails(ord[0], (det) => {</span>
<span class="line" data-c-line="5">      console.log(det);</span>
<span class="line" data-c-line="6">    });</span>
<span class="line" data-c-line="7">  });</span>
<span class="line" data-c-line="8">});</span></code></pre>
                <pre class="code-block" id="promises-code" style="flex: 1;"><code><span class="line" data-p-line="1">// Linear async-await</span>
<span class="line" data-p-line="2">const usr = await getUser(id);</span>
<span class="line" data-p-line="3">const ord = await getOrders(usr.id);</span>
<span class="line" data-p-line="4">const det = await getDetails(ord[0]);</span>
<span class="line" data-p-line="5">console.log(det);</span></code></pre>
              </div>
            </div>
          </div>
        `;
      case 'git':
        return `
          <div class="visualizer-split">
            <div class="vis-left">
              <div class="git-sandbox">
                <div class="git-workspace-graph" id="git-graph-stage">
                  <svg width="100%" height="100%" id="git-svg"></svg>
                </div>
                <div class="git-commands-quick">
                  <button class="btn-git-quick" data-cmd="commit">git commit -m "Work"</button>
                  <button class="btn-git-quick" data-cmd="branch">git branch feature</button>
                  <button class="btn-git-quick" data-cmd="checkout-feature">git checkout feature</button>
                  <button class="btn-git-quick" data-cmd="checkout-main">git checkout main</button>
                  <button class="btn-git-quick" data-cmd="merge">git merge feature</button>
                </div>
                <div class="git-terminal-sim">
                  <div class="terminal-output" id="git-terminal-output">
                    Repository initialized on branch 'main'.
                  </div>
                  <div class="terminal-input-line">
                    <span class="prompt-symbol">$</span>
                    <input type="text" id="git-terminal-input" placeholder="Type a git command...">
                  </div>
                </div>
              </div>
              <div class="vis-controls">
                <button class="btn-control" id="btn-git-reset">Reset Repository</button>
              </div>
            </div>
            <div class="vis-right" style="flex: 0.6;">
              <div class="code-panel-header">
                <span>Git Status</span>
              </div>
              <pre class="code-block" style="font-size:0.75rem;"><code>HEAD: <span id="git-head-val" style="color:var(--primary); font-weight:700;">main</span>
Branches:
- <span id="git-branches-list" style="color:var(--secondary);">main</span>

Workflow Instructions:
1. Try commits on main
2. Spawn 'feature' branch
3. Checkout feature, add commits
4. Switch back to main, merge!</code></pre>
            </div>
          </div>
        `;
    }
  },

  // Perform steps
  performStepLogic(topicId, state) {
    if (state.step >= state.maxSteps) {
      state.step = 0; // loop simulation
      this.reset(topicId);
      return;
    }
    state.step++;

    switch (topicId) {
      case 'closures':
        this.runClosuresStep(state);
        break;
      case 'hoisting':
        this.runHoistingStep(state);
        break;
      case 'eventloop':
        this.runEventLoopStep(state);
        break;
      case 'promises':
        this.runPromisesStep(state);
        break;
    }
  },

  // STEP: Closures
  runClosuresStep(state) {
    switch (state.step) {
      case 1: // initCounter() called
        state.stack = ['initCounter()'];
        state.heap = {};
        state.console.push('Executing: initCounter() called');
        break;
      case 2: // variable count created in local environment
        state.stack = ['initCounter()'];
        state.heap = {};
        state.console.push('Memory Allocated: let count = 0 inside initCounter scope');
        break;
      case 3: // returning counter object
        state.stack = ['initCounter()'];
        state.heap = { count: 0 };
        state.console.push('initCounter returns add() function. Scope is preserved in Heap.');
        break;
      case 4: // initCounter returns. stack frame popped
        state.stack = [];
        state.heap = { count: 0 };
        state.console.push('initCounter stack frame popped! count=0 survives in Closure Heap.');
        break;
      case 5: // first myCounter.add() call
        state.stack = ['add()'];
        state.heap = { count: 1 };
        state.console.push('myCounter.add() called: count incremented to 1');
        break;
      case 6: // first myCounter.add() return
        state.stack = [];
        state.console.push('myCounter.add() returned: 1');
        break;
      case 7: // second myCounter.add() call
        state.stack = ['add()'];
        state.heap = { count: 2 };
        state.console.push('myCounter.add() called: outer count variable incremented to 2');
        break;
      case 8: // second return
        state.stack = [];
        state.console.push('myCounter.add() returned: 2');
        break;
    }
  },

  // STEP: Hoisting
  runHoistingStep(state) {
    switch (state.step) {
      case 1: // Compilation phase ends, Execution starts
        state.phase = 'execution';
        state.console.push('Execution Phase begins line-by-line...');
        break;
      case 2: // console.log(username)
        state.console.push('Line 1: console.log(username) reads var from memory -> Output: undefined');
        break;
      case 3: // console.log(score)
        state.console.push('Line 2: console.log(score) attempts access in TDZ -> Throws ReferenceError!');
        break;
      case 4: // showMsg() call
        state.console.push('Line 3: showMsg() called -> Outputs: "Hello!" (Function was fully hoisted)');
        break;
      case 5: // username assignment
        state.memory['username'] = '"Kavya"';
        state.console.push('Line 5: username initialized -> Value in memory set to "Kavya"');
        break;
      case 6: // score assignment
        state.memory['score'] = '95 (TDZ Cleared)';
        state.console.push('Line 6: score initialized -> Value set to 95. TDZ Cleared.');
        break;
    }
  },

  // STEP: Event Loop
  runEventLoopStep(state) {
    switch (state.step) {
      case 1:
        state.stack = ['console.log("A")'];
        state.console.push('Call Stack: Pushing console.log("A")');
        break;
      case 2:
        state.stack = [];
        state.console.push('Console Log output: "A"');
        break;
      case 3:
        state.stack = ['setTimeout(...)'];
        state.console.push('Call Stack: Pushing setTimeout()');
        break;
      case 4:
        state.stack = [];
        state.webapis = ['Timeout Callback (100ms)'];
        state.console.push('Web API: Timer registered, setTimeout popped from Call Stack');
        break;
      case 5:
        state.stack = ['Promise.then(...)'];
        state.console.push('Call Stack: Pushing Promise handler');
        break;
      case 6:
        state.stack = [];
        state.microtasks = ['Promise Callback () => log("C")'];
        state.console.push('Microtask Queue: Promise resolves and queues C callback');
        break;
      case 7:
        state.stack = ['console.log("D")'];
        state.console.push('Call Stack: Pushing console.log("D")');
        break;
      case 8:
        state.stack = [];
        state.console.push('Console Log output: "D"');
        // also simulate timer finishing
        state.webapis = [];
        state.macrotasks = ['setTimeout Callback () => log("B")'];
        state.console.push('Web API: Timer expired. B callback moved to Macrotask Queue.');
        break;
      case 9:
        state.spinning = true;
        state.console.push('Event Loop checks: Call Stack is empty. Checking Microtask Queue first.');
        break;
      case 10:
        state.spinning = false;
        state.microtasks = [];
        state.stack = ['Promise Callback'];
        state.console.push('Call Stack: Execute microtask callback -> Output: "C"');
        break;
      case 11:
        state.stack = [];
        state.spinning = true;
        state.console.push('Event Loop checks: Microtask Queue empty. Checking Macrotask Queue next.');
        break;
      case 12:
        state.spinning = false;
        state.macrotasks = [];
        state.stack = ['Timeout Callback'];
        state.console.push('Call Stack: Execute macrotask callback -> Output: "B"');
        break;
    }
  },

  // STEP: Promises vs Callbacks
  runPromisesStep(state) {
    switch (state.step) {
      case 1:
        state.callbackActiveStep = 2;
        state.promiseActiveStep = 2;
        state.callbackLogs.push('Initiating getUser(id)');
        state.promiseLogs.push('getUser(id) -> returns Promise');
        state.console.push('Step 1: Pushed user request in both flows.');
        break;
      case 2:
        state.callbackActiveStep = 3;
        state.promiseActiveStep = 3;
        state.callbackLogs.push('└─ Callback returned. Initiating getOrders(user.id)');
        state.promiseLogs.push('usr resolved. Initiating getOrders(usr.id)');
        state.console.push('Step 2: Nesting depth increases in Callback flow.');
        break;
      case 3:
        state.callbackActiveStep = 4;
        state.promiseActiveStep = 4;
        state.callbackLogs.push('   └─ Callback returned. Initiating getDetails(ord[0])');
        state.promiseLogs.push('ord resolved. Initiating getDetails(ord[0])');
        state.console.push('Step 3: Callback Hell nested 3 layers deep. Promises remain flat.');
        break;
      case 4:
        state.callbackActiveStep = 5;
        state.promiseActiveStep = 5;
        state.callbackLogs.push('      └─ Output details: {id: 45, items: [...]}');
        state.promiseLogs.push('det resolved. Output details: {id: 45, items: [...]}');
        state.console.push('Step 4: Executions finished.');
        break;
      case 5:
        state.callbackActiveStep = 0;
        state.promiseActiveStep = 0;
        state.console.push('Completed comparison.');
        break;
    }
  },

  // Update DOM structures based on state
  updateUI(topicId) {
    const state = this.states[topicId];
    if (!state) return;

    // Handle code line highlighting
    this.highlightCodeLines(topicId, state);

    switch (topicId) {
      case 'closures':
        this.updateClosuresUI(state);
        break;
      case 'hoisting':
        this.updateHoistingUI(state);
        break;
      case 'eventloop':
        this.updateEventLoopUI(state);
        break;
      case 'promises':
        this.updatePromisesUI(state);
        break;
      case 'git':
        this.updateGitUI(state);
        break;
    }
  },

  // Highlight lines of code based on current simulation step
  highlightCodeLines(topicId, state) {
    const codeBlock = document.getElementById(`${topicId}-code`);
    if (!codeBlock) return;
    
    // Clear old highlights
    const lines = codeBlock.querySelectorAll('.line');
    lines.forEach(l => l.classList.remove('line-highlight'));

    let activeLine = 0;

    if (topicId === 'closures') {
      const stepMap = [10, 1, 2, 3, 10, 11, 11, 12, 12];
      activeLine = stepMap[state.step] || 0;
    } else if (topicId === 'hoisting') {
      const stepMap = [0, 1, 1, 2, 3, 5, 6];
      activeLine = stepMap[state.step] || 0;
    } else if (topicId === 'eventloop') {
      const stepMap = [0, 1, 1, 2, 2, 5, 5, 8, 8, 5, 5, 2, 2];
      activeLine = stepMap[state.step] || 0;
    }

    if (activeLine > 0) {
      const targetLine = codeBlock.querySelector(`[data-line="${activeLine}"]`);
      if (targetLine) targetLine.classList.add('line-highlight');
    }
  },

  // RENDER: Closures UI
  updateClosuresUI(state) {
    const container = document.getElementById('closures-diagram');
    if (!container) return;

    let html = '';

    // Render stack frame
    if (state.stack.length > 0) {
      html += `
        <div class="stack-frame active">
          <div class="frame-title">Stack Frame</div>
          <div class="variable-row">
            <span>Context:</span>
            <span class="variable-val">${state.stack[0]}</span>
          </div>
          ${state.step === 2 ? `
            <div class="variable-row">
              <span>let count</span>
              <span class="variable-val">0</span>
            </div>
          ` : ''}
        </div>
        <div class="connector-arrow">➡️</div>
      `;
    }

    // Render heap closures
    if (Object.keys(state.heap).length > 0 || state.step >= 3) {
      html += `
        <div class="heap-bubble">
          <div class="bubble-title">Scope: initCounter</div>
          <div class="variable-row">
            <span>count</span>
            <span class="variable-val">${state.heap.count !== undefined ? state.heap.count : 0}</span>
          </div>
          <div class="variable-row" style="opacity: 0.6; font-size: 0.7rem;">
            <span>[[OuterScope]]</span>
            <span>Global</span>
          </div>
        </div>
      `;
    }

    if (html === '') {
      html = '<div style="color:var(--text-muted); font-style:italic;">Call Stack and Scope Heap are empty. Click Next Step.</div>';
    }

    container.innerHTML = html;

    // Update simulation console log
    const consoleEl = document.getElementById('closures-console');
    if (consoleEl && state.console.length > 0) {
      consoleEl.innerHTML = state.console.map(c => `<div>> ${c}</div>`).join('');
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }
  },

  // RENDER: Hoisting UI
  updateHoistingUI(state) {
    const phaseBox = document.getElementById('hoisting-phase-box');
    const memoryBody = document.getElementById('hoisting-memory-body');
    const consoleEl = document.getElementById('hoisting-console');

    if (!phaseBox || !memoryBody) return;

    // Render phase indicator
    if (state.phase === 'compilation') {
      phaseBox.innerHTML = `
        <span class="phase-badge compilation">Compilation Phase</span>
        <span class="phase-desc">Scanning script... Variable space allocated, initialized variables to undefined/TDZ.</span>
      `;
    } else {
      phaseBox.innerHTML = `
        <span class="phase-badge execution">Execution Phase</span>
        <span class="phase-desc">Running code step by step. Accessing and overwriting memory values.</span>
      `;
    }

    // Render memory table rows
    let tableHtml = '';
    const identifiers = ['username', 'score', 'showMsg'];
    const types = ['var', 'let', 'function'];

    identifiers.forEach((id, idx) => {
      let isHighlight = false;
      if (state.step === 5 && id === 'username') isHighlight = true;
      if (state.step === 6 && id === 'score') isHighlight = true;
      
      const val = state.memory[id];
      const valClass = val.includes('TDZ') ? 'tdz-active' : '';

      tableHtml += `
        <tr class="${isHighlight ? 'memory-row-highlight' : ''}">
          <td style="font-family:var(--font-mono); font-weight:600;">${id}</td>
          <td style="color:var(--text-muted); font-size:0.75rem;">${types[idx]}</td>
          <td class="${valClass}" style="font-family:var(--font-mono);">${val}</td>
        </tr>
      `;
    });
    memoryBody.innerHTML = tableHtml;

    // Update console
    if (consoleEl && state.console.length > 0) {
      consoleEl.innerHTML = state.console.map(c => `<div>> ${c}</div>`).join('');
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }
  },

  // RENDER: Event Loop UI
  updateEventLoopUI(state) {
    const stack = document.getElementById('eventloop-stack');
    const webapi = document.getElementById('eventloop-webapi');
    const micro = document.getElementById('eventloop-micro');
    const macro = document.getElementById('eventloop-macro');
    const wheel = document.getElementById('eventloop-wheel');
    const consoleEl = document.getElementById('eventloop-console');

    if (!stack || !webapi || !micro || !macro) return;

    // Render stack
    stack.innerHTML = state.stack.map(s => `<div class="stack-frame-item">${s}</div>`).join('');
    
    // Render Web API
    webapi.innerHTML = state.webapis.map(w => `<div class="queue-item-badge" style="border-color:var(--warning);">${w}</div>`).join('');

    // Render queues
    micro.innerHTML = state.microtasks.map(m => `<div class="queue-item-badge micro">${m}</div>`).join('');
    macro.innerHTML = state.macrotasks.map(ma => `<div class="queue-item-badge">${ma}</div>`).join('');

    // Rotate Event Loop wheel
    if (wheel) {
      if (state.spinning) {
        wheel.classList.add('spinning');
      } else {
        wheel.classList.remove('spinning');
      }
    }

    // Update console
    if (consoleEl && state.console.length > 0) {
      consoleEl.innerHTML = state.console.map(c => `<div>> ${c}</div>`).join('');
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }
  },

  // RENDER: Promises vs Callbacks UI
  updatePromisesUI(state) {
    const cbTimeline = document.getElementById('callbacks-timeline');
    const prTimeline = document.getElementById('promises-timeline');
    const consoleEl = document.getElementById('promises-console');
    
    const cbCodeBlock = document.getElementById('callbacks-code');
    const prCodeBlock = document.getElementById('promises-code');

    if (!cbTimeline || !prTimeline) return;

    // Callback Steps render
    let cbHtml = '';
    const cbSteps = [
      { text: 'getUser(id)', nest: 0 },
      { text: 'getOrders(user.id)', nest: 1 },
      { text: 'getDetails(ord[0])', nest: 2 },
      { text: 'console.log(det)', nest: 3 }
    ];

    cbSteps.forEach((s, idx) => {
      const active = state.step > idx;
      cbHtml += `
        <div class="timeline-step ${active ? 'resolved-step' : ''} ${s.nest > 0 ? `nest-${s.nest}` : ''}">
          <span class="step-time">[L${idx+2}]</span>
          <span>${s.text}</span>
        </div>
      `;
    });
    cbTimeline.innerHTML = cbHtml;

    // Promises Steps render
    let prHtml = '';
    const prSteps = [
      { text: 'await getUser(id)', nest: 0 },
      { text: 'await getOrders(usr.id)', nest: 0 },
      { text: 'await getDetails(ord[0])', nest: 0 },
      { text: 'console.log(det)', nest: 0 }
    ];

    prSteps.forEach((s, idx) => {
      const active = state.step > idx;
      prHtml += `
        <div class="timeline-step ${active ? 'resolved-step' : ''}">
          <span class="step-time">[L${idx+2}]</span>
          <span>${s.text}</span>
        </div>
      `;
    });
    prTimeline.innerHTML = prHtml;

    // Code highlights
    if (cbCodeBlock && prCodeBlock) {
      cbCodeBlock.querySelectorAll('.line').forEach(l => l.classList.remove('line-highlight'));
      prCodeBlock.querySelectorAll('.line').forEach(l => l.classList.remove('line-highlight'));

      if (state.step > 0 && state.step <= 4) {
        const cbLine = cbCodeBlock.querySelector(`[data-c-line="${state.step + 1}"]`);
        const prLine = prCodeBlock.querySelector(`[data-p-line="${state.step + 1}"]`);
        if (cbLine) cbLine.classList.add('line-highlight');
        if (prLine) prLine.classList.add('line-highlight');
      }
    }

    // Update logs console
    if (consoleEl && state.console.length > 0) {
      consoleEl.innerHTML = `<div>${state.console[state.console.length - 1]}</div>`;
    }
  },

  // RENDER: Git Workflow Graphic Node Renderer
  updateGitUI(state) {
    const svg = document.getElementById('git-svg');
    const branchesVal = document.getElementById('git-branches-list');
    const headVal = document.getElementById('git-head-val');
    
    if (!svg) return;

    svg.innerHTML = ''; // Clear SVG
    
    // Draw branches links/lines
    for (let i = 1; i < state.history.length; i++) {
      const commit = state.history[i];
      const parent = state.history.find(c => c.id === commit.parent);
      if (parent) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', parent.x);
        line.setAttribute('y1', parent.y);
        line.setAttribute('x2', commit.x);
        line.setAttribute('y2', commit.y);
        line.setAttribute('stroke', commit.branch === 'main' ? '#8b5cf6' : '#06b6d4');
        line.setAttribute('stroke-width', '3');
        svg.appendChild(line);
      }
    }

    // Draw nodes
    state.history.forEach(c => {
      // Circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', c.x);
      circle.setAttribute('cy', c.y);
      circle.setAttribute('r', '8');
      
      const isHeadCommit = state.branches[state.head] === c.id;
      circle.setAttribute('fill', isHeadCommit ? '#ec4899' : (c.branch === 'main' ? '#8b5cf6' : '#06b6d4'));
      if (isHeadCommit) {
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
      }
      svg.appendChild(circle);

      // Label text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', c.x - 15);
      text.setAttribute('y', c.y - 15);
      text.setAttribute('fill', '#f3f4f6');
      text.setAttribute('font-size', '10px');
      text.setAttribute('font-family', 'var(--font-mono)');
      text.textContent = `${c.id} (${c.label.substring(0, 7)})`;
      svg.appendChild(text);
    });

    // Draw branch labels
    Object.keys(state.branches).forEach((branchName, idx) => {
      const headCommitId = state.branches[branchName];
      const commit = state.history.find(c => c.id === headCommitId);
      if (commit) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', commit.x - 15);
        text.setAttribute('y', commit.y + 25);
        
        const isCurrentHead = state.head === branchName;
        text.setAttribute('fill', isCurrentHead ? '#ec4899' : '#9ca3af');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-size', '10px');
        text.textContent = `[${branchName}]${isCurrentHead ? ' *HEAD' : ''}`;
        svg.appendChild(text);
      }
    });

    // Update sidebar state text
    if (branchesVal) {
      branchesVal.textContent = Object.keys(state.branches).join(', ');
    }
    if (headVal) {
      headVal.textContent = state.head;
    }
  },

  // EXECUTE: git command run in terminal
  runGitCommand(cmdString) {
    const state = this.states['git'];
    if (!state) return;
    
    cmdString = cmdString.trim().replace(/\s+/g, ' ');
    const termOut = document.getElementById('git-terminal-output');
    
    let reply = `\n$ ${cmdString}`;
    
    if (cmdString === 'git commit' || cmdString.startsWith('git commit ')) {
      const branchName = state.head;
      const parentId = state.branches[branchName];
      const parentCommit = state.history.find(c => c.id === parentId);
      
      state.commitCount++;
      const commitId = 'c' + state.commitCount;
      const countX = parentCommit ? parentCommit.x + 80 : 80;
      const countY = branchName === 'main' ? 120 : 60;
      
      const newCommit = {
        id: commitId,
        label: `Commit ${state.commitCount}`,
        branch: branchName,
        parent: parentId,
        x: countX,
        y: countY
      };
      
      state.history.push(newCommit);
      state.branches[branchName] = commitId;
      
      reply += `\n[${branchName} ${commitId}] Commit created\n 1 file changed, 1 insertion(+)`;
      
    } else if (cmdString === 'git branch feature') {
      if (state.branches['feature']) {
        reply += '\nFatal: branch feature already exists.';
      } else {
        state.branches['feature'] = state.branches[state.head];
        reply += '\nBranch feature created.';
      }
      
    } else if (cmdString === 'git checkout feature') {
      if (!state.branches['feature']) {
        reply += '\nError: branch feature not found.';
      } else {
        state.head = 'feature';
        reply += '\nSwitched to branch \'feature\'.';
      }
      
    } else if (cmdString === 'git checkout main') {
      state.head = 'main';
      reply += '\nSwitched to branch \'main\'.';
      
    } else if (cmdString === 'git merge feature') {
      if (state.head !== 'main') {
        reply += '\nError: can only merge to main in this demo.';
      } else if (!state.branches['feature']) {
        reply += '\nError: nothing to merge.';
      } else {
        const featureCommit = state.branches['feature'];
        const mainCommit = state.branches['main'];
        
        if (featureCommit === mainCommit) {
          reply += '\nAlready up to date.';
        } else {
          // Merge Node
          state.commitCount++;
          const mergeId = 'c' + state.commitCount;
          
          const parentMain = state.history.find(c => c.id === mainCommit);
          const parentFeat = state.history.find(c => c.id === featureCommit);
          const mergeX = Math.max(parentMain.x, parentFeat.x) + 80;
          
          const mergeCommit = {
            id: mergeId,
            label: 'Merge commit',
            branch: 'main',
            parent: mainCommit, // connects to main path, we'll draw simple visual
            x: mergeX,
            y: 120
          };
          
          state.history.push(mergeCommit);
          
          // Add cross connect line for visual references (we will fake this by injecting parent links)
          // To draw visual line to feature commit too
          const extraLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          setTimeout(() => {
            const svg = document.getElementById('git-svg');
            if (svg) {
              const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
              line.setAttribute('x1', parentFeat.x);
              line.setAttribute('y1', parentFeat.y);
              line.setAttribute('x2', mergeX);
              line.setAttribute('y2', 120);
              line.setAttribute('stroke', '#06b6d4');
              line.setAttribute('stroke-width', '2');
              line.setAttribute('stroke-dasharray', '5,5');
              svg.appendChild(line);
            }
          }, 50);
          
          state.branches['main'] = mergeId;
          reply += `\nUpdating ${mainCommit.substring(0,6)}..${mergeId.substring(0,6)}\nFast-forward merge of branch 'feature'.`;
        }
      }
    } else {
      reply += `\nCommand '${cmdString}' not recognized. Try git commands from shortcuts.`;
    }
    
    if (termOut) {
      termOut.innerHTML += reply;
      termOut.scrollTop = termOut.scrollHeight;
    }
    this.updateUI('git');
  },

  // Event bindings
  bindEvents(topicId) {
    if (topicId === 'closures') {
      const stepBtn = document.getElementById('btn-closures-step');
      const resetBtn = document.getElementById('btn-closures-reset');
      
      if (stepBtn) stepBtn.addEventListener('click', () => this.step('closures'));
      if (resetBtn) resetBtn.addEventListener('click', () => this.reset('closures'));
      
    } else if (topicId === 'hoisting') {
      const stepBtn = document.getElementById('btn-hoisting-step');
      const resetBtn = document.getElementById('btn-hoisting-reset');
      
      if (stepBtn) stepBtn.addEventListener('click', () => this.step('hoisting'));
      if (resetBtn) resetBtn.addEventListener('click', () => this.reset('hoisting'));
      
    } else if (topicId === 'eventloop') {
      const stepBtn = document.getElementById('btn-eventloop-step');
      const resetBtn = document.getElementById('btn-eventloop-reset');
      
      if (stepBtn) stepBtn.addEventListener('click', () => this.step('eventloop'));
      if (resetBtn) resetBtn.addEventListener('click', () => this.reset('eventloop'));
      
    } else if (topicId === 'promises') {
      const stepBtn = document.getElementById('btn-promises-step');
      const resetBtn = document.getElementById('btn-promises-reset');
      
      if (stepBtn) stepBtn.addEventListener('click', () => this.step('promises'));
      if (resetBtn) resetBtn.addEventListener('click', () => this.reset('promises'));
      
    } else if (topicId === 'git') {
      const resetBtn = document.getElementById('btn-git-reset');
      if (resetBtn) resetBtn.addEventListener('click', () => this.reset('git'));
      
      // Bind shortcuts
      const shortcuts = document.querySelectorAll('.btn-git-quick');
      shortcuts.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const action = e.currentTarget.dataset.cmd;
          if (action === 'commit') this.runGitCommand('git commit');
          if (action === 'branch') this.runGitCommand('git branch feature');
          if (action === 'checkout-feature') this.runGitCommand('git checkout feature');
          if (action === 'checkout-main') this.runGitCommand('git checkout main');
          if (action === 'merge') this.runGitCommand('git merge feature');
        });
      });
      
      // Bind keyboard input
      const input = document.getElementById('git-terminal-input');
      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const val = input.value;
            if (val.trim()) {
              this.runGitCommand(val);
              input.value = '';
            }
          }
        });
      }
    }
  },

  // EXPLANATION: Markdown-like explanations for each concept
  getExplanation(topicId) {
    switch (topicId) {
      case 'closures':
        return `
          <p>A <strong>closure</strong> is the combination of a function bundled together (enclosed) with references to its surrounding state (the <strong>lexical environment</strong>). In JavaScript, closures are created every time a function is created, at function creation time.</p>
          <p>To use a closure, define a function inside another function and expose it (e.g., by returning it or passing it to another function). The inner function will have access to the variables in the outer function's scope, even after the outer function has finished executing.</p>
          <h4>Key Features in Simulation:</h4>
          <ul>
            <li>Notice how <code>initCounter()</code> is executed and popped off the Call Stack.</li>
            <li>Its local scope variable <code>count</code> persists in the Heap under the <strong>Closure Scope</strong> because the returned <code>add()</code> function still holds a reference to it.</li>
            <li>Each invocation of <code>myCounter.add()</code> goes up the scope chain to find and mutate this private variables scope.</li>
          </ul>
        `;
      case 'hoisting':
        return `
          <p><strong>Hoisting</strong> is JavaScript's default behavior of moving declarations to the top of the current scope (to the top of the current script or function) during the compilation/creation phase before the code is executed.</p>
          <h4>Rules of Hoisting:</h4>
          <ul>
            <li><strong>Variables declared with <code>var</code></strong> are hoisted and initialized to <code>undefined</code>. You can read them before definition without crashing, though they will return <code>undefined</code>.</li>
            <li><strong>Variables declared with <code>let</code> and <code>const</code></strong> are hoisted but remain <em>uninitialized</em>. The region between the start of the block and the declaration line is known as the <strong>Temporal Dead Zone (TDZ)</strong>. Accessing them in TDZ throws a <code>ReferenceError</code>.</li>
            <li><strong>Function declarations</strong> (e.g., <code>function showMsg() {...}</code>) are fully hoisted, meaning their complete definition is loaded into memory, allowing you to call them anywhere in their scope.</li>
            <li><strong>Function expressions</strong> (e.g., <code>var myFunc = () => {}</code>) follow variable hoisting rules depending on whether they use <code>var</code>, <code>let</code>, or <code>const</code>.</li>
          </ul>
        `;
      case 'eventloop':
        return `
          <p>JavaScript is a <strong>single-threaded</strong> language, meaning it can execute only one piece of code at a time. The <strong>Event Loop</strong> is the mechanism that allows JS to perform non-blocking asynchronous operations, offloading tasks like timers or fetch requests to the browser (Web APIs).</p>
          <h4>How the Event Loop operates:</h4>
          <ol>
            <li>Synchronous code executes on the <strong>Call Stack</strong>.</li>
            <li>Asynchronous calls (like <code>setTimeout</code>) are sent to the <strong>Web APIs</strong> container to wait.</li>
            <li>When the async event completes (timer expires, server responds), its callback is placed into the appropriate queue:
              <ul>
                <li><strong>Microtask Queue</strong>: High priority (Promises, MutationObservers).</li>
                <li><strong>Macrotask Queue / Callback Queue</strong>: Standard priority (timers, DOM events, fetch callbacks).</li>
              </ul>
            </li>
            <li>When the Call Stack is completely empty, the Event Loop activates.</li>
            <li>It processes <strong>all items</strong> in the Microtask Queue first, then picks <strong>one</strong> macrotask from the Macrotask Queue and repeats the cycle.</li>
          </ol>
        `;
      case 'promises':
        return `
          <p><strong>Promises vs Callbacks</strong> represents the evolution of handling asynchronous operations in JavaScript.</p>
          <h4>Callbacks:</h4>
          <ul>
            <li>A callback is simply a function passed as an argument to another function, to be called when the async work completes.</li>
            <li>When multiple asynchronous tasks depend on each other, they require deeply nested callbacks. This is known as <strong>Callback Hell</strong> or the <strong>Pyramid of Doom</strong>. It makes code highly coupled, difficult to read, and challenging to handle errors.</li>
          </ul>
          <h4>Promises:</h4>
          <ul>
            <li>A Promise represents a proxy for a value not necessarily known when the promise is created. It has three states: <code>pending</code>, <code>fulfilled</code>, or <code>rejected</code>.</li>
            <li>Promises allow you to chain operations using <code>.then()</code> or flatten them entirely using ES8 <code>async/await</code> syntax.</li>
            <li>This keeps the code flat, synchronous-looking, and allows unified error handling using <code>try/catch</code>.</li>
          </ul>
        `;
      case 'git':
        return `
          <p>A <strong>Git Workflow</strong> manages commits, branches, and merges in a project. Git is a distributed version control system that records snapshots of files as commits in a tree-like structure.</p>
          <h4>Key Commands in Simulation:</h4>
          <ul>
            <li><code>git commit</code>: Creates a new node (commit) on the current branch. HEAD moves to point to the new commit.</li>
            <li><code>git branch &lt;name&gt;</code>: Places a new branch pointer at the current commit. It does not switch you to it automatically.</li>
            <li><code>git checkout &lt;name&gt;</code>: Moves the active <strong>HEAD</strong> pointer to the selected branch, making it active for subsequent commits.</li>
            <li><code>git merge &lt;name&gt;</code>: Integrates commits from the target branch into the active branch. In our graph, this merges <code>feature</code> back into <code>main</code>, creating a merge commit connecting both lines of history.</li>
          </ul>
        `;
    }
  }
};
window.Visualizers = Visualizers;
