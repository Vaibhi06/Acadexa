import Class from '../models/Class.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * @desc    Get all classes
 * @route   GET /api/classes
 * @access  Private
 */
export const getAllClasses = async (req, res, next) => {
    try {
        const classes = await Class.findAll({
            where: { isActive: true },
            order: [['createdAt', 'DESC']]
        });

        return successResponse(res, 200, 'Classes retrieved successfully', {
            classes
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get class by ID
 * @route   GET /api/classes/:id
 * @access  Private
 */
export const getClassById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const classItem = await Class.findByPk(id);

        if (!classItem) {
            return errorResponse(res, 404, 'Class not found');
        }

        return successResponse(res, 200, 'Class retrieved successfully', {
            class: classItem
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new class
 * @route   POST /api/classes
 * @access  Private (Admin only)
 */
export const createClass = async (req, res, next) => {
    try {
        const { name, code, year, faculty } = req.body;

        // Check if class code already exists
        const existingClass = await Class.findOne({ where: { code } });

        if (existingClass) {
            return errorResponse(res, 400, 'Class with this code already exists');
        }

        // Create new class
        const newClass = await Class.create({
            name,
            code,
            year: year || '2024-25',
            faculty,
            students: 0
        });

        return successResponse(res, 201, 'Class created successfully', {
            class: newClass
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update class
 * @route   PUT /api/classes/:id
 * @access  Private (Admin only)
 */
export const updateClass = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, code, year, faculty, students } = req.body;

        const classItem = await Class.findByPk(id);

        if (!classItem) {
            return errorResponse(res, 404, 'Class not found');
        }

        // Check if new code conflicts with existing class
        if (code && code !== classItem.code) {
            const existingClass = await Class.findOne({ where: { code } });
            if (existingClass) {
                return errorResponse(res, 400, 'Class with this code already exists');
            }
        }

        // Update class
        await classItem.update({
            name: name || classItem.name,
            code: code || classItem.code,
            year: year || classItem.year,
            faculty: faculty !== undefined ? faculty : classItem.faculty,
            students: students !== undefined ? students : classItem.students
        });

        return successResponse(res, 200, 'Class updated successfully', {
            class: classItem
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete class
 * @route   DELETE /api/classes/:id
 * @access  Private (Admin only)
 */
export const deleteClass = async (req, res, next) => {
    try {
        const { id } = req.params;

        const classItem = await Class.findByPk(id);

        if (!classItem) {
            return errorResponse(res, 404, 'Class not found');
        }

        // Soft delete by marking as inactive
        await classItem.update({ isActive: false });

        return successResponse(res, 200, 'Class deleted successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get class names only (for dropdowns)
 * @route   GET /api/classes/names
 * @access  Private
 */
export const getClassNames = async (req, res, next) => {
    try {
        const classes = await Class.findAll({
            where: { isActive: true },
            attributes: ['id', 'name', 'code'],
            order: [['name', 'ASC']]
        });

        const classNames = classes.map(c => ({ id: c.id, name: c.name, code: c.code }));

        return successResponse(res, 200, 'Class names retrieved successfully', {
            classes: classNames
        });
    } catch (error) {
        next(error);
    }
};
