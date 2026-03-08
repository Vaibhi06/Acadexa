import express from 'express';
import {
    createFaculty,
    getAllFaculty,
    updateFaculty,
    deleteFaculty
} from '../controllers/facultyController.js';

const router = express.Router();

router.route('/')
    .post(createFaculty)
    .get(getAllFaculty);

router.route('/:id')
    .put(updateFaculty)
    .delete(deleteFaculty);

export default router;
