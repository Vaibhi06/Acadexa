import Student from '../models/Student.js';
import Class from '../models/Class.js';
import Faculty from '../models/Faculty.js';
import Inquiry from '../models/Inquiry.js';
import Attendance from '../models/Attendance.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { Op } from 'sequelize';

export const getDashboardStats = async (req, res, next) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Parallel execution for independent queries
        const [
            totalStudents,
            totalClasses,
            totalFaculty,
            activeInquiries,
            todayPresent,
            todayAbsent,
            studentsWithFees
        ] = await Promise.all([
            Student.count({ where: { status: 'active' } }),
            Class.count({ where: { isActive: true } }),
            Faculty.count(),
            Inquiry.count({
                where: {
                    status: { [Op.in]: ['new', 'in-progress'] }
                }
            }),
            Attendance.count({
                where: {
                    date: today,
                    status: 'present'
                }
            }),
            Attendance.count({
                where: {
                    date: today,
                    status: 'absent'
                }
            }),
            Student.findAll({
                attributes: ['fees'],
                where: { status: 'active' }
            })
        ]);

        // Calculate Fee Stats from JSON
        let feeStats = {
            totalAmount: 0,
            paidAmount: 0,
            pendingAmount: 0,
            paidCount: 0,
            pendingCount: 0
        };

        studentsWithFees.forEach(student => {
            const fees = student.fees || { total: 0, paid: 0, pending: 0 };
            feeStats.totalAmount += parseInt(fees.total || 0);
            feeStats.paidAmount += parseInt(fees.paid || 0);
            feeStats.pendingAmount += parseInt(fees.pending || 0);

            if (parseInt(fees.pending) > 0) {
                feeStats.pendingCount++;
            } else if (parseInt(fees.total) > 0 && parseInt(fees.pending) === 0) {
                feeStats.paidCount++;
            }
        });

        // Response Data
        const stats = {
            counts: {
                students: totalStudents,
                classes: totalClasses,
                faculty: totalFaculty,
                inquiries: activeInquiries
            },
            attendance: {
                present: todayPresent,
                absent: todayAbsent,
                late: 0, // Not tracked currently
                total: totalStudents // Assuming all active students should attend
            },
            fees: feeStats
        };

        return successResponse(res, 200, 'Dashboard stats retrieved successfully', { stats });
    } catch (error) {
        next(error);
    }
};
