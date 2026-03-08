import sequelize from './config/database.js';
import Student from './models/Student.js';

const populateFees = async () => {
    try {
        // Connect to DB using existing config
        console.log('Connecting to database...\n');

        const students = await Student.findAll({ where: { status: 'active' } });

        if (!students || students.length === 0) {
            console.log('No students found');
            return;
        }

        console.log(`Found ${students.length} students\n`);

        const feeData = {
            'Class 1': [45000, 25000],
            'Class 2': [45000, 45000],
            'Class 3': [50000, 20000],
            'Class 4': [50000, 30000],
            'Class 5': [55000, 15000],
            'Class 6': [55000, 40000],
            'Class 7': [60000, 25000],
            'Class 8': [60000, 60000],
            'Class 9': [65000, 35000],
            'Class 10': [65000, 45000]
        };

        for (const student of students) {
            const [total, paid] = feeData[student.classCode] || [50000, 20000];
            const pending = total - paid;

            await student.update({
                fees: { total, paid, pending }
            });

            console.log(`✅ ${student.firstName} ${student.lastName} - ₹${total} (Pending: ₹${pending})`);
        }

        console.log(`\n✨ Done! Updated ${students.length} students`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

populateFees();