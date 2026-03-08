import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Mark = sequelize.define('Mark', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studentId: {
        type: DataTypes.STRING, // Linking to Student ID string like STU001
        allowNull: false
    },
    studentName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false
    },
    examId: {
        type: DataTypes.INTEGER, // References Exam model
        allowNull: true
    },
    examName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marksObtained: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    maxMarks: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 100
    }
}, {
    tableName: 'marks',
    timestamps: true
});

export default Mark;
