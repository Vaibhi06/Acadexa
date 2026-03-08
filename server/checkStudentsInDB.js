import sequelize from './config/database.js';
import Student from './models/Student.js';

async function checkStudentsInDB() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database\n');

        // Count all students
        const totalCount = await Student.count();
        console.log(`📊 Total students in database: ${totalCount}`);

        // Count active students
        const activeCount = await Student.count({ where: { isActive: true } });
        console.log(`📊 Active students: ${activeCount}`);

        // Count inactive students
        const inactiveCount = await Student.count({ where: { isActive: false } });
        console.log(`📊 Inactive/deleted students: ${inactiveCount}\n`);

        if (totalCount > 0) {
            console.log('='.repeat(80));
            console.log('STUDENTS IN DATABASE:');
            console.log('='.repeat(80));

            const students = await Student.findAll({
                attributes: ['id', 'firstName', 'lastName', 'email', 'class', 'isActive'],
                limit: 10
            });

            students.forEach((student, index) => {
                console.log(`\n${index + 1}. ${student.firstName} ${student.lastName}`);
                console.log(`   Email: ${student.email}`);
                console.log(`   Class: ${student.class}`);
                console.log(`   Active: ${student.isActive ? '✅ Yes' : '❌ No (Soft Deleted)'}`);
            });

            console.log('\n' + '='.repeat(80));

            if (activeCount === 0 && totalCount > 0) {
                console.log('\n⚠️  WARNING: All students are marked as INACTIVE (soft deleted)!');
                console.log('The frontend only shows active students.');
                console.log('\nTo fix, run: UPDATE students SET isActive = 1;');
            }
        } else {
            console.log('❌ No students found in database');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkStudentsInDB();
