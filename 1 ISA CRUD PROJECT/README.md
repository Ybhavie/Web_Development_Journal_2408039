# 🎓 Student Data Portal

**A complete, full-stack Student Management System designed to handle administrative data entry with persistent database storage.**

## 🛑 The Problem
Educational institutions often rely on fragmented spreadsheets or outdated software to manage basic student records. This leads to duplicate entries, lost data, and a slow workflow for administrators who simply need to update a student's class or roll number quickly.

## 💡 The Solution
The **Student Data Portal** is a streamlined, full-stack web application that allows administrators to seamlessly perform CRUD operations (Create, Read, Update, Delete) on student records. By connecting a clean, responsive frontend to a Node.js backend and a SQLite database, this portal ensures that all student data is centralized, accurate, and permanently stored.

## ✨ Key Features
* **Complete CRUD Functionality:** Add new students, view the roster, edit existing details, and delete records instantly.
* **Persistent Storage:** Unlike basic frontend apps that lose data on refresh, this project uses a backend SQLite database (`database.sqlite`) to permanently store student information.
* **RESTful API Backend:** Powered by a custom Node.js server (`server.js`) that handles data routing between the browser and the database.
* **Dynamic UI Rendering:** The frontend uses Vanilla JavaScript to fetch data from the server and dynamically populate the student table without reloading the page.

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (DOM Manipulation & Fetch API)
* **Backend:** Node.js (with Express.js)
* **Database:** SQLite
* **Dependencies:** Managed via npm (`package.json`)

## 📂 Project Structure
```text
📁 02_Student_Data_Portal/
├── 📄 index.html        # Main portal interface
├── 📄 styles.css        # UI styling and layout
├── 📄 script.js         # Frontend logic and API calls
├── 📄 server.js         # Node.js backend server
├── 🗄️ database.sqlite   # Relational database file
├── 📄 students.json     # JSON data backup/seed file
└── 📄 package.json      # Node module dependencies
