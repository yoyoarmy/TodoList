// Global state
let tasks = [];
let filter = 'all';

// Fetch tasks from the server when the page loads
async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:3000/tasks', {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate that data is an array
        if (!Array.isArray(data)) {
            throw new Error('Server did not return an array of tasks');
        }
        
        tasks = data;
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        // Optionally show error to user
        tasks = []; // Reset tasks to empty array on error
        renderTasks(); // Still render (will show empty list)
    }
}



// Function to add a new task
async function addTask(e) {
    e.preventDefault();

    const newTask = document.getElementById('new-task').value.trim();
    if (newTask) {
        try {
            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newTask })
            });
            const data = await response.json();
            tasks.push(data);
            document.getElementById('new-task').value = '';
            renderTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
}

// Function to toggle completion status of a task
async function toggleCompletion(id) {
    try {
        const task = tasks.find(task => task._id === id);
        if (!task) return;

        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ completed: !task.completed })
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        const updatedTask = await response.json();
        
        // Update the task in the local array
        const taskIndex = tasks.findIndex(t => t._id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
        }
        
        // Re-render the tasks
        renderTasks();
    } catch (error) {
        console.error('Error toggling task:', error);
        // If there's an error, refresh the task list
        await fetchTasks();
    }
}

// Function to delete a task
async function deleteTask(id) {
    try {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()  // Add authentication headers
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        // Only update local state if delete was successful
        tasks = tasks.filter(task => task._id !== id);
        renderTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        // If there's an error, refresh the task list
        await fetchTasks();
    }
}

// Function to render tasks based on the current filter and search term
function renderTasks() {
    const taskList = document.getElementById('task-list');
    const searchTerm = document.getElementById('search-task').value.trim().toLowerCase();

    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        // Add null checks and validation
        if (!task || typeof task.text !== 'string') {
            console.warn('Invalid task format:', task);
            return false;
        }

        const matchesSearch = task.text.toLowerCase().includes(searchTerm);
        const matchesFilter =
            filter === 'all' ||
            (filter === 'active' && !task.completed) ||
            (filter === 'completed' && task.completed);
        return matchesSearch && matchesFilter;
    });

    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = task.completed ? 'completed' : '';
        taskItem.innerHTML = `
            <div>
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleCompletion('${task._id}')">
                <span>${task.text}</span>
            </div>
            <div class="task-actions">
                <button onclick="deleteTask('${task._id}')" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

// Function to filter tasks
function filterTasks(selectedFilter) {
    filter = selectedFilter;
    
    // Update active tab styling
    document.querySelectorAll('.tab').forEach(tab => {
        if (tab.textContent.toLowerCase().includes(selectedFilter)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    renderTasks();
}

// Function to search tasks
function searchTasks() {
    renderTasks();
}

// Add this function to handle theme
function initializeTheme() {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on saved preference or system setting
    if (savedTheme) {
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        updateThemeIcon(savedTheme === 'dark');
    } else {
        document.body.classList.toggle('dark-mode', systemPrefersDark);
        updateThemeIcon(systemPrefersDark);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only apply system preference if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            document.body.classList.toggle('dark-mode', e.matches);
            updateThemeIcon(e.matches);
        }
    });
}

// Function to update the theme icon
function updateThemeIcon(isDark) {
    const themeIcon = document.querySelector('#dark-mode-btn i');
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// Modified dark mode toggle
const darkModeButton = document.getElementById('dark-mode-btn');
darkModeButton.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    updateThemeIcon(isDarkMode);
    // Save user preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Set up form submission handler
    const form = document.getElementById('add-task-form');
    form.addEventListener('submit', addTask);
    
    // Set up search handler
    const searchInput = document.getElementById('search-task');
    searchInput.addEventListener('input', searchTasks);
    
    // Initial load of tasks
    fetchTasks();
    initializeTheme();
});


// Add this to the top of your existing script.js
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Update your fetch calls to include the token
// For example, update fetchTasks:
async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:3000/tasks', {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate that data is an array
        if (!Array.isArray(data)) {
            throw new Error('Server did not return an array of tasks');
        }
        
        tasks = data;
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        // Optionally show error to user
        tasks = []; // Reset tasks to empty array on error
        renderTasks(); // Still render (will show empty list)
    }
}

// Update addTask:
async function addTask(e) {
    e.preventDefault();
    const newTask = document.getElementById('new-task').value.trim();
    if (newTask) {
        try {
            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ text: newTask })
            });
            const data = await response.json();
            tasks.push(data);
            document.getElementById('new-task').value = '';
            renderTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
}

// Add a logout button to your task manager
const logoutButton = document.createElement('button');
logoutButton.textContent = 'Logout';
logoutButton.className = 'btn';
logoutButton.onclick = () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
};
document.querySelector('.card-header').appendChild(logoutButton);