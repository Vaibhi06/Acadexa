import sequelize from './config/database.js';
import Student from './models/Student.js';
import Attendance from './models/Attendance.js';
import Inquiry from './models/Inquiry.js';
import Task from './models/Task.js';
import Faculty from './models/Faculty.js';
import FeeStructure from './models/FeeStructure.js';
import Exam from './models/Exam.js';
import Mark from './models/Mark.js';
import Timetable from './models/Timetable.js';
import Syllabus from './models/Syllabus.js';
import StudyMaterial from './models/StudyMaterial.js';
import Notice from './models/Notice.js';

async function syncDatabase() {
    try {
        console.log('🔄 Synchronizing database schema with models...\n');

        console.log('📋 Student model loaded. Columns defined:');
        Object.keys(Student.rawAttributes).forEach(attr => console.log(`  - ${attr}`));

        console.log('\n📋 Attendance model loaded. Columns defined:');
        Object.keys(Attendance.rawAttributes).forEach(attr => console.log(`  - ${attr}`));

        console.log('\n📋 Inquiry model loaded. Columns defined:');
        Object.keys(Inquiry.rawAttributes).forEach(attr => console.log(`  - ${attr}`));

        console.log('\n📋 Task model loaded. Columns defined:');
        Object.keys(Task.rawAttributes).forEach(attr => console.log(`  - ${attr}`));

        console.log('\n📋 Faculty model loaded.');
        console.log('\n📋 FeeStructure model loaded.');
        console.log('\n📋 Exam model loaded.');
        console.log('\n📋 Mark model loaded.');
        console.log('\n📋 Timetable model loaded.');
        console.log('\n📋 Syllabus model loaded.');
        console.log('\n📋 StudyMaterial model loaded.');
        console.log('\n📋 Notice model loaded.');

        console.log('\n🔧 Applying changes to database...');

        // This will update the database tables to match the models
        // alter: true will modify existing tables to match the model
        await sequelize.sync({ alter: true });

        console.log('\n✅ Database synchronized successfully!');
        console.log('All model columns have been added to the database tables.');
        console.log('The middleName column (and any other missing columns) should now exist.\n');

    } catch (error) {
        console.error('❌ Error syncing database:', error.message);
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase();
