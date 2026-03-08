import sequelize from './config/database.js';
import Faculty from './models/Faculty.js';
import FeeStructure from './models/FeeStructure.js';
import Exam from './models/Exam.js';
import Mark from './models/Mark.js';
import Timetable from './models/Timetable.js';
import StudyMaterial from './models/StudyMaterial.js';
import Notice from './models/Notice.js';
import Task from './models/Task.js';

const seedData = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database.');

        // --- Faculty ---
        const facultyCount = await Faculty.count();
        if (facultyCount === 0) {
            await Faculty.bulkCreate([
                {
                    facultyId: 'FAC001',
                    name: 'Mr. John Smith',
                    email: 'john.smith@acadexa.com',
                    phone: '+91 98765 11111',
                    subjects: ['Mathematics', 'Physics'],
                    classes: ['10th Grade A', '11th Grade A'],
                    salary: '₹50,000/month'
                },
                {
                    facultyId: 'FAC002',
                    name: 'Ms. Sarah Johnson',
                    email: 'sarah.j@acadexa.com',
                    phone: '+91 98765 22222',
                    subjects: ['English', 'Literature'],
                    classes: ['10th Grade B', '12th Grade A'],
                    salary: '₹48,000/month'
                },
                {
                    facultyId: 'FAC003',
                    name: 'Mr. Robert Davis',
                    email: 'robert.d@acadexa.com',
                    phone: '+91 98765 33333',
                    subjects: ['Chemistry', 'Biology'],
                    classes: ['11th Grade A', '12th Grade A'],
                    salary: '₹52,000/month'
                }
            ]);
            console.log('✅ Seeded Faculty');
        }

        // --- Fees ---
        const feesCount = await FeeStructure.count();
        if (feesCount === 0) {
            await FeeStructure.bulkCreate([
                {
                    class: '10th Grade A',
                    totalFees: 50000,
                    installments: [
                        { id: 1, amount: 20000, dueDate: '2025-04-01' },
                        { id: 2, amount: 15000, dueDate: '2025-08-01' },
                        { id: 3, amount: 15000, dueDate: '2025-12-01' }
                    ]
                }
            ]);
            console.log('✅ Seeded Fee Structures');
        }

        // --- Exams ---
        const examsCount = await Exam.count();
        if (examsCount === 0) {
            await Exam.bulkCreate([
                { name: 'Mid-Term Exam', class: '10th Grade A', subject: 'Mathematics', date: '2025-01-15', time: '10:00 AM', status: 'upcoming' },
                { name: 'Unit Test 1', class: '11th Grade B', subject: 'Physics', date: '2025-01-16', time: '11:00 AM', status: 'upcoming' },
                { name: 'Final Exam', class: '12th Grade A', subject: 'Chemistry', date: '2024-12-20', time: '09:00 AM', status: 'completed' }
            ]);
            console.log('✅ Seeded Exams');
        }

        // --- Marks ---
        const marksCount = await Mark.count();
        if (marksCount === 0) {
            await Mark.bulkCreate([
                { studentId: 'STU001', studentName: 'John Doe', class: '10th Grade A', examName: 'Mid-Term Exam', subject: 'Mathematics', marksObtained: 85, maxMarks: 100 },
                { studentId: 'STU002', studentName: 'Jane Smith', class: '10th Grade A', examName: 'Mid-Term Exam', subject: 'Mathematics', marksObtained: 92, maxMarks: 100 },
                { studentId: 'STU003', studentName: 'Mike Johnson', class: '10th Grade A', examName: 'Mid-Term Exam', subject: 'Mathematics', marksObtained: 78, maxMarks: 100 }
            ]);
            console.log('✅ Seeded Marks');
        }

        // --- Timetable ---
        const timetableCount = await Timetable.count();
        if (timetableCount === 0) {
            await Timetable.bulkCreate([
                {
                    class: '10th Grade A',
                    time: '09:00 AM',
                    monday: { subject: 'Mathematics', faculty: 'Mr. John Smith' },
                    tuesday: { subject: 'Physics', faculty: 'Mr. John Smith' },
                    wednesday: { subject: 'Chemistry', faculty: 'Mr. Robert Davis' },
                    thursday: { subject: 'English', faculty: 'Ms. Sarah Johnson' },
                    friday: { subject: 'Biology', faculty: 'Mr. Robert Davis' }
                },
                {
                    class: '10th Grade A',
                    time: '10:30 AM',
                    monday: { subject: 'Physics', faculty: 'Mr. John Smith' },
                    tuesday: { subject: 'Mathematics', faculty: 'Mr. John Smith' },
                    wednesday: { subject: 'English', faculty: 'Ms. Sarah Johnson' },
                    thursday: { subject: 'Chemistry', faculty: 'Mr. Robert Davis' },
                    friday: { subject: 'Mathematics', faculty: 'Mr. John Smith' }
                }
            ]);
            console.log('✅ Seeded Timetable');
        }

        // --- Study Materials ---
        const materialCount = await StudyMaterial.count();
        if (materialCount === 0) {
            await StudyMaterial.bulkCreate([
                { title: 'Mathematics Chapter 1 - Sets', class: '10th Grade A', subject: 'Mathematics', fileName: 'math_chapter1.pdf', size: '2.5 MB', version: 'v1.0' },
                { title: 'Physics - Motion Notes', class: '11th Grade A', subject: 'Physics', fileName: 'physics_motion.pdf', size: '3.1 MB', version: 'v1.0' }
            ]);
            console.log('✅ Seeded Study Materials');
        }

        // --- Tasks ---
        const taskCount = await Task.count();
        if (taskCount === 0) {
            await Task.bulkCreate([
                { title: 'Prepare for meeting', description: 'Review quarterly goals', dueDate: '2025-02-01', priority: 'high', status: 'pending', assignedTo: 'Self' },
                { title: 'Update website', description: 'Fix typo on home page', dueDate: '2025-02-02', priority: 'medium', status: 'completed', assignedTo: 'Staff: Mr. Admin' }
            ]);
            console.log('✅ Seeded Tasks');
        }

        console.log('🎉 Database seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
