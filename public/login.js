document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    // Check if already logged in
    fetch('/api/me')
        .then(res => {
            if (res.ok) {
                window.location.href = '/dashboard';
            }
        })
        .catch(() => {
            // Not logged in, continue with login form
        });
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.classList.remove('show');
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                window.location.href = '/dashboard';
            } else {
                errorMessage.textContent = data.error || 'Login failed. Please check your credentials.';
                errorMessage.classList.add('show');
            }
        } catch (error) {
            errorMessage.textContent = 'An error occurred. Please try again.';
            errorMessage.classList.add('show');
        }
    });
});

