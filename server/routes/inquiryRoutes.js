import express from 'express';
import {
    createInquiry,
    getAllInquiries,
    updateInquiryStatus,
    addFollowUp,
    deleteInquiry
} from '../controllers/inquiryController.js';

const router = express.Router();

router.route('/')
    .post(createInquiry)
    .get(getAllInquiries);

router.patch('/:id/status', updateInquiryStatus);
router.post('/:id/follow-up', addFollowUp);
router.delete('/:id', deleteInquiry);

export default router;
