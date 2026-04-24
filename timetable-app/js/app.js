let currentView = 'today';

async function main() {
  await initDB();
  startClock();
  renderTodayView();
  renderWeekView();
  renderManageView();
  setInterval(() => {
    if (currentView === 'today') renderTodayView();
  }, 30000);
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`view-${view}`).classList.add('active');
  document.querySelectorAll(`[data-view="${view}"]`).forEach(el => el.classList.add('active'));

  if (view === 'today')  renderTodayView();
  if (view === 'week')   renderWeekView();
  if (view === 'manage') renderManageView();
}

/* ── TODAY VIEW ── */
function renderTodayView() {
  const day   = todayName();
  const slots = dbGetToday(day);

  document.getElementById('today-subtitle').textContent =
    new Date().toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'});

  const timeline = document.getElementById('today-timeline');
  const empty    = document.getElementById('today-empty');
  timeline.innerHTML = '';

  if (!slots.length) {
    empty.style.display = 'block';
    timeline.appendChild(empty);
    document.getElementById('today-stats').innerHTML = '';
    return;
  }
  empty.style.display = 'none';

  let cntComp = 0, cntMissed = 0, cntCurr = 0;
  const isMob = window.innerWidth <= 540;

  slots.forEach(slot => {
    const status  = getLectureStatus(slot);
    const savedSt = slot.status;
    if (status === 'completed') cntComp++;
    if (status === 'missed')    cntMissed++;
    if (status === 'current')   cntCurr++;

    const card = document.createElement('div');
    card.className = `lecture-card status-${status}`;
    card.id = `card-${slot.id}`;

    // On mobile the card stacks vertically — show end time inline
    const timeBlock = isMob
      ? `<div class="card-time">
           <div class="card-time-start">${formatTime12(slot.start_time)}</div>
           <span class="card-time-end-mobile">→ ${formatTime12(slot.end_time)}</span>
         </div>`
      : `<div class="card-time">
           <div class="card-time-start">${formatTime12(slot.start_time)}</div>
           <div class="card-time-sep">▼</div>
           <div style="font-size:0.7rem;color:var(--text-dim)">${formatTime12(slot.end_time)}</div>
         </div>`;

    card.innerHTML = `
      ${timeBlock}
      <div class="card-body">
        <div class="card-subject">${escHtml(slot.subject)}</div>
        <div class="card-meta">
          ${slot.room ? `<span class="card-room">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>${escHtml(slot.room)}</span>` : ''}
          ${slot.notes ? `<span class="card-notes">${escHtml(slot.notes)}</span>` : ''}
        </div>
        ${status === 'current' ? `<div class="current-badge"><span class="dot"></span>Live Now</div>` : ''}
      </div>
      <div class="status-toggle">
        <div class="status-label">Status</div>
        <div class="toggle-group">
          <button class="toggle-btn sched ${savedSt==='scheduled'?'active-sched':''}"
            onclick="setStatus(${slot.id},'scheduled','today')">Sched</button>
          <button class="toggle-btn comp ${savedSt==='completed'?'active-comp':''}"
            onclick="setStatus(${slot.id},'completed','today')">Done</button>
          <button class="toggle-btn missed ${savedSt==='missed'?'active-missed':''}"
            onclick="setStatus(${slot.id},'missed','today')">Miss</button>
        </div>
      </div>`;
    timeline.appendChild(card);
  });

  const statsEl = document.getElementById('today-stats');
  statsEl.innerHTML = '';
  if (cntCurr)   statsEl.innerHTML += `<span class="stat-pill cyan">● Live: ${cntCurr}</span>`;
  if (cntComp)   statsEl.innerHTML += `<span class="stat-pill green">✓ Done: ${cntComp}</span>`;
  if (cntMissed) statsEl.innerHTML += `<span class="stat-pill red">✗ Missed: ${cntMissed}</span>`;
  const rem = slots.length - cntComp - cntMissed;
  if (rem > 0) statsEl.innerHTML += `<span class="stat-pill orange">◷ Left: ${rem}</span>`;
}

