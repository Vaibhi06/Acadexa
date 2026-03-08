import express from 'express';
import { createNotice, getNotices } from '../controllers/noticeController.js';

const router = express.Router();

router.route('/')
    .post(createNotice)
    .get(getNotices);

export default router;
