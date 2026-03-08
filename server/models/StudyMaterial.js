import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StudyMaterial = sequelize.define('StudyMaterial', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
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
    fileName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileUrl: { // In a real app this would be a path or S3 URL. For now we just store the name or simulate it.
        type: DataTypes.STRING,
        allowNull: true
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true
    },
    version: {
        type: DataTypes.STRING,
        defaultValue: 'v1.0'
    }
}, {
    tableName: 'study_materials',
    timestamps: true
});

export default StudyMaterial;
