// Script to populate student fees via API (uses running backend server)
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

const populateFeesViaAPI = async () => {
    try {
        console.log('🔄 Fetching students from API...\n');

        // Get all students
        const studentsResponse = await fetch(`${API_URL}/students`);
        const students = await studentsResponse.json();

        if (!students || students.length === 0) {
            console.log('⚠️  No students found in database');
            process.exit(0);
        }

        console.log(`📊 Found ${students.length} students\n`);

        // Fee structures by class
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
        const errors = [];

        // Update each student
        for (const student of students) {
            const classKey = student.classCode;

            // Get fee structure for this class
            const feeStructure = feeByClass[classKey] || {
                total: 50000,
                paid: Math.floor(Math.random() * 30000) + 10000
            };

            const total = feeStructure.total;
            const paid = feeStructure.paid;
            const pending = total - paid;

            try {
                const response = await fetch(`${API_URL}/fees/students/${student.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ total, paid, pending })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                updatedCount++;
                console.log(`✅ ${student.firstName} ${student.lastName} (${classKey})`);
                console.log(`   Total: ₹${total.toLocaleString()} | Paid: ₹${paid.toLocaleString()} | Pending: ₹${pending.toLocaleString()}\n`);
            } catch (error) {
                errors.push(`${student.firstName} ${student.lastName}: ${error.message}`);
            }
        }

        console.log(`\n🎉 Successfully updated ${updatedCount}/${students.length} students!`);

        if (errors.length > 0) {
            console.log(`\n⚠️  ${errors.length} errors:`);
            errors.forEach(err => console.log(`   - ${err}`));
        }

        // Calculate summary
        const summaryResponse = await fetch(`${API_URL}/fees/summary/stats`);
        const summary = await summaryResponse.json();

        if (summary.success) {
            console.log('\n📋 Summary:');
            console.log(`   Total Fees: ₹${summary.data.totalAmount.toLocaleString()}`);
            console.log(`   Collected: ₹${summary.data.paidAmount.toLocaleString()}`);
            console.log(`   Pending: ₹${summary.data.pendingAmount.toLocaleString()}`);
            console.log(`   Students with pending fees: ${summary.data.pendingCount}`);
        }

        console.log('\n✨ Refresh your browser to see the updated fee records!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n💡 Make sure the backend server is running on port 5000');
        process.exit(1);
    }
};

populateFeesViaAPI();
