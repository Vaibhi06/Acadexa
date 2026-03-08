// Test login with different possible admin passwords
const testAdminLogin = async () => {
    const possiblePasswords = [
        'Admin@123',
        'Admin123',
        'admin@123'
    ];

    for (const password of possiblePasswords) {
        try {
            console.log(`\nTesting with password: ${password}`);
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'admin@acadexa.com',
                    password: password
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log('✅ CORRECT PASSWORD FOUND!');
                console.log('==========================================');
                console.log('Email: admin@acadexa.com');
                console.log(`Password: ${password}`);
                console.log('Role:', data.data.user.role);
                console.log('==========================================');
                return;
            } else {
                console.log('❌ Failed:', data.message);
            }
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    }

    console.log('\n⚠️  None of the test passwords worked.');
    console.log('You may need to check the database or create a new admin account.');
};

testAdminLogin();
