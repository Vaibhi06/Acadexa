// Test complete timetable system
const testTimetableSystem = async () => {
    console.log('\n=== Testing Timetable System ===\n');

    // 1. Test GET endpoint
    console.log('1. Testing GET /api/timetable...');
    const getResponse = await fetch('http://localhost:5000/api/timetable?class=10th%20Grade%20A');
    const getData = await getResponse.json();
    console.log('   Status:', getResponse.status);
    console.log('   Data:', JSON.stringify(getData, null, 2));

    if (getResponse.status === 200) {
        console.log('   ✅ GET endpoint working!\n');
    } else {
        console.log('   ❌ GET endpoint failed!\n');
    }

    // 2. Test POST endpoint
    console.log('2. Testing POST /api/timetable...');
    const testData = {
        class: 'Test Class',
        schedules: [
            {
                id: Date.now(),
                time: '09:00 AM',
                monday: { subject: 'Math', faculty: 'Dr. Smith' },
                tuesday: { subject: 'Physics', faculty: 'Ms. Johnson' },
                wednesday: { subject: 'Chemistry', faculty: 'Mr. Williams' },
                thursday: { subject: 'Biology', faculty: 'Mrs. Brown' },
                friday: { subject: 'English', faculty: 'Mr. Jones' },
                saturday: '',
                sunday: ''
            }
        ]
    };

    const postResponse = await fetch('http://localhost:5000/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
    });
    const postData = await postResponse.json();
    console.log('   Status:', postResponse.status);
    console.log('   Response:', JSON.stringify(postData, null, 2));

    if (postResponse.status === 200) {
        console.log('   ✅ POST endpoint working!\n');
    } else {
        console.log('   ❌ POST endpoint failed!\n');
    }

    console.log('=== Test Complete ===\n');
};

testTimetableSystem().catch(console.error);
