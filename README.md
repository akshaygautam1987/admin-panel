# Admin Panel

A modern, full-featured Node.js admin panel application built with Express.js and vanilla JavaScript.

## Features

- 🔐 **Authentication System** - Secure login/logout with session management
- 📊 **Dashboard** - Overview with statistics and recent activity
- 👥 **User Management** - Create, read, update, and delete users
- ⚙️ **Settings** - Account and system information
- 🎨 **Modern UI** - Clean, responsive design with smooth interactions
- 🔒 **Protected Routes** - Server-side authentication middleware

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: Express Sessions
- **Password Hashing**: bcrypt

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (optional):
   Create a `.env` file in the root directory:
   ```
   PORT=3000
   SESSION_SECRET=your-secret-key-change-this-in-production
   NODE_ENV=development
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

## Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

## Project Structure

```
Admin Panel/
├── server.js          # Express server and API routes
├── package.json       # Dependencies and scripts
├── .gitignore        # Git ignore file
├── README.md         # This file
└── public/           # Frontend files
    ├── login.html    # Login page
    ├── dashboard.html # Dashboard page
    ├── users.html    # User management page
    ├── settings.html # Settings page
    ├── styles.css    # Global styles
    ├── login.js      # Login functionality
    ├── dashboard.js  # Dashboard functionality
    ├── users.js      # User management functionality
    └── settings.js   # Settings functionality
```

## API Endpoints

### Authentication
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Statistics
- `GET /api/stats` - Get dashboard statistics

## Development

### Adding New Features

1. Add API routes in `server.js`
2. Create or update HTML pages in `public/`
3. Add JavaScript functionality in corresponding `.js` files
4. Update styles in `styles.css` if needed

### Database Integration

Currently, the application uses in-memory data storage. To integrate with a database:

1. Install a database driver (e.g., `mongoose` for MongoDB, `pg` for PostgreSQL)
2. Replace in-memory data arrays in `server.js` with database queries
3. Update API endpoints to use async database operations

## Security Considerations

- Change the default credentials in production
- Use a strong `SESSION_SECRET` in production
- Implement HTTPS in production
- Add rate limiting for API endpoints
- Validate and sanitize all user inputs
- Consider using JWT tokens instead of sessions for stateless authentication
- Implement CSRF protection

## License

ISC

## Author

Created as a modern admin panel template for Node.js applications.

