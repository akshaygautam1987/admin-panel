document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadStats();
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

async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to load stats');
        
        const stats = await response.json();
        
        document.getElementById('totalUsers').textContent = stats.totalUsers;
        document.getElementById('activeUsers').textContent = stats.activeUsers;
        document.getElementById('inactiveUsers').textContent = stats.inactiveUsers;
        document.getElementById('pendingUsers').textContent = stats.pendingUsers;
        
        // Load recent users
        const tableBody = document.getElementById('recentUsersTable');
        if (stats.recentUsers && stats.recentUsers.length > 0) {
            tableBody.innerHTML = stats.recentUsers.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="status-badge ${user.status}">${user.status}</span></td>
                    <td>${user.createdAt}</td>
                </tr>
            `).join('');
        } else {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No users found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading stats:', error);
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

