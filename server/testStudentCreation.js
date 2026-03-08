// Test script to verify student creation
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api/students';

// Get token from your browser's localStorage and replace this
const TOKEN = 'YOUR_TOKEN_HERE';

const testStudent = {
    firstName: 'Test',
    lastName: 'Student',
    middleName: 'Middle',
    email: `test${Date.now()}@example.com`,
    phone: '1234567890',
    dateOfBirth: '2000-01-01',
    gender: 'male',
    class: 'Test Class',
    joiningDate: new Date().toISOString().split('T')[0],
    guardianName: 'Test Guardian',
    guardianPhone: '9876543210',
    address: '123 Test Street',
    city: 'Test City',
    uid: 'UID123',
    aadharCard: '123456789012'
};

async function testAddStudent() {
    try {
        console.log('Testing student creation...');
        console.log('Sending data:', JSON.stringify(testStudent, null, 2));

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify(testStudent)
        });

        const data = await response.json();

        console.log('\n=== RESPONSE ===');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(data, null, 2));

        if (data.success) {
            console.log('\n✅ SUCCESS! Student created:', data.data.student.id);
        } else {
            console.log('\n❌ FAILED:', data.message);
        }
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
    }
}

console.log('='.repeat(50));
console.log('STUDENT CREATION TEST');
console.log('='.repeat(50));
console.log('\nInstructions:');
console.log('1. Login to your app in the browser');
console.log('2. Open DevTools (F12)');
console.log('3. Type: localStorage.getItem("token")');
console.log('4. Copy the token value');
console.log('5. Replace TOKEN in this file');
console.log('6. Run: node testStudentCreation.js');
console.log('='.repeat(50));
console.log();

// Uncomment below line after adding your token
// testAddStudent();
