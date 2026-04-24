const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function todayName() {
  return DAYS[new Date().getDay()];
}

function formatTime12(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}

function timeToMinutes(t) {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function nowMinutes() {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

function getLectureStatus(slot) {
  if (slot.status === 'completed') return 'completed';
  if (slot.status === 'missed')    return 'missed';
  const now = nowMinutes();
  const start = timeToMinutes(slot.start_time);
  const end   = timeToMinutes(slot.end_time);
  if (now >= start && now <= end) return 'current';
  return 'scheduled';
}

function startClock() {
  function tick() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const ss = String(now.getSeconds()).padStart(2,'0');
    const timeStr = `${hh}:${mm}:${ss}`;
    const dateStr = now.toLocaleDateString('en-US', {weekday:'long', month:'short', day:'numeric'});

    const el = document.getElementById('sidebar-clock');
    if (el) el.textContent = timeStr;
    const dateEl = document.getElementById('sidebar-date');
    if (dateEl) dateEl.textContent = dateStr;

    // Mobile top bar clock (no seconds to save space)
    const mEl = document.getElementById('mobile-clock-display');
    if (mEl) mEl.textContent = `${hh}:${mm}`;
  }
  tick();
  setInterval(tick, 1000);
}

function isMobile() {
  return window.innerWidth <= 768;
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('visible');
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-backdrop').classList.add('visible');
}