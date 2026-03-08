import jwt from 'jsonwebtoken';
console.log('--- JWT Test Start ---');
const token = jwt.sign({ id: 1 }, 'secret', { expiresIn: '1h' });
console.log('Token created:', token);
const decoded = jwt.verify(token, 'secret');
console.log('Decoded:', decoded);
console.log('--- JWT Test End ---');
