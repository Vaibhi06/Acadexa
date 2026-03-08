import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    classCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    studentId: {
        type: DataTypes.STRING, // 6-digit numeric string
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('present', 'absent'),
        allowNull: false,
        defaultValue: 'present'
    }
}, {
    tableName: 'attendance',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['date', 'studentId'] // One record per student per day
        },
        {
            fields: ['classCode', 'date'] // Fast lookup for class view
        }
    ]
});

export default Attendance;
