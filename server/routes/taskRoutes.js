import express from 'express';
import {
    createTask,
    getAllTasks,
    updateTaskStatus,
    deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

router.route('/')
    .post(createTask)
    .get(getAllTasks);

router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
