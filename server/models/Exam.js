import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Exam = sequelize.define('Exam', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING, // e.g., Mid-Term Exam
        allowNull: false
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING, // e.g., 10:00 AM
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('upcoming', 'completed', 'cancelled'),
        defaultValue: 'upcoming'
    }
}, {
    tableName: 'exams',
    timestamps: true
});

export default Exam;
