import { verifyToken, extractToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';
import User from '../models/User.js';

/**
 * Middleware to protect routes - requires valid JWT token
 */
export const protect = async (req, res, next) => {
    try {
        // Extract token from headers
        const token = extractToken(req);

        if (!token) {
            return errorResponse(res, 401, 'Not authorized, no token provided');
        }

        // Verify token
        const decoded = verifyToken(token);

        // Find user by ID from token
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return errorResponse(res, 401, 'User not found');
        }

        if (!user.isActive) {
            return errorResponse(res, 401, 'User account is inactive');
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        return errorResponse(res, 401, 'Not authorized, token failed');
    }
};

/**
 * Middleware to restrict access based on user roles
 * @param  {...String} roles - Allowed roles
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(res, 401, 'Not authorized');
        }

        if (!roles.includes(req.user.role)) {
            return errorResponse(
                res,
                403,
                `User role '${req.user.role}' is not authorized to access this route`
            );
        }

        next();
    };
};
