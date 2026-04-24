const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) return console.error(err.message);
    console.log('✅ Connected to SQLite database.');
});

// 2. Create the Table
db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    rollNum TEXT UNIQUE,
    studentClass TEXT
)`);

// 3. READ: Get all students
app.get('/api/students', (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

// 4. CREATE: Add new student
app.post('/api/students', (req, res) => {
    const { name, rollNum, studentClass } = req.body;
    db.run("INSERT INTO students (name, rollNum, studentClass) VALUES (?, ?, ?)", 
    [name, rollNum, studentClass], function(err) {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: this.lastID });
    });
});

// 5. UPDATE: Edit existing student
app.put('/api/students/:oldRoll', (req, res) => {
    const { name, rollNum, studentClass } = req.body;
    const oldRoll = req.params.oldRoll;
    db.run("UPDATE students SET name = ?, rollNum = ?, studentClass = ? WHERE rollNum = ?", 
    [name, rollNum, studentClass, oldRoll], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Updated!" });
    });
});

// 6. DELETE: Remove student
app.delete('/api/students/:roll', (req, res) => {
    db.run("DELETE FROM students WHERE rollNum = ?", [req.params.roll], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Deleted!" });
    });
});

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));