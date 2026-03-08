import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Inquiry = sequelize.define('Inquiry', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studentName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    studentMobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fatherMobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    schoolName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    percentage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    std: {
        type: DataTypes.STRING,
        allowNull: false
    },
    medium: {
        type: DataTypes.STRING,
        allowNull: true
    },
    group: {
        type: DataTypes.STRING,
        allowNull: true
    },
    referenceBy: {
        type: DataTypes.STRING,
        allowNull: true
    },
    interestLevel: {
        type: DataTypes.ENUM('High', 'Medium', 'Low'),
        defaultValue: 'Medium'
    },
    status: {
        type: DataTypes.ENUM('new', 'in-progress', 'converted'),
        defaultValue: 'new'
    },
    followUpDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    followUpTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    followUps: {
        type: DataTypes.JSON, // Stores array of { date, note } objects
        defaultValue: []
    }
}, {
    tableName: 'inquiries',
    timestamps: true
});

export default Inquiry;
