import Notice from '../models/Notice.js';

export const createNotice = async (req, res) => {
    try {
        const notice = await Notice.create(req.body);
        res.status(201).json(notice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getNotices = async (req, res) => {
    try {
        const notices = await Notice.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