/* ── WEEK VIEW ── */
function renderWeekView() {
  const all   = dbGetAll();
  const today = todayName();
  const days  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const grid  = document.getElementById('week-grid');
  grid.innerHTML = '';

  days.forEach(day => {
    const daySlots = all.filter(s => s.day === day);
    const isToday  = day === today;
    const col = document.createElement('div');
    col.className = 'week-day-col';
    col.innerHTML = `<div class="week-day-header ${isToday?'today-col':''}">
      ${day}${isToday?' <span style="font-size:0.58rem;color:var(--cyan);vertical-align:middle">●</span>':''}
    </div>`;

    if (!daySlots.length) {
      col.innerHTML += `<div style="font-size:0.7rem;color:var(--text-dark);padding:8px 14px;">No classes</div>`;
    } else {
      daySlots.forEach(slot => {
        const status = getLectureStatus(slot);
        const mini = document.createElement('div');
        mini.className = `mini-card status-${status}`;
        mini.innerHTML = `
          <div class="mini-subject">${escHtml(slot.subject)}</div>
          <div class="mini-time">${formatTime12(slot.start_time)} – ${formatTime12(slot.end_time)}</div>
          ${slot.room ? `<div class="mini-room">${escHtml(slot.room)}</div>` : ''}`;
        col.appendChild(mini);
      });
    }
    grid.appendChild(col);
  });
}

/* ── MANAGE VIEW ── */
function renderManageView() {
  const all = dbGetAll();

  // ─ Desktop table ─
  const tbody = document.getElementById('manage-tbody');
  tbody.innerHTML = '';

  // ─ Mobile card list ─
  const cards = document.getElementById('manage-cards');
  cards.innerHTML = '';

  if (!all.length) {
    const empty = `<tr><td colspan="5" style="text-align:center;color:var(--text-dark);padding:40px 20px;">
      No slots yet. Tap <strong style="color:var(--cyan)">New Slot</strong> above to add one.
    </td></tr>`;
    tbody.innerHTML = empty;
    cards.innerHTML = `<div class="empty-state" style="padding:40px 0">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
      <p>No slots yet. Add one above.</p>
    </div>`;
    return;
  }

  all.forEach(slot => {
    // Desktop row
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="subject-cell">${escHtml(slot.subject)}</td>
      <td><span class="day-badge">${slot.day}</span></td>
      <td class="time-cell">${formatTime12(slot.start_time)} – ${formatTime12(slot.end_time)}</td>
      <td style="color:var(--text-dim)">${escHtml(slot.room||'—')}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-icon edit" onclick="openModal(${slot.id})" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="btn btn-icon del" onclick="deleteSlot(${slot.id})" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </td>`;
    tbody.appendChild(tr);

    // Mobile card
    const mc = document.createElement('div');
    mc.className = 'manage-mob-card';
    mc.innerHTML = `
      <div class="mob-card-row">
        <div class="mob-card-subject">${escHtml(slot.subject)}</div>
        <div class="mob-card-actions">
          <button class="btn btn-icon edit" onclick="openModal(${slot.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="btn btn-icon del" onclick="deleteSlot(${slot.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="mob-card-meta">
        <span class="mob-meta-badge day">${slot.day}</span>
        <span class="mob-meta-badge time">${formatTime12(slot.start_time)} – ${formatTime12(slot.end_time)}</span>
        ${slot.room ? `<span class="mob-meta-badge room">${escHtml(slot.room)}</span>` : ''}
      </div>`;
    cards.appendChild(mc);
  });
}

/* ── STATUS ── */
function setStatus(id, status, source) {
  dbUpdateStatus(id, status);
  if (source === 'today') renderTodayView();
  if (currentView === 'week') renderWeekView();
}

/* ── MODAL ── */
function openModal(id) {
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('slot-form').reset();
  document.getElementById('f-id').value = '';
  document.getElementById('modal-title').textContent = id ? 'Edit Slot' : 'Add New Slot';
  if (id) {
    const slot = dbGetById(id);
    if (!slot) return;
    document.getElementById('f-id').value      = slot.id;
    document.getElementById('f-subject').value = slot.subject;
    document.getElementById('f-day').value     = slot.day;
    document.getElementById('f-start').value   = slot.start_time;
    document.getElementById('f-end').value     = slot.end_time;
    document.getElementById('f-room').value    = slot.room;
    document.getElementById('f-notes').value   = slot.notes;
  }
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').classList.remove('open');
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('f-id').value;
  const slot = {
    id:         id ? parseInt(id) : null,
    subject:    document.getElementById('f-subject').value.trim(),
    day:        document.getElementById('f-day').value,
    start_time: document.getElementById('f-start').value,
    end_time:   document.getElementById('f-end').value,
    room:       document.getElementById('f-room').value.trim(),
    notes:      document.getElementById('f-notes').value.trim(),
  };
  if (id) dbUpdate(slot); else dbInsert(slot);
  closeModal();
  renderTodayView();
  renderWeekView();
  renderManageView();
}

function deleteSlot(id) {
  if (!confirm('Delete this slot permanently?')) return;
  dbDelete(id);
  renderTodayView();
  renderWeekView();
  renderManageView();
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Re-render today view on resize (card layout differs mobile vs desktop)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (currentView === 'today') renderTodayView();
  }, 200);
});

main();