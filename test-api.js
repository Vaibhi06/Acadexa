// Test dashboard API
const testDashboardAPI = async () => {
    try {
        console.log('Testing Dashboard API...\n');

        const response = await fetch('http://localhost:5000/api/dashboard/stats');
        const data = await response.json();

        console.log('Status:', response.status);
        console.log('\nAPI Response:', JSON.stringify(data, null, 2));

        if (data.success && data.data.stats) {
            const stats = data.data.stats;
            console.log('\n✅ API IS WORKING!');
            console.log('\nStats returned:');
            console.log(`  - Students: ${stats.counts.students}`);
            console.log(`  - Classes: ${stats.counts.classes}`);
            console.log(`  - Faculty: ${stats.counts.faculty}`);
            console.log(`  - Inquiries: ${stats.counts.inquiries}`);
            console.log(`  - Birthdays: ${stats.birthdays}`);

            if (stats.counts.students === 0) {
                console.log('\n⚠️  API returns 0 students even though database has 6!');
                console.log('   This means there is a problem in the backend query.');
            }
        } else {
            console.log('\n❌ API returned unexpected response');
        }
    } catch (error) {
        console.error('\n❌ API Error:', error.message);
    }
};

testDashboardAPI();
