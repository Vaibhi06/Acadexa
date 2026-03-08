import express from 'express';
import {
    getAllStudents,
    getStudentById,
    getStudentsByClass,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentStats
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes (protected by authentication)
router.get('/', protect, getAllStudents);
router.get('/stats/summary', protect, getStudentStats);
router.get('/class/:classCode', protect, getStudentsByClass);
router.get('/:id', protect, getStudentById);

// Admin only routes
router.post('/', protect, authorize('admin'), createStudent);
router.put('/:id', protect, authorize('admin'), updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

export default router;
