/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object} data - Response data
 */
export const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
    const response = {
        success: true,
        message,
        ...(data && { data })
    };

    return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Array} errors - Array of error details
 */
export const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
    const response = {
        success: false,
        message,
        ...(errors && { errors })
    };

    return res.status(statusCode).json(response);
};
