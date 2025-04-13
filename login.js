document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Basic validation (extend as needed)
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        window.location.href = 'bubbles.html';
    } else {
        alert('Please enter both username and password');
    }
});