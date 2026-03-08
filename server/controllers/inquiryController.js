import Inquiry from '../models/Inquiry.js';

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Private/Admin
export const createInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.create(req.body);
        res.status(201).json(inquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
export const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update inquiry status
// @route   PATCH /api/inquiries/:id/status
// @access  Private/Admin
export const updateInquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const inquiry = await Inquiry.findByPk(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        inquiry.status = status;
        await inquiry.save();

        res.json(inquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Add follow-up note
// @route   POST /api/inquiries/:id/follow-up
// @access  Private/Admin
export const addFollowUp = async (req, res) => {
    try {
        const { note } = req.body;
        const inquiry = await Inquiry.findByPk(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        const newFollowUp = {
            date: new Date().toISOString().split('T')[0],
            note: note
        };

        // Initialize followUps if null (though default is [])
        const currentFollowUps = inquiry.followUps || [];

        // Sequelize JSON array update
        inquiry.followUps = [...currentFollowUps, newFollowUp];
        await inquiry.save();

        res.json(inquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
export const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByPk(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        await inquiry.destroy();
        res.json({ message: 'Inquiry removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
