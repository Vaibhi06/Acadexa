import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Syllabus = sequelize.define('Syllabus', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    faculty: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Complex nested structure: Chapters -> Topics
    chapters: {
        type: DataTypes.JSON,
        defaultValue: []
    }
}, {
    tableName: 'syllabus',
    timestamps: true
});

export default Syllabus;
