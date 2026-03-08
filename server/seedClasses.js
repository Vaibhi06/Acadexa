import Class from './models/Class.js';
import { connectDB } from './config/database.js';

const seedClasses = async () => {
    try {
        await connectDB();

        // Check if classes already exist
        const existingClasses = await Class.findAll();

        if (existingClasses.length > 0) {
            console.log('⚠️  Classes already exist in database!');
            console.log(`Found ${existingClasses.length} classes`);
            process.exit(0);
        }

        // Default classes to seed
        const defaultClasses = [
            { name: '10th Grade A', code: '10A', year: '2024-25', students: 0, faculty: 'Mr. Smith' },
            { name: '10th Grade B', code: '10B', year: '2024-25', students: 0, faculty: 'Ms. Johnson' },
            { name: '11th Grade A', code: '11A', year: '2024-25', students: 0, faculty: 'Mr. Davis' },
            { name: '12th Grade A', code: '12A', year: '2024-25', students: 0, faculty: 'Ms. Wilson' },
        ];

        // Create classes
        await Class.bulkCreate(defaultClasses);

        console.log('✅ Default classes added successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        defaultClasses.forEach(cls => {
            console.log(`📚 ${cls.name} (${cls.code}) - ${cls.faculty}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding classes:', error.message);
        process.exit(1);
    }
};

seedClasses();
