// Handle form submissions
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Check authentication on every page load
    checkAuth();
});

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store the token
        localStorage.setItem('token', data.token);

        // Redirect to task manager
        window.location.href = 'taskmanager.html';
    } catch (error) {
        alert(error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate input
    if (username.length < 4 || password.length < 4) {
        alert('Username and password must be at least 4 characters long');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Store the token
        localStorage.setItem('token', data.token);

        // Redirect to task manager
        window.location.href = 'taskmanager.html';
    } catch (error) {
        alert(error.message);
    }
}

// Function to check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    const isLoginPage = window.location.href.includes('index.html');
    const isRegisterPage = window.location.href.includes('register.html');

    // If no token and not on login/register page, redirect to login
    if (!token && !isLoginPage && !isRegisterPage) {
        window.location.href = 'index.html';
        return;
    }

    // If has token and on login/register page, redirect to index
    if (token && (isLoginPage || isRegisterPage)) {
        window.location.href = 'taskmanager.html';
    }
}