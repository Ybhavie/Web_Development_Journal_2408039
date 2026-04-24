(function () {
  'use strict';

  let tasks = [];
  let currentFilter = 'all';

  // DOM Elements
  const taskInput    = document.getElementById('taskInput');
  const addBtn       = document.getElementById('addBtn');
  const taskList     = document.getElementById('taskList');
  const emptyState   = document.getElementById('emptyState');
  const totalCount   = document.getElementById('totalCount');
  const pendingCount = document.getElementById('pendingCount');
  const doneCount    = document.getElementById('doneCount');
  const clearAllBtn  = document.getElementById('clearAllBtn');
  const dateBadge    = document.getElementById('dateBadge');
  const tabBtns      = document.querySelectorAll('.tab-btn');
  const tabIndicator = document.querySelector('.tab-indicator');
  const glow         = document.getElementById('cursor-glow');

  // --- 1. AUDIO ENGINE (No files needed) ---
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  function playTone(freq, type = 'sine', duration = 0.1) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  // --- 2. DYNAMIC UI INJECTION ---
  function injectPriorityDropdown() {
    if (document.getElementById('priorityInput')) return;
    const wrapper = document.querySelector('.input-wrapper');
    const select = document.createElement('select');
    select.id = 'priorityInput';
    select.className = 'priority-select';
    select.innerHTML = `
      <option value="low">Low</option>
      <option value="medium" selected>Medium</option>
      <option value="high">High</option>
    `;
    // Insert it at the start of the wrapper
    wrapper.insertBefore(select, taskInput);
  }

  function setRealTimeDate() {
    const d = new Date();
    dateBadge.textContent = d.toLocaleDateString('en-US', { 
      weekday: 'short', month: 'short', day: 'numeric' 
    });
  }

  /**
   * INITIALIZATION
   */
  function init() {
    setRealTimeDate();
    injectPriorityDropdown();
    loadTasks();
    renderTasks();
    updateStats();
    bindEvents();
    handleTorchEffect();
    createSparkles();
    
    // Position the "All" tab highlight immediately
    setTimeout(() => {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) positionIndicator(activeTab);
    }, 100);
  }

  // Torch / Flashlight Logic
  function handleTorchEffect() {
    document.addEventListener('mousemove', (e) => {
      window.requestAnimationFrame(() => {
        if(glow) {
          glow.style.left = `${e.clientX}px`;
          glow.style.top = `${e.clientY}px`;
        }
      });
    });
  }

  // Particle System
  function createSparkles() {
    const container = document.getElementById('sparkle-container');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 45; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      const size = 1 + Math.random() * 1.5;
      s.style.width = `${size}px`;
      s.style.height = `${size}px`;
      s.style.setProperty('--duration', `${12 + Math.random() * 8}s`);
      s.style.animationDelay = `-${Math.random() * 15}s`;
      container.appendChild(s);
    }
  }

  /**
   * DATA & TASK LOGIC
   */
  function loadTasks() {
    tasks = JSON.parse(localStorage.getItem('flowstate_tasks')) || [];
  }

  function saveTasks() {
    localStorage.setItem('flowstate_tasks', JSON.stringify(tasks));
  }

  function addTask() {
    const text = taskInput.value.trim();
    const priority = document.getElementById('priorityInput').value;
    if (!text) return shakeInput();

    const newTask = {
      id: 'fs-' + Date.now() + Math.random().toString(36).slice(2, 4),
      text: text,
      priority: priority,
      completed: false
    };

    tasks.unshift(newTask);
    saveTasks();
    taskInput.value = '';
    playTone(600, 'triangle'); 
    renderTasks();
    updateStats();
  }

  window.toggleTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    if (task.completed) playTone(880, 'sine');
    saveTasks();
    renderTasks();
    updateStats();
  };

  window.deleteTask = function(id) {
    const li = document.querySelector(`[data-id="${id}"]`);
    if (li) {
      li.classList.add('removing');
      playTone(200, 'sine', 0.2);
      li.addEventListener('animationend', () => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
      }, { once: true });
    }
  };

  /**
   * RENDERING
   */
  function renderTasks() {
    const filtered = getFiltered();
    taskList.innerHTML = '';
    emptyState.classList.toggle('visible', filtered.length === 0);
    
    filtered.forEach(t => {
      const li = document.createElement('li');
      li.className = `task-item ${t.completed ? 'completed' : ''}`;
      li.setAttribute('data-id', t.id);
      li.innerHTML = `
        <div class="task-checkbox ${t.completed ? 'checked' : ''}" onclick="toggleTask('${t.id}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <span class="task-text">${t.text} <span class="priority-tag prio-${t.priority}">${t.priority}</span></span>
        <button class="delete-btn" onclick="deleteTask('${t.id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
        </button>
      `;
      taskList.appendChild(li);
    });
  }

  function getFiltered() {
    if (currentFilter === 'pending') return tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    return [...tasks];
  }

  function updateStats() {
    const done = tasks.filter(t => t.completed).length;
    totalCount.textContent = tasks.length;
    pendingCount.textContent = tasks.length - done;
    doneCount.textContent = done;
  }

  function shakeInput() {
    taskInput.style.animation = 'shake 0.4s ease';
    setTimeout(() => taskInput.style.animation = '', 400);
    taskInput.focus();
  }

  function positionIndicator(activeBtn) {
    if (!activeBtn || !tabIndicator) return;
    const parentRect = activeBtn.parentElement.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    
    tabIndicator.style.width = `${btnRect.width}px`;
    tabIndicator.style.transform = `translateX(${btnRect.left - parentRect.left - 6}px)`;
    tabIndicator.style.opacity = "1";
  }

  /**
   * EVENTS
   */
  function bindEvents() {
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (e) => e.key === 'Enter' && addTask());
    clearAllBtn.addEventListener('click', () => {
        if(confirm("Clear completed tasks?")) {
            tasks = tasks.filter(t => !t.completed);
            saveTasks();
            renderTasks();
            updateStats();
        }
    });

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        positionIndicator(btn);
        renderTasks();
      });
    });

    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) positionIndicator(activeTab);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();