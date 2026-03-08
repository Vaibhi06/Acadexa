import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed'),
        defaultValue: 'pending'
    },
    assignedTo: {
        type: DataTypes.STRING,
        defaultValue: 'Self'
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'tasks',
    timestamps: true
});

export default Task;
