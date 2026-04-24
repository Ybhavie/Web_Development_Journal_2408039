let DB = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS slots (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  subject     TEXT    NOT NULL,
  day         TEXT    NOT NULL,
  start_time  TEXT    NOT NULL,
  end_time    TEXT    NOT NULL,
  room        TEXT    DEFAULT '',
  notes       TEXT    DEFAULT '',
  status      TEXT    DEFAULT 'scheduled'
);`;

const SEED = [
  ['Mathematics',     'Monday',    '08:00','09:00','Hall A-101','Calculus chapter 4','scheduled'],
  ['Physics Lab',     'Monday',    '10:30','12:30','Lab B-02',  'Bring lab coat',    'scheduled'],
  ['English Lit',     'Tuesday',   '09:00','10:00','Room 204',  '',                  'scheduled'],
  ['Data Structures', 'Tuesday',   '14:00','15:30','Hall C-301','',                  'scheduled'],
  ['History',         'Wednesday', '11:00','12:00','Room 105',  '',                  'scheduled'],
  ['Chemistry',       'Thursday',  '08:30','09:30','Lab A-01',  '',                  'scheduled'],
  ['Electives Seminar','Friday',   '13:00','15:00','Auditorium','Guest lecture',      'scheduled'],
];

async function initDB() {
  const SQL = await initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
  });
  const saved = localStorage.getItem('timetable_db');
  if (saved) {
    const buf = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
    DB = new SQL.Database(buf);
  } else {
    DB = new SQL.Database();
    DB.run(SCHEMA);
    const stmt = DB.prepare(`INSERT INTO slots (subject,day,start_time,end_time,room,notes,status) VALUES (?,?,?,?,?,?,?)`);
    SEED.forEach(row => stmt.run(row));
    stmt.free();
    saveDB();
  }
}

function saveDB() {
  const data = DB.export();
  const b64  = btoa(String.fromCharCode(...data));
  localStorage.setItem('timetable_db', b64);
}

function dbGetAll() {
  const res = DB.exec(`SELECT * FROM slots ORDER BY
    CASE day WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3
             WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6
             WHEN 'Sunday' THEN 7 END, start_time`);
  if (!res.length) return [];
  const { columns, values } = res[0];
  return values.map(row => Object.fromEntries(columns.map((c,i) => [c, row[i]])));
}

function dbGetToday(day) {
  const res = DB.exec(`SELECT * FROM slots WHERE day=? ORDER BY start_time`, [day]);
  if (!res.length) return [];
  const { columns, values } = res[0];
  return values.map(row => Object.fromEntries(columns.map((c,i) => [c, row[i]])));
}

function dbInsert(s) {
  DB.run(`INSERT INTO slots (subject,day,start_time,end_time,room,notes,status) VALUES (?,?,?,?,?,?,?)`,
    [s.subject, s.day, s.start_time, s.end_time, s.room||'', s.notes||'', 'scheduled']);
  saveDB();
}

function dbUpdate(s) {
  DB.run(`UPDATE slots SET subject=?,day=?,start_time=?,end_time=?,room=?,notes=? WHERE id=?`,
    [s.subject, s.day, s.start_time, s.end_time, s.room||'', s.notes||'', s.id]);
  saveDB();
}

function dbUpdateStatus(id, status) {
  DB.run(`UPDATE slots SET status=? WHERE id=?`, [status, id]);
  saveDB();
}

function dbDelete(id) {
  DB.run(`DELETE FROM slots WHERE id=?`, [id]);
  saveDB();
}

function dbGetById(id) {
  const res = DB.exec(`SELECT * FROM slots WHERE id=?`, [id]);
  if (!res.length) return null;
  const { columns, values } = res[0];
  return Object.fromEntries(columns.map((c,i) => [c, values[0][i]]));
}