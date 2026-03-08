import { body, validationResult } from 'express-validator';
import { errorResponse } from '../utils/response.js';

/**
 * Validation rules for user signup
 */
export const signupValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('role')
        .optional()
        .isIn(['admin', 'faculty', 'student'])
        .withMessage('Role must be admin, faculty, or student')
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

/**
 * Middleware to check validation results
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));

        return errorResponse(res, 400, 'Validation failed', formattedErrors);
    }

    next();
};
