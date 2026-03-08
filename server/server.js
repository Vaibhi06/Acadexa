import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/database.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to database
console.log('🔄 Starting database connection...');
await connectDB();
console.log('✅ Base server initialization complete.');

// Debug: Track what's killing the process
process.on('exit', (code) => console.log(`👋 Process exiting with code: ${code}`));
process.on('uncaughtException', (err) => { 
    console.error('💥 Uncaught Exception:', err); 
    process.exit(1); 
});
process.on('unhandledRejection', (reason, promise) => { 
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason); 
});

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// API Routes
app.use('/api', routes);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Portal API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            signup: 'POST /api/auth/signup',
            login: 'POST /api/auth/login',
            profile: 'GET /api/auth/me',
            logout: 'POST /api/auth/logout'
        }
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});
