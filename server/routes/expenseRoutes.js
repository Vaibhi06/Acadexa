import express from 'express';
import {
    getAllExpenses,
    createExpense,
    updateExpense,
    deleteExpense
} from '../controllers/expenseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllExpenses);
router.post('/', protect, authorize('admin'), createExpense);
router.put('/:id', protect, authorize('admin'), updateExpense);
router.delete('/:id', protect, authorize('admin'), deleteExpense);

export default router;
