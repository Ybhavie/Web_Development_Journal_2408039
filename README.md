# 📖 Web Development Journal

Welcome to my central repository! This space serves as a chronological journal of my coursework, full-stack explorations, and standalone application builds. It documents my progression from fundamental frontend mechanics to complex, database-driven system architecture. 

---

## 📂 Repository Directory

### 01. 🗓️ Timetable OS
**A lightweight, browser-native operating system designed to eliminate academic scheduling chaos.**

* **The Problem:** Educators and students juggle highly fragmented schedules across different days, rooms, and subjects. Traditional calendar apps are often bloated, requiring too many clicks to find the most critical information: *"Where do I need to be right now?"* * **The Solution:** Timetable OS is a streamlined, context-aware scheduling application that runs entirely in the browser. The moment you open the app, the "Today" view immediately filters the noise and presents your immediate itinerary. It combines a premium, desktop-like UI with mobile-first responsiveness.
* **Key Features:**
  * **Context-Aware Dashboard:** The 'Today' view instantly calculates and displays only the classes relevant to the current day.
  * **Weekly Grid Overview:** A broader, bird's-eye view of the entire academic week.
  * **Full CRUD Management:** Easily add, edit, or remove class slots through a sleek, overlay modal form.
  * **Client-Side Database:** Utilizes WebAssembly to run a full SQLite database directly in the browser, ensuring rapid load times and data persistence without needing a complex backend.
  * **Modern Aesthetic:** Features a tech-forward design with scanline overlays, noise textures, and glassmorphism UI components.
* **Tech Stack:** HTML5, Custom CSS3, Vanilla JavaScript (ES6+), SQLite (via `sql.js`).

---

### 02. 🎓 Student Data Portal
**A complete, full-stack Student Management System designed to handle administrative data entry with persistent database storage.**

* **The Problem:** Educational institutions often rely on fragmented spreadsheets or outdated software to manage basic student records, leading to lost data and slow administrative workflows.
* **The Solution:** A streamlined, full-stack web application that allows administrators to seamlessly perform CRUD operations on student records. By connecting a responsive frontend to a Node.js backend and a SQLite database, this portal ensures data is centralized and permanently stored.
* **Key Features:**
  * **Complete CRUD Functionality:** Add, view, edit, and delete student records instantly.
  * **Persistent Storage:** Uses a backend SQLite database (`database.sqlite`) to permanently store information.
  * **RESTful API Backend:** Powered by a custom Node.js server (`server.js`) handling data routing.
  * **Dynamic UI Rendering:** Vanilla JavaScript fetches data and dynamically populates the DOM without reloading the page.
* **Tech Stack:** HTML5, CSS3, Vanilla JavaScript, Node.js, Express.js, SQLite.

---

### 03. 📦 Product ERP (Spring Boot)
**A classroom-developed, full-stack enterprise resource planning (ERP) module demonstrating client-server architecture.**

* **Overview:** Built as a foundational exercise in connecting frontends to Java-based backends, this project features a clean, responsive form that captures product data and communicates with a RESTful Spring Boot API.
* **Key Features:**
  * **Asynchronous Data Handling:** Utilizes the JavaScript `fetch()` API to send structured JSON payloads (`POST /api/products`) without interrupting the user experience.
  * **Input Serialization:** Captures real-time DOM inputs and formats them into strict data models before transmission.
  * **Pro-Level UI:** Features a custom Glassmorphism aesthetic with cursor-sensitive animations and animated toast notifications.
* **Tech Stack:** Java (Spring Boot), HTML5, CSS3, Vanilla JavaScript.

---

### 04. ⚡ FlowState — Minimalist Task Manager
**A high-performance, distraction-free application designed for deep work and maximum focus.**

* **Live Demo:** [Visit FlowState](https://flow-state-snowy.vercel.app/)
* **Core Features:**
  * **Pure Vanilla Engine:** Built entirely with native Web Standards. Zero frameworks, zero libraries, and zero external dependencies for maximum speed and portability.
  * **Intelligent Priority System:** Seamlessly categorize tasks into High, Medium, or Low priority tiers to streamline your workflow.
  * **Zero-Latency Persistence:** Leverages `localStorage` for instant data serialization, ensuring tasks are saved and loaded without server requests.
  * **Real-Time State Management:** Robust data-handling logic that updates the UI instantly as tasks are added, toggled, or deleted.
  * **Glassmorphism Architecture:** A sleek, modern interface utilizing CSS backdrop filters and recursive shadows for a premium aesthetic.
  * **Synthesized Audio Feedback:** Utilizes the Web Audio API to generate real-time auditory cues, providing sensory confirmation for every action.
* **Tech Stack:** Semantic HTML5, CSS3 (Variables, Flexbox, Animations), JavaScript ES6+ (DOM manipulation, JSON serialization, Event Delegation).

---
*Developed with ❤️ by Vaibhavi*
