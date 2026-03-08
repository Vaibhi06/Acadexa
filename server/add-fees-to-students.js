// Script to add fee data to existing students
import sequelize from './config/database.js';
import Student from './models/Student.js';

const addFeesToStudents = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        // Get all students
        const students = await Student.findAll();
        console.log(`Found ${students.length} students`);

        // Sample fee structures for different classes
        const feeStructures = {
            'Class 1': { total: 50000, paid: 30000, pending: 20000 },
            'Class 2': { total: 50000, paid: 50000, pending: 0 },
            'Class 3': { total: 55000, paid: 25000, pending: 30000 },
            'Class 4': { total: 55000, paid: 55000, pending: 0 },
            'Class 5': { total: 60000, paid: 40000, pending: 20000 },
            'Class 6': { total: 60000, paid: 20000, pending: 40000 },
        };

        // Update each student with fee data
        for (const student of students) {
            const classKey = student.classCode || 'Class 1';
            const fees = feeStructures[classKey] || { total: 50000, paid: 25000, pending: 25000 };

            await student.update({ fees });
            console.log(`Updated fees for ${student.firstName} ${student.lastName}: Total: ₹${fees.total}, Paid: ₹${fees.paid}, Pending: ₹${fees.pending}`);
        }

        console.log('\n✅ All students updated with fee data!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

addFeesToStudents();
