import express from 'express';
import { saveSyllabus, getSyllabus, generateSyllabus } from '../controllers/syllabusController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .post(protect, saveSyllabus) // Save/Update
    .get(protect, getSyllabus);   // Fetch all

router.post('/ai-generate', protect, generateSyllabus);

export default router;
