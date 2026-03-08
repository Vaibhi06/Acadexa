import FeeStructure from '../models/FeeStructure.js';
import Student from '../models/Student.js';

// ========== Fee Structure Management ==========
export const createFeeStructure = async (req, res) => {
    try {
        const feeStructure = await FeeStructure.create(req.body);
        res.status(201).json(feeStructure);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getFeeStructures = async (req, res) => {
    try {
        const structures = await FeeStructure.findAll();
        res.json(structures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateFeeStructure = async (req, res) => {
    try {
        const structure = await FeeStructure.findByPk(req.params.id);
        if (!structure) return res.status(404).json({ message: 'Fee Structure not found' });
        await structure.update(req.body);
        res.json(structure);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteFeeStructure = async (req, res) => {
    try {
        const structure = await FeeStructure.findByPk(req.params.id);
        if (!structure) return res.status(404).json({ message: 'Fee Structure not found' });
        await structure.destroy();
        res.json({ message: 'Fee Structure removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ========== Student Fee Management ==========

// Get all students with their fee details
export const getAllStudentFees = async (req, res) => {
    try {
        const students = await Student.findAll({
            attributes: ['id', 'firstName', 'lastName', 'classCode', 'phone', 'guardianPhone', 'fees', 'status'],
            where: { status: 'active' }
        });

        const formatted = students.map(student => ({
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
            class: student.classCode,
            phone: student.phone || student.guardianPhone,
            totalFees: student.fees?.total || 0,
            paid: student.fees?.paid || 0,
            pending: student.fees?.pending || 0,
            status: (student.fees?.pending > 0) ? 'partial' : 'paid',
            lastUpdated: student.updatedAt
        }));

        res.json({
            success: true,
            count: formatted.length,
            data: formatted
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get fee details for a specific student
export const getStudentFees = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.studentId, {
            attributes: ['id', 'firstName', 'lastName', 'classCode', 'phone', 'guardianPhone', 'fees']
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            data: {
                id: student.id,
                name: `${student.firstName} ${student.lastName}`,
                class: student.classCode,
                phone: student.phone || student.guardianPhone,
                fees: student.fees || { total: 0, paid: 0, pending: 0 }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update student fee details
export const updateStudentFees = async (req, res) => {
    try {
        const { total, paid, pending } = req.body;
        const student = await Student.findByPk(req.params.studentId);

        console.log(`\n--- Fee Update Request for Student: ${req.params.studentId} ---`);
        console.log('Incoming Data:', { total, paid, pending });

        if (!student) {
            console.log('❌ Student not found');
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Ensure we are working with numbers
        const totalNum = total !== undefined ? parseFloat(total) : (student.fees?.total || 0);
        const paidNum = paid !== undefined ? parseFloat(paid) : (student.fees?.paid || 0);
        const pendingNum = pending !== undefined ? parseFloat(pending) : (totalNum - paidNum);

        const updatedFees = {
            total: totalNum,
            paid: paidNum,
            pending: pendingNum
        };

        // Use set and save for more reliable JSON column updates
        student.set('fees', updatedFees);
        await student.save();

        res.json({
            success: true,
            message: 'Fee details updated successfully and stored in database',
            data: {
                id: student.id,
                name: `${student.firstName} ${student.lastName}`,
                fees: student.fees
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Record a payment for a student
export const recordPayment = async (req, res) => {
    try {
        const { amount, paymentMethod, transactionId, notes } = req.body;
        const student = await Student.findByPk(req.params.studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const currentFees = student.fees || { total: 0, paid: 0, pending: 0 };
        const newPaid = (currentFees.paid || 0) + parseFloat(amount);
        const newPending = (currentFees.total || 0) - newPaid;

        const updatedFees = {
            total: currentFees.total || 0,
            paid: newPaid,
            pending: Math.max(0, newPending) // Don't allow negative pending
        };

        // Use set and save for JSON column persistence
        student.set('fees', updatedFees);
        await student.save();

        res.json({
            success: true,
            message: 'Payment recorded successfully',
            data: {
                id: student.id,
                name: `${student.firstName} ${student.lastName}`,
                paymentAmount: amount,
                paymentMethod,
                transactionId,
                fees: updatedFees
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get fee summary statistics
export const getFeeSummary = async (req, res) => {
    try {
        const students = await Student.findAll({
            attributes: ['fees', 'status'],
            where: { status: 'active' }
        });

        const summary = students.reduce((acc, student) => {
            const fees = student.fees || { total: 0, paid: 0, pending: 0 };
            acc.totalAmount += fees.total || 0;
            acc.paidAmount += fees.paid || 0;
            acc.pendingAmount += fees.pending || 0;

            if (fees.pending > 0) {
                acc.pendingCount++;
            } else {
                acc.paidCount++;
            }

            return acc;
        }, {
            totalAmount: 0,
            paidAmount: 0,
            pendingAmount: 0,
            paidCount: 0,
            pendingCount: 0
        });

        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

