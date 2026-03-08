import express from 'express';
import {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
    getClassNames
} from '../controllers/classController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes (protected by authentication)
router.get('/', protect, getAllClasses);
router.get('/names', protect, getClassNames);
router.get('/:id', protect, getClassById);

// Admin only routes
router.post('/', protect, authorize('admin'), createClass);
router.put('/:id', protect, authorize('admin'), updateClass);
router.delete('/:id', protect, authorize('admin'), deleteClass);

export default router;
