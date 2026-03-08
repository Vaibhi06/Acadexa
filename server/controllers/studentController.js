import Student from '../models/Student.js';
import sequelize from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Private
 */
export const getAllStudents = async (req, res, next) => {
    try {
        const students = await Student.findAll({
            where: { isActive: true },
            order: [['createdAt', 'DESC']]
        });

        // Add name field for frontend compatibility
        const studentsWithName = students.map(s => ({
            ...s.toJSON(),
            name: `${s.firstName} ${s.lastName}`
        }));

        return successResponse(res, 200, 'Students retrieved successfully', {
            students: studentsWithName
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get student by ID
 * @route   GET /api/students/:id
 * @access  Private
 */
export const getStudentById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const student = await Student.findByPk(id);

        if (!student) {
            return errorResponse(res, 404, 'Student not found');
        }

        const studentData = {
            ...student.toJSON(),
            name: `${student.firstName} ${student.lastName}`
        };

        return successResponse(res, 200, 'Student retrieved successfully', {
            student: studentData
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get students by class
 * @route   GET /api/students/class/:className
 * @access  Private
 */
export const getStudentsByClass = async (req, res, next) => {
    try {
        const { classCode } = req.params;

        const students = await Student.findAll({
            where: {
                classCode: classCode,
                isActive: true
            }
        });

        const studentsWithName = students.map(s => ({
            ...s.toJSON(),
            name: `${s.firstName} ${s.lastName}`
        }));

        return successResponse(res, 200, 'Students retrieved successfully', {
            students: studentsWithName
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new student
 * @route   POST /api/students
 * @access  Private (Admin only)
 */
export const createStudent = async (req, res, next) => {
    try {
        const studentData = req.body;

        // Check if email already exists
        const existingStudent = await Student.findOne({
            where: { email: studentData.email }
        });

        if (existingStudent) {
            return errorResponse(res, 400, 'Student with this email already exists');
        }

        // Create new student
        const student = await Student.create(studentData);

        const studentResponse = {
            ...student.toJSON(),
            name: `${student.firstName} ${student.lastName}`
        };

        return successResponse(res, 201, 'Student created successfully', {
            student: studentResponse
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update student
 * @route   PUT /api/students/:id
 * @access  Private (Admin only)
 */
export const updateStudent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const student = await Student.findByPk(id);

        if (!student) {
            return errorResponse(res, 404, 'Student not found');
        }

        // Check if email is being changed and if it conflicts
        if (updateData.email && updateData.email !== student.email) {
            const existingStudent = await Student.findOne({
                where: { email: updateData.email }
            });
            if (existingStudent) {
                return errorResponse(res, 400, 'Email already in use');
            }
        }

        // Update student
        await student.update(updateData);

        const studentResponse = {
            ...student.toJSON(),
            name: `${student.firstName} ${student.lastName}`
        };

        return successResponse(res, 200, 'Student updated successfully', {
            student: studentResponse
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete student (soft delete)
 * @route   DELETE /api/students/:id
 * @access  Private (Admin only)
 */
export const deleteStudent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const student = await Student.findByPk(id);

        if (!student) {
            return errorResponse(res, 404, 'Student not found');
        }

        // Soft delete
        await student.update({ isActive: false });

        return successResponse(res, 200, 'Student deleted successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get student statistics
 * @route   GET /api/students/stats/summary
 * @access  Private
 */
export const getStudentStats = async (req, res, next) => {
    try {
        const totalStudents = await Student.count({ where: { isActive: true } });

        const activeStudents = await Student.count({
            where: { status: 'active', isActive: true }
        });

        const classDistribution = await Student.findAll({
            attributes: [
                'class',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: { isActive: true },
            group: ['class']
        });

        return successResponse(res, 200, 'Statistics retrieved successfully', {
            totalStudents,
            activeStudents,
            classDistribution
        });
    } catch (error) {
        next(error);
    }
};
