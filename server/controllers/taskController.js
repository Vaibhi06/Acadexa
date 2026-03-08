import Task from '../models/Task.js';

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Toggle status or use provided status
        task.status = task.status === 'pending' ? 'completed' : 'pending';
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.destroy();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
