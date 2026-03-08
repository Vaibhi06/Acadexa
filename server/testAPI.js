// Test if the students API is returning data
const API_URL = 'http://localhost:5000/api/students';

async function testStudentsAPI() {
    try {
        console.log('Testing GET /api/students endpoint...\n');

        const response = await fetch(API_URL);
        const data = await response.json();

        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.success && data.data) {
            console.log(`\n✅ API Working! Found ${data.data.students.length} students in database`);
            if (data.data.students.length > 0) {
                console.log('\nFirst student:');
                console.log(JSON.stringify(data.data.students[0], null, 2));
            }
        } else {
            console.log('\n❌ API returned success:false or missing data');
        }
    } catch (error) {
        console.error('\n❌ Error calling API:', error.message);
    }
}

testStudentsAPI();
