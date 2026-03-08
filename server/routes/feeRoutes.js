import express from 'express';
import {
    createFeeStructure,
    getFeeStructures,
    updateFeeStructure,
    deleteFeeStructure,
    getAllStudentFees,
    getStudentFees,
    updateStudentFees,
    recordPayment,
    getFeeSummary
} from '../controllers/feeController.js';

const router = express.Router();

// Fee Structure Routes
router.route('/')
    .post(createFeeStructure)
    .get(getFeeStructures);

router.route('/:id')
    .put(updateFeeStructure)
    .delete(deleteFeeStructure);

// Student Fee Management Routes
router.get('/students/all', getAllStudentFees);
router.get('/students/:studentId', getStudentFees);
router.put('/students/:studentId', updateStudentFees);
router.post('/students/:studentId/payment', recordPayment);
router.get('/summary/stats', getFeeSummary);

export default router;
