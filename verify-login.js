// Test login now that servers are on correct ports
const testLoginNow = async () => {
    try {
        console.log('Testing login with admin@123...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@acadexa.com',
                password: 'admin@123'
            }),
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (response.ok && data.success) {
            console.log('\n✅ LOGIN SUCCESSFUL!');
            console.log('==========================================');
            console.log('Email: admin@acadexa.com');
            console.log('Password: admin@123');
            console.log('Role:', data.data.user.role);
            console.log('==========================================');
            console.log('\n🌐 Open http://localhost:5173 and login with these credentials!');
        } else {
            console.log('\n❌ Login failed. Response:', data);
        }
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
};

testLoginNow();
