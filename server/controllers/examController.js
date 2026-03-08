import Exam from '../models/Exam.js';

export const createExam = async (req, res) => {
    try {
        const exam = await Exam.create(req.body);
        res.status(201).json(exam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllExams = async (req, res) => {
    try {
        const exams = await Exam.findAll();
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findByPk(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });
        await exam.destroy();
        res.json({ message: 'Exam removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
