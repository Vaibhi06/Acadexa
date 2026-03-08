import Timetable from '../models/Timetable.js';

export const saveTimetable = async (req, res) => {
    try {
        const { class: className, schedules } = req.body;
        // Expecting schedules to be an array of periods (id, time, days...)
        // We might want to clear existing for the class and rewrite, or update.
        // For simplicity: Delete existing for class and re-create.

        await Timetable.destroy({ where: { class: className } });

        const created = await Timetable.bulkCreate(schedules.map(s => ({ ...s, class: className })));

        res.json({ message: 'Timetable saved', data: created });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getTimetable = async (req, res) => {
    try {
        const { class: className } = req.query;
        const where = className ? { class: className } : {};
        const timetable = await Timetable.findAll({ where });
        res.json(timetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
