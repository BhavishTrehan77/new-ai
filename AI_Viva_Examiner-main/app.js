// Main orchestrator for VivaSphere
document.addEventListener('DOMContentLoaded', () => {
  
  // Cache DOM elements
  const navBtnStudy = document.getElementById('nav-btn-study');
  const navBtnViva = document.getElementById('nav-btn-viva');
  const viewStudy = document.getElementById('view-study');
  const viewViva = document.getElementById('view-viva');
  
  const apiKeyToggle = document.getElementById('btn-api-key-toggle');
  const apiKeyDropdown = document.getElementById('api-key-dropdown');
  const inputApiKey = document.getElementById('input-api-key');
  const btnSaveKey = document.getElementById('btn-save-key');
  const btnClearKey = document.getElementById('btn-clear-key');
  const currentModeText = document.getElementById('current-mode-text');
  const statusDot = document.querySelector('.status-dot');
  
  const topicItems = document.querySelectorAll('.topic-item');
  const visualizerTitle = document.getElementById('visualizer-title');
  const visualizerStage = document.getElementById('visualizer-stage');
  const explanationContent = document.getElementById('explanation-content');
  const btnQuickViva = document.getElementById('btn-quick-viva');
  
  const selectDifficulty = document.getElementById('select-difficulty');
  const selectVivaTopic = document.getElementById('select-viva-topic');
  const systemPromptDisplay = document.getElementById('system-prompt-display');
  const customInstructions = document.getElementById('custom-instructions');
  const btnApplyPrompt = document.getElementById('btn-apply-prompt');
  
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const btnSendMessage = document.getElementById('btn-send-message');
  const btnStartSession = document.getElementById('btn-start-session');
  const btnGetHint = document.getElementById('btn-get-hint');
  const btnResetViva = document.getElementById('btn-reset-viva');
  const examinerStatus = document.getElementById('examiner-status');
  const avatarRing = document.querySelector('.avatar-ring');
  const topicsCheckedList = document.getElementById('topics-checked-list');
  const vivaScoreEl = document.getElementById('viva-score');
  const vivaStreakEl = document.getElementById('viva-streak');
  
  const tabBtnResponse = document.getElementById('tab-btn-response');
  const tabBtnSchema = document.getElementById('tab-btn-schema');
  const jsonResponseView = document.getElementById('json-response-view');
  const jsonSchemaView = document.getElementById('json-schema-view');

  let activeView = 'study';
  let activeTopic = 'closures';
  let totalScore = 0;
  let currentStreak = 0;

  // Initialize App
  function init() {
    // 1. Set API status from local storage
    if (Examiner.apiKey) {
      inputApiKey.value = Examiner.apiKey;
      setApiStatus(true);
    } else {
      setApiStatus(false);
    }

    // 2. Initialize default visualizer (Closures)
    Visualizers.init(activeTopic, visualizerStage, explanationContent);

    // 3. Update system prompt display text
    updateSystemPromptView();

    // 4. Register Event Listeners
    bindEvents();
  }

  // Bind all event listeners
  function bindEvents() {
    // View switching navigation
    navBtnStudy.addEventListener('click', () => switchView('study'));
    navBtnViva.addEventListener('click', () => switchView('viva'));

    // API settings toggle
    apiKeyToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      apiKeyDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!apiKeyDropdown.classList.contains('hidden') && !apiKeyDropdown.contains(e.target) && e.target !== apiKeyToggle) {
        apiKeyDropdown.classList.add('hidden');
      }
    });

    // Save/Clear API key
    btnSaveKey.addEventListener('click', () => {
      const key = inputApiKey.value.trim();
      if (key) {
        Examiner.apiKey = key;
        localStorage.setItem('gemini_api_key', key);
        setApiStatus(true);
        apiKeyDropdown.classList.add('hidden');
        appendSystemMessage("Switched to real Gemini API examiner.");
      }
    });
    btnClearKey.addEventListener('click', () => {
      Examiner.apiKey = '';
      localStorage.removeItem('gemini_api_key');
      inputApiKey.value = '';
      setApiStatus(false);
      apiKeyDropdown.classList.add('hidden');
      appendSystemMessage("Cleared API Key. Switched to offline simulation mode.");
    });

    // Topic Selection (Study Lab sidebar)
    topicItems.forEach(item => {
      item.addEventListener('click', (e) => {
        topicItems.forEach(i => i.classList.remove('active'));
        const itemEl = e.currentTarget;
        itemEl.classList.add('active');
        
        activeTopic = itemEl.dataset.topic;
        
        // Update Title text
        const niceNames = {
          closures: 'JavaScript Closures',
          hoisting: 'JavaScript Hoisting',
          eventloop: 'JavaScript Event Loop',
          promises: 'Promises vs Callbacks',
          git: 'Git Workflow Graph'
        };
        visualizerTitle.textContent = niceNames[activeTopic];
        
        // Initialize Visualizer
        Visualizers.init(activeTopic, visualizerStage, explanationContent);
      });
    });

    // Quick start viva test from Visualizer header
    btnQuickViva.addEventListener('click', () => {
      // Set viva focus to match current visualizer
      selectVivaTopic.value = activeTopic;
      Examiner.vivaTopic = activeTopic;
      updateSystemPromptView();
      
      // Go to viva screen and trigger start
      switchView('viva');
      startVivaSession();
    });

    // Prompt Engineering adjustments
    selectDifficulty.addEventListener('change', () => {
      Examiner.vivaDifficulty = selectDifficulty.value;
      updateSystemPromptView();
    });
    selectVivaTopic.addEventListener('change', () => {
      Examiner.vivaTopic = selectVivaTopic.value;
      updateSystemPromptView();
    });
    customInstructions.addEventListener('input', () => {
      Examiner.customInstructions = customInstructions.value;
      updateSystemPromptView();
    });
    btnApplyPrompt.addEventListener('click', () => {
      updateSystemPromptView();
      appendSystemMessage("System prompt updated. Settings will apply to subsequent AI requests.");
    });

    // Structured output tab buttons
    tabBtnResponse.addEventListener('click', () => {
      tabBtnResponse.classList.add('active');
      tabBtnSchema.classList.remove('active');
      jsonResponseView.classList.remove('hidden');
      jsonSchemaView.classList.add('hidden');
    });
    tabBtnSchema.addEventListener('click', () => {
      tabBtnSchema.classList.add('active');
      tabBtnResponse.classList.remove('active');
      jsonSchemaView.classList.remove('hidden');
      jsonResponseView.classList.add('hidden');
    });

    // AI Viva Arena Buttons
    btnStartSession.addEventListener('click', startVivaSession);
    btnResetViva.addEventListener('click', resetVivaSession);
    btnGetHint.addEventListener('click', getHint);

    btnSendMessage.addEventListener('click', sendUserMessage);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !chatInput.disabled) {
        e.preventDefault();
        sendUserMessage();
      }
    });
  }

  // Switch SPA Views
  function switchView(viewName) {
    activeView = viewName;
    if (viewName === 'study') {
      navBtnStudy.classList.add('active');
      navBtnViva.classList.remove('active');
      viewStudy.classList.add('active-view');
      viewViva.classList.remove('active-view');
    } else {
      navBtnViva.classList.add('active');
      navBtnStudy.classList.remove('active');
      viewViva.classList.add('active-view');
      viewStudy.classList.remove('active-view');
    }
  }

  // Set API display status labels
  function setApiStatus(isConnected) {
    if (isConnected) {
      statusDot.className = 'status-dot connected';
      currentModeText.textContent = "Running in Gemini API Mode";
      document.getElementById('api-status-label').textContent = "API Key Active";
    } else {
      statusDot.className = 'status-dot simulated';
      currentModeText.textContent = "Running in Simulation Mode";
      document.getElementById('api-status-label').textContent = "API Key";
    }
  }

  // Update prompt textbox display
  function updateSystemPromptView() {
    systemPromptDisplay.value = Examiner.getSystemPrompt();
  }

  // START VIVA SESSION
  function startVivaSession() {
    btnStartSession.style.display = 'none';
    chatInput.removeAttribute('disabled');
    btnSendMessage.removeAttribute('disabled');
    btnGetHint.removeAttribute('disabled');
    
    chatMessages.innerHTML = '';
    appendSystemMessage("Viva Session Initiated. Waiting for examiner question...");
    
    setLoadingState(true);
    
    Examiner.startSession()
      .then(res => {
        setLoadingState(false);
        appendAiBubble(res.question);
        topicsCheckedList.textContent = `Focus: ${res.topicFocus}`;
      })
      .catch(err => {
        setLoadingState(false);
        appendSystemMessage(`Error: ${err.message}. Consider switching to Simulated Mode.`);
        btnStartSession.style.display = 'block';
      });
  }

  // RESET VIVA SESSION
  function resetVivaSession() {
    totalScore = 0;
    currentStreak = 0;
    vivaScoreEl.textContent = '0';
    vivaScoreEl.className = 'score-value';
    vivaStreakEl.textContent = '0';
    topicsCheckedList.textContent = 'Topic: Not started';
    
    Examiner.vivaActive = false;
    btnStartSession.style.display = 'block';
    chatInput.setAttribute('disabled', 'true');
    btnSendMessage.setAttribute('disabled', 'true');
    btnGetHint.setAttribute('disabled', 'true');
    
    chatMessages.innerHTML = `
      <div class="system-bubble">
        Viva reset. Adjust settings and click <strong>Start Viva Session</strong> to begin a new round.
      </div>
    `;
    examinerStatus.textContent = 'Ready to start viva';
  }

  // GET HINT
  function getHint() {
    if (Examiner.currentHint) {
      appendSystemMessage(`💡 Hint: ${Examiner.currentHint}`);
    } else {
      appendSystemMessage("💡 Hint: Think about how variables behave in memory for this topic.");
    }
  }

  // SUBMIT CANDIDATE MESSAGE
  function sendUserMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    appendUserBubble(text);
    setLoadingState(true);

    Examiner.submitAnswer(text)
      .then(res => {
        setLoadingState(false);
        
        // Handle delta points scoring
        handleScore(res.scoreDelta);
        
        // Append response (with assessment evaluation block inside)
        appendAiBubble(res.question, res.feedback, res.scoreDelta, res.conceptsChecked);
        
        // Update topics focus label
        topicsCheckedList.textContent = `Focus: ${res.topicFocus}`;
      })
      .catch(err => {
        setLoadingState(false);
        appendSystemMessage(`Error processing response: ${err.message}`);
      });
  }

  // Handle Score State updates
  function handleScore(delta) {
    totalScore += delta;
    vivaScoreEl.textContent = totalScore;
    
    if (delta > 0) {
      currentStreak++;
      vivaScoreEl.className = 'score-value correct';
    } else if (delta < 0) {
      currentStreak = 0;
      vivaScoreEl.className = 'score-value incorrect';
    } else {
      vivaScoreEl.className = 'score-value';
    }
    
    vivaStreakEl.textContent = currentStreak;
  }

  // UI state while API is calling
  function setLoadingState(isLoading) {
    if (isLoading) {
      chatInput.setAttribute('disabled', 'true');
      btnSendMessage.setAttribute('disabled', 'true');
      examinerStatus.textContent = 'Dr. Gemini is typing...';
      avatarRing.classList.add('pulsing');
    } else {
      chatInput.removeAttribute('disabled');
      btnSendMessage.removeAttribute('disabled');
      examinerStatus.textContent = 'Waiting for your answer...';
      avatarRing.classList.remove('pulsing');
      chatInput.focus();
    }
  }

  // Append bubbles to UI
  function appendSystemMessage(msg) {
    const div = document.createElement('div');
    div.className = 'system-bubble';
    div.innerHTML = msg;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendUserBubble(msg) {
    const div = document.createElement('div');
    div.className = 'msg-bubble msg-user';
    div.textContent = msg;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendAiBubble(question, feedback = '', scoreDelta = 0, concepts = []) {
    const div = document.createElement('div');
    div.className = 'msg-bubble msg-ai';
    
    let html = '';

    // If this bubble contains feedback on the *previous* answer, render it elegantly
    if (feedback) {
      let ratingClass = 'partial';
      let ratingLabel = 'Partial Answer';
      if (scoreDelta > 0) { ratingClass = 'correct'; ratingLabel = 'Correct!'; }
      if (scoreDelta < 0) { ratingClass = 'incorrect'; ratingLabel = 'Incorrect'; }

      html += `
        <span class="feedback-tag ${ratingClass}">${ratingLabel}</span>
        <div class="feedback-text">"${feedback}"</div>
      `;

      if (concepts.length > 0) {
        html += `
          <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:10px;">
            Matched concepts: ${concepts.map(c => `<code style="background:rgba(255,255,255,0.05); padding:1px 4px; border-radius:3px; margin-right:4px;">${c}</code>`).join('')}
          </div>
        `;
      }
    }

    // Append the actual question/statement
    html += `<div class="question-text">${question}</div>`;
    
    div.innerHTML = html;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Launch initializers
  init();
});
