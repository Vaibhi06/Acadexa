import { Op } from 'sequelize';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import { successResponse, errorResponse } from '../utils/response.js';
import sequelize from '../config/database.js';

/**
 * @desc    Mark attendance for a class
 * @route   POST /api/attendance
 * @access  Private (Admin/Faculty)
 */
export const markAttendance = async (req, res, next) => {
    try {
        const { date, classCode, students } = req.body;

        if (!date || !classCode || !students || !Array.isArray(students)) {
            return errorResponse(res, 400, 'Invalid data provided');
        }

        // Use transaction for bulk operations
        const result = await sequelize.transaction(async (t) => {
            let createdCount = 0;
            let updatedCount = 0;

            for (const student of students) {
                const [record, created] = await Attendance.findOrCreate({
                    where: {
                        date,
                        studentId: student.id
                    },
                    defaults: {
                        classCode,
                        status: student.status
                    },
                    transaction: t
                });

                if (!created) {
                    // Update existing record if status changed
                    if (record.status !== student.status) {
                        record.status = student.status;
                        record.classCode = classCode; // Ensure classCode is consistent
                        await record.save({ transaction: t });
                        updatedCount++;
                    }
                } else {
                    createdCount++;
                }
            }
            return { createdCount, updatedCount };
        });

        return successResponse(res, 200, 'Attendance saved successfully', result);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get attendance for a class on a specific date or range
 * @route   GET /api/attendance
 * @access  Private
 */
export const getAttendance = async (req, res, next) => {
    try {
        const { date, startDate, endDate, classCode } = req.query;

        if (!classCode) {
            return errorResponse(res, 400, 'Class Code is required');
        }

        const whereClause = { classCode };

        if (date) {
            whereClause.date = date;
        } else if (startDate && endDate) {
            whereClause.date = {
                [Op.between]: [startDate, endDate]
            };
        } else {
            // Fallback to today or return all?
            // Returning error encourages range specification
            return errorResponse(res, 400, 'Date or Date Range is required');
        }

        const attendance = await Attendance.findAll({
            where: whereClause
        });

        return successResponse(res, 200, 'Attendance records retrieved', attendance);

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get attendance stats for a student
 * @route   GET /api/attendance/student/:studentId
 * @access  Private
 */
export const getStudentAttendance = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        const records = await Attendance.findAll({
            where: { studentId },
            order: [['date', 'DESC']]
        });

        return successResponse(res, 200, 'Student attendance history', records);
    } catch (error) {
        next(error);
    }
};
