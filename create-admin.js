// Create admin account in the database
const createAdminAccount = async () => {
    try {
        console.log('Creating admin account...');
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@acadexa.com',
                password: 'Admin@123',
                role: 'admin'
            }),
        });

        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));

        if (response.ok && data.success) {
            console.log('✅ Admin account created successfully!');
            console.log('Email: admin@acadexa.com');
            console.log('Password: Admin@123');
            console.log('Role: admin');
        } else {
            console.log('❌ Failed to create admin:', data.message || data.error);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

createAdminAccount();
