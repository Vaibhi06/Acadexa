import sequelize from './config/database.js';
import Attendance from './models/Attendance.js';
import Class from './models/Class.js';
import Exam from './models/Exam.js';
import Expense from './models/Expense.js';
import Faculty from './models/Faculty.js';
import FeeStructure from './models/FeeStructure.js';
import Income from './models/Income.js';
import Inquiry from './models/Inquiry.js';
import Mark from './models/Mark.js';
import Notice from './models/Notice.js';
import Student from './models/Student.js';
import StudyMaterial from './models/StudyMaterial.js';
import Syllabus from './models/Syllabus.js';
import Task from './models/Task.js';
import Timetable from './models/Timetable.js';
import User from './models/User.js';

async function checkSync() {
    try {
        console.log('🔄 Authenticating...');
        await sequelize.authenticate();
        console.log('✅ Authenticated.');

        console.log('🔄 Syncing FULL DATABASE...');
        await sequelize.sync({ alter: true });
        console.log('✅ Database Synchronized');

        process.exit(0);
    } catch (error) {
        console.error('❌ Sync failed:', error);
        process.exit(1);
    }
}

checkSync();
