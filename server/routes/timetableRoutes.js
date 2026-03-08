import express from 'express';
import { saveTimetable, getTimetable } from '../controllers/timetableController.js';

const router = express.Router();

router.route('/')
    .post(saveTimetable)
    .get(getTimetable);

export default router;
