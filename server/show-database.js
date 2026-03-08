// Simple database checker
import { sequelize } from './config/database.js';
import Student from './models/Student.js';
import Class from './models/Class.js';
import Faculty from './models/Faculty.js';
import Inquiry from './models/Inquiry.js';
import User from './models/User.js';
import Attendance from './models/Attendance.js';

async function showDatabaseContent() {
    try {
        await sequelize.authenticate();
        console.log('\n✅ Database Connected Successfully!');
        console.log('📁 Database:', sequelize.config.database);
        console.log('\n' + '='.repeat(60));

        // Check each model
        const students = await Student.findAll();
        const classes = await Class.findAll();
        const faculty = await Faculty.findAll();
        const inquiries = await Inquiry.findAll();
        const users = await User.findAll();
        const attendances = await Attendance.findAll();

        console.log('\n📊 DATABASE CONTENT SUMMARY:');
        console.log('='.repeat(60));
        console.log(`\n👥 USERS: ${users.length} records`);
        if (users.length > 0) {
            users.forEach((u, i) => console.log(`   ${i + 1}. ${u.email} (${u.role})`));
        }

        console.log(`\n🎓 STUDENTS: ${students.length} records`);
        if (students.length > 0) {
            students.forEach((s, i) => console.log(`   ${i + 1}. ${s.name} - ${s.email}`));
        } else {
            console.log('   ⚠️  NO STUDENTS FOUND - This is why dashboard shows 0!');
        }

        console.log(`\n📚 CLASSES: ${classes.length} records`);
        if (classes.length > 0) {
            classes.forEach((c, i) => console.log(`   ${i + 1}. ${c.name} - ${c.section}`));
        } else {
            console.log('   ⚠️  NO CLASSES FOUND - This is why dashboard shows 0!');
        }

        console.log(`\n👨‍🏫 FACULTY: ${faculty.length} records`);
        if (faculty.length > 0) {
            faculty.forEach((f, i) => console.log(`   ${i + 1}. ${f.name} - ${f.email}`));
        } else {
            console.log('   ⚠️  NO FACULTY FOUND - This is why dashboard shows 0!');
        }

        console.log(`\n❓ INQUIRIES: ${inquiries.length} records`);
        if (inquiries.length > 0) {
            inquiries.forEach((inq, i) => console.log(`   ${i + 1}. ${inq.name} - ${inq.status}`));
        } else {
            console.log('   ⚠️  NO INQUIRIES FOUND - This is why dashboard shows 0!');
        }

        console.log(`\n📋 ATTENDANCES: ${attendances.length} records`);

        console.log('\n' + '='.repeat(60));
        console.log('\n💡 CONCLUSION:');
        if (students.length === 0 && classes.length === 0 && faculty.length === 0) {
            console.log('   Your database is EMPTY except for the admin user.');
            console.log('   You need to ADD data through the website pages:');
            console.log('   1. Go to Classes Management → Add classes');
            console.log('   2. Go to Students Management → Add students');
            console.log('   3. Go to Faculty Management → Add faculty');
            console.log('   4. Then the dashboard will show real numbers!');
        } else {
            console.log('   Database has data! Dashboard should show it.');
        }
        console.log('='.repeat(60) + '\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

showDatabaseContent();
