import express from 'express';
import { createExam, getAllExams, deleteExam } from '../controllers/examController.js';

const router = express.Router();

router.route('/')
    .post(createExam)
    .get(getAllExams);

router.route('/:id')
    .delete(deleteExam);

export default router;
