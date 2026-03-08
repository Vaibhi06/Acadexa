import bcrypt from 'bcryptjs';
console.log('--- Bcrypt Test Start ---');
const hash = await bcrypt.hash('test', 10);
console.log('Hash created:', hash);
const match = await bcrypt.compare('test', hash);
console.log('Match:', match);
console.log('--- Bcrypt Test End ---');
