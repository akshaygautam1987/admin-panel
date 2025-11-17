document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUserInfo();
    setupLogout();
});

async function checkAuth() {
    try {
        const response = await fetch('/api/me');
        if (!response.ok) {
            window.location.href = '/';
            return;
        }
        const user = await response.json();
        document.getElementById('userName').textContent = user.username;
    } catch (error) {
        window.location.href = '/';
    }
}

async function loadUserInfo() {
    try {
        const response = await fetch('/api/me');
        if (!response.ok) throw new Error('Failed to load user info');
        
        const user = await response.json();
        document.getElementById('settingsUsername').textContent = user.username;
        document.getElementById('settingsEmail').textContent = user.email;
        document.getElementById('settingsRole').textContent = user.role;
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

function setupLogout() {
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });
}

