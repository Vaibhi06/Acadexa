import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return errorResponse(res, 400, 'User with this email already exists');
        }

        // Create new user
        const user = await User.create({
            email,
            password,
            role: role || 'student'
        });

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        return successResponse(res, 201, 'User registered successfully', {
            user: user.toJSON(),
            token
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        // Check if user is active
        if (!user.isActive) {
            return errorResponse(res, 401, 'Your account has been deactivated');
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        return successResponse(res, 200, 'Login successful', {
            user: user.toJSON(),
            token
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        return successResponse(res, 200, 'User retrieved successfully', {
            user: user.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
    try {
        // In JWT authentication, logout is typically handled client-side by removing the token
        // This endpoint is optional and can be used for logging purposes

        return successResponse(res, 200, 'Logout successful');
    } catch (error) {
        next(error);
    }
};
