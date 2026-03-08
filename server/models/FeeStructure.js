import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FeeStructure = sequelize.define('FeeStructure', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false
    },
    totalFees: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    academicYear: {
        type: DataTypes.STRING,
        defaultValue: '2025-2026'
    },
    installments: {
        type: DataTypes.JSON, // Array of { id, amount, dueDate }
        defaultValue: []
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'fee_structures',
    timestamps: true
});

export default FeeStructure;
