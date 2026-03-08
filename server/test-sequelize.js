import { Sequelize } from 'sequelize';
console.log('--- Sequelize Test Start ---');
try {
    const s = new Sequelize('mysql://root@localhost:3306/portal_db', { logging: false });
    console.log('Sequelize initialized');
    await s.authenticate();
    console.log('Sequelize authenticated');
} catch (e) {
    console.error('Sequelize error:', e.message);
}
console.log('--- Sequelize Test End ---');
