import express from 'express';
import authRoutes from './authRoutes.js';
import classRoutes from './classRoutes.js';
import studentRoutes from './studentRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import inquiryRoutes from './inquiryRoutes.js';
import taskRoutes from './taskRoutes.js';
import facultyRoutes from './facultyRoutes.js';
import feeRoutes from './feeRoutes.js';
import examRoutes from './examRoutes.js';
import markRoutes from './markRoutes.js';
import syllabusRoutes from './syllabusRoutes.js';
import timetableRoutes from './timetableRoutes.js';
import studyMaterialRoutes from './studyMaterialRoutes.js';
import noticeRoutes from './noticeRoutes.js';
import incomeRoutes from './incomeRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/classes', classRoutes);
router.use('/students', studentRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/tasks', taskRoutes);
router.use('/faculty', facultyRoutes);
router.use('/fees', feeRoutes);
router.use('/exams', examRoutes);
router.use('/marks', markRoutes);
router.use('/syllabus', syllabusRoutes);
router.use('/timetable', timetableRoutes);
router.use('/materials', studyMaterialRoutes);
router.use('/notices', noticeRoutes);
router.use('/incomes', incomeRoutes);
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes);

// API health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

export default router;
