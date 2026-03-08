import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generate JWT token
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT token
 */
export const generateToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Extract token from request headers
 * @param {Object} req - Express request object
 * @returns {String|null} JWT token or null
 */
export const extractToken = (req) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    return null;
};
