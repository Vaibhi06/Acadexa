import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Timetable = sequelize.define('Timetable', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Storing daily schedules as JSON objects or simple strings
    monday: { type: DataTypes.JSON, allowNull: true },
    tuesday: { type: DataTypes.JSON, allowNull: true },
    wednesday: { type: DataTypes.JSON, allowNull: true },
    thursday: { type: DataTypes.JSON, allowNull: true },
    friday: { type: DataTypes.JSON, allowNull: true },
    saturday: { type: DataTypes.JSON, allowNull: true },
    sunday: { type: DataTypes.JSON, allowNull: true }
}, {
    tableName: 'timetables',
    timestamps: true
});

export default Timetable;
