// Quick test script to check if login endpoint is working
const testLogin = async () => {
    try {
        console.log('Testing login endpoint...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@acadexa.com',
                password: 'admin123'
            }),
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('✅ Login endpoint is working!');
        } else {
            console.log('❌ Login failed:', data.message || data.error);
        }
    } catch (error) {
        console.error('❌ Connection error:', error.message);
    }
};

testLogin();
