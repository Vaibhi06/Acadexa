import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Faculty = sequelize.define('Faculty', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // We can generate a custom string ID like FAC001 in the controller or use this ID
    facultyId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subjects: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    classes: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: []
    },
    salary: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    joiningDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'faculty',
    timestamps: true
});

export default Faculty;
