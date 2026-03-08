// Database content checker with file output
import { sequelize } from './config/database.js';
import Student from './models/Student.js';
import Class from './models/Class.js';
import Faculty from './models/Faculty.js';
import Inquiry from './models/Inquiry.js';
import User from './models/User.js';
import Attendance from './models/Attendance.js';
import fs from 'fs';

async function checkDatabase() {
    let output = '';

    try {
        await sequelize.authenticate();
        output += '\n✅ Database Connected!\n';
        output += `📁 Database: ${sequelize.config.database}\n`;
        output += '='.repeat(60) + '\n\n';

        const students = await Student.count();
        const classes = await Class.count();
        const faculty = await Faculty.count();
        const inquiries = await Inquiry.count();
        const users = await User.count();
        const attendances = await Attendance.count();

        output += '📊 DATABASE TABLES:\n';
        output += '='.repeat(60) + '\n';
        output += `\n👥 USERS TABLE: ${users} records\n`;
        output += `🎓 STUDENTS TABLE: ${students} records ${students === 0 ? '⚠️  EMPTY!' : '✅'}\n`;
        output += `📚 CLASSES TABLE: ${classes} records ${classes === 0 ? '⚠️  EMPTY!' : '✅'}\n`;
        output += `👨‍🏫 FACULTY TABLE: ${faculty} records ${faculty === 0 ? '⚠️  EMPTY!' : '✅'}\n`;
        output += `❓ INQUIRIES TABLE: ${inquiries} records ${inquiries === 0 ? '⚠️  EMPTY!' : '✅'}\n`;
        output += `📋 ATTENDANCES TABLE: ${attendances} records\n`;

        output += '\n' + '='.repeat(60) + '\n\n';
        output += '💡 DIAGNOSIS:\n';
        output += '='.repeat(60) + '\n';

        if (students === 0 && classes === 0 && faculty === 0 && inquiries === 0) {
            output += '\n❌ DATABASE IS EMPTY!\n\n';
            output += 'This is why your dashboard shows all zeros!\n\n';
            output += 'SOLUTION:\n';
            output += '1. Open your website at http://localhost:5173\n';
            output += '2. Login with: admin@acadexa.com / admin@123\n';
            output += '3. Navigate to these pages and ADD data:\n';
            output += '   - Classes Management → Add classes\n';
            output += '   - Students Management → Add students\n';
            output += '   - Faculty Management → Add faculty\n';
            output += '   - Inquiries Management → Add inquiries\n\n';
            output += '4. Return to Dashboard → Data will appear!\n\n';
        } else {
            output += '\n✅ Database has data!\n';
            output += `   - ${students} students\n`;
            output += `   - ${classes} classes\n`;
            output += `   - ${faculty} faculty\n`;
            output += `   - ${inquiries} inquiries\n\n`;
            output += 'Dashboard should display these numbers.\n';
            output += 'If dashboard still shows 0, there may be an API issue.\n\n';
        }

        output += '='.repeat(60) + '\n';

        // Write to file
        fs.writeFileSync('./database-report.txt', output);
        console.log(output);
        console.log('\n📄 Report saved to: server/database-report.txt\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkDatabase();
