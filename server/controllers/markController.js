import Mark from '../models/Mark.js';

export const saveMarks = async (req, res) => {
    try {
        // Expecting an array of mark objects or a single object
        const marksData = req.body;

        let savedMarks;
        if (Array.isArray(marksData)) {
            // Bulk create or update
            // For simplicity in this demo, we'll try to find existing and update, or create
            savedMarks = [];
            for (const data of marksData) {
                const [mark, created] = await Mark.findOrCreate({
                    where: {
                        studentId: data.studentId,
                        subject: data.subject,
                        examName: data.examName
                    },
                    defaults: data
                });
                if (!created) {
                    await mark.update(data);
                }
                savedMarks.push(mark);
            }
        } else {
            savedMarks = await Mark.create(marksData);
        }

        res.status(201).json(savedMarks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMarks = async (req, res) => {
    try {
        // Can filter by studentId, class, etc. via query params
        const { studentId, class: className, examName } = req.query;
        const where = {};
        if (studentId) where.studentId = studentId;
        if (className) where.class = className;
        if (examName) where.examName = examName;

        const marks = await Mark.findAll({ where });
        res.json(marks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
