const form = document.getElementById('studentForm');
const tableBody = document.getElementById('studentTableBody');
const submitBtn = document.getElementById('submitBtn');
const editIndexField = document.getElementById('editIndex');

const API_URL = 'http://localhost:3000/api/students';

let students = [];

// 1. READ: Load all students
async function loadStudents() {
    try {
        const response = await fetch(API_URL);
        students = await response.json();
        renderTable();
    } catch (error) {
        console.error("Error connecting to server:", error);
    }
}

function renderTable() {
    tableBody.innerHTML = '';
    students.forEach((student, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.rollNum}</td>
                <td>${student.studentClass}</td>
                <td>
                    <button class="edit-btn" onclick="editStudent(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteRecord('${student.rollNum}')">Delete</button>
                </td>
            </tr>`;
    });
}

// 2. CREATE & UPDATE
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const rollNum = document.getElementById('rollNum').value;
    const studentClass = document.getElementById('studentClass').value;
    const editIndex = parseInt(editIndexField.value);

    const studentData = { name, rollNum, studentClass };

    if (editIndex === -1) {
        // CREATE (POST)
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
    } else {
        // UPDATE (PUT)
        const originalRoll = students[editIndex].rollNum;
        await fetch(`${API_URL}/${originalRoll}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        
        editIndexField.value = "-1";
        submitBtn.innerText = "Add Student";
        submitBtn.style.background = "linear-gradient(to right, #3b82f6, #8b5cf6)";
    }

    form.reset();
    loadStudents();
});

// 3. EDIT: Populate form
window.editStudent = function(index) {
    const s = students[index];
    document.getElementById('name').value = s.name;
    document.getElementById('rollNum').value = s.rollNum;
    document.getElementById('studentClass').value = s.studentClass;
    
    editIndexField.value = index;
    submitBtn.innerText = "Update Record";
    submitBtn.style.background = "#f59e0b";
};

// 4. DELETE
window.deleteRecord = async function(rollNum) {
    if (confirm(`Delete student with Roll No: ${rollNum}?`)) {
        try {
            await fetch(`${API_URL}/${rollNum}`, { method: 'DELETE' });
            loadStudents();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    }
};

loadStudents();