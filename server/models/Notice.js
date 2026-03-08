import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notice = sequelize.define('Notice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    recipientType: {
        type: DataTypes.ENUM('student', 'faculty', 'all'),
        allowNull: false
    },
    targetClass: {
        type: DataTypes.STRING, // e.g. "10th Grade A" or "all"
        allowNull: true
    },
    postedBy: {
        type: DataTypes.STRING,
        defaultValue: 'Admin'
    }
}, {
    tableName: 'notices',
    timestamps: true
});

export default Notice;
