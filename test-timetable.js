// Test timetable API
const test = async () => {
    console.log('Testing Timetable API...\n');

    // Test GET with a class name
    const response = await fetch('http://localhost:5000/api/timetable?class=10th%20Grade%20A');
    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.status === 200) {
        console.log('\n✅ API is working!');
        console.log('Timetable entries:', data.length);
    } else {
        console.log('\n❌ API returned error');
    }
};

test();
