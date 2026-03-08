import Expense from '../models/Expense.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAllExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll({
            order: [['date', 'DESC']]
        });
        return successResponse(res, 200, 'Expenses retrieved successfully', { expenses });
    } catch (error) {
        next(error);
    }
};

export const createExpense = async (req, res, next) => {
    try {
        const { date, description, category, amount } = req.body;
        const newExpense = await Expense.create({ date, description, category, amount });
        return successResponse(res, 201, 'Expense created successfully', { expense: newExpense });
    } catch (error) {
        next(error);
    }
};

export const updateExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { date, description, category, amount } = req.body;
        const expense = await Expense.findByPk(id);
        if (!expense) return errorResponse(res, 404, 'Expense not found');

        await expense.update({ date, description, category, amount });
        return successResponse(res, 200, 'Expense updated successfully', { expense });
    } catch (error) {
        next(error);
    }
};

export const deleteExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findByPk(id);
        if (!expense) return errorResponse(res, 404, 'Expense not found');

        await expense.destroy();
        return successResponse(res, 200, 'Expense deleted successfully');
    } catch (error) {
        next(error);
    }
};
