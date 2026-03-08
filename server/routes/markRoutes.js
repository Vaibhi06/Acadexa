import express from 'express';
import { saveMarks, getMarks } from '../controllers/markController.js';

const router = express.Router();

router.route('/')
    .post(saveMarks)
    .get(getMarks);

export default router;
