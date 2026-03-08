import Faculty from '../models/Faculty.js';

export const createFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.create(req.body);
        res.status(201).json(faculty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findAll();
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findByPk(req.params.id);
        if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
        await faculty.update(req.body);
        res.json(faculty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findByPk(req.params.id);
        if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
        await faculty.destroy();
        res.json({ message: 'Faculty removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
