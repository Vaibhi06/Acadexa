import Student from './models/Student.js';
import { connectDB } from './config/database.js';

const seedStudents = async () => {
    try {
        await connectDB();

        // Check if students already exist
        const existingStudents = await Student.findAll();

        if (existingStudents.length > 0) {
            console.log('⚠️  Students already exist in database!');
            console.log(`Found ${existingStudents.length} students`);
            process.exit(0);
        }

        // Default students to seed
        const defaultStudents = [
            {
                id: 'STU001',
                firstName: 'John',
                lastName: 'Doe',
                class: '10th Grade A',
                email: 'john@example.com',
                phone: '+91 98765 43210',
                dateOfBirth: '2007-05-15',
                gender: 'male',
                guardianName: 'Robert Doe',
                guardianPhone: '+91 98765 43200',
                address: '123 Main St',
                city: 'Mumbai',
                status: 'active',
                attendance: '92%',
                joiningDate: '2024-04-15',
                marks: [
                    { subject: 'Mathematics', marks: 85, grade: 'A', maxMarks: 100 },
                    { subject: 'Physics', marks: 78, grade: 'B+', maxMarks: 100 },
                    { subject: 'Chemistry', marks: 82, grade: 'A-', maxMarks: 100 },
                    { subject: 'English', marks: 90, grade: 'A+', maxMarks: 100 },
                    { subject: 'Computer Science', marks: 88, grade: 'A', maxMarks: 100 }
                ],
                fees: { total: 50000, paid: 45000, pending: 5000 }
            },
            {
                id: 'STU002',
                firstName: 'Jane',
                lastName: 'Smith',
                class: '10th Grade B',
                email: 'jane@example.com',
                phone: '+91 98765 43211',
                dateOfBirth: '2007-06-20',
                gender: 'female',
                guardianName: 'Mary Smith',
                guardianPhone: '+91 98765 43201',
                address: '456 Oak Ave',
                city: 'Mumbai',
                status: 'active',
                attendance: '95%',
                joiningDate: '2024-04-16',
                marks: [
                    { subject: 'Mathematics', marks: 92, grade: 'A+', maxMarks: 100 },
                    { subject: 'Physics', marks: 88, grade: 'A', maxMarks: 100 },
                    { subject: 'Chemistry', marks: 90, grade: 'A+', maxMarks: 100 },
                    { subject: 'English', marks: 95, grade: 'A+', maxMarks: 100 },
                    { subject: 'Computer Science', marks: 91, grade: 'A+', maxMarks: 100 }
                ],
                fees: { total: 50000, paid: 50000, pending: 0 }
            }
        ];

        // Create students
        await Student.bulkCreate(defaultStudents);

        console.log('✅ Default students added successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        defaultStudents.forEach(student => {
            console.log(`👨‍🎓 ${student.firstName} ${student.lastName} (${student.id}) - ${student.class}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding students:', error.message);
        process.exit(1);
    }
};

seedStudents();
