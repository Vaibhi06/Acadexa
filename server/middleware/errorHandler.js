import { errorResponse } from '../utils/response.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
    // **ENHANCED LOGGING** - This helps debug recurring errors
    console.error('═══════════════════════════════════════════');
    console.error('❌ ERROR OCCURRED:');
    console.error('═══════════════════════════════════════════');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Route:', req.method, req.originalUrl);
    console.error('Request Body:', JSON.stringify(req.body, null, 2));
    if (err.stack) {
        console.error('Stack Trace:', err.stack);
    }
    console.error('═══════════════════════════════════════════\n');

    // Sequelize Validation Error
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => ({
            field: e.path,
            message: e.message
        }));
        console.error('🔴 Validation Error - Fields:', errors);
        return errorResponse(res, 400, 'Validation Error', errors);
    }

    // Sequelize Unique Constraint Error
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors[0].path;
        console.error(`🔴 Duplicate Entry - Field: ${field}`);
        return errorResponse(res, 400, `${field} already exists`);
    }

    // Sequelize Database Error
    if (err.name === 'SequelizeDatabaseError') {
        console.error('🔴 Database Error Details:', err.parent?.sqlMessage || err.message);
        return errorResponse(res, 500, 'Database error occurred');
    }

    // Sequelize Connection Error
    if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
        console.error('🔴 DATABASE NOT CONNECTED! Check if MySQL is running in XAMPP!');
        return errorResponse(res, 500, 'Database connection failed. Please ensure MySQL is running.');
    }

    // JWT Error
    if (err.name === 'JsonWebTokenError') {
        console.error('🔴 Invalid JWT Token');
        return errorResponse(res, 401, 'Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        console.error('🔴 JWT Token Expired');
        return errorResponse(res, 401, 'Token expired');
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`🔴 Unhandled Error (${statusCode}):`, message);
    return errorResponse(res, statusCode, message);
};

/**
 * 404 Not Found handler
 */
export const notFound = (req, res, next) => {
    return errorResponse(res, 404, `Route ${req.originalUrl} not found`);
};
