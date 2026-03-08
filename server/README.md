# Portal Backend API

Complete Node.js backend with Express and MySQL for user authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (via XAMPP or MySQL Server)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup MySQL Database:**
   - Start MySQL (via XAMPP or MySQL service)
   - Create database:
     ```sql
     CREATE DATABASE portal_db;
     ```

3. **Configure environment:**
   - Edit `.env` file with your MySQL credentials
   - Default configuration uses `root` user with no password

4. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication.

### Signup Example
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "Student123",
  "role": "student"
}
```

### Login Example
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "Student123"
}
```

Response includes JWT token:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Using Protected Endpoints
Include the token in the Authorization header:
```
Authorization: Bearer <your-token-here>
```

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── errorHandler.js     # Error handling
│   └── validate.js         # Input validation
├── models/
│   └── User.js             # User model
├── routes/
│   ├── authRoutes.js       # Auth routes
│   └── index.js            # Route aggregator
├── utils/
│   ├── jwt.js              # JWT utilities
│   └── response.js         # Response formatters
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── server.js               # Main entry point
```

## 🔒 User Roles

- `admin` - Full access
- `faculty` - Faculty access
- `student` - Student access (default)

## 🛠️ Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=portal_db
DB_PORT=3306

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173
```

## ✅ Password Requirements

- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## 🐛 Troubleshooting

**MySQL Connection Error:**
- Ensure MySQL is running (check XAMPP or Windows Services)
- Verify credentials in `.env` file
- Check if database `portal_db` exists

**Port Already in Use:**
- Change `PORT` in `.env` file

**CORS Error:**
- Update `CLIENT_URL` in `.env` to match your frontend URL

## 📚 Dependencies

- **express** - Web framework
- **sequelize** - ORM for MySQL
- **mysql2** - MySQL driver
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - CORS middleware
- **dotenv** - Environment variables

## 📝 License

ISC
