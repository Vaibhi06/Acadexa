import express from 'express';
import {
    getAllIncomes,
    createIncome,
    updateIncome,
    deleteIncome
} from '../controllers/incomeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllIncomes);
router.post('/', protect, authorize('admin'), createIncome);
router.put('/:id', protect, authorize('admin'), updateIncome);
router.delete('/:id', protect, authorize('admin'), deleteIncome);

export default router;
