<?php
/**
 * Question 2: Develop a mini web application
 * Question 2b: Use any framework/PHP and save the data to the database
 * (Note: Using JSON file as a flat-file database for simplicity, instead of MySQL or SQLite, to meet the requirement of saving data without complex setup)
 */
$file = 'tasks.json';

// Initialize the data storage
if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
}

$json_data = file_get_contents($file);
$tasks = json_decode($json_data, true);

if (!is_array($tasks)) { $tasks = []; }

// Question 2b-ii: Insert new tasks from a form
if (isset($_POST['add_task'])) {
    $task_name = trim($_POST['task_name']);
    if (!empty($task_name)) {
        $tasks[] = [
            'id' => time(),
            'name' => $task_name,
            'status' => 'pending'
        ];
        file_put_contents($file, json_encode(array_values($tasks)));
    }
}

// Question 2a-iii: Delete tasks
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $tasks = array_filter($tasks, function($t) use ($id) { return $t['id'] != $id; });
    file_put_contents($file, json_encode(array_values($tasks)));
    header("Location: index.php");
    exit();
}

/**
 * Question 2a-ii: Mark tasks as completed
 * Question 2b-iv: Update task status (completed/pending)
 */
if (isset($_GET['toggle'])) {
    $id = $_GET['toggle'];
    foreach ($tasks as &$t) {
        if ($t['id'] == $id) {
            $t['status'] = ($t['status'] == 'pending') ? 'completed' : 'pending';
        }
    }
    file_put_contents($file, json_encode(array_values($tasks)));
    header("Location: index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Question 2a: Create a responsive To-Do List Application using Bootstrap -->
    <title>Task Manager - Roll No 2408039</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container mt-5">
        <div class="text-center mb-4">
            <h2 class="fw-bold text-info">Task Manager</h2>
            <p class="text-muted small">Roll No: 2408039 | Exam: CSA-202</p>
        </div>
        
        <!-- Question 3a-ii: Adding validation to prevent empty task insertion (Linked to script.js) -->
        <form method="POST" onsubmit="return validateForm()" class="input-group mb-4">
            <input type="text" name="task_name" id="taskInput" class="form-control shadow-none" placeholder="Add a new task...">
            <button type="submit" name="add_task" class="btn btn-primary px-4">Add Task</button>
        </form>

        <!-- Question 3a-i: Filter tasks (Pending Section) -->
        <div class="section-title text-info small fw-bold mb-2">PENDING</div>
        <ul class="list-group mb-4" id="pendingList">
            <?php 
            // Question 2b-iii: Display all tasks
            $hasPending = false;
            foreach ($tasks as $task): 
                if ($task['status'] == 'pending'): 
                    $hasPending = true;
            ?>
                <li class="list-group-item d-flex justify-content-between align-items-center task-item">
                    <div class="d-flex align-items-center">
                        <input type="checkbox" class="form-check-input me-3 custom-checkbox" 
                               onclick="window.location.href='?toggle=<?= $task['id'] ?>'">
                        <span><?= htmlspecialchars($task['name']) ?></span>
                    </div>
                    <a href="?delete=<?= $task['id'] ?>" class="btn btn-sm text-danger border-0 opacity-75">✕</a>
                </li>
            <?php endif; endforeach; ?>
        </ul>

        <!-- Question 3a-i: Filter tasks (Completed Section) -->
        <div class="section-title text-muted small fw-bold mb-2">COMPLETED</div>
        <ul class="list-group" id="completedList">
            <?php foreach ($tasks as $task): if ($task['status'] == 'completed'): ?>
                <li class="list-group-item d-flex justify-content-between align-items-center task-item completed-item">
                    <div class="d-flex align-items-center">
                        <!-- Requirement: Mark tasks as completed (Checkbox & Strike-through) -->
                        <input type="checkbox" class="form-check-input me-3 custom-checkbox" checked
                               onclick="window.location.href='?toggle=<?= $task['id'] ?>'">
                        <span class="text-decoration-line-through text-muted"><?= htmlspecialchars($task['name']) ?></span>
                    </div>
                    <a href="?delete=<?= $task['id'] ?>" class="btn btn-sm text-danger border-0 opacity-75">✕</a>
                </li>
            <?php endif; endforeach; ?>
        </ul>
        
        <!-- Question 2a-iv: Persistence is handled via JSON file saving in the PHP logic at the top -->
    </div>

    <script src="script.js"></script>
</body>
</html>