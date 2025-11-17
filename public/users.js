document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUsers();
    setupEventListeners();
});

async function checkAuth() {
    try {
        const response = await fetch('/api/me');
        if (!response.ok) {
            window.location.href = '/';
            return;
        }
    } catch (error) {
        window.location.href = '/';
    }
}

async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to load users');
        
        const users = await response.json();
        const tableBody = document.getElementById('usersTable');
        
        if (users && users.length > 0) {
            tableBody.innerHTML = users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="status-badge ${user.status}">${user.status}</span></td>
                    <td>${user.createdAt}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editUser(${user.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No users found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function setupEventListeners() {
    // Add user button
    document.getElementById('addUserBtn').addEventListener('click', () => {
        openModal();
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });
    
    // Modal close buttons
    const modal = document.getElementById('userModal');
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.getElementById('userForm').reset();
            document.getElementById('userId').value = '';
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.getElementById('userForm').reset();
            document.getElementById('userId').value = '';
        }
    });
    
    // Form submission
    document.getElementById('userForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveUser();
    });
}

async function openModal(userId = null) {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const title = document.getElementById('modalTitle');
    
    if (userId) {
        title.textContent = 'Edit User';
        try {
            const response = await fetch(`/api/users/${userId}`);
            if (!response.ok) throw new Error('Failed to load user');
            
            const user = await response.json();
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userStatus').value = user.status;
        } catch (error) {
            console.error('Error loading user:', error);
            alert('Failed to load user data');
            return;
        }
    } else {
        title.textContent = 'Add User';
        form.reset();
        document.getElementById('userId').value = '';
    }
    
    modal.classList.add('show');
}

async function saveUser() {
    const form = document.getElementById('userForm');
    const formData = new FormData(form);
    const userId = document.getElementById('userId').value;
    
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        status: formData.get('status')
    };
    
    try {
        const url = userId ? `/api/users/${userId}` : '/api/users';
        const method = userId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) throw new Error('Failed to save user');
        
        document.getElementById('userModal').classList.remove('show');
        form.reset();
        loadUsers();
    } catch (error) {
        console.error('Error saving user:', error);
        alert('Failed to save user');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete user');
        
        loadUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
    }
}

// Make functions globally available
window.editUser = editUser;
window.deleteUser = deleteUser;

function editUser(userId) {
    openModal(userId);
}

