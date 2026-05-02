// Question 3a-ii: Validation
function validateForm() {
    const input = document.getElementById('taskInput');
    if (input.value.trim() === "") {
        alert("Task name cannot be empty! Please enter a task.");
        return false; // Stops the form from submitting to index.php
    }
    return true; // Allows the task to be added
}
// Question 3a-i: Filtering logic
function filterTasks(status) {
    const items = document.querySelectorAll('.task-item');
    items.forEach(item => {
        if (status === 'all') {
            item.style.display = 'flex';
        } else if (item.getAttribute('data-status') === status) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

