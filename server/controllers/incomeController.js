import Income from '../models/Income.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAllIncomes = async (req, res, next) => {
    try {
        const incomes = await Income.findAll({
            order: [['date', 'DESC']]
        });
        return successResponse(res, 200, 'Incomes retrieved successfully', { incomes });
    } catch (error) {
        next(error);
    }
};

export const createIncome = async (req, res, next) => {
    try {
        const { date, description, category, amount } = req.body;
        const newIncome = await Income.create({ date, description, category, amount });
        return successResponse(res, 201, 'Income created successfully', { income: newIncome });
    } catch (error) {
        next(error);
    }
};

export const updateIncome = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { date, description, category, amount } = req.body;
        const income = await Income.findByPk(id);
        if (!income) return errorResponse(res, 404, 'Income not found');

        await income.update({ date, description, category, amount });
        return successResponse(res, 200, 'Income updated successfully', { income });
    } catch (error) {
        next(error);
    }
};

export const deleteIncome = async (req, res, next) => {
    try {
        const { id } = req.params;
        const income = await Income.findByPk(id);
        if (!income) return errorResponse(res, 404, 'Income not found');

        await income.destroy();
        return successResponse(res, 200, 'Income deleted successfully');
    } catch (error) {
        next(error);
    }
};
