import User from './models/User.js';
import { connectDB } from './config/database.js';

// Admin credentials
const ADMIN_EMAIL = 'admin@acadexa.com';
const ADMIN_PASSWORD = 'admin@123';

const createAdminUser = async () => {
    try {
        // Connect to database
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ where: { email: ADMIN_EMAIL } });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('Email:', ADMIN_EMAIL);
            console.log('Role:', existingAdmin.role);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD, // Will be hashed automatically by User model
            role: 'admin',
            isActive: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', ADMIN_EMAIL);
        console.log('🔑 Password:', ADMIN_PASSWORD);
        console.log('👤 Role:', admin.role);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\nYou can now login with these credentials!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    }
};

createAdminUser();
