import User from './models/User.js';
import { connectDB } from './config/database.js';
import bcrypt from 'bcryptjs';

await connectDB();

const user = await User.findOne({ where: { email: 'admin@acadexa.com' } });
if (!user) {
  console.log('❌ No admin user found!');
  process.exit(1);
}

console.log('Found user:', user.email, 'role:', user.role);
console.log('Password hash:', user.password?.substring(0, 20) + '...');

// Test various passwords
const passwords = ['admin@123', 'admin123', 'Admin@123', 'admin', '123456', 'password'];
for (const pwd of passwords) {
  const match = await bcrypt.compare(pwd, user.password);
  if (match) {
    console.log(`✅ CORRECT PASSWORD IS: "${pwd}"`);
  }
}

process.exit(0);
