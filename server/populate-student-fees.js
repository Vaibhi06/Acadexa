// Script to populate fee records for all existing students
import sequelize from './config/database.js';
import Student from './models/Student.js';

const populateStudentFees = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully\n');

        // Get all active students
        const students = await Student.findAll({
            where: { status: 'active' }
        });

        if (students.length === 0) {
            console.log('⚠️  No active students found in database');
            process.exit(0);
        }

        console.log(`📊 Found ${students.length} active students\n`);

        // Fee structures by class (you can customize these)
        const feeByClass = {
            'Class 1': { total: 45000, paid: 25000 },
            'Class 2': { total: 45000, paid: 45000 },
            'Class 3': { total: 50000, paid: 20000 },
            'Class 4': { total: 50000, paid: 30000 },
            'Class 5': { total: 55000, paid: 15000 },
            'Class 6': { total: 55000, paid: 40000 },
            'Class 7': { total: 60000, paid: 25000 },
            'Class 8': { total: 60000, paid: 60000 },
            'Class 9': { total: 65000, paid: 35000 },
            'Class 10': { total: 65000, paid: 45000 },
        };

        let updatedCount = 0;

        // Update each student with fee data
        for (const student of students) {
            const classKey = student.classCode;

            // Get fee structure for this class, or use default
            const feeStructure = feeByClass[classKey] || {
                total: 50000,
                paid: Math.floor(Math.random() * 30000) + 10000 // Random paid between 10k-40k
            };

            const total = feeStructure.total;
            const paid = feeStructure.paid;
            const pending = total - paid;

            // Update student with fees
            await student.update({
                fees: {
                    total,
                    paid,
                    pending
                }
            });

            updatedCount++;
            console.log(`✅ ${student.firstName} ${student.lastName} (${classKey})`);
            console.log(`   Total: ₹${total.toLocaleString()} | Paid: ₹${paid.toLocaleString()} | Pending: ₹${pending.toLocaleString()}\n`);
        }

        console.log(`\n🎉 Successfully updated ${updatedCount} students with fee records!`);
        console.log('\n📋 Summary:');

        const summary = students.reduce((acc, s) => {
            acc.totalAmount += s.fees?.total || 0;
            acc.paidAmount += s.fees?.paid || 0;
            acc.pendingAmount += s.fees?.pending || 0;
            if (s.fees?.pending > 0) acc.pendingCount++;
            return acc;
        }, { totalAmount: 0, paidAmount: 0, pendingAmount: 0, pendingCount: 0 });

        console.log(`   Total Fees: ₹${summary.totalAmount.toLocaleString()}`);
        console.log(`   Collected: ₹${summary.paidAmount.toLocaleString()}`);
        console.log(`   Pending: ₹${summary.pendingAmount.toLocaleString()}`);
        console.log(`   Students with pending fees: ${summary.pendingCount}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n💡 Make sure MySQL is running via XAMPP');
        process.exit(1);
    }
};

populateStudentFees();
