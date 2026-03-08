// Simple script to load students data directly and show what's happening
import sequelize from './config/database.js';
import Student from './models/Student.js';

async function showAndFixStudents() {
    try {
        await sequelize.authenticate();

        // Get all students
        const students = await Student.findAll({
            where: { isActive: true },
            order: [['createdAt', 'DESC']]
        });

        console.log('\n✅ STUDENT DATA FROM DATABASE:\n');
        console.log(`Total Active Students: ${students.length}\n`);

        // Format them the way the frontend expects
        const studentsWithName = students.map(s => ({
            ...s.toJSON(),
            name: `${s.firstName} ${s.lastName}`
        }));

        console.log('Students with formatted names:');
        studentsWithName.forEach((student, index) => {
            console.log(`\n${index + 1}. ${student.name}`);
            console.log(`   ID: ${student.id}`);
            console.log(`   Email: ${student.email}`);
            console.log(`   Class: ${student.class}`);
            console.log(`   Status: ${student.status}`);
        });

        console.log('\n\n📋 THIS IS THE DATA THE FRONTEND SHOULD RECEIVE:');
        console.log(JSON.stringify({
            success: true,
            message: 'Students retrieved successfully',
            data: {
                students: studentsWithName
            }
        }, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

showAndFixStudents();
