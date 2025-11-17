const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// In-memory data store (replace with database in production)
let users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

let userData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', createdAt: '2024-01-16' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', createdAt: '2024-01-17' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'active', createdAt: '2024-01-18' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', status: 'pending', createdAt: '2024-01-19' }
];

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Routes
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/users', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'users.html'));
});

app.get('/settings', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

// API Routes

// Authentication
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  req.session.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  res.json({ success: true, user: req.session.user });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json(req.session.user);
});

// Users API
app.get('/api/users', requireAuth, (req, res) => {
  res.json(userData);
});

app.get('/api/users/:id', requireAuth, (req, res) => {
  const user = userData.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.post('/api/users', requireAuth, (req, res) => {
  const { name, email, status } = req.body;
  const newUser = {
    id: userData.length + 1,
    name,
    email,
    status: status || 'pending',
    createdAt: new Date().toISOString().split('T')[0]
  };
  userData.push(newUser);
  res.json(newUser);
});

app.put('/api/users/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const index = userData.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  userData[index] = { ...userData[index], ...req.body };
  res.json(userData[index]);
});

app.delete('/api/users/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const index = userData.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  userData.splice(index, 1);
  res.json({ success: true });
});

// Stats API
app.get('/api/stats', requireAuth, (req, res) => {
  const stats = {
    totalUsers: userData.length,
    activeUsers: userData.filter(u => u.status === 'active').length,
    inactiveUsers: userData.filter(u => u.status === 'inactive').length,
    pendingUsers: userData.filter(u => u.status === 'pending').length,
    recentUsers: userData.slice(-5)
  };
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Default login: admin / admin123`);
});

