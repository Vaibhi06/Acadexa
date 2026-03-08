import express from 'express';
import { markAttendance, getAttendance, getStudentAttendance } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Routes
router.post('/', protect, authorize('admin', 'faculty'), markAttendance);
router.get('/', protect, getAttendance);
router.get('/student/:studentId', protect, getStudentAttendance);

export default router;
