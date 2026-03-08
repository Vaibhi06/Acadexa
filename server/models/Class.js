import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Class = sequelize.define('Class', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    year: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '2024-25'
    },
    students: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    faculty: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'classes',
    timestamps: true
});

export default Class;
