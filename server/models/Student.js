import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    middleName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    uid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    aadharCard: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 12]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },

    classCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false
    },
    joiningDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    guardianName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    guardianPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'graduated'),
        defaultValue: 'active'
    },
    attendance: {
        type: DataTypes.STRING,
        defaultValue: '0%'
    },
    marks: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    fees: {
        type: DataTypes.JSON,
        defaultValue: () => ({
            total: 0,
            paid: 0,
            pending: 0
        })
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'students',
    timestamps: true,
    hooks: {
        beforeCreate: async (student) => {
            if (!student.id) {
                let unique = false;
                let newId;
                while (!unique) {
                    newId = Math.floor(100000 + Math.random() * 900000).toString();
                    const count = await student.constructor.count({ where: { id: newId } });
                    if (count === 0) unique = true;
                }
                student.id = newId;
            }
        }
    },
    indexes: [
        { fields: ['email'] },
        { fields: ['classCode'] },
        { fields: ['status'] }
    ]
});

// Virtual field for full name
Student.prototype.getFullName = function () {
    return `${this.firstName} ${this.lastName}`;
};

export default Student;
