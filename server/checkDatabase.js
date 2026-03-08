import sequelize from './config/database.js';
import Student from './models/Student.js';

async function checkDatabase() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Connected!\n');

        // Get table structure
        const [results] = await sequelize.query('DESCRIBE students');

        console.log('='.repeat(80));
        console.log('STUDENTS TABLE STRUCTURE');
        console.log('='.repeat(80));
        console.table(results);

        // Try to create a test student
        console.log('\n' + '='.repeat(80));
        console.log('TESTING STUDENT CREATION');
        console.log('='.repeat(80));

        const testData = {
            firstName: 'Test',
            lastName: 'Student',
            email: `test${Date.now()}@test.com`,
            phone: '1234567890',
            class: 'Test',
            dateOfBirth: '2000-01-01',
            gender: 'male',
            joiningDate: new Date().toISOString().split('T')[0],
            guardianName: 'Guardian',
            guardianPhone: '9876543210',
            address: '123 Test St',
            city: 'Test City'
        };

        console.log('\nAttempting to create student with data:');
        console.log(JSON.stringify(testData, null, 2));

        const student = await Student.create(testData);
        console.log('\n✅ SUCCESS! Student created:');
        console.log(student.toJSON());

        // Delete the test student
        await student.destroy();
        console.log('\n✅ Test student removed');

    } catch (error) {
        console.error('\n' + '='.repeat(80));
        console.error('❌ ERROR OCCURRED:');
        console.error('='.repeat(80));
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        if (error.parent) {
            console.error('SQL Error:', error.parent.sqlMessage);
            console.error('SQL:', error.parent.sql);
        }
        console.error('\nFull Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkDatabase();
